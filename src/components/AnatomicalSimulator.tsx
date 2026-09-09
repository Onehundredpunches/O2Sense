import React, { useEffect, useRef, useState } from 'react';
import { 
  Sparkles, 
  Info, 
  Layers,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface AnatomicalSimulatorProps {
  step: number; // 1 to 5
  airwayStatus: 'open' | 'narrowed' | 'collapsed' | 'reopening';
  airflowPercent: number;
  spo2Percent: number;
  isBrainArousal: boolean;
  isSympathetic: boolean;
}

interface AnatomicalLabel {
  id: string;
  name: string;
  role: string;
  x: number;
  y: number;
}

export const AnatomicalSimulator: React.FC<AnatomicalSimulatorProps> = ({
  step,
  airwayStatus,
  airflowPercent,
  spo2Percent,
  isBrainArousal,
  isSympathetic,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<AnatomicalLabel | null>(null);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Anatomical landmark hotspots (coordinates normalized 0-1 relative to canvas)
  const labels: AnatomicalLabel[] = [
    {
      id: 'nose',
      name: 'Khoang mũi (Nasal Cavity)',
      role: 'Đường dẫn khí chính khi ngủ, làm ấm và ẩm không khí trước khi vào phổi.',
      x: 0.36,
      y: 0.28,
    },
    {
      id: 'palate',
      name: 'Khẩu cái mềm & Lưỡi gà (Soft Palate & Uvula)',
      role: 'Mô mềm rung gây ra tiếng ngáy, dễ bị áp lực âm hút sập áp sát vào thành họng sau.',
      x: 0.44,
      y: 0.38,
    },
    {
      id: 'tongue',
      name: 'Cơ cằm-lưỡi (Genioglossus Muscle)',
      role: 'Cơ then chốt mở đường thở. Khi ngủ say mất trương lực sẽ thụt lùi gây tắc họng.',
      x: 0.48,
      y: 0.46,
    },
    {
      id: 'obstruction',
      name: 'Điểm tắc nghẽn hầu họng (Pharyngeal Collapse Zone)',
      role: 'Vị trí đường kính lòng họng bị ép bẹp dí về 0mm trong cơn ngưng thở OSA.',
      x: 0.43,
      y: 0.50,
    },
    {
      id: 'trachea',
      name: 'Khí quản & Vòng sụn (Trachea)',
      role: 'Ống dẫn khí có các vòng sụn hình chữ C giữ cho khí quản không bị xẹp.',
      x: 0.45,
      y: 0.68,
    },
    {
      id: 'brain',
      name: 'Vỏ não & Hệ lưới ARAS (Cerebral Cortex & ARAS)',
      role: 'Nơi tiếp nhận tín hiệu báo động thiếu O2/ứ CO2 và kích hoạt vi tỉnh thức (Micro-arousal).',
      x: 0.62,
      y: 0.25,
    },
    {
      id: 'chemoreceptor',
      name: 'Thụ thể hóa học xoang cảnh (Carotid Body)',
      role: 'Cảm biến phân áp oxy và CO2 trong máu động mạch cảnh, phát xung báo động lên não.',
      x: 0.52,
      y: 0.58,
    },
    {
      id: 'lungs',
      name: 'Phổi & Cây phế quản (Lungs & Bronchi)',
      role: 'Nơi diễn ra trao đổi oxy và CO2 ở phế nang; gồng nỗ lực co bóp tạo áp lực âm khi tắc.',
      x: 0.35,
      y: 0.85,
    },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let startTime = performance.now();

    // High DPI Support
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Airflow particles
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, (_, i) => ({
      t: i / particleCount,
      speed: 0.008,
      offset: (Math.random() - 0.5) * 8,
      size: Math.random() * 2 + 2,
    }));

    // Rendering Loop
    const render = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(render);
      const elapsed = (currentTime - startTime) / 1000;

      ctx.clearRect(0, 0, width, height);

      // Save context for camera zoom & center
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(zoomLevel, zoomLevel);
      ctx.translate(-width / 2, -height / 2);

      // 1. BACKGROUND MEDICAL ENVIRONMENT (Hospital Bed / Pillow / Gradient)
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#0a1124');
      bgGrad.addColorStop(0.5, '#050b18');
      bgGrad.addColorStop(1, '#02060f');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Pillow beneath head
      ctx.beginPath();
      ctx.ellipse(width * 0.68, height * 0.48, width * 0.28, height * 0.22, -0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Blanket / Bed line
      ctx.beginPath();
      ctx.moveTo(width * 0.1, height * 0.82);
      ctx.bezierCurveTo(width * 0.35, height * 0.78, width * 0.6, height * 0.85, width * 0.95, height * 0.88);
      ctx.lineTo(width * 0.95, height);
      ctx.lineTo(width * 0.1, height);
      ctx.closePath();
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.stroke();

      // 2. SUPINE HUMAN SILHOUETTE (Supine Sleeping Profile: Nose pointing up/left)
      // Head center around (width * 0.52, height * 0.38)
      ctx.save();

      // Translucent Head Outer Contour
      ctx.beginPath();
      // Start from chest / clavicle
      ctx.moveTo(width * 0.22, height * 0.82);
      // Neck anterior
      ctx.lineTo(width * 0.38, height * 0.62);
      // Chin
      ctx.quadraticCurveTo(width * 0.34, height * 0.52, width * 0.36, height * 0.46);
      // Lower lip
      ctx.lineTo(width * 0.34, height * 0.41);
      // Upper lip & Philtrum
      ctx.quadraticCurveTo(width * 0.33, height * 0.36, width * 0.34, height * 0.33);
      // Nose tip pointing upward
      ctx.lineTo(width * 0.31, height * 0.27);
      // Nose bridge
      ctx.lineTo(width * 0.37, height * 0.23);
      // Forehead
      ctx.quadraticCurveTo(width * 0.42, height * 0.15, width * 0.55, height * 0.14);
      // Cranium / Top of head
      ctx.bezierCurveTo(width * 0.75, height * 0.13, width * 0.85, height * 0.28, width * 0.82, height * 0.48);
      // Occiput & Back of neck on pillow
      ctx.bezierCurveTo(width * 0.80, height * 0.62, width * 0.68, height * 0.68, width * 0.58, height * 0.75);
      // Back / Upper thorax
      ctx.lineTo(width * 0.52, height * 0.88);
      ctx.closePath();

      // Soft human skin tone with translucent holographic shading
      const skinGrad = ctx.createLinearGradient(width * 0.3, height * 0.2, width * 0.7, height * 0.7);
      skinGrad.addColorStop(0, 'rgba(30, 41, 59, 0.75)');
      skinGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.85)');
      skinGrad.addColorStop(1, 'rgba(10, 15, 30, 0.92)');
      ctx.fillStyle = skinGrad;
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.6;
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      // Closed sleeping eye with peaceful eyelid
      ctx.beginPath();
      ctx.arc(width * 0.43, height * 0.26, 6, 0.2 * Math.PI, 0.8 * Math.PI, false);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Ear silhouette
      ctx.beginPath();
      ctx.ellipse(width * 0.58, height * 0.40, 12, 18, 0.3, 0, Math.PI * 2);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();

      // 3. ANATOMICAL SAGITTAL CROSS-SECTION (Nasal, Palate, Tongue, Pharynx, Trachea)

      // A. Bony landmarks: Cervical spine vertebrae (C1-C6) at posterior neck
      for (let i = 0; i < 5; i++) {
        const vy = height * 0.48 + i * 18;
        const vx = width * 0.52 + i * 2;
        ctx.fillStyle = '#334155';
        ctx.fillRect(vx, vy, 22, 12);
        ctx.strokeStyle = '#64748b';
        ctx.strokeRect(vx, vy, 22, 12);
      }

      // B. Nasal Cavity & Turbinates
      ctx.beginPath();
      ctx.moveTo(width * 0.33, height * 0.28); // Nostril
      ctx.bezierCurveTo(width * 0.36, height * 0.25, width * 0.44, height * 0.26, width * 0.46, height * 0.32);
      ctx.lineTo(width * 0.42, height * 0.35); // Hard palate floor
      ctx.lineTo(width * 0.35, height * 0.34);
      ctx.closePath();
      ctx.fillStyle = 'rgba(244, 63, 94, 0.25)';
      ctx.fill();
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Hard Palate (Bone)
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(width * 0.36, height * 0.34, width * 0.08, 4);

      // C. TONGUE & GENIOGLOSSUS MUSCLE (Dynamic Deformation!)
      // In OSA collapse: tongue base sags backward towards posterior wall
      const isCollapsed = airwayStatus === 'collapsed';
      const isReopening = airwayStatus === 'reopening';

      // Tongue displacement:
      // Normal: tongueBaseX ≈ 0.45
      // Collapsed: tongueBaseX ≈ 0.485 (pressed tightly against posterior wall at 0.49!)
      // Reopening: tongueBaseX ≈ 0.42 (snapped forward toward jaw)
      let tongueBackX = width * 0.455;
      let palateBackX = width * 0.46;

      if (isCollapsed) {
        // Sagged backward and pressed firmly against pharyngeal wall!
        tongueBackX = width * 0.488;
        palateBackX = width * 0.486;
      } else if (isReopening) {
        // Contracted forward
        tongueBackX = width * 0.425;
        palateBackX = width * 0.435;
      }

      // Soft Palate & Uvula
      ctx.beginPath();
      ctx.moveTo(width * 0.44, height * 0.35);
      ctx.quadraticCurveTo(palateBackX, height * 0.38, palateBackX - 3, height * 0.43); // Uvula tip
      ctx.quadraticCurveTo(palateBackX - 8, height * 0.39, width * 0.43, height * 0.36);
      ctx.closePath();
      ctx.fillStyle = isCollapsed ? '#dc2626' : '#f43f5e';
      ctx.fill();
      ctx.strokeStyle = '#fda4af';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Tongue Muscle Body
      ctx.beginPath();
      // Attached to inside of mandible (chin)
      ctx.moveTo(width * 0.39, height * 0.49);
      // Dorsum of tongue (curves up toward palate)
      ctx.bezierCurveTo(width * 0.40, height * 0.41, width * 0.43, height * 0.41, tongueBackX, height * 0.46);
      // Tongue base (curves down toward epiglottis)
      ctx.quadraticCurveTo(tongueBackX + (isCollapsed ? 4 : -4), height * 0.52, width * 0.44, height * 0.56);
      // Hyoid bone attachment
      ctx.lineTo(width * 0.42, height * 0.55);
      ctx.quadraticCurveTo(width * 0.40, height * 0.53, width * 0.39, height * 0.49);
      ctx.closePath();

      // Tongue muscle texture gradient
      const tongueGrad = ctx.createRadialGradient(width * 0.42, height * 0.47, 5, width * 0.43, height * 0.47, 45);
      tongueGrad.addColorStop(0, '#fb7185');
      tongueGrad.addColorStop(0.7, '#e11d48');
      tongueGrad.addColorStop(1, '#9f1239');
      ctx.fillStyle = tongueGrad;
      ctx.fill();
      ctx.strokeStyle = '#fecdd3';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Muscle fibers lines (Genioglossus striations radiating from mandible)
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(width * 0.39, height * 0.49);
        const targetX = width * 0.41 + i * (tongueBackX - width * 0.41) / 5;
        const targetY = height * 0.42 + i * 2.5;
        ctx.lineTo(targetX, targetY);
        ctx.stroke();
      }
      ctx.restore();

      // Epiglottis
      ctx.beginPath();
      ctx.moveTo(width * 0.43, height * 0.56);
      ctx.quadraticCurveTo(width * 0.45, height * 0.54, width * 0.46, height * 0.58);
      ctx.lineTo(width * 0.44, height * 0.60);
      ctx.closePath();
      ctx.fillStyle = '#f43f5e';
      ctx.fill();

      // D. Posterior Pharyngeal Wall (Fixed back wall of airway)
      const pharynxWallX = width * 0.49;
      ctx.beginPath();
      ctx.moveTo(width * 0.46, height * 0.30);
      ctx.bezierCurveTo(pharynxWallX, height * 0.36, pharynxWallX, height * 0.55, width * 0.48, height * 0.64);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Trachea with Cartilage Rings
      const tracheaX = width * 0.44;
      const tracheaY = height * 0.62;
      for (let r = 0; r < 7; r++) {
        const ry = tracheaY + r * 12;
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(tracheaX - 8, ry, 20, 6);
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1;
        ctx.strokeRect(tracheaX - 8, ry, 20, 6);
      }

      // E. AIRWAY LUMEN & FLOW PATH
      // If NOT collapsed: draw glowing cyan airway path
      if (!isCollapsed) {
        ctx.save();
        ctx.beginPath();
        // Airway channel center line
        ctx.moveTo(width * 0.33, height * 0.28); // Nostril
        ctx.quadraticCurveTo(width * 0.42, height * 0.27, width * 0.45, height * 0.34); // Choana
        ctx.quadraticCurveTo(width * 0.47, height * 0.42, width * 0.46, height * 0.50); // Pharynx
        ctx.quadraticCurveTo(width * 0.45, height * 0.58, width * 0.44, height * 0.72); // Trachea
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = isReopening ? 16 : 10;
        ctx.stroke();
        ctx.restore();
      }

      // 4. AIRFLOW PARTICLES & GLOWING FLOW ARROWS
      if (airflowPercent > 0) {
        // Continuous moving flow
        particles.forEach((p) => {
          p.t += (airflowPercent / 100) * 0.012;
          if (p.t > 1) p.t = 0;

          // Interpolate position along airway curve
          let px = 0, py = 0;
          if (p.t < 0.25) {
            // Nostril to choana
            const subT = p.t / 0.25;
            px = width * 0.33 + subT * (width * 0.45 - width * 0.33);
            py = height * 0.28 + subT * (height * 0.34 - height * 0.28);
          } else if (p.t < 0.65) {
            // Pharynx past tongue
            const subT = (p.t - 0.25) / 0.4;
            px = width * 0.45 + subT * (width * 0.46 - width * 0.45) + p.offset;
            py = height * 0.34 + subT * (height * 0.55 - height * 0.34);
          } else {
            // Trachea to lungs
            const subT = (p.t - 0.65) / 0.35;
            px = width * 0.46 + subT * (width * 0.44 - width * 0.46);
            py = height * 0.55 + subT * (height * 0.76 - height * 0.55);
          }

          ctx.beginPath();
          ctx.arc(px, py, p.size * (isReopening ? 1.5 : 1), 0, Math.PI * 2);
          ctx.fillStyle = isReopening ? '#ffffff' : '#38bdf8';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // Directional arrows
        ctx.save();
        ctx.strokeStyle = '#38bdf8';
        ctx.fillStyle = '#38bdf8';
        ctx.lineWidth = 2.5;

        // Arrow entering nostril
        ctx.beginPath();
        ctx.moveTo(width * 0.28, height * 0.24);
        ctx.lineTo(width * 0.33, height * 0.28);
        ctx.stroke();

        // Arrow in pharynx
        ctx.beginPath();
        ctx.moveTo(width * 0.455, height * 0.41);
        ctx.lineTo(width * 0.458, height * 0.47);
        ctx.stroke();
        ctx.restore();
      } else {
        // COLLAPSED: Particles gather outside nose, unable to enter!
        ctx.save();
        ctx.fillStyle = '#f43f5e';
        for (let i = 0; i < 15; i++) {
          const jitterX = Math.sin(elapsed * 12 + i) * 8;
          const jitterY = Math.cos(elapsed * 12 + i) * 6;
          ctx.beginPath();
          ctx.arc(width * 0.32 + jitterX, height * 0.27 + jitterY, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // RED OBSTRUCTION COLLAPSE FORCE ARROWS (Pointing backward into wall)
        ctx.strokeStyle = '#f43f5e';
        ctx.fillStyle = '#f43f5e';
        ctx.lineWidth = 3;
        // Force arrow on soft palate
        ctx.beginPath();
        ctx.moveTo(width * 0.44, height * 0.39);
        ctx.lineTo(width * 0.48, height * 0.40);
        ctx.stroke();
        // Force arrow on tongue base
        ctx.beginPath();
        ctx.moveTo(width * 0.43, height * 0.50);
        ctx.lineTo(width * 0.485, height * 0.51);
        ctx.stroke();

        // Warning Label at occlusion
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText('ĐƯỜNG THỞ BẸP DÍ (0mm)', width * 0.495, height * 0.50);
        ctx.restore();
      }

      // 5. BRAIN CORTEX & NEURAL AROUSAL SPARKS (Upper cranium)
      ctx.save();
      const brainX = width * 0.62;
      const brainY = height * 0.25;

      // Brain parenchyma shape
      ctx.beginPath();
      ctx.ellipse(brainX, brainY, 38, 28, -0.15, 0, Math.PI * 2);
      ctx.fillStyle = isBrainArousal ? 'rgba(245, 158, 11, 0.45)' : 'rgba(139, 92, 246, 0.25)';
      ctx.fill();
      ctx.strokeStyle = isBrainArousal ? '#fbbf24' : '#8b5cf6';
      ctx.lineWidth = isBrainArousal ? 2.5 : 1.5;
      ctx.stroke();

      // Brainstem / Medulla extending downward
      ctx.beginPath();
      ctx.moveTo(brainX - 10, brainY + 22);
      ctx.quadraticCurveTo(brainX - 8, brainY + 45, width * 0.52, height * 0.52);
      ctx.strokeStyle = isBrainArousal ? '#fbbf24' : '#7c3aed';
      ctx.lineWidth = 3;
      ctx.stroke();

      // AROUSAL BURST: Golden electrical lightning / brainwave flash!
      if (isBrainArousal) {
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 15;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;

        // Radiating EEG lightning ripples
        for (let a = 0; a < 6; a++) {
          const angle = a * (Math.PI / 3) + elapsed * 3;
          const r1 = 30 + Math.sin(elapsed * 10 + a) * 8;
          const r2 = 48 + Math.cos(elapsed * 10 + a) * 10;
          ctx.beginPath();
          ctx.moveTo(brainX + Math.cos(angle) * r1, brainY + Math.sin(angle) * r1);
          ctx.lineTo(brainX + Math.cos(angle) * r2, brainY + Math.sin(angle) * r2);
          ctx.stroke();
        }

        // Pulse down Hypoglossal nerve XII to Tongue!
        ctx.beginPath();
        ctx.moveTo(brainX - 8, brainY + 35);
        ctx.quadraticCurveTo(width * 0.48, height * 0.48, width * 0.42, height * 0.48);
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.shadowBlur = 0;
      }
      ctx.restore();

      // 6. CAROTID CHEMORECEPTORS (Bifurcation of carotid artery)
      const carotidX = width * 0.52;
      const carotidY = height * 0.58;
      ctx.save();
      ctx.beginPath();
      ctx.arc(carotidX, carotidY, isCollapsed ? 6 + Math.sin(elapsed * 8) * 2 : 4, 0, Math.PI * 2);
      ctx.fillStyle = isCollapsed ? '#ef4444' : '#f59e0b';
      ctx.shadowColor = isCollapsed ? '#ef4444' : '#f59e0b';
      ctx.shadowBlur = isCollapsed ? 12 : 4;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();

      // 7. LUNGS & DIAPHRAGM IN CHEST
      const lungsY = height * 0.82;
      const lungBreath = isCollapsed
        ? Math.sin(elapsed * 4) * 6 // Violent paradoxical strain
        : Math.sin(elapsed * 2) * 4; // Normal rhythm

      ctx.save();
      // Left and Right Lungs
      ctx.beginPath();
      ctx.ellipse(width * 0.35, lungsY + lungBreath, 35, 45, -0.2, 0, Math.PI * 2);
      ctx.ellipse(width * 0.48, lungsY + lungBreath, 32, 42, 0.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(236, 72, 153, 0.22)';
      ctx.fill();
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Bronchial tree lines
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(tracheaX, tracheaY + 45);
      ctx.lineTo(width * 0.36, lungsY - 10);
      ctx.moveTo(tracheaX, tracheaY + 45);
      ctx.lineTo(width * 0.46, lungsY - 10);
      ctx.stroke();

      // Heart
      const heartBeat = isSympathetic
        ? 1 + Math.sin(elapsed * 12) * 0.2 // Tachycardia
        : 1 + Math.sin(elapsed * 3) * 0.08;
      ctx.beginPath();
      ctx.arc(width * 0.42, lungsY, 14 * heartBeat, 0, Math.PI * 2);
      ctx.fillStyle = isSympathetic ? '#dc2626' : '#991b1b';
      ctx.fill();
      ctx.strokeStyle = '#ef4444';
      ctx.stroke();
      ctx.restore();

      // Airway simulation rendering complete without overlapping canvas text
      ctx.restore(); // Restore zoom / center
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [step, airwayStatus, airflowPercent, spo2Percent, isBrainArousal, isSympathetic, zoomLevel]);

  return (
    <div className="relative w-full h-[400px] sm:h-[480px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between">
      {/* Simulation Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair select-none"
      />

      {/* Top Floating Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        {/* Left: Zoom & Label Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 pointer-events-auto shadow-lg">
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              showLabels ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showLabels ? 'Ẩn nhãn giải phẫu' : 'Hiện nhãn giải phẫu'}</span>
          </button>

          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.6))}
            className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
            title="Phóng to"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.85))}
            className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
            title="Thu nhỏ"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Real-time Status Badge */}
        <div className="pointer-events-auto">
          {airwayStatus === 'collapsed' && (
            <div className="px-3 py-1.5 bg-rose-500/30 border border-rose-500/60 rounded-xl text-rose-300 text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span>GỐC LƯỠI TỤT • HẦU HỌNG SẬP 100%</span>
            </div>
          )}
          {airwayStatus === 'reopening' && (
            <div className="px-3 py-1.5 bg-sky-500/30 border border-sky-500/60 rounded-xl text-sky-300 text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span>CƠ CẰM-LƯỠI CO • BẬT MỞ ĐƯỜNG THỞ (GASP)</span>
            </div>
          )}
          {isBrainArousal && (
            <div className="px-3 py-1.5 bg-amber-500/30 border border-amber-500/60 rounded-xl text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>VI TỈNH GIẤC (EEG MICRO-AROUSAL)</span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Anatomical Landmark Hotspots (when showLabels is on) */}
      {showLabels && (
        <div className="absolute inset-0 pointer-events-none">
          {labels.map((lbl) => (
            <div
              key={lbl.id}
              style={{ left: `${lbl.x * 100}%`, top: `${lbl.y * 100}%` }}
              onClick={() => setSelectedLabel(lbl)}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
            >
              <div className="w-4 h-4 rounded-full bg-sky-500/40 border-2 border-sky-400 flex items-center justify-center group-hover:scale-125 transition-transform shadow-md shadow-sky-500/50">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
              <span className="hidden sm:block absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-200 text-[10px] font-medium border border-slate-700/80 shadow-lg pointer-events-none group-hover:block">
                {lbl.name.split('(')[0]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Selected Landmark Info Card (when clicked) */}
      {selectedLabel && (
        <div className="absolute bottom-3 left-3 right-3 z-20 bg-slate-900/95 backdrop-blur-md p-3.5 rounded-xl border border-sky-500/50 shadow-2xl flex items-start justify-between gap-3 animate-fadeIn">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>{selectedLabel.name}</span>
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              {selectedLabel.role}
            </p>
          </div>
          <button
            onClick={() => setSelectedLabel(null)}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold rounded-md transition-colors"
          >
            Đóng
          </button>
        </div>
      )}
    </div>
  );
};
