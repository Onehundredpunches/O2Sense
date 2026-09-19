import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  RotateCw, 
  RotateCcw,
  Scissors, 
  Video, 
  Tag,
  Info,
  X,
  Compass,
  CheckCircle2
} from 'lucide-react';

interface AnatomyScene3DProps {
  step: number; // 1 to 5
  airwayStatus: 'open' | 'narrowed' | 'collapsed' | 'reopening';
  airflowPercent: number;
  spo2Percent: number;
  isBrainArousal: boolean;
  isSympathetic: boolean;
}

interface AnatomicalPin3D {
  id: string;
  name: string;
  role: string;
  pos: THREE.Vector3;
  color: string;
}

// Canonical Clinical Reference: Optimal Medical Sagittal Cross-Section Perspective
const CLINICAL_CAM_POS = new THREE.Vector3(0.8, 2.9, 11.2);
const CLINICAL_LOOK_AT = new THREE.Vector3(0.8, 2.5, 0);

// Procedural texture for realistic brain gyri & sulci folds (0 external assets, 0ms load)
function createBrainGyriTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(0, 0, 512, 512);

  for (let y = 0; y < 512; y += 4) {
    for (let x = 0; x < 512; x += 4) {
      const v =
        Math.sin(x * 0.08 + Math.sin(y * 0.05) * 4) +
        Math.cos(y * 0.08 + Math.cos(x * 0.05) * 4) +
        Math.sin((x + y) * 0.04);
      const intensity = Math.floor(((v + 3) / 6) * 180 + 50);
      ctx.fillStyle = `rgb(${Math.floor(intensity * 0.65)}, ${Math.floor(intensity * 0.5)}, ${intensity})`;
      ctx.fillRect(x, y, 4, 4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export const AnatomyScene3D: React.FC<AnatomyScene3DProps> = ({
  step,
  airwayStatus,
  airflowPercent,
  spo2Percent,
  isBrainArousal,
  isSympathetic,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const resetToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Programmatic smooth camera animation state (ease-out lerp without fighting OrbitControls)
  const animRef = useRef<{
    active: boolean;
    isResetting: boolean;
    startTime: number;
    duration: number;
    startPos: THREE.Vector3;
    endPos: THREE.Vector3;
    startTarget: THREE.Vector3;
    endTarget: THREE.Vector3;
  }>({
    active: false,
    isResetting: false,
    startTime: 0,
    duration: 750,
    startPos: new THREE.Vector3(),
    endPos: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    endTarget: new THREE.Vector3(),
  });

  // Keep latest props in a ref to avoid destroying & remounting WebGL scene on every step change
  const propsRef = useRef({
    step,
    airwayStatus,
    airflowPercent,
    spo2Percent,
    isBrainArousal,
    isSympathetic,
  });

  useEffect(() => {
    propsRef.current = {
      step,
      airwayStatus,
      airflowPercent,
      spo2Percent,
      isBrainArousal,
      isSympathetic,
    };
  }, [step, airwayStatus, airflowPercent, spo2Percent, isBrainArousal, isSympathetic]);

  const [activeCameraView, setActiveCameraView] = useState<'clinical' | 'airway' | 'endoscopy' | 'brain' | 'chest'>('clinical');
  const [isRotatedAway, setIsRotatedAway] = useState<boolean>(false);
  const [deviationAngle, setDeviationAngle] = useState<number>(0);
  const [isRecalibrating, setIsRecalibrating] = useState<boolean>(false);
  const [showResetToast, setShowResetToast] = useState<boolean>(false);
  const [isSagittalClipped, setIsSagittalClipped] = useState<boolean>(false);
  const [show3DLabels, setShow3DLabels] = useState<boolean>(true);
  const [selectedPin, setSelectedPin] = useState<AnatomicalPin3D | null>(null);

  // Function to smoothly animate camera to target
  const triggerCameraTransition = useCallback(
    (targetPos: THREE.Vector3, targetLookAt: THREE.Vector3, duration = 750) => {
      if (!cameraRef.current || !controlsRef.current) return;
      animRef.current.active = true;
      animRef.current.startTime = performance.now();
      animRef.current.duration = duration;
      animRef.current.startPos.copy(cameraRef.current.position);
      animRef.current.endPos.copy(targetPos);
      animRef.current.startTarget.copy(controlsRef.current.target);
      animRef.current.endTarget.copy(targetLookAt);
    },
    []
  );

  // Return to canonical Medical Sagittal View ("Góc Nhìn Y Khoa Chuẩn")
  const resetToClinicalView = useCallback(() => {
    setActiveCameraView('clinical');
    animRef.current.isResetting = true;
    setIsRecalibrating(true);
    setTimeout(() => setIsRecalibrating(false), 750);
    triggerCameraTransition(CLINICAL_CAM_POS, CLINICAL_LOOK_AT, 750);
    setIsRotatedAway(false);
    setDeviationAngle(0);
    setShowResetToast(true);
    if (resetToastTimerRef.current) clearTimeout(resetToastTimerRef.current);
    resetToastTimerRef.current = setTimeout(() => {
      setShowResetToast(false);
    }, 2400);
  }, [triggerCameraTransition]);

  // Check if camera has rotated or drifted away from clinical standard view
  const checkDisoriented = useCallback((cam: THREE.PerspectiveCamera, ctrl: OrbitControls) => {
    if (animRef.current.isResetting) return;

    const curDir = new THREE.Vector3().subVectors(ctrl.target, cam.position).normalize();
    const clinicalDir = new THREE.Vector3().subVectors(CLINICAL_LOOK_AT, CLINICAL_CAM_POS).normalize();
    const dot = Math.max(-1, Math.min(1, curDir.dot(clinicalDir)));
    const angleRad = Math.acos(dot);
    const angleDeg = Math.round(angleRad * (180 / Math.PI));
    setDeviationAngle(angleDeg);

    const targetDist = ctrl.target.distanceTo(CLINICAL_LOOK_AT);
    const camDistDelta = Math.abs(cam.position.distanceTo(ctrl.target) - CLINICAL_CAM_POS.distanceTo(CLINICAL_LOOK_AT));

    // Deviation angle > ~12 degrees (dot < 0.978) or target shifted or zoom changed significantly
    const isAngleOff = dot < 0.978;
    const isPanOff = targetDist > 1.4;
    const isZoomOff = camDistDelta > 4.5;
    const isOff = isAngleOff || isPanOff || isZoomOff;
    setIsRotatedAway(isOff);
  }, []);

  // 3D Anatomical Landmark Pins with directional fanning to avoid any overlap
  const landmarkPins: (AnatomicalPin3D & { shortName: string; align: 'left' | 'right' | 'center' })[] = [
    {
      id: 'nose',
      name: 'Khoang mũi (Đường khí vào)',
      shortName: '👃 Mũi',
      role: 'Cửa ngõ hít thở chính khi ngủ, làm ấm và bão hòa ẩm không khí trước khi vào vùng hầu họng.',
      pos: new THREE.Vector3(2.35, 5.2, 0),
      color: '#38bdf8',
      align: 'right',
    },
    {
      id: 'palate',
      name: 'Khẩu cái mềm & Lưỡi gà',
      shortName: '🔴 Lưỡi gà',
      role: 'Khẩu cái mềm và lưỡi gà là các cấu trúc di động ở vùng hầu. Khi đường thở hẹp, các mô này có thể rung góp phần tạo tiếng ngáy và ở một số người có thể tham gia vào vị trí xẹp đường thở.',
      pos: new THREE.Vector3(2.5, 3.3, 0),
      color: '#f43f5e',
      align: 'right',
    },
    {
      id: 'tongue',
      name: 'Gốc lưỡi & Cơ cằm-lưỡi',
      shortName: '👅 Gốc lưỡi',
      role: 'Gốc lưỡi và cơ cằm - lưỡi là khối cơ quan trọng nâng đỡ đường thở. Khi ngủ, hoạt động điều khiển thần kinh - cơ thay đổi; ở người có đường thở dễ xẹp, khả năng bù trừ có thể không đủ.',
      pos: new THREE.Vector3(1.6, 2.3, 0),
      color: '#fb7185',
      align: 'right',
    },
    {
      id: 'mandible',
      name: 'Xương hàm dưới & Cằm',
      shortName: '🦴 Xương hàm',
      role: 'Khung xương giữ vị trí của các cấu trúc nâng đỡ đường thở. Cấu trúc giải phẫu sọ mặt (như hàm dưới lùi hoặc vòm họng hẹp) có thể là một yếu tố góp phần vào nguy cơ OSA.',
      pos: new THREE.Vector3(1.25, 3.7, 0),
      color: '#e2e8f0',
      align: 'left',
    },
    {
      id: 'airway',
      name: 'Vùng bít tắc hầu họng',
      shortName: '💨 Vùng nghẽn',
      role: 'Vùng khẩu kính lòng hầu họng. Luồng khí bị giảm mạnh khi các thành hầu xẹp lại trong biến cố ngưng thở hoặc giảm thở do tắc nghẽn.',
      pos: new THREE.Vector3(0.5, 1.85, 0),
      color: '#34d399',
      align: 'left',
    },
    {
      id: 'trachea',
      name: 'Khí quản & Vòng sụn',
      shortName: '🫁 Khí quản',
      role: 'Ống dẫn khí chính có các vòng sụn cứng giữ lòng ống không bị xẹp, dẫn khí oxy thẳng xuống hai lá phổi.',
      pos: new THREE.Vector3(-2.6, 1.15, 0),
      color: '#0ea5e9',
      align: 'left',
    },
  ];

  // Ref to materials that support sagittal clipping plane
  const clippableMaterialsRef = useRef<THREE.Material[]>([]);
  // Ref to store pin 2D screen positions
  const pinRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 480;

    // 1. Scene Setup with Deep Medical Slate Atmosphere
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);
    scene.fog = new THREE.FogExp2(0x030712, 0.022);

    // 2. Camera Setup (Horizontal Supine Sleep Posture - Canonical Medical Alignment)
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.copy(CLINICAL_CAM_POS);
    cameraRef.current = camera;

    // 3. WebGL Renderer with High-Fidelity Tone Mapping & Local Clipping Enabled
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.localClippingEnabled = true;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls with High Responsiveness
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxDistance = 26;
    controls.minDistance = 2.2;
    controls.target.copy(CLINICAL_LOOK_AT);
    controlsRef.current = controls;

    // Interrupt programmatic camera transition if user manually grabs/rotates
    controls.addEventListener('start', () => {
      animRef.current.active = false;
      animRef.current.isResetting = false;
    });

    // Detect user disorientation when rotating freely
    controls.addEventListener('change', () => {
      checkDisoriented(camera, controls);
    });

    // 5. Lighting: Medical Holographic Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x0f172a, 2.0);
    scene.add(ambientLight);

    // Key Light from front-top
    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.4);
    keyLight.position.set(6, 12, 10);
    scene.add(keyLight);

    // Rim Backlight (Fresnel effect making facial silhouette stand out brilliantly!)
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
    rimLight.position.set(-8, 8, -8);
    scene.add(rimLight);

    // Warm mucosal fill light
    const warmFillLight = new THREE.DirectionalLight(0xf43f5e, 1.1);
    warmFillLight.position.set(2, 6, 8);
    scene.add(warmFillLight);

    // Brain Arousal Point Light
    const arousalPointLight = new THREE.PointLight(0xf59e0b, 0, 18);
    arousalPointLight.position.set(3.4, 2.8, 0);
    scene.add(arousalPointLight);

    // Occlusion Warning Point Light
    const occlusionPointLight = new THREE.PointLight(0xef4444, 0, 14);
    occlusionPointLight.position.set(1.6, 2.1, 0);
    scene.add(occlusionPointLight);

    // Acoustic Snoring Sound Wave Mesh (Pulsing Rings)
    const soundWaveGeo = new THREE.RingGeometry(0.2, 0.45, 32);
    const soundWaveMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const soundWaveMesh = new THREE.Mesh(soundWaveGeo, soundWaveMat);
    soundWaveMesh.position.set(2.0, 2.7, 0);
    soundWaveMesh.rotation.y = Math.PI / 2;
    scene.add(soundWaveMesh);

    // 6. MAIN BODY GROUP (Supine Sleep Posture)
    const bodyGroup = new THREE.Group();
    scene.add(bodyGroup);

    // --- A. Hospital Bed & Ergonomic Medical Pillow ---
    const pillowGeo = new THREE.BoxGeometry(5.2, 1.2, 5.4);
    const pillowMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.85,
      metalness: 0.05,
    });
    const pillowMesh = new THREE.Mesh(pillowGeo, pillowMat);
    pillowMesh.position.set(3.2, 0.45, 0);
    bodyGroup.add(pillowMesh);

    const mattressGeo = new THREE.BoxGeometry(18, 1.0, 7.8);
    const mattressMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.9,
      metalness: 0.1,
    });
    const mattressMesh = new THREE.Mesh(mattressGeo, mattressMat);
    mattressMesh.position.set(-2.5, -0.6, 0);
    bodyGroup.add(mattressMesh);

    // --- B. Sculpted Translucent 3D Human Silhouette (Head, Nose, Lips, Chin, Neck) ---
    // True human midsagittal anatomical silhouette
    const bodyProfileShape = new THREE.Shape();
    bodyProfileShape.moveTo(-7.5, 0.3);
    bodyProfileShape.lineTo(-3.5, 0.4);
    bodyProfileShape.lineTo(-1.0, 0.6);
    bodyProfileShape.lineTo(1.5, 0.8);
    bodyProfileShape.quadraticCurveTo(3.2, 1.0, 4.8, 1.5);
    bodyProfileShape.quadraticCurveTo(5.4, 2.4, 5.0, 3.4);
    bodyProfileShape.quadraticCurveTo(4.4, 4.4, 3.4, 4.4); // Forehead / Glabella
    bodyProfileShape.lineTo(2.7, 4.3);                    // Nose bridge
    bodyProfileShape.lineTo(2.35, 5.15);                  // Tip of nose (Nostril)
    bodyProfileShape.lineTo(2.0, 4.65);                   // Philtrum
    bodyProfileShape.lineTo(1.9, 4.35);                   // Upper lip
    bodyProfileShape.lineTo(1.8, 4.3);                    // Mouth fissure
    bodyProfileShape.lineTo(1.68, 3.9);                   // Lower lip
    bodyProfileShape.lineTo(1.58, 4.0);                   // Mentolabial sulcus
    bodyProfileShape.lineTo(1.25, 3.35);                  // Mental protuberance (Chin)
    bodyProfileShape.quadraticCurveTo(0.7, 2.6, 0.0, 2.3);// Submental throat
    bodyProfileShape.lineTo(-0.6, 2.2);                   // Thyroid notch (Adam's apple)
    bodyProfileShape.quadraticCurveTo(-1.8, 2.7, -3.5, 2.85); // Thoracic chest contour
    bodyProfileShape.quadraticCurveTo(-5.5, 2.7, -7.5, 2.3);
    bodyProfileShape.lineTo(-7.5, 0.3);

    const extrudeSettings = {
      steps: 2,
      depth: 3.4,
      bevelEnabled: true,
      bevelThickness: 0.9,
      bevelSize: 0.7,
      bevelSegments: 8,
    };
    const bodySkinGeo = new THREE.ExtrudeGeometry(bodyProfileShape, extrudeSettings);
    bodySkinGeo.translate(0, 0, -1.7);

    const skinGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.28,
      roughness: 0.28,
      metalness: 0.1,
      transmission: 0.72,
      thickness: 2.2,
      ior: 1.35,
      side: THREE.DoubleSide,
    });
    const bodySkinMesh = new THREE.Mesh(bodySkinGeo, skinGlassMat);
    bodyGroup.add(bodySkinMesh);

    // --- C. Anatomical Mandible (Xương hàm dưới) & Hard Palate ---
    // Jawbone gives instant orientation of chin, mouth and tongue base
    const mandibleShape = new THREE.Shape();
    mandibleShape.moveTo(1.25, 3.35); // Chin
    mandibleShape.lineTo(1.45, 3.25); // Lower teeth alveolar crest
    mandibleShape.quadraticCurveTo(0.6, 2.4, 0.2, 2.5); // Body to angle of jaw
    mandibleShape.lineTo(0.0, 2.65);  // Ramus
    mandibleShape.quadraticCurveTo(0.5, 2.8, 1.25, 3.35);

    const mandibleGeo = new THREE.ExtrudeGeometry(mandibleShape, { depth: 2.0, bevelEnabled: true, bevelThickness: 0.15, bevelSize: 0.1, bevelSegments: 3 });
    mandibleGeo.translate(0, 0, -1.0);
    const boneMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.45,
      metalness: 0.15,
      emissive: 0x64748b,
      emissiveIntensity: 0.18,
    });
    const mandibleMesh = new THREE.Mesh(mandibleGeo, boneMat);
    bodyGroup.add(mandibleMesh);

    // Hard Palate (Bony roof of mouth separating oral & nasal cavity)
    const hardPalateGeo = new THREE.BoxGeometry(0.85, 0.16, 1.8);
    const hardPalateMesh = new THREE.Mesh(hardPalateGeo, boneMat);
    hardPalateMesh.position.set(2.4, 3.55, 0);
    hardPalateMesh.rotation.z = -Math.PI / 16;
    bodyGroup.add(hardPalateMesh);

    // Anatomical Hyoid Bone (Xương móng - U-shaped bone anchor at C3)
    const hyoidCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.5, 2.0, 0.45),
      new THREE.Vector3(0.75, 2.05, 0),
      new THREE.Vector3(0.5, 2.0, -0.45),
    ]);
    const hyoidGeo = new THREE.TubeGeometry(hyoidCurve, 16, 0.08, 8, false);
    const hyoidMesh = new THREE.Mesh(hyoidGeo, boneMat);
    bodyGroup.add(hyoidMesh);

    // --- D. Upper Airway Lumen Tunnel (Translucent Mucosal Air Pathway) ---
    const airwaySpline = new THREE.CatmullRomCurve3([
      new THREE.Vector3(2.1, 4.65, 0), // Nostril opening
      new THREE.Vector3(2.6, 4.0, 0),  // Nasal cavity
      new THREE.Vector3(2.8, 3.2, 0),  // Nasopharynx
      new THREE.Vector3(2.0, 2.4, 0),  // Oropharynx / Retroglossal space
      new THREE.Vector3(1.3, 1.9, 0),  // Hypopharynx
      new THREE.Vector3(0.4, 1.65, 0), // Laryngeal inlet
      new THREE.Vector3(-1.2, 1.5, 0), // Upper Trachea
      new THREE.Vector3(-3.2, 1.4, 0), // Mid Trachea to Carina
    ]);

    const airwayTubeGeo = new THREE.TubeGeometry(airwaySpline, 64, 0.42, 20, false);
    const airwayTubeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.78,
      roughness: 0.2,
      emissive: 0x0284c7,
      emissiveIntensity: 0.45,
      side: THREE.DoubleSide,
    });
    const airwayTubeMesh = new THREE.Mesh(airwayTubeGeo, airwayTubeMat);
    bodyGroup.add(airwayTubeMesh);

    // --- E. Trachea Cartilage Rings ---
    const ringsGroup = new THREE.Group();
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.35,
      metalness: 0.2,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.4,
    });
    for (let r = 0; r < 9; r++) {
      const rx = -0.3 - r * 0.34;
      const ringGeo = new THREE.TorusGeometry(0.46, 0.07, 12, 24);
      ringGeo.rotateY(Math.PI / 2);
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(rx, 1.5 - r * 0.012, 0);
      ringsGroup.add(ringMesh);
    }
    bodyGroup.add(ringsGroup);

    // --- F. Anatomical Tongue & Genioglossus Muscle (Realistic Lingual Volume) ---
    const tongueShape = new THREE.Shape();
    tongueShape.moveTo(1.4, 3.25); // Tip behind lower incisors
    tongueShape.quadraticCurveTo(2.1, 3.3, 2.0, 2.7); // Dorsum arch
    tongueShape.quadraticCurveTo(1.8, 2.2, 1.1, 2.3); // Base of tongue sloping to hyoid
    tongueShape.lineTo(0.9, 2.6);  // Genioglossus origin at inner mandible
    tongueShape.quadraticCurveTo(1.1, 3.0, 1.4, 3.25);

    const tongueGeo = new THREE.ExtrudeGeometry(tongueShape, {
      depth: 1.6,
      bevelEnabled: true,
      bevelThickness: 0.35,
      bevelSize: 0.3,
      bevelSegments: 5,
    });
    tongueGeo.translate(0, 0, -0.8);

    const tongueMat = new THREE.MeshStandardMaterial({
      color: 0xe11d48,
      transparent: true,
      opacity: 0.88,
      roughness: 0.4,
      metalness: 0.08,
      emissive: 0x9f1239,
      emissiveIntensity: 0.4,
    });
    const tongueMesh = new THREE.Mesh(tongueGeo, tongueMat);
    bodyGroup.add(tongueMesh);

    // --- G. Anatomical Soft Palate & Uvula (Curved Velum draping downward) ---
    const palateCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(2.1, 3.45, 0), // Junction with hard palate
      new THREE.Vector3(2.35, 3.15, 0), // Velar curve
      new THREE.Vector3(2.25, 2.65, 0), // Free margin & Uvula tip
    ]);
    const palateGeo = new THREE.TubeGeometry(palateCurve, 24, 0.22, 14, false);
    const palateMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.9,
      roughness: 0.35,
      emissive: 0xbe123c,
      emissiveIntensity: 0.45,
    });
    const palateMesh = new THREE.Mesh(palateGeo, palateMat);
    bodyGroup.add(palateMesh);

    // --- H. Epiglottis Cartilage Leaf ---
    const epiglottisGeo = new THREE.CylinderGeometry(0.08, 0.16, 0.75, 12);
    epiglottisGeo.rotateZ(Math.PI / 4.5);
    const epiglottisMat = new THREE.MeshStandardMaterial({
      color: 0xfb7185,
      roughness: 0.5,
      emissive: 0xe11d48,
      emissiveIntensity: 0.3,
    });
    const epiglottisMesh = new THREE.Mesh(epiglottisGeo, epiglottisMat);
    epiglottisMesh.position.set(1.15, 2.05, 0);
    bodyGroup.add(epiglottisMesh);

    // Register all clippable materials for Sagittal Cut
    clippableMaterialsRef.current = [skinGlassMat, boneMat, tongueMat, palateMat, epiglottisMat];

    // --- I. Cervical Spine C1-C6 with Intervertebral Discs ---
    const spineGroup = new THREE.Group();
    const vertMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.6, metalness: 0.2 });
    const discMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 0.65 });

    for (let c = 0; c < 6; c++) {
      const cx = 1.0 - c * 0.6;
      const cy = 1.0 - c * 0.05;
      const vertGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.35, 12);
      vertGeo.rotateZ(Math.PI / 2);
      const vertMesh = new THREE.Mesh(vertGeo, vertMat);
      vertMesh.position.set(cx, cy, 0);
      spineGroup.add(vertMesh);

      if (c < 5) {
        const discGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.12, 12);
        discGeo.rotateZ(Math.PI / 2);
        const discMesh = new THREE.Mesh(discGeo, discMat);
        discMesh.position.set(cx - 0.26, cy, 0);
        spineGroup.add(discMesh);
      }
    }
    bodyGroup.add(spineGroup);

    // --- J. Anatomical Brain & Brainstem ---
    const brainGroup = new THREE.Group();
    const brainGyriTexture = createBrainGyriTexture();
    const brainMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      map: brainGyriTexture,
      transparent: true,
      opacity: 0.58,
      roughness: 0.4,
      metalness: 0.15,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.35,
    });

    const leftHemiGeo = new THREE.SphereGeometry(1.4, 28, 24);
    leftHemiGeo.scale(1.2, 0.88, 0.72);
    const leftHemi = new THREE.Mesh(leftHemiGeo, brainMat);
    leftHemi.position.set(3.4, 2.7, 0.65);
    brainGroup.add(leftHemi);

    const rightHemi = new THREE.Mesh(leftHemiGeo, brainMat);
    rightHemi.position.set(3.4, 2.7, -0.65);
    brainGroup.add(rightHemi);

    clippableMaterialsRef.current.push(brainMat);

    // Brainstem & ARAS Reticular Activation Center
    const stemGeo = new THREE.CylinderGeometry(0.32, 0.45, 1.8, 16);
    stemGeo.rotateZ(Math.PI / 3.5);
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      emissive: 0x9333ea,
      emissiveIntensity: 0.5,
    });
    const brainstem = new THREE.Mesh(stemGeo, stemMat);
    brainstem.position.set(2.4, 1.8, 0);
    brainGroup.add(brainstem);
    bodyGroup.add(brainGroup);

    // --- K. Lungs & Pulsating Heart ---
    const lungsGroup = new THREE.Group();
    const lungTranslucentMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.35,
      transmission: 0.5,
      roughness: 0.3,
      emissive: 0x0369a1,
      emissiveIntensity: 0.25,
      side: THREE.DoubleSide,
    });

    const leftLungGeo = new THREE.ConeGeometry(1.6, 4.0, 20);
    leftLungGeo.rotateZ(Math.PI / 2);
    leftLungGeo.scale(1.0, 1.0, 0.85);
    const leftLungMesh = new THREE.Mesh(leftLungGeo, lungTranslucentMat);
    leftLungMesh.position.set(-0.6, 0, 1.4);
    lungsGroup.add(leftLungMesh);

    const rightLungMesh = new THREE.Mesh(leftLungGeo, lungTranslucentMat);
    rightLungMesh.position.set(-0.6, 0, -1.4);
    lungsGroup.add(rightLungMesh);

    // Pulsating Heart
    const heartGeo = new THREE.SphereGeometry(0.85, 20, 20);
    heartGeo.scale(1.15, 0.9, 0.9);
    const heartMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.35,
      emissive: 0x991b1b,
      emissiveIntensity: 0.45,
    });
    const heartMesh = new THREE.Mesh(heartGeo, heartMat);
    heartMesh.position.set(-3.7, 1.1, 0);
    bodyGroup.add(heartMesh);
    bodyGroup.add(lungsGroup);

    // --- L. Airflow Particles (Bioluminescent O2 Molecules) ---
    const particleCount = 100;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleProgress = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particleProgress[i] = i / particleCount;
      const pt = airwaySpline.getPoint(particleProgress[i]);
      particlePositions[i * 3] = pt.x;
      particlePositions[i * 3 + 1] = pt.y;
      particlePositions[i * 3 + 2] = pt.z;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.36,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    bodyGroup.add(particlePoints);

    // --- ANIMATION LOOP ---
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // 1. Programmatic Camera Animation Lerp (Smooth cubic ease-out, zero conflict with OrbitControls)
      if (animRef.current.active) {
        const now = performance.now();
        const elapsed = now - animRef.current.startTime;
        const progress = Math.min(1, elapsed / animRef.current.duration);
        // Cubic ease-out curve
        const ease = 1 - Math.pow(1 - progress, 3);

        camera.position.lerpVectors(animRef.current.startPos, animRef.current.endPos, ease);
        controls.target.lerpVectors(animRef.current.startTarget, animRef.current.endTarget, ease);
        controls.update();

        if (progress >= 1) {
          animRef.current.active = false;
          animRef.current.isResetting = false;
          camera.position.copy(animRef.current.endPos);
          controls.target.copy(animRef.current.endTarget);
          controls.update();
        }
      } else {
        controls.update();
      }

      // Read current dynamic props without restarting WebGL
      const {
        airwayStatus: curAirwayStatus,
        airflowPercent: curAirflowPercent,
        isBrainArousal: curIsBrainArousal,
        isSympathetic: curIsSympathetic,
      } = propsRef.current;

      const isCollapsed = curAirwayStatus === 'collapsed';
      const isNarrowed = curAirwayStatus === 'narrowed';
      const isReopening = curAirwayStatus === 'reopening';

      // 2. Biological Tissue Motion & Morphing Pharyngeal Dynamics
      if (isCollapsed) {
        // Step 3 & 4: Severe Apnea - Base of tongue falls backwards against posterior wall
        tongueMesh.position.set(0.35, -0.4, 0);
        tongueMesh.scale.set(1.05, 0.88, 1.15);
        (tongueMesh.material as THREE.MeshStandardMaterial).color.setHex(0x9f1239);
        (tongueMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x881337);

        palateMesh.position.set(-0.25, -0.45, 0);
        palateMesh.rotation.z = -Math.PI / 7;

        epiglottisMesh.rotation.z = -Math.PI / 7;
        hyoidMesh.position.set(-0.08, -0.15, 0);

        occlusionPointLight.intensity = 3.5 + Math.sin(elapsedTime * 6) * 1.5;
        (airwayTubeMesh.material as THREE.MeshStandardMaterial).color.setHex(0xef4444);
        (airwayTubeMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0xb91c1c);

        soundWaveMat.opacity = 0;

        // Paradoxical chest retraction
        const chestRetraction = Math.sin(elapsedTime * 4.8) * 0.14;
        leftLungMesh.position.y = chestRetraction;
        rightLungMesh.position.y = chestRetraction;
      } else if (isNarrowed) {
        // Step 2: Snoring - Uvula rapid acoustic flutter + sound ripple
        const flutter = Math.sin(elapsedTime * 36) * 0.09;
        palateMesh.position.set(flutter, flutter * 0.5, 0);

        tongueMesh.position.set(0.12, -0.15, 0);
        tongueMesh.scale.set(1.02, 0.95, 1.05);
        (tongueMesh.material as THREE.MeshStandardMaterial).color.setHex(0xe11d48);
        (tongueMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x9f1239);

        epiglottisMesh.rotation.z = Math.PI / 5;
        hyoidMesh.position.set(0, 0, 0);

        occlusionPointLight.intensity = 1.0;
        (airwayTubeMesh.material as THREE.MeshStandardMaterial).color.setHex(0xf59e0b);
        (airwayTubeMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0xd97706);

        // Expanding acoustic snoring ripples
        const waveScale = (elapsedTime * 2.5) % 1.0;
        soundWaveMesh.scale.setScalar(1 + waveScale * 2.5);
        soundWaveMat.opacity = (1 - waveScale) * 0.75;
      } else if (isReopening) {
        // Step 5: Micro-arousal & Gasp - Genioglossus contracts forward
        tongueMesh.position.set(-0.15, 0.1, 0);
        tongueMesh.scale.set(0.96, 1.02, 0.92);
        (tongueMesh.material as THREE.MeshStandardMaterial).color.setHex(0x38bdf8);
        (tongueMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x0284c7);

        palateMesh.position.set(0.1, 0.1, 0);
        palateMesh.rotation.z = 0;

        epiglottisMesh.rotation.z = Math.PI / 4.2;
        hyoidMesh.position.set(0.1, 0.05, 0);

        occlusionPointLight.intensity = 0;
        soundWaveMat.opacity = 0;
        (airwayTubeMesh.material as THREE.MeshStandardMaterial).color.setHex(0x34d399);
        (airwayTubeMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x059669);
      } else {
        // Step 1: Normal open airway
        tongueMesh.position.set(0, 0, 0);
        tongueMesh.scale.set(1, 1, 1);
        (tongueMesh.material as THREE.MeshStandardMaterial).color.setHex(0xe11d48);
        (tongueMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x9f1239);

        palateMesh.position.set(0, 0, 0);
        palateMesh.rotation.z = 0;

        epiglottisMesh.rotation.z = Math.PI / 4.5;
        hyoidMesh.position.set(0, 0, 0);

        occlusionPointLight.intensity = 0;
        soundWaveMat.opacity = 0;
        (airwayTubeMesh.material as THREE.MeshStandardMaterial).color.setHex(0x38bdf8);
        (airwayTubeMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x0284c7);
      }

      // 3. Brain Arousal Neural Flash
      if (curIsBrainArousal) {
        arousalPointLight.intensity = 5.0 + Math.sin(elapsedTime * 12) * 2.5;
        (brainMat as THREE.MeshStandardMaterial).color.setHex(0xfbbf24);
        (brainMat as THREE.MeshStandardMaterial).emissive.setHex(0xd97706);
        (brainMat as THREE.MeshStandardMaterial).emissiveIntensity = 0.85;
      } else {
        arousalPointLight.intensity = 0;
        (brainMat as THREE.MeshStandardMaterial).color.setHex(0xa855f7);
        (brainMat as THREE.MeshStandardMaterial).emissive.setHex(0x7c3aed);
        (brainMat as THREE.MeshStandardMaterial).emissiveIntensity = 0.35;
      }

      // 4. Cardiac Rhythm
      const heartSpeed = curIsSympathetic ? 12 : 3.5;
      const heartPulse = 1.0 + Math.sin(elapsedTime * heartSpeed) * (curIsSympathetic ? 0.22 : 0.08);
      heartMesh.scale.set(1.15 * heartPulse, 0.9 * heartPulse, 0.9 * heartPulse);

      // 5. Bioluminescent O2 Flow Particles
      const positions = particleGeo.attributes.position.array as Float32Array;
      const speedMultiplier = isCollapsed ? 0.0 : (curAirflowPercent / 100) * 0.012;

      for (let i = 0; i < particleCount; i++) {
        if (!isCollapsed) {
          particleProgress[i] = (particleProgress[i] + speedMultiplier) % 1.0;
        } else {
          particleProgress[i] = Math.min(particleProgress[i], 0.38);
        }
        const pt = airwaySpline.getPoint(particleProgress[i]);
        positions[i * 3] = pt.x;
        positions[i * 3 + 1] = pt.y;
        positions[i * 3 + 2] = pt.z;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // 6. UPDATE 3D FLOATING PINS SCREEN POSITIONS (60 FPS Smooth projection)
      const curW = container.clientWidth;
      const curH = container.clientHeight || 480;

      landmarkPins.forEach((pin) => {
        const domEl = pinRefs.current[pin.id];
        if (!domEl) return;

        // Verify point is in front of camera view frustum
        const viewPos = pin.pos.clone().applyMatrix4(camera.matrixWorldInverse);
        if (viewPos.z >= -camera.near || viewPos.z <= -camera.far) {
          domEl.style.display = 'none';
          return;
        }

        // Project to NDC coordinates
        const projected = pin.pos.clone().project(camera);

        if (
          projected.z > 1.0 ||
          projected.z < -1.0 ||
          projected.x < -1.1 ||
          projected.x > 1.1 ||
          projected.y < -1.1 ||
          projected.y > 1.1
        ) {
          domEl.style.display = 'none';
        } else {
          const px = (projected.x * 0.5 + 0.5) * curW;
          const py = (-(projected.y * 0.5) + 0.5) * curH;
          domEl.style.display = 'flex';
          domEl.style.transform = `translate3d(${px}px, ${py}px, 0)`;
        }
      });

      // Render Scene
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []); // Mounted once: stable WebGL context

  // Update Sagittal Clipping Plane dynamically
  useEffect(() => {
    const sagittalPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0.02);
    clippableMaterialsRef.current.forEach((mat) => {
      mat.clippingPlanes = isSagittalClipped ? [sagittalPlane] : [];
      mat.needsUpdate = true;
    });
  }, [isSagittalClipped]);

  // Smooth Camera Preset Controller
  const setCameraPreset = (view: 'clinical' | 'airway' | 'endoscopy' | 'brain' | 'chest') => {
    setActiveCameraView(view);

    if (view === 'clinical') {
      resetToClinicalView();
    } else if (view === 'airway') {
      triggerCameraTransition(new THREE.Vector3(1.6, 2.8, 6.5), new THREE.Vector3(1.4, 2.3, 0), 700);
      setIsRotatedAway(true);
    } else if (view === 'endoscopy') {
      triggerCameraTransition(new THREE.Vector3(2.6, 4.4, 3.2), new THREE.Vector3(1.3, 2.0, 0), 750);
      setIsRotatedAway(true);
    } else if (view === 'brain') {
      triggerCameraTransition(new THREE.Vector3(3.4, 3.5, 6.8), new THREE.Vector3(3.0, 2.6, 0), 700);
      setIsRotatedAway(true);
    } else if (view === 'chest') {
      triggerCameraTransition(new THREE.Vector3(-2.8, 3.5, 8.5), new THREE.Vector3(-2.5, 1.2, 0), 700);
      setIsRotatedAway(true);
    }
  };



  return (
    <div className="relative w-full h-[460px] sm:h-[520px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl select-none">
      {/* 3D WebGL Canvas */}
      <div 
        ref={mountRef} 
        data-testid="three-canvas-container"
        className="w-full h-full cursor-grab active:cursor-grabbing" 
      />

      {/* HOLOGRAPHIC CALIBRATION SCANLINE OVERLAY */}
      {isRecalibrating && (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-teal-300 to-transparent shadow-[0_0_18px_#2dd4bf] animate-scanline" />
          <div className="w-full h-full bg-teal-500/5 pointer-events-none animate-pulse" />
        </div>
      )}

      {/* TOP ZONE: Unified Sleek Glassmorphic Toolbar (Z-Index 20) */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
        {/* Left: Camera Presets with prominent 'Góc Nhìn Y Khoa Chuẩn' button */}
        <div className="flex items-center gap-1 bg-slate-900/95 backdrop-blur-md p-1 rounded-2xl border border-slate-700/80 shadow-2xl pointer-events-auto overflow-x-auto no-scrollbar max-w-[calc(100%-110px)] sm:max-w-none">
          
          {/* THE MASTER BUTTON: 'Góc Nhìn Y Khoa Chuẩn' (Golden Standard Sagittal View) */}
          <button
            data-testid="btn-reset-clinical-view"
            onClick={resetToClinicalView}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all shadow-md flex-shrink-0 group relative ${
              isRotatedAway
                ? 'bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 text-white border border-teal-300 ring-2 ring-teal-400/50 animate-pulse hover:brightness-110 shadow-lg shadow-teal-500/30'
                : activeCameraView === 'clinical'
                ? 'bg-teal-600 text-white border border-teal-400 shadow-teal-500/30'
                : 'bg-slate-800/90 text-teal-300 border border-teal-600/40 hover:text-white hover:bg-slate-800'
            }`}
            title="Khôi phục góc nhìn đứng dọc (Sagittal) chuẩn y khoa tối ưu nhất"
          >
            <Compass 
              className={`w-3.5 h-3.5 text-teal-200 group-hover:rotate-45 transition-transform duration-300 flex-shrink-0 ${
                isRotatedAway ? 'animate-spin-slow' : ''
              }`} 
            />
            <span className="tracking-tight whitespace-nowrap flex items-center gap-1">
              <span className="sm:inline hidden">⭐ </span>
              <span className="hidden xs:inline">Góc Nhìn Y Khoa Chuẩn</span>
              <span className="xs:hidden">Góc Y Khoa</span>
            </span>
            {isRotatedAway ? (
              <span className="px-1.5 py-0.2 bg-black/30 border border-white/20 rounded-md text-[10px] font-mono font-bold text-emerald-200 flex-shrink-0">
                {deviationAngle > 0 ? `-${deviationAngle}°` : 'Lệch'}
              </span>
            ) : (
              <span className="hidden md:inline px-1 py-0.2 bg-teal-800/60 rounded text-[9px] font-mono text-teal-200">
                Sagittal
              </span>
            )}
          </button>

          <div className="w-px h-4 bg-slate-700/70 mx-0.5 flex-shrink-0" />

          {/* Sub-presets */}
          <button
            data-testid="btn-view-airway"
            onClick={() => setCameraPreset('airway')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
              activeCameraView === 'airway'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Họng & Lưỡi
          </button>
          <button
            data-testid="btn-view-endoscopy"
            onClick={() => setCameraPreset('endoscopy')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 flex-shrink-0 ${
              activeCameraView === 'endoscopy'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Mô phỏng nội soi vòm họng từ trên nhìn xuống (DISE)"
          >
            <Video className="w-3 h-3 text-sky-400 flex-shrink-0" />
            <span>Nội soi DISE</span>
          </button>
          <button
            data-testid="btn-view-brain"
            onClick={() => setCameraPreset('brain')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
              activeCameraView === 'brain'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Não ARAS
          </button>
          <button
            data-testid="btn-view-chest"
            onClick={() => setCameraPreset('chest')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
              activeCameraView === 'chest'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Phổi & Tim
          </button>
        </div>

        {/* Right: Auxiliary Toggles (3D Labels + Sagittal Clipping Plane) */}
        <div className="flex items-center gap-1.5 pointer-events-auto flex-shrink-0">
          <button
            data-testid="btn-toggle-3d-labels"
            onClick={() => setShow3DLabels(!show3DLabels)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-lg backdrop-blur-md ${
              show3DLabels
                ? 'bg-teal-600 text-white border-teal-500'
                : 'bg-slate-900/90 border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Bật/Tắt các mốc định danh giải phẫu 3D"
          >
            <Tag className="w-3.5 h-3.5 text-teal-300" />
            <span className="hidden md:inline">{show3DLabels ? 'Ẩn số ghim' : 'Hiện số ghim'}</span>
          </button>

          <button
            data-testid="btn-toggle-sagittal-cut"
            onClick={() => setIsSagittalClipped(!isSagittalClipped)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-lg backdrop-blur-md ${
              isSagittalClipped
                ? 'bg-teal-500/30 border-teal-400 text-teal-200 ring-2 ring-teal-400/30'
                : 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Cắt đôi khuôn mặt theo mặt phẳng đứng dọc để nhìn sâu vào lòng họng"
          >
            <Scissors className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">{isSagittalClipped ? 'Hủy cắt đứng' : 'Mặt cắt đứng'}</span>
            <span className="sm:hidden">{isSagittalClipped ? 'Bỏ cắt' : 'Mặt cắt'}</span>
          </button>
        </div>
      </div>

      {/* DYNAMIC FLOATING PILL: Shown when user rotates freely away from clinical orientation */}
      {isRotatedAway && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 pointer-events-auto animate-in fade-in slide-in-from-top-3 duration-300 max-w-[92vw]">
          <button
            data-testid="floating-reset-clinical-pill"
            onClick={resetToClinicalView}
            className="flex items-center gap-2 bg-gradient-to-r from-teal-600 via-sky-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs px-3.5 sm:px-4 py-2 rounded-full shadow-2xl border border-teal-300/60 backdrop-blur-md ring-4 ring-teal-500/20 group hover:scale-105 transition-all cursor-pointer whitespace-nowrap"
            title="Bấm để đưa camera trở lại góc nhìn đứng dọc chuẩn y khoa"
          >
            <RotateCcw className="w-3.5 h-3.5 text-teal-100 group-hover:-rotate-90 transition-transform duration-300 flex-shrink-0" />
            <span className="hidden sm:inline">Lệch {deviationAngle > 0 ? `${deviationAngle}° • ` : ''}Bấm về Góc Nhìn Y Khoa Chuẩn</span>
            <span className="sm:hidden">{deviationAngle > 0 ? `Lệch ${deviationAngle}° • ` : ''}Về Góc Chuẩn</span>
            <span className="px-1.5 py-0.2 bg-emerald-300 text-slate-950 font-black rounded-full text-[10px] font-mono flex-shrink-0">1-Chạm</span>
          </button>
        </div>
      )}

      {/* CONFIRMATION TOAST: Gently notifies that clinical view is locked */}
      {showResetToast && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-in fade-in slide-in-from-top-2 duration-200 max-w-[92vw]">
          <div className="flex items-center gap-2 bg-emerald-950/95 border border-emerald-500 text-emerald-200 text-xs font-bold px-3.5 sm:px-4 py-2 rounded-xl shadow-2xl backdrop-blur-md whitespace-nowrap">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="hidden sm:inline">Đã khóa Góc Nhìn Y Khoa Chuẩn (Mặt cắt Sagittal)</span>
            <span className="sm:hidden">Đã khóa Góc Nhìn Chuẩn</span>
          </div>
        </div>
      )}

      {/* ROTATION GESTURE HINT (Hidden when rotated away to prevent clutter) */}
      {!isRotatedAway && !showResetToast && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-10 pointer-events-none hidden lg:flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-700/60 text-[10px] text-slate-400 shadow-md">
          <RotateCw className="w-3 h-3 text-teal-400 animate-spin-slow" />
          <span>Kéo chuột xoay 360° • Cuộn phóng to/thu nhỏ • Nút góc y khoa sẵn sàng khôi phục</span>
        </div>
      )}

      {/* INTERACTIVE 3D FLOATING LANDMARK PINS (Anchored to Organs in 3D Space) */}
      {show3DLabels && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {landmarkPins.map((pin) => (
            <div
              key={pin.id}
              data-pin-id={pin.id}
              data-testid={`pin-3d-${pin.id}`}
              ref={(el) => { pinRefs.current[pin.id] = el; }}
              style={{ position: 'absolute', top: 0, left: 0, willChange: 'transform' }}
              className="pointer-events-auto cursor-pointer group"
              onClick={() => setSelectedPin(pin)}
            >
              <div
                className={`transition-transform duration-150 group-hover:scale-105 flex items-center ${
                  pin.align === 'left'
                    ? '-translate-x-full -translate-y-1/2 pr-2'
                    : pin.align === 'right'
                    ? 'translate-x-2 -translate-y-1/2'
                    : '-translate-x-1/2 -translate-y-1/2'
                }`}
              >
                <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-700/90 shadow-2xl group-hover:border-teal-400">
                  <div
                    className="w-2 h-2 rounded-full animate-pulse flex-shrink-0"
                    style={{ backgroundColor: pin.color }}
                  />
                  <span className="text-[11px] font-bold text-slate-100 whitespace-nowrap">
                    {pin.shortName}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SELECTED 3D PIN DETAIL MODAL CARD */}
      {selectedPin && (
        <div 
          data-testid="selected-pin-popup"
          data-selected-pin-id={selectedPin.id}
          className="absolute bottom-3 left-3 right-3 z-30 bg-slate-900/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-teal-500/60 shadow-2xl flex items-start justify-between gap-3 animate-fadeIn pointer-events-auto"
        >
          <div className="space-y-1">
            <h4 data-testid="selected-pin-name" className="text-xs sm:text-sm font-bold text-teal-400 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span>{selectedPin.name}</span>
            </h4>
            <p data-testid="selected-pin-role" className="text-xs text-slate-200 leading-relaxed">
              {selectedPin.role}
            </p>
          </div>
          <button
            data-testid="close-pin-popup-btn"
            onClick={() => setSelectedPin(null)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors flex-shrink-0"
            title="Đóng thông tin"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* BOTTOM-RIGHT ZONE: Quick Organ Focus Buttons */}
      <div className="absolute bottom-3 right-3 z-10 hidden sm:flex items-center gap-1 sm:gap-1.5 pointer-events-auto">
        <button
          onClick={() => setCameraPreset('airway')}
          className={`px-2 py-1 rounded-lg text-[11px] font-medium border backdrop-blur-md transition-all shadow-md ${
            activeCameraView === 'airway'
              ? 'bg-rose-500/30 border-rose-400 text-rose-200'
              : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Tập trung vào Gốc lưỡi và Cơ cằm - lưỡi"
        >
          👅 Gốc lưỡi
        </button>
        <button
          onClick={() => setCameraPreset('brain')}
          className={`px-2 py-1 rounded-lg text-[11px] font-medium border backdrop-blur-md transition-all shadow-md ${
            activeCameraView === 'brain'
              ? 'bg-amber-500/30 border-amber-400 text-amber-200'
              : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Tập trung vào Não bộ & ARAS"
        >
          🧠 Não bộ
        </button>
        <button
          onClick={() => setCameraPreset('chest')}
          className={`px-2 py-1 rounded-lg text-[11px] font-medium border backdrop-blur-md transition-all shadow-md ${
            activeCameraView === 'chest'
              ? 'bg-sky-500/30 border-sky-400 text-sky-200'
              : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Tập trung vào Phổi & Nhịp tim"
        >
          🫁 Phổi & Tim
        </button>
      </div>
    </div>
  );
};

export default AnatomyScene3D;

