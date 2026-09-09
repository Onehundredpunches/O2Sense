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
    const height = container.clientHeight || 460;

    // 1. Scene Setup with Medical Deep Slate Atmosphere
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040814);
    scene.fog = new THREE.FogExp2(0x040814, 0.022);

    // 2. Camera Setup (Horizontal Supine Sleep Angle)
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 7, 14);
    cameraRef.current = camera;

    // 3. WebGL Renderer with High-Fidelity Tone Mapping & Local Clipping Enabled!
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.localClippingEnabled = true; // Enables BioDigital Human-style Sagittal Clipping Plane
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxDistance = 28;
    controls.minDistance = 2.5;
    controls.target.set(0, 1.8, 0);
    controlsRef.current = controls;

    // 5. Lighting: Holographic Medical X-Ray Aesthetic
    const ambientLight = new THREE.AmbientLight(0x0c1b33, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    keyLight.position.set(6, 12, 10);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x818cf8, 1.5);
    rimLight.position.set(-10, -5, -8);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x0284c7, 1.2);
    fillLight.position.set(2, 6, -8);
    scene.add(fillLight);

    // Brain Arousal Point Light
    const arousalPointLight = new THREE.PointLight(0xf59e0b, 0, 18);
    arousalPointLight.position.set(3.4, 2.7, 0);
    scene.add(arousalPointLight);

    // Occlusion Warning Point Light
    const occlusionPointLight = new THREE.PointLight(0xef4444, 0, 10);
    occlusionPointLight.position.set(1.6, 2.0, 0);
    scene.add(occlusionPointLight);

    // 6. MAIN BODY GROUP (Supine Sleep Posture)
    const bodyGroup = new THREE.Group();
    scene.add(bodyGroup);

    // --- A. Hospital Bed & Pillow ---
    const pillowGeo = new THREE.BoxGeometry(5.0, 1.1, 5.2);
    const pillowMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.85,
      metalness: 0.05,
    });
    const pillowMesh = new THREE.Mesh(pillowGeo, pillowMat);
    pillowMesh.position.set(3.2, 0.45, 0);
    bodyGroup.add(pillowMesh);

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
    const bodyProfileShape = new THREE.Shape();
    bodyProfileShape.moveTo(-7.5, 0.3);
    bodyProfileShape.lineTo(-3.5, 0.4);
    bodyProfileShape.lineTo(-1.0, 0.6);
    bodyProfileShape.lineTo(1.5, 0.8);
    bodyProfileShape.quadraticCurveTo(3.2, 1.0, 4.8, 1.5);
    bodyProfileShape.quadraticCurveTo(5.4, 2.4, 5.0, 3.4);
    bodyProfileShape.quadraticCurveTo(4.4, 4.3, 3.4, 4.3);
    bodyProfileShape.lineTo(2.7, 4.2);
    bodyProfileShape.lineTo(2.3, 5.0); // Nose tip
    bodyProfileShape.lineTo(2.0, 4.5);
    bodyProfileShape.lineTo(1.9, 4.2);
    bodyProfileShape.lineTo(1.8, 4.15);
    bodyProfileShape.lineTo(1.65, 3.75);
    bodyProfileShape.lineTo(1.55, 3.85);
    bodyProfileShape.lineTo(1.25, 3.25);
    bodyProfileShape.quadraticCurveTo(0.7, 2.5, 0.0, 2.2);
    bodyProfileShape.lineTo(-0.6, 2.1);
    bodyProfileShape.quadraticCurveTo(-1.8, 2.6, -3.5, 2.75);
    bodyProfileShape.quadraticCurveTo(-5.5, 2.6, -7.5, 2.2);
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

    // Holographic Medical Glass Shader with distinct silhouette
    const skinGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.32,
      roughness: 0.25,
      metalness: 0.1,
      transmission: 0.65,
      thickness: 2.0,
      ior: 1.35,
      side: THREE.DoubleSide,
    });
    const bodySkinMesh = new THREE.Mesh(bodySkinGeo, skinGlassMat);
    bodyGroup.add(bodySkinMesh);

    // --- C. Anatomical Upper Airway Lumen Spline ---
    const airwaySpline = new THREE.CatmullRomCurve3([
      new THREE.Vector3(2.1, 4.5, 0),
      new THREE.Vector3(2.5, 3.9, 0),
      new THREE.Vector3(2.8, 3.1, 0),
      new THREE.Vector3(2.1, 2.3, 0),
      new THREE.Vector3(1.4, 1.8, 0),
      new THREE.Vector3(0.4, 1.6, 0),
      new THREE.Vector3(-1.2, 1.5, 0),
      new THREE.Vector3(-3.2, 1.4, 0),
    ]);

    const airwayTubeGeo = new THREE.TubeGeometry(airwaySpline, 60, 0.42, 18, false);
    const airwayTubeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
      roughness: 0.15,
      emissive: 0x0284c7,
      emissiveIntensity: 0.5,
      side: THREE.DoubleSide,
    });
    const airwayTubeMesh = new THREE.Mesh(airwayTubeGeo, airwayTubeMat);
    bodyGroup.add(airwayTubeMesh);

    // --- D. Trachea Cartilage Rings ---
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

    // --- E. Anatomical Tongue & Genioglossus Muscle ---
    const tongueGeo = new THREE.SphereGeometry(0.85, 24, 20);
    tongueGeo.scale(1.4, 0.85, 0.85);
    const tongueMat = new THREE.MeshStandardMaterial({
      color: 0xe11d48,
      transparent: true,
      opacity: 0.88,
      roughness: 0.35,
      metalness: 0.1,
      emissive: 0x9f1239,
      emissiveIntensity: 0.4,
    });
    const tongueMesh = new THREE.Mesh(tongueGeo, tongueMat);
    tongueMesh.position.set(1.45, 2.6, 0);
    bodyGroup.add(tongueMesh);

    // --- F. Soft Palate & Uvula ---
    const palateGeo = new THREE.CylinderGeometry(0.16, 0.28, 1.3, 16);
    palateGeo.rotateZ(Math.PI / 3.8);
    const palateMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.88,
      roughness: 0.35,
      emissive: 0xbe123c,
      emissiveIntensity: 0.4,
    });
    const palateMesh = new THREE.Mesh(palateGeo, palateMat);
    palateMesh.position.set(2.2, 2.75, 0);
    bodyGroup.add(palateMesh);

    clippableMaterialsRef.current = [skinGlassMat, tongueMat, palateMat];

    // --- G. Cervical Spine C1-C6 ---
    const spineGroup = new THREE.Group();
    const vertMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6, metalness: 0.2 });
    const discMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 0.6 });

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

    // --- H. Anatomical Brain ---
    const brainGroup = new THREE.Group();
    const brainGyriTexture = createBrainGyriTexture();
    const brainMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      map: brainGyriTexture,
      transparent: true,
      opacity: 0.55,
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

    clippableMaterialsRef.current = [skinGlassMat, tongueMat, palateMat, brainMat];

    // Brainstem & ARAS reticular core
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

    // --- I. Anatomical Lungs & Bronchial Tree ---
    const lungsGroup = new THREE.Group();
    const lungTranslucentMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.35,
      transmission: 0.5,
      roughness: 0.3,
      emissive: 0x0369a1,
      emissiveIntensity: 0.2,
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

    // Pulsating Heart between lungs
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

    // --- J. Airflow Particles ---
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

    // --- ANIMATION LOOP ---
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Camera lerp
      camera.position.lerp(targetCamPosRef.current, 0.05);
      controls.target.lerp(targetLookAtRef.current, 0.05);
      controls.update();

      const isCollapsed = airwayStatus === 'collapsed';
      const isNarrowed = airwayStatus === 'narrowed';
      const isReopening = airwayStatus === 'reopening';

      // 1. Airway & Tongue Dynamics
      if (isCollapsed) {
        tongueMesh.position.set(1.65, 1.95, 0);
        tongueMesh.scale.set(1.5, 0.72, 1.15);
        (tongueMesh.material as THREE.MeshStandardMaterial).color.setHex(0x9f1239);
        (tongueMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x881337);

        palateMesh.position.set(1.95, 2.1, 0);
        palateMesh.rotation.z = Math.PI / 2.8;

        occlusionPointLight.intensity = 3.5 + Math.sin(elapsedTime * 6) * 1.5;
        (airwayTubeMesh.material as THREE.MeshStandardMaterial).color.setHex(0xef4444);
        (airwayTubeMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0xb91c1c);

        // PARADOXICAL BREATHING STRAIN: Chest pulls inward with desperate effort
        const chestRetraction = Math.sin(elapsedTime * 4.5) * 0.12;
        leftLungMesh.position.y = chestRetraction;
        rightLungMesh.position.y = chestRetraction;
      } else if (isNarrowed) {
        // Snoring vibration flutter in 3D
        const uvula3DFlutter = Math.sin(elapsedTime * 32) * 0.08;
        palateMesh.position.set(2.1 + uvula3DFlutter, 2.6, 0);

        tongueMesh.position.set(1.55, 2.3, 0);
        tongueMesh.scale.set(1.48, 0.8, 0.95);
        (tongueMesh.material as THREE.MeshStandardMaterial).color.setHex(0xe11d48);
        (tongueMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x9f1239);

        occlusionPointLight.intensity = 1.0;
        (airwayTubeMesh.material as THREE.MeshStandardMaterial).color.setHex(0xf59e0b);
        (airwayTubeMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0xd97706);
      } else if (isReopening) {
        tongueMesh.position.set(1.3, 2.8, 0);
        tongueMesh.scale.set(1.38, 0.92, 0.8);
        (tongueMesh.material as THREE.MeshStandardMaterial).color.setHex(0x38bdf8);
        (tongueMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x0284c7);

        palateMesh.position.set(2.25, 2.85, 0);
        palateMesh.rotation.z = Math.PI / 4.2;

        occlusionPointLight.intensity = 0;
        (airwayTubeMesh.material as THREE.MeshStandardMaterial).color.setHex(0x34d399);
        (airwayTubeMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x059669);
      } else {
        tongueMesh.position.set(1.45, 2.6, 0);
        tongueMesh.scale.set(1.45, 0.85, 0.85);
        (tongueMesh.material as THREE.MeshStandardMaterial).color.setHex(0xe11d48);
        (tongueMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x9f1239);

        palateMesh.position.set(2.2, 2.75, 0);
        palateMesh.rotation.z = Math.PI / 3.8;

        occlusionPointLight.intensity = 0;
        (airwayTubeMesh.material as THREE.MeshStandardMaterial).color.setHex(0x38bdf8);
        (airwayTubeMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x0284c7);
      }

      // 2. Brain Arousal Lightning in 3D
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

      // 3. Heart rhythm
      const heartSpeed = isSympathetic ? 12 : 3.5;
      const heartPulse = 1.0 + Math.sin(elapsedTime * heartSpeed) * (isSympathetic ? 0.22 : 0.08);
      heartMesh.scale.set(1.15 * heartPulse, 0.9 * heartPulse, 0.9 * heartPulse);

      // 4. Moving Airflow Particles in 3D
      const positions = particleGeo.attributes.position.array as Float32Array;
      const speedMultiplier = isCollapsed ? 0.0 : (airflowPercent / 100) * 0.012;

      for (let i = 0; i < particleCount; i++) {
        if (!isCollapsed) {
          particleProgress[i] = (particleProgress[i] + speedMultiplier) % 1.0;
        }
        const pt = airwaySpline.getPoint(particleProgress[i]);
        positions[i * 3] = pt.x;
        positions[i * 3 + 1] = pt.y;
        positions[i * 3 + 2] = pt.z;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Render
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

  // Update Sagittal Clipping Plane dynamically
  useEffect(() => {
    const sagittalPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0.05);
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
      targetCamPosRef.current.set(0, 6.5, 14);
      targetLookAtRef.current.set(0, 1.8, 0);
    } else if (view === 'airway') {
      targetCamPosRef.current.set(1.5, 4.2, 9.0);
      targetLookAtRef.current.set(1.4, 2.2, 0);
    } else if (view === 'endoscopy') {
      targetCamPosRef.current.set(3.2, 5.2, 5.0);
      targetLookAtRef.current.set(1.5, 2.0, 0);
    } else if (view === 'brain') {
      targetCamPosRef.current.set(4.0, 5.0, 7.5);
      targetLookAtRef.current.set(3.4, 2.7, 0);
    } else if (view === 'chest') {
      targetCamPosRef.current.set(-3.5, 5.0, 9.5);
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
    <div className="relative w-full h-[440px] sm:h-[500px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl select-none">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating Control Bar: Presets & Sagittal Clip Toggle */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Camera Presets */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 shadow-lg pointer-events-auto">
          <span className="text-[10px] text-slate-400 font-bold px-1 uppercase flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Góc 3D:</span>
          </span>
          <button
            onClick={() => setCameraPreset('profile')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeCameraView === 'profile'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Bao quát
          </button>
          <button
            onClick={() => setCameraPreset('airway')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeCameraView === 'airway'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Hầu họng & Lưỡi
          </button>
          <button
            onClick={() => setCameraPreset('endoscopy')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              activeCameraView === 'endoscopy'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Góc nhìn nội soi tai mũi họng từ trên nhìn xuống"
          >
            <Video className="w-3 h-3 text-sky-400" />
            <span>Nội soi họng</span>
          </button>
          <button
            onClick={() => setCameraPreset('brain')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeCameraView === 'brain'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Não bộ
          </button>
          <button
            onClick={() => setCameraPreset('chest')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeCameraView === 'chest'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Phổi & Tim
          </button>
        </div>

        {/* Right: Sagittal Clipping Plane Toggle (BioDigital Human Style!) */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setIsSagittalClipped(!isSagittalClipped)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-lg backdrop-blur-md ${
              isSagittalClipped
                ? 'bg-teal-500/30 border-teal-400 text-teal-200'
                : 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Cắt đôi khuôn mặt theo mặt phẳng đứng dọc để nhìn vào lòng họng"
          >
            <Scissors className="w-3.5 h-3.5 text-teal-400" />
            <span>{isSagittalClipped ? 'Bỏ cắt mặt phẳng' : 'Mặt cắt dọc 3D (Sagittal)'}</span>
          </button>
        </div>
      </div>

      {/* Real-time 3D Airway Caliber Gauge (Top Left below camera bar) */}
      <div className="absolute top-14 left-3 z-10 pointer-events-auto">
        <div className="bg-slate-900/90 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-slate-700/80 shadow-2xl flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-teal-400 flex-shrink-0 border border-slate-700">
            <Gauge className="w-4 h-4" />
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

      {/* Floating Organ Labels Overlay (Clickable 3D Highlights) */}
      <div className="absolute bottom-11 sm:bottom-3 right-3 z-10 flex flex-col sm:flex-row items-end sm:items-center gap-1 pointer-events-auto">
        <button
          onClick={() => {
            setActivePin(activePin === 'tongue' ? null : 'tongue');
            setCameraPreset('airway');
          }}
          className={`px-2 py-1 rounded-lg text-[11px] font-medium border backdrop-blur-md transition-all ${
            activePin === 'tongue'
              ? 'bg-rose-500/30 border-rose-400 text-rose-200 shadow-lg'
              : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:text-white'
          }`}
        >
          👅 Gốc lưỡi & Cơ cằm-lưỡi
        </button>
        <button
          onClick={() => {
            setActivePin(activePin === 'brain' ? null : 'brain');
            setCameraPreset('brain');
          }}
          className={`px-2 py-1 rounded-lg text-[11px] font-medium border backdrop-blur-md transition-all ${
            activePin === 'brain'
              ? 'bg-amber-500/30 border-amber-400 text-amber-200 shadow-lg'
              : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:text-white'
          }`}
        >
          🧠 Não & Thần kinh XII
        </button>
        <button
          onClick={() => {
            setActivePin(activePin === 'lungs' ? null : 'lungs');
            setCameraPreset('chest');
          }}
          className={`px-2 py-1 rounded-lg text-[11px] font-medium border backdrop-blur-md transition-all ${
            activePin === 'lungs'
              ? 'bg-sky-500/30 border-sky-400 text-sky-200 shadow-lg'
              : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:text-white'
          }`}
        >
          🫁 Phổi & Nhịp tim
        </button>
      </div>

      {/* Touch & Mouse Gesture Hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none hidden md:flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-700/60 text-[10px] text-slate-400 shadow-md">
        <RotateCw className="w-3 h-3 text-teal-400 animate-spin-slow" />
        <span>Kéo chuột để xoay 360° • Cuộn để phóng to/thu nhỏ</span>
      </div>
    </div>
  );
};

export default AnatomyScene3D;
