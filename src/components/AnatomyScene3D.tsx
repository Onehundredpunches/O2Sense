import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  RotateCw, 
  Eye, 
  Scissors, 
  Gauge, 
  Video
} from 'lucide-react';

interface AnatomyScene3DProps {
  step: number; // 1 to 5
  airwayStatus: 'open' | 'narrowed' | 'collapsed' | 'reopening';
  airflowPercent: number;
  spo2Percent: number;
  isBrainArousal: boolean;
  isSympathetic: boolean;
}

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
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 6.5, 13.5));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0.5, 2.2, 0));

  const [activeCameraView, setActiveCameraView] = useState<'profile' | 'airway' | 'endoscopy' | 'brain' | 'chest'>('profile');
  const [isSagittalClipped, setIsSagittalClipped] = useState<boolean>(false);
  const [activePin, setActivePin] = useState<string | null>(null);

  // Live airway caliber calculation
  const airwayCaliber = {
    1: 12.0,
    2: 3.2,
    3: 0.0,
    4: 0.0,
    5: 11.5,
  }[step] ?? (airwayStatus === 'collapsed' ? 0.0 : airwayStatus === 'narrowed' ? 3.5 : 12.0);

  // Ref to materials that support sagittal clipping plane
  const clippableMaterialsRef = useRef<THREE.Material[]>([]);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 480;

    // 1. Scene Setup with Deep Medical Slate Atmosphere
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);
    scene.fog = new THREE.FogExp2(0x030712, 0.022);

    // 2. Camera Setup (Horizontal Supine Sleep Posture)
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 6.5, 13.5);
    cameraRef.current = camera;

    // 3. WebGL Renderer with High-Fidelity Tone Mapping & Local Clipping Enabled
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.localClippingEnabled = true;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxDistance = 26;
    controls.minDistance = 2.2;
    controls.target.set(0.5, 2.2, 0);
    controlsRef.current = controls;

    // 5. Lighting: Holographic Medical Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
    keyLight.position.set(6, 12, 10);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x818cf8, 1.6);
    rimLight.position.set(-10, -5, -8);
    scene.add(rimLight);

    const warmFillLight = new THREE.DirectionalLight(0xf43f5e, 0.9);
    warmFillLight.position.set(2, 6, 8);
    scene.add(warmFillLight);

    // Brain Arousal Point Light
    const arousalPointLight = new THREE.PointLight(0xf59e0b, 0, 18);
    arousalPointLight.position.set(3.4, 2.8, 0);
    scene.add(arousalPointLight);

    // Occlusion Warning Point Light
    const occlusionPointLight = new THREE.PointLight(0xef4444, 0, 12);
    occlusionPointLight.position.set(1.5, 2.2, 0);
    scene.add(occlusionPointLight);

    // Acoustic Snoring Sound Wave Mesh (Pulsing Rings)
    const soundWaveGeo = new THREE.RingGeometry(0.2, 0.4, 32);
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

    // --- A. Hospital Bed & Ergonomic Pillow ---
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

    // --- B. Sculpted Translucent 3D Human Silhouette (Head, Neck, Torso) ---
    const bodyProfileShape = new THREE.Shape();
    bodyProfileShape.moveTo(-7.5, 0.3);
    bodyProfileShape.lineTo(-3.5, 0.4);
    bodyProfileShape.lineTo(-1.0, 0.6);
    bodyProfileShape.lineTo(1.5, 0.8);
    bodyProfileShape.quadraticCurveTo(3.2, 1.0, 4.8, 1.5);
    bodyProfileShape.quadraticCurveTo(5.4, 2.4, 5.0, 3.4);
    bodyProfileShape.quadraticCurveTo(4.4, 4.4, 3.4, 4.4); // Forehead
    bodyProfileShape.lineTo(2.7, 4.3);
    bodyProfileShape.lineTo(2.35, 5.15); // Nose tip
    bodyProfileShape.lineTo(2.0, 4.65);  // Philtrum
    bodyProfileShape.lineTo(1.9, 4.35);  // Upper lip
    bodyProfileShape.lineTo(1.8, 4.3);
    bodyProfileShape.lineTo(1.68, 3.9);  // Lower lip
    bodyProfileShape.lineTo(1.58, 4.0);  // Mentolabial sulcus
    bodyProfileShape.lineTo(1.25, 3.35); // Mental protuberance (Chin)
    bodyProfileShape.quadraticCurveTo(0.7, 2.6, 0.0, 2.3); // Submental throat
    bodyProfileShape.lineTo(-0.6, 2.2);  // Thyroid notch (Adam's apple)
    bodyProfileShape.quadraticCurveTo(-1.8, 2.7, -3.5, 2.85); // Chest contour
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
      roughness: 0.3,
      metalness: 0.1,
      transmission: 0.7,
      thickness: 2.2,
      ior: 1.35,
      side: THREE.DoubleSide,
    });
    const bodySkinMesh = new THREE.Mesh(bodySkinGeo, skinGlassMat);
    bodyGroup.add(bodySkinMesh);

    // --- C. Anatomical Mandible & Hard Palate (Cortical Bone) ---
    const mandibleShape = new THREE.Shape();
    mandibleShape.moveTo(1.2, 3.3);
    mandibleShape.lineTo(1.4, 3.2);
    mandibleShape.quadraticCurveTo(0.6, 2.4, 0.2, 2.5);
    mandibleShape.lineTo(0.0, 2.65);
    mandibleShape.quadraticCurveTo(0.5, 2.8, 1.2, 3.3);

    const mandibleGeo = new THREE.ExtrudeGeometry(mandibleShape, { depth: 2.0, bevelEnabled: true, bevelThickness: 0.15, bevelSize: 0.1, bevelSegments: 3 });
    mandibleGeo.translate(0, 0, -1.0);
    const boneMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.5,
      metalness: 0.15,
      emissive: 0x64748b,
      emissiveIntensity: 0.15,
    });
    const mandibleMesh = new THREE.Mesh(mandibleGeo, boneMat);
    bodyGroup.add(mandibleMesh);

    // Hard Palate (Bony roof of mouth)
    const hardPalateGeo = new THREE.BoxGeometry(0.8, 0.18, 1.8);
    const hardPalateMesh = new THREE.Mesh(hardPalateGeo, boneMat);
    hardPalateMesh.position.set(2.4, 3.55, 0);
    hardPalateMesh.rotation.z = -Math.PI / 16;
    bodyGroup.add(hardPalateMesh);

    // --- D. Upper Airway Lumen Tunnel (Translucent Mucosal Air Path) ---
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

      // Smooth Camera Lerp
      camera.position.lerp(targetCamPosRef.current, 0.05);
      controls.target.lerp(targetLookAtRef.current, 0.05);
      controls.update();

      const isCollapsed = airwayStatus === 'collapsed';
      const isNarrowed = airwayStatus === 'narrowed';
      const isReopening = airwayStatus === 'reopening';

      // 1. Biological Tissue Motion & Realistic Pharyngeal Dynamics
      if (isCollapsed) {
        // Step 3 & 4: Severe Apnea - Base of tongue falls backwards against posterior wall
        tongueMesh.position.set(0.35, -0.4, 0);
        tongueMesh.scale.set(1.05, 0.88, 1.15);
        (tongueMesh.material as THREE.MeshStandardMaterial).color.setHex(0x9f1239);
        (tongueMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x881337);

        palateMesh.position.set(-0.25, -0.45, 0);
        palateMesh.rotation.z = -Math.PI / 7;

        occlusionPointLight.intensity = 3.5 + Math.sin(elapsedTime * 6) * 1.5;
        (airwayTubeMesh.material as THREE.MeshStandardMaterial).color.setHex(0xef4444);
        (airwayTubeMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0xb91c1c);

        // Sound wave invisible during complete silence apnea
        soundWaveMat.opacity = 0;

        // Paradoxical chest retraction (respiratory struggle against closed throat)
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

        occlusionPointLight.intensity = 1.0;
        (airwayTubeMesh.material as THREE.MeshStandardMaterial).color.setHex(0xf59e0b);
        (airwayTubeMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0xd97706);

        // Expanding acoustic snoring ripples
        const waveScale = ((elapsedTime * 2.5) % 1.0);
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

        occlusionPointLight.intensity = 0;
        soundWaveMat.opacity = 0;
        (airwayTubeMesh.material as THREE.MeshStandardMaterial).color.setHex(0x38bdf8);
        (airwayTubeMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x0284c7);
      }

      // 2. Brain Arousal Neural Flash
      if (isBrainArousal) {
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

      // 3. Cardiac Rhythm
      const heartSpeed = isSympathetic ? 12 : 3.5;
      const heartPulse = 1.0 + Math.sin(elapsedTime * heartSpeed) * (isSympathetic ? 0.22 : 0.08);
      heartMesh.scale.set(1.15 * heartPulse, 0.9 * heartPulse, 0.9 * heartPulse);

      // 4. Bioluminescent O2 Flow Particles
      const positions = particleGeo.attributes.position.array as Float32Array;
      const speedMultiplier = isCollapsed ? 0.0 : (airflowPercent / 100) * 0.012;

      for (let i = 0; i < particleCount; i++) {
        if (!isCollapsed) {
          particleProgress[i] = (particleProgress[i] + speedMultiplier) % 1.0;
        } else {
          // Blocked: Particles cannot pass the blockage (limit to nasopharynx entrance)
          particleProgress[i] = Math.min(particleProgress[i], 0.38);
        }
        const pt = airwaySpline.getPoint(particleProgress[i]);
        positions[i * 3] = pt.x;
        positions[i * 3 + 1] = pt.y;
        positions[i * 3 + 2] = pt.z;
      }
      particleGeo.attributes.position.needsUpdate = true;

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
  }, [airwayStatus, airflowPercent, spo2Percent, isBrainArousal, isSympathetic]);

  // Update Sagittal Clipping Plane dynamically
  useEffect(() => {
    const sagittalPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0.02);
    clippableMaterialsRef.current.forEach((mat) => {
      mat.clippingPlanes = isSagittalClipped ? [sagittalPlane] : [];
      mat.needsUpdate = true;
    });
  }, [isSagittalClipped]);

  // Smooth Camera Preset Controller
  const setCameraPreset = (view: 'profile' | 'airway' | 'endoscopy' | 'brain' | 'chest') => {
    setActiveCameraView(view);
    setActivePin(null);

    if (view === 'profile') {
      targetCamPosRef.current.set(0, 6.5, 13.5);
      targetLookAtRef.current.set(0.5, 2.2, 0);
    } else if (view === 'airway') {
      targetCamPosRef.current.set(1.5, 4.2, 9.2);
      targetLookAtRef.current.set(1.4, 2.3, 0);
    } else if (view === 'endoscopy') {
      // Look down into the pharynx from the nasopharynx
      targetCamPosRef.current.set(3.2, 5.0, 4.8);
      targetLookAtRef.current.set(1.5, 2.0, 0);
    } else if (view === 'brain') {
      targetCamPosRef.current.set(3.8, 4.8, 7.8);
      targetLookAtRef.current.set(3.4, 2.7, 0);
    } else if (view === 'chest') {
      targetCamPosRef.current.set(-3.2, 4.8, 9.5);
      targetLookAtRef.current.set(-3.0, 1.2, 0);
    }
  };

  // Auto-align camera smoothly according to active step
  useEffect(() => {
    if (step === 3 || step === 5) {
      setCameraPreset('airway');
    } else if (step === 4) {
      setCameraPreset('brain');
    } else if (step === 2) {
      setCameraPreset('airway');
    } else {
      setCameraPreset('profile');
    }
  }, [step]);

  return (
    <div className="relative w-full h-[450px] sm:h-[510px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl select-none">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* TOP ZONE: Unified Sleek Glassmorphic Toolbar (Z-Index 20) */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
        {/* Left: Camera Presets (Horizontal Scroll without wrapping) */}
        <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-lg pointer-events-auto overflow-x-auto no-scrollbar max-w-[calc(100%-120px)] sm:max-w-none">
          <div className="px-1.5 py-0.5 text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 flex-shrink-0">
            <Eye className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden md:inline">Góc 3D:</span>
          </div>
          <button
            onClick={() => setCameraPreset('profile')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeCameraView === 'profile'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Bao quát
          </button>
          <button
            onClick={() => setCameraPreset('airway')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeCameraView === 'airway'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Họng & Lưỡi
          </button>
          <button
            onClick={() => setCameraPreset('endoscopy')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
              activeCameraView === 'endoscopy'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Góc nhìn nội soi tai mũi họng từ trên nhìn xuống"
          >
            <Video className="w-3 h-3 text-sky-400" />
            <span>Nội soi</span>
          </button>
          <button
            onClick={() => setCameraPreset('brain')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeCameraView === 'brain'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Não
          </button>
          <button
            onClick={() => setCameraPreset('chest')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeCameraView === 'chest'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Phổi
          </button>
        </div>

        {/* Right: Sagittal Clipping Plane Toggle */}
        <div className="flex items-center gap-1.5 pointer-events-auto flex-shrink-0">
          <button
            onClick={() => setIsSagittalClipped(!isSagittalClipped)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-lg backdrop-blur-md ${
              isSagittalClipped
                ? 'bg-teal-500/30 border-teal-400 text-teal-200'
                : 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Cắt đôi khuôn mặt theo mặt phẳng đứng dọc để nhìn vào lòng họng"
          >
            <Scissors className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">{isSagittalClipped ? 'Bỏ cắt 3D' : 'Mặt cắt 3D (Sagittal)'}</span>
            <span className="sm:hidden">{isSagittalClipped ? 'Hủy cắt' : 'Mặt cắt'}</span>
          </button>
        </div>
      </div>

      {/* TOP-CENTER: Mouse & Touch Gesture Hint (Below toolbar, Never Collides with any button) */}
      <div className="absolute top-14 left-1/2 -translate-x-1/2 z-10 pointer-events-none hidden lg:flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-700/60 text-[10px] text-slate-400 shadow-md">
        <RotateCw className="w-3 h-3 text-teal-400 animate-spin-slow" />
        <span>Kéo chuột xoay 360° • Cuộn phóng to/thu nhỏ</span>
      </div>

      {/* BOTTOM-LEFT ZONE: Real-time 3D Airway Caliber Gauge (Z-Index 10) */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-auto">
        <div className="bg-slate-900/95 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl border border-slate-700/80 shadow-2xl flex items-center gap-2 sm:gap-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-800 flex items-center justify-center text-teal-400 flex-shrink-0 border border-slate-700">
            <Gauge className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Khẩu kính 3D</span>
              <span className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                airwayCaliber === 0 ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                airwayCaliber < 5 ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {airwayCaliber === 0 ? 'TẮC NGHẼN' : airwayCaliber < 5 ? 'HẸP NẶNG' : 'THÔNG KHÍ'}
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-base sm:text-lg font-black tracking-tight ${
                airwayCaliber === 0 ? 'text-rose-400 animate-pulse' :
                airwayCaliber < 5 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {airwayCaliber.toFixed(1)}
              </span>
              <span className="text-xs font-semibold text-slate-400">mm</span>
              <span className="text-[10px] text-slate-500 ml-1 hidden sm:inline">
                (Chuẩn: 10 - 13mm)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM-RIGHT ZONE: Quick Organ Focus Buttons (Hidden on mobile to ensure 0 overlap with caliber gauge, visible on sm+) */}
      <div className="absolute bottom-3 right-3 z-10 hidden sm:flex items-center gap-1 sm:gap-1.5 pointer-events-auto">
        <button
          onClick={() => {
            setActivePin(activePin === 'tongue' ? null : 'tongue');
            setCameraPreset('airway');
          }}
          className={`px-2 py-1 rounded-lg text-[11px] font-medium border backdrop-blur-md transition-all shadow-md ${
            activePin === 'tongue'
              ? 'bg-rose-500/30 border-rose-400 text-rose-200'
              : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Tập trung vào Gốc lưỡi và Cơ cằm-lưỡi"
        >
          👅 Gốc lưỡi
        </button>
        <button
          onClick={() => {
            setActivePin(activePin === 'brain' ? null : 'brain');
            setCameraPreset('brain');
          }}
          className={`px-2 py-1 rounded-lg text-[11px] font-medium border backdrop-blur-md transition-all shadow-md ${
            activePin === 'brain'
              ? 'bg-amber-500/30 border-amber-400 text-amber-200'
              : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Tập trung vào Não bộ & Thần kinh hạ thiệt XII"
        >
          🧠 Não bộ
        </button>
        <button
          onClick={() => {
            setActivePin(activePin === 'lungs' ? null : 'lungs');
            setCameraPreset('chest');
          }}
          className={`px-2 py-1 rounded-lg text-[11px] font-medium border backdrop-blur-md transition-all shadow-md ${
            activePin === 'lungs'
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
