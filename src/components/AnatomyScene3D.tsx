import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RotateCw, Eye, Sparkles } from 'lucide-react';

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

  // Multi-frequency sinusoidal interference pattern simulating cerebral convolutions
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
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 7, 14));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.8, 0));

  const [activeCameraView, setActiveCameraView] = useState<'profile' | 'airway' | 'brain' | 'chest'>('profile');
  const [activePin, setActivePin] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 460;

    // 1. Scene Setup with Medical Deep Slate Atmosphere
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040814); // Deep surgical dark cyan
    scene.fog = new THREE.FogExp2(0x040814, 0.022);

    // 2. Camera Setup (Horizontal Supine Sleep Angle)
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 7, 14);
    cameraRef.current = camera;

    // 3. WebGL Renderer with High-Fidelity Tone Mapping
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxDistance = 28;
    controls.minDistance = 3.5;
    controls.target.set(0, 1.8, 0);
    controlsRef.current = controls;

    // 5. Lighting: Holographic Medical X-Ray Aesthetic
    const ambientLight = new THREE.AmbientLight(0x0c1b33, 1.4);
    scene.add(ambientLight);

    // Cyan Key Light
    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    keyLight.position.set(6, 12, 10);
    scene.add(keyLight);

    // Indigo Rim Light (Backlighting to highlight body silhouette)
    const rimLight = new THREE.DirectionalLight(0x818cf8, 1.5);
    rimLight.position.set(-10, -5, -8);
    scene.add(rimLight);

    // Soft Fill Light for facial contours
    const fillLight = new THREE.DirectionalLight(0x0284c7, 1.2);
    fillLight.position.set(2, 6, -8);
    scene.add(fillLight);

    // Brain Arousal Point Light (Flares golden during micro-arousal)
    const arousalPointLight = new THREE.PointLight(0xf59e0b, 0, 18);
    arousalPointLight.position.set(3.4, 2.7, 0);
    scene.add(arousalPointLight);

    // Occlusion Warning Point Light (Flares red at collapse site)
    const occlusionPointLight = new THREE.PointLight(0xef4444, 0, 10);
    occlusionPointLight.position.set(1.6, 2.0, 0);
    scene.add(occlusionPointLight);

    // 6. MAIN BODY GROUP (Supine Sleep Posture: Head at +X, Torso at -X)
    const bodyGroup = new THREE.Group();
    scene.add(bodyGroup);

    // --- A. Hospital Bed & Ergonomic Pillow ---
    // Soft Medical Pillow under head and neck
    const pillowGeo = new THREE.BoxGeometry(5.0, 1.1, 5.2);
    const pillowMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.85,
      metalness: 0.05,
    });
    const pillowMesh = new THREE.Mesh(pillowGeo, pillowMat);
    pillowMesh.position.set(3.2, 0.45, 0);
    bodyGroup.add(pillowMesh);

    // Mattress beneath thorax & spine
    const mattressGeo = new THREE.BoxGeometry(17, 1.0, 7.5);
    const mattressMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.9,
      metalness: 0.1,
    });
    const mattressMesh = new THREE.Mesh(mattressGeo, mattressMat);
    mattressMesh.position.set(-2.5, -0.6, 0);
    bodyGroup.add(mattressMesh);

    // --- B. Sculpted Translucent 3D Human Body Envelope ---
    // Anatomical profile of sleeping person (nose points UP toward ceiling)
    const bodyProfileShape = new THREE.Shape();
    bodyProfileShape.moveTo(-7.5, 0.3); // Mid-back on bed
    bodyProfileShape.lineTo(-3.5, 0.4); // Upper thoracic back
    bodyProfileShape.lineTo(-1.0, 0.6); // Cervical spine / nape on pillow
    bodyProfileShape.lineTo(1.5, 0.8);  // Neck-occiput junction
    bodyProfileShape.quadraticCurveTo(3.2, 1.0, 4.8, 1.5); // Occiput
    bodyProfileShape.quadraticCurveTo(5.4, 2.4, 5.0, 3.4); // Crown of head
    bodyProfileShape.quadraticCurveTo(4.4, 4.3, 3.4, 4.3); // Forehead / brow
    bodyProfileShape.lineTo(2.7, 4.2); // Glabella & nasal bridge
    bodyProfileShape.lineTo(2.3, 5.0); // Nose tip (pointing UP!)
    bodyProfileShape.lineTo(2.0, 4.5); // Columella / nostril base
    bodyProfileShape.lineTo(1.9, 4.2); // Philtrum
    bodyProfileShape.lineTo(1.8, 4.15); // Upper lip
    bodyProfileShape.lineTo(1.65, 3.75); // Oral fissure
    bodyProfileShape.lineTo(1.55, 3.85); // Lower lip
    bodyProfileShape.lineTo(1.25, 3.25); // Chin (mandibular symphysis)
    bodyProfileShape.quadraticCurveTo(0.7, 2.5, 0.0, 2.2); // Submental angle to thyroid notch
    bodyProfileShape.lineTo(-0.6, 2.1); // Suprasternal notch
    bodyProfileShape.quadraticCurveTo(-1.8, 2.6, -3.5, 2.75); // Clavicle & Upper chest
    bodyProfileShape.quadraticCurveTo(-5.5, 2.6, -7.5, 2.2); // Mid chest & abdomen
    bodyProfileShape.lineTo(-7.5, 0.3); // Close path

    const extrudeSettings = {
      steps: 2,
      depth: 3.4,
      bevelEnabled: true,
      bevelThickness: 0.9,
      bevelSize: 0.7,
      bevelSegments: 8,
    };
    const bodySkinGeo = new THREE.ExtrudeGeometry(bodyProfileShape, extrudeSettings);
    // Center extrusion along Z axis
    bodySkinGeo.translate(0, 0, -1.7);

    // Holographic Medical Glass Shader
    const skinGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.26,
      roughness: 0.2,
      metalness: 0.1,
      transmission: 0.78,
      thickness: 1.8,
      ior: 1.35,
      side: THREE.DoubleSide,
    });
    const bodySkinMesh = new THREE.Mesh(bodySkinGeo, skinGlassMat);
    bodyGroup.add(bodySkinMesh);

    // --- C. Anatomical Upper Airway Lumen Spline ---
    // Smooth spline pathway for airflow from Nostril -> Nasopharynx -> Oropharynx -> Trachea
    const airwaySpline = new THREE.CatmullRomCurve3([
      new THREE.Vector3(2.1, 4.5, 0),    // Nostril (Air inlet)
      new THREE.Vector3(2.5, 3.9, 0),    // Nasal cavity / turbinates
      new THREE.Vector3(2.8, 3.1, 0),    // Nasopharynx
      new THREE.Vector3(2.1, 2.3, 0),    // Retropalatal / Oropharynx (COLLAPSE SITE)
      new THREE.Vector3(1.4, 1.8, 0),    // Retroglossal (Behind tongue base)
      new THREE.Vector3(0.4, 1.6, 0),    // Hypopharynx / Larynx
      new THREE.Vector3(-1.2, 1.5, 0),   // Trachea upper
      new THREE.Vector3(-3.2, 1.4, 0),   // Trachea carina (lung bifurcation)
    ]);

    const airwayTubeGeo = new THREE.TubeGeometry(airwaySpline, 60, 0.42, 18, false);
    const airwayTubeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
      roughness: 0.15,
      emissive: 0x0284c7,
      emissiveIntensity: 0.45,
      side: THREE.DoubleSide,
    });
    const airwayTubeMesh = new THREE.Mesh(airwayTubeGeo, airwayTubeMat);
    bodyGroup.add(airwayTubeMesh);

    // --- D. Trachea Cartilage Rings (10 Ribbed C-Rings) ---
    const ringsGroup = new THREE.Group();
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.3,
      metalness: 0.2,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.5,
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

    // --- E. Anatomical Tongue & Genioglossus Muscle (Cơ Cằm-Lưỡi) ---
    // Sculpted crescent tongue organ resting in oral cavity
    const tongueGeo = new THREE.SphereGeometry(1.0, 24, 20);
    tongueGeo.scale(1.45, 0.85, 0.85);
    const tongueMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      roughness: 0.45,
      metalness: 0.1,
      emissive: 0xbe123c,
      emissiveIntensity: 0.35,
    });
    const tongueMesh = new THREE.Mesh(tongueGeo, tongueMat);
    tongueMesh.position.set(1.4, 2.3, 0);
    bodyGroup.add(tongueMesh);

    // Genioglossus muscle fan fibers connecting mandible chin (1.25, 3.25) to tongue base
    const muscleFibersGroup = new THREE.Group();
    const fiberMat = new THREE.LineBasicMaterial({ color: 0xfb7185, linewidth: 2 });
    for (let f = 0; f < 8; f++) {
      const zOff = (f - 3.5) * 0.18;
      const fiberGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(1.25, 3.25, zOff * 0.5), // Mandibular chin origin
        new THREE.Vector3(1.7, 2.1, zOff * 1.1),    // Tongue base insertion
      ]);
      const fiberLine = new THREE.Line(fiberGeo, fiberMat);
      muscleFibersGroup.add(fiberLine);
    }
    bodyGroup.add(muscleFibersGroup);

    // --- F. Soft Palate & Uvula (Khẩu Cái Mềm) ---
    const palateGeo = new THREE.ConeGeometry(0.35, 1.25, 16);
    palateGeo.rotateZ(0.65);
    const palateMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      roughness: 0.4,
      emissive: 0xbe123c,
      emissiveIntensity: 0.4,
    });
    const palateMesh = new THREE.Mesh(palateGeo, palateMat);
    palateMesh.position.set(2.3, 2.85, 0);
    bodyGroup.add(palateMesh);

    // --- G. Occlusion Clamp Ring (Active in Step 3 when airway collapses) ---
    const collapseClampGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.8, 16);
    collapseClampGeo.scale(1.0, 0.25, 1.2);
    const collapseClampMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.2,
      emissive: 0xdc2626,
      emissiveIntensity: 0.8,
    });
    const collapseClampMesh = new THREE.Mesh(collapseClampGeo, collapseClampMat);
    collapseClampMesh.position.set(1.7, 1.95, 0);
    collapseClampMesh.visible = false;
    bodyGroup.add(collapseClampMesh);

    // --- H. Anatomical Brain with Procedural Gyri & Cortical Arousal Flare ---
    const brainGroup = new THREE.Group();
    brainGroup.position.set(3.4, 2.7, 0);
    bodyGroup.add(brainGroup);

    const gyriTexture = createBrainGyriTexture();
    const brainMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      roughness: 0.4,
      metalness: 0.1,
      bumpMap: gyriTexture,
      bumpScale: 0.08,
      transparent: true,
      opacity: 0.82,
      emissive: 0x6d28d9,
      emissiveIntensity: 0.35,
    });

    // Left Hemisphere
    const leftHemisphereGeo = new THREE.SphereGeometry(1.35, 32, 24);
    leftHemisphereGeo.scale(1.2, 0.95, 0.72);
    const leftHemisphereMesh = new THREE.Mesh(leftHemisphereGeo, brainMat);
    leftHemisphereMesh.position.set(0, 0, 0.58);
    brainGroup.add(leftHemisphereMesh);

    // Right Hemisphere
    const rightHemisphereMesh = new THREE.Mesh(leftHemisphereGeo, brainMat);
    rightHemisphereMesh.position.set(0, 0, -0.58);
    brainGroup.add(rightHemisphereMesh);

    // Cerebellum under occipital lobe
    const cerebellumGeo = new THREE.SphereGeometry(0.75, 24, 18);
    cerebellumGeo.scale(1.1, 0.8, 1.2);
    const cerebellumMesh = new THREE.Mesh(cerebellumGeo, brainMat);
    cerebellumMesh.position.set(0.9, -0.9, 0);
    brainGroup.add(cerebellumMesh);

    // Brainstem descending to spinal cord
    const brainstemGeo = new THREE.CylinderGeometry(0.35, 0.42, 1.7, 16);
    brainstemGeo.rotateZ(0.72);
    const brainstemMesh = new THREE.Mesh(brainstemGeo, brainMat);
    brainstemMesh.position.set(-0.9, -0.7, 0);
    brainGroup.add(brainstemMesh);

    // Hypoglossal Nerve (CN XII) firing pulse from brainstem to tongue base
    const nerveGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(2.5, 2.0, 0), // Brainstem hypoglossal nucleus
      new THREE.Vector3(1.8, 1.9, 0), // Neck path
      new THREE.Vector3(1.4, 2.1, 0), // Tongue base insertion
    ]);
    const nerveMat = new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 3 });
    const nerveLine = new THREE.Line(nerveGeo, nerveMat);
    nerveLine.visible = false;
    bodyGroup.add(nerveLine);

    // Carotid Body Chemoreceptors (Glowing amber sphere at carotid bifurcation)
    const carotidGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const carotidMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.9,
    });
    const carotidMesh = new THREE.Mesh(carotidGeo, carotidMat);
    carotidMesh.position.set(0.9, 1.5, 0.8);
    bodyGroup.add(carotidMesh);

    // --- I. 3D Lungs with Realistic Branching Bronchial Tree (Like reference photo!) ---
    const lungsGroup = new THREE.Group();
    lungsGroup.position.set(-4.5, 1.0, 0);
    bodyGroup.add(lungsGroup);

    const lungTranslucentMat = new THREE.MeshPhysicalMaterial({
      color: 0xec4899,
      transparent: true,
      opacity: 0.38,
      roughness: 0.5,
      transmission: 0.6,
      emissive: 0x9d174d,
      emissiveIntensity: 0.2,
      side: THREE.DoubleSide,
    });

    // Anatomical Left & Right Lung Cones
    const leftLungGeo = new THREE.ConeGeometry(1.6, 4.0, 20);
    leftLungGeo.rotateZ(Math.PI / 2);
    leftLungGeo.scale(1.0, 1.0, 0.85);
    const leftLungMesh = new THREE.Mesh(leftLungGeo, lungTranslucentMat);
    leftLungMesh.position.set(-0.6, 0, 1.4);
    lungsGroup.add(leftLungMesh);

    const rightLungMesh = new THREE.Mesh(leftLungGeo, lungTranslucentMat);
    rightLungMesh.position.set(-0.6, 0, -1.4);
    lungsGroup.add(rightLungMesh);

    // Branching Bronchial Tree inside Lungs (White/cyan glowing branches matching reference!)
    const bronchialGroup = new THREE.Group();
    const bronchMat = new THREE.LineBasicMaterial({ color: 0x7dd3fc, linewidth: 2 });

    const createBranch = (start: THREE.Vector3, dir: THREE.Vector3, len: number, depth: number) => {
      if (depth === 0) return;
      const end = start.clone().add(dir.clone().multiplyScalar(len));
      const branchGeo = new THREE.BufferGeometry().setFromPoints([start, end]);
      bronchialGroup.add(new THREE.Line(branchGeo, bronchMat));

      // Bifurcate
      const d1 = dir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.45).applyAxisAngle(new THREE.Vector3(0, 0, 1), 0.3);
      const d2 = dir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), -0.45).applyAxisAngle(new THREE.Vector3(0, 0, 1), -0.3);
      createBranch(end, d1, len * 0.72, depth - 1);
      createBranch(end, d2, len * 0.72, depth - 1);
    };

    // Left bronchial arbor
    createBranch(new THREE.Vector3(1.0, 0.4, 0), new THREE.Vector3(-0.8, -0.2, 0.6).normalize(), 1.2, 4);
    // Right bronchial arbor
    createBranch(new THREE.Vector3(1.0, 0.4, 0), new THREE.Vector3(-0.8, -0.2, -0.6).normalize(), 1.2, 4);
    lungsGroup.add(bronchialGroup);

    // Anatomical Pulsating Heart between lungs
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

    // --- J. Autonomic / Sympathetic Nerve Wave (Turquoise Sine Wave like Reference Image!) ---
    const wavePoints: THREE.Vector3[] = [];
    for (let w = 0; w < 40; w++) {
      const wx = 3.0 - (w / 40) * 8.5;
      const wy = 2.4 + Math.sin(w * 0.5) * 0.25;
      const wz = 1.6 + Math.cos(w * 0.5) * 0.15;
      wavePoints.push(new THREE.Vector3(wx, wy, wz));
    }
    const waveGeo = new THREE.BufferGeometry().setFromPoints(wavePoints);
    const waveMat = new THREE.LineBasicMaterial({ color: 0x2dd4bf, linewidth: 2.5 });
    const autonomicWave = new THREE.Line(waveGeo, waveMat);
    bodyGroup.add(autonomicWave);

    // Sympathetic ganglia nodes along nerve wave
    const gangliaGroup = new THREE.Group();
    for (let g = 0; g < 6; g++) {
      const gGeo = new THREE.SphereGeometry(0.14, 12, 12);
      const gMat = new THREE.MeshStandardMaterial({ color: 0x2dd4bf, emissive: 0x0d9488, emissiveIntensity: 0.7 });
      const gMesh = new THREE.Mesh(gGeo, gMat);
      const samplePt = wavePoints[g * 6 + 2];
      if (samplePt) {
        gMesh.position.copy(samplePt);
        gangliaGroup.add(gMesh);
      }
    }
    bodyGroup.add(gangliaGroup);

    // --- K. Glowing Airflow Particles along Airway ---
    const particleCount = 90;
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
      size: 0.38,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    bodyGroup.add(particlePoints);

    // --- L. Floating 3D SpO2 Neon Hologram Waveform (Matching Reference Photo!) ---
    const spo2PointsCount = 35;
    const spo2LineGeo = new THREE.BufferGeometry();
    const spo2Positions = new Float32Array(spo2PointsCount * 3);
    for (let i = 0; i < spo2PointsCount; i++) {
      const sx = 4.2 - (i / spo2PointsCount) * 9.0;
      spo2Positions[i * 3] = sx;
      spo2Positions[i * 3 + 1] = 5.2; // Floating above body
      spo2Positions[i * 3 + 2] = 0;
    }
    spo2LineGeo.setAttribute('position', new THREE.BufferAttribute(spo2Positions, 3));
    const spo2LineMat = new THREE.LineBasicMaterial({ color: 0x10b981, linewidth: 3 });
    const spo2Line = new THREE.Line(spo2LineGeo, spo2LineMat);
    bodyGroup.add(spo2Line);

    // --- ANIMATION RENDER LOOP ---
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Camera Lerping to target position
      camera.position.lerp(targetCamPosRef.current, 0.05);
      controls.target.lerp(targetLookAtRef.current, 0.05);
      controls.update();

      const isCollapsed = airwayStatus === 'collapsed';
      const isReopening = airwayStatus === 'reopening';

      // 1. Airway & Tongue Dynamics
      if (isCollapsed) {
        // TONGUE DROPS BACKWARD & DOWNWARD (Gravity + negative suction)
        tongueMesh.position.set(1.65, 1.95, 0); // Displaced into pharyngeal wall!
        tongueMesh.scale.set(1.5, 0.72, 1.15); // Flaccid flattened mass
        (tongueMesh.material as THREE.MeshStandardMaterial).color.setHex(0x9f1239);

        // Soft palate sucked flat against posterior pharyngeal wall
        palateMesh.position.set(2.0, 2.2, 0);
        palateMesh.rotation.z = 1.15;

        // Airway tube completely pinched shut
        collapseClampMesh.visible = true;
        occlusionPointLight.intensity = 2.5 + Math.sin(elapsedTime * 8) * 1.5;
        (airwayTubeMesh.material as THREE.MeshStandardMaterial).color.setHex(0xf43f5e);
        (airwayTubeMesh.material as THREE.MeshStandardMaterial).opacity = 0.35;

        // Paradoxical chest heave: Lungs strain vigorously against closed throat
        const strainBreath = Math.sin(elapsedTime * 4.5) * 0.22;
        lungsGroup.position.y = 1.0 + strainBreath;
      } else if (isReopening) {
        // EXPLOSIVE GASP: GENIOGLOSSUS MUSCLE CONTRACTS FORWARD
        tongueMesh.position.set(1.2, 2.45, 0); // Pulled tight forward toward chin!
        tongueMesh.scale.set(1.3, 0.95, 0.9);
        (tongueMesh.material as THREE.MeshStandardMaterial).color.setHex(0xf43f5e);

        palateMesh.position.set(2.3, 2.85, 0);
        palateMesh.rotation.z = 0.65;

        collapseClampMesh.visible = false;
        occlusionPointLight.intensity = 0;
        (airwayTubeMesh.material as THREE.MeshStandardMaterial).color.setHex(0x38bdf8);
        (airwayTubeMesh.material as THREE.MeshStandardMaterial).opacity = 0.85;

        // Deep recovery breath
        const gaspBreath = 1 + Math.abs(Math.sin(elapsedTime * 3.5)) * 0.22;
        lungsGroup.scale.set(gaspBreath, gaspBreath, gaspBreath);
      } else {
        // NORMAL SUPINE BREATHING
        tongueMesh.position.set(1.4, 2.3, 0);
        tongueMesh.scale.set(1.45, 0.85, 0.85);
        (tongueMesh.material as THREE.MeshStandardMaterial).color.setHex(0xf43f5e);

        palateMesh.position.set(2.3, 2.85, 0);
        palateMesh.rotation.z = 0.65;

        collapseClampMesh.visible = false;
        occlusionPointLight.intensity = 0;
        (airwayTubeMesh.material as THREE.MeshStandardMaterial).color.setHex(0x38bdf8);
        (airwayTubeMesh.material as THREE.MeshStandardMaterial).opacity = 0.75;

        // Gentle respiratory rhythm
        const normalBreath = 1 + Math.sin(elapsedTime * 2.0) * 0.07;
        lungsGroup.scale.set(normalBreath, normalBreath, normalBreath);
      }

      // Snoring vibration flutter in Step 2
      if (airwayStatus === 'narrowed') {
        palateMesh.rotation.z = 0.65 + Math.sin(elapsedTime * 35) * 0.15;
      }

      // 2. Airflow Particle Movement
      const positions = particleGeo.attributes.position.array as Float32Array;
      const speed = airflowPercent > 0 ? (airflowPercent / 100) * 0.014 : 0;

      for (let i = 0; i < particleCount; i++) {
        if (airflowPercent === 0) {
          // Blocked at oropharynx
          particleProgress[i] = (i / particleCount) * 0.36;
          const pt = airwaySpline.getPoint(particleProgress[i]);
          positions[i * 3] = pt.x + Math.sin(elapsedTime * 14 + i) * 0.05;
          positions[i * 3 + 1] = pt.y + Math.cos(elapsedTime * 14 + i) * 0.05;
          positions[i * 3 + 2] = pt.z;
        } else {
          particleProgress[i] += speed;
          if (particleProgress[i] > 1) particleProgress[i] = 0;
          const pt = airwaySpline.getPoint(particleProgress[i]);
          positions[i * 3] = pt.x;
          positions[i * 3 + 1] = pt.y;
          positions[i * 3 + 2] = pt.z;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // 3. Brain Micro-Arousal Glow & Hypoglossal Motor Pulse
      if (isBrainArousal) {
        arousalPointLight.intensity = 4.0 + Math.sin(elapsedTime * 16) * 2.5;
        (leftHemisphereMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0xf59e0b);
        (leftHemisphereMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.95;
        (rightHemisphereMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0xf59e0b);
        (rightHemisphereMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.95;
        nerveLine.visible = true;
        carotidMesh.scale.setScalar(1.6 + Math.sin(elapsedTime * 10) * 0.3);
      } else {
        arousalPointLight.intensity = 0;
        (leftHemisphereMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x6d28d9);
        (leftHemisphereMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.35;
        (rightHemisphereMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x6d28d9);
        (rightHemisphereMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.35;
        nerveLine.visible = false;
        carotidMesh.scale.setScalar(1.0);
      }

      // 4. Heart Rate Tachycardia in Step 5
      const heartPulseSpeed = isSympathetic ? 13 : 3.2;
      const heartScale = 1 + Math.abs(Math.sin(elapsedTime * heartPulseSpeed)) * (isSympathetic ? 0.35 : 0.12);
      heartMesh.scale.set(1.15 * heartScale, 0.9 * heartScale, 0.9 * heartScale);
      if (isSympathetic) {
        (heartMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0xef4444);
        (heartMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.9;
        (autonomicWave.material as THREE.LineBasicMaterial).color.setHex(0xf59e0b);
      } else {
        (heartMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x991b1b);
        (heartMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.45;
        (autonomicWave.material as THREE.LineBasicMaterial).color.setHex(0x2dd4bf);
      }

      // 5. SpO2 Dynamic Waveform Line
      const spo2Arr = spo2LineGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < spo2PointsCount; i++) {
        const tRatio = i / spo2PointsCount;
        let dipY = 5.2;
        if (isCollapsed) {
          if (tRatio > 0.35) dipY = 5.2 - (tRatio - 0.35) * 2.6; // Steep fall to 82%
        } else if (isReopening) {
          if (tRatio > 0.35 && tRatio < 0.8) dipY = 3.8 + (tRatio - 0.35) * 3.0; // Recovery climb
        }
        spo2Arr[i * 3 + 1] = dipY + Math.sin(elapsedTime * 4 + i) * 0.04;
      }
      spo2LineGeo.attributes.position.needsUpdate = true;
      (spo2Line.material as THREE.LineBasicMaterial).color.setHex(spo2Percent < 90 ? 0xef4444 : 0x10b981);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 460;
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

  // Smooth Camera Preset Controller
  const setCameraPreset = (view: 'profile' | 'airway' | 'brain' | 'chest') => {
    setActiveCameraView(view);
    setActivePin(null);

    if (view === 'profile') {
      targetCamPosRef.current.set(0, 7, 14);
      targetLookAtRef.current.set(0, 1.8, 0);
    } else if (view === 'airway') {
      targetCamPosRef.current.set(1.8, 3.8, 6.0);
      targetLookAtRef.current.set(1.8, 2.3, 0);
    } else if (view === 'brain') {
      targetCamPosRef.current.set(3.8, 4.6, 5.5);
      targetLookAtRef.current.set(3.4, 2.7, 0);
    } else if (view === 'chest') {
      targetCamPosRef.current.set(-3.8, 4.2, 7.0);
      targetLookAtRef.current.set(-3.8, 1.2, 0);
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
    <div className="relative w-full h-[440px] sm:h-[500px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Camera View Switcher Bar (Clean, Non-Overlapping Layout) */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 shadow-lg max-w-[85%] sm:max-w-none">
        <span className="text-[10px] text-slate-400 font-bold px-1.5 uppercase flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">Góc Nhìn 3D:</span>
        </span>
        <button
          onClick={() => setCameraPreset('profile')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            activeCameraView === 'profile'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          Nằm ngủ toàn cảnh
        </button>
        <button
          onClick={() => setCameraPreset('airway')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            activeCameraView === 'airway'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          Hầu họng & Lưỡi
        </button>
        <button
          onClick={() => setCameraPreset('brain')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            activeCameraView === 'brain'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          Não & Vi thức giấc
        </button>
        <button
          onClick={() => setCameraPreset('chest')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            activeCameraView === 'chest'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          Phổi & Tim
        </button>
      </div>

      {/* Real-time Physiological Status Badges (Top Right, cleanly positioned below camera switcher on mobile) */}
      <div className="absolute top-16 sm:top-3 right-3 z-10 flex flex-col items-end gap-1.5 pointer-events-none">
        {airwayStatus === 'collapsed' && (
          <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-rose-500/40 border border-rose-500/70 rounded-xl text-rose-200 text-[11px] sm:text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>GỐC LƯỠI TỤT • HẦU HỌNG TẮC 100%</span>
          </div>
        )}
        {airwayStatus === 'reopening' && (
          <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-sky-500/40 border border-sky-500/70 rounded-xl text-sky-200 text-[11px] sm:text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md animate-pulse">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span>CƠ CẰM-LƯỠI CO • BẬT MỞ ĐƯỜNG THỞ</span>
          </div>
        )}
        {isBrainArousal && (
          <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-amber-500/40 border border-amber-500/70 rounded-xl text-amber-200 text-[11px] sm:text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VỎ NÃO VI TỈNH THỨC (AROUSAL)</span>
          </div>
        )}
      </div>

      {/* Floating Organ Labels Overlay (Clickable Anatomical Highlights) */}
      <div className="absolute bottom-11 right-3 z-10 flex flex-col items-end gap-1">
        <button
          onClick={() => {
            setActivePin(activePin === 'tongue' ? null : 'tongue');
            setCameraPreset('airway');
          }}
          className={`px-2 py-1 rounded-md text-[11px] font-medium border backdrop-blur-md transition-all ${
            activePin === 'tongue'
              ? 'bg-rose-500/30 border-rose-400 text-rose-200 shadow-lg'
              : 'bg-slate-900/70 border-slate-700/60 text-slate-300 hover:text-white'
          }`}
        >
          👅 Gốc lưỡi & Cơ cằm-lưỡi
        </button>
        <button
          onClick={() => {
            setActivePin(activePin === 'brain' ? null : 'brain');
            setCameraPreset('brain');
          }}
          className={`px-2 py-1 rounded-md text-[11px] font-medium border backdrop-blur-md transition-all ${
            activePin === 'brain'
              ? 'bg-amber-500/30 border-amber-400 text-amber-200 shadow-lg'
              : 'bg-slate-900/70 border-slate-700/60 text-slate-300 hover:text-white'
          }`}
        >
          🧠 Vỏ não & Thần kinh XII
        </button>
        <button
          onClick={() => {
            setActivePin(activePin === 'lungs' ? null : 'lungs');
            setCameraPreset('chest');
          }}
          className={`px-2 py-1 rounded-md text-[11px] font-medium border backdrop-blur-md transition-all ${
            activePin === 'lungs'
              ? 'bg-sky-500/30 border-sky-400 text-sky-200 shadow-lg'
              : 'bg-slate-900/70 border-slate-700/60 text-slate-300 hover:text-white'
          }`}
        >
          🫁 Cây phế quản & Nhịp tim
        </button>
      </div>

      {/* Touch & Mouse Gesture Hint & Fullscreen Toggle */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-[11px] text-slate-300 shadow-md">
          <RotateCw className="w-3.5 h-3.5 text-sky-400 animate-spin-slow" />
          <span>Kéo chuột để xoay 360° • Cuộn để phóng to</span>
        </div>
        <div className="flex sm:hidden items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-700 text-[10px] text-slate-300 shadow-md">
          <RotateCw className="w-3 h-3 text-sky-400" />
          <span>Dùng 2 ngón tay để xoay 3D (1 ngón để cuộn web)</span>
        </div>
      </div>
    </div>
  );
};
