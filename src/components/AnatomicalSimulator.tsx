import React, { useEffect, useRef, useState } from 'react';
import { 
  Sparkles, 
  Info, 
  Layers,
  ZoomIn,
  ZoomOut,
  Volume2,
  Gauge,
  AlertTriangle,
  CheckCircle2
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

  // Real-time airway caliber (mm) based on physiological phase
  const airwayCaliber = {
    1: 12.0,
    2: 3.2,
    3: 0.0,
    4: 0.0,
    5: 11.5,
  }[step] ?? (airwayStatus === 'collapsed' ? 0.0 : airwayStatus === 'narrowed' ? 3.5 : 12.0);

  // Anatomical landmark hotspots (coordinates normalized 0-1 relative to canvas)
  const labels: AnatomicalLabel[] = [
    {
      id: 'nose',
      name: 'Khoang mũi (Nasal Cavity)',
      role: 'Đường dẫn khí chính khi ngủ, làm ấm và bão hòa ẩm không khí trước khi vào khí quản.',
      x: 0.36,
      y: 0.28,
    },
    {
      id: 'palate',
      name: 'Khẩu cái mềm & Lưỡi gà (Soft Palate & Uvula)',
      role: 'Mô mềm rung với tần số cao khi luồng khí đi qua khe hẹp tạo tiếng ngáy; dễ bị áp lực âm hút sập.',
      x: 0.44,
      y: 0.38,
    },
    {
      id: 'tongue',
      name: 'Cơ cằm-lưỡi (Genioglossus Muscle)',
      role: 'Cơ then chốt mở đường thở. Khi ngủ say mất trương lực sẽ thụt lùi theo trọng lực gây tắc họng.',
      x: 0.48,
      y: 0.46,
    },
    {
      id: 'obstruction',
      name: 'Vùng tắc nghẽn hầu họng (Pharyngeal Collapse)',
      role: 'Khẩu kính đường kính họng bị ép bẹp dí về 0.0mm trong cơn ngưng thở khi ngủ tắc nghẽn (OSA).',
      x: 0.43,
      y: 0.50,
    },
    {
      id: 'trachea',
      name: 'Khí quản & Vòng sụn chữ C (Trachea)',
      role: 'Ống dẫn khí chính có các vòng sụn giữ cho thành khí quản không bị xẹp dưới áp lực âm.',
      x: 0.45,
      y: 0.68,
    },
    {
      id: 'brain',
      name: 'Vỏ não & Hệ lưới hoạt hóa ARAS',
      role: 'Trung tâm báo động tiếp nhận kích thích thiếu O2/ứ CO2, kích hoạt vi tỉnh thức (Micro-arousal).',
      x: 0.62,
      y: 0.25,
    },
    {
      id: 'chemoreceptor',
      name: 'Thụ thể hóa học xoang cảnh (Carotid Body)',
      role: 'Cảm biến nồng độ oxy và CO2 trong máu động mạch cảnh, phát xung báo động khẩn cấp lên não.',
      x: 0.52,
      y: 0.58,
    },
    {
      id: 'lungs',
      name: 'Phổi & Cơ hoành gắng sức (Lungs & Diaphragm)',
      role: 'Khi họng bị tắc, ngực và cơ hoành vẫn co bóp gồng gắng sức nghịch thường tạo áp lực âm lớn.',
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

    // Streamline particles for fluid dynamics
    const streamlineCount = 55;
    const particles = Array.from({ length: streamlineCount }, (_, i) => ({
      t: i / streamlineCount,
      speed: 0.01 + Math.random() * 0.006,
      offset: (Math.random() - 0.5) * 6,
      size: Math.random() * 2 + 1.8,
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
      bgGrad.addColorStop(0, '#060d1d');
      bgGrad.addColorStop(0.5, '#040813');
      bgGrad.addColorStop(1, '#020409');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Hospital Pillow beneath head
      ctx.beginPath();
      ctx.ellipse(width * 0.68, height * 0.48, width * 0.28, height * 0.22, -0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Blanket / Mattress line
      ctx.beginPath();
      ctx.moveTo(width * 0.1, height * 0.82);
      ctx.bezierCurveTo(width * 0.35, height * 0.78, width * 0.6, height * 0.85, width * 0.95, height * 0.88);
      ctx.lineTo(width * 0.95, height);
      ctx.lineTo(width * 0.1, height);
      ctx.closePath();
      ctx.fillStyle = '#090d16';
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.stroke();

      // 2. SUPINE HUMAN SILHOUETTE (Supine Sleeping Profile: Nose pointing up/left)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(width * 0.22, height * 0.82); // Upper chest
      ctx.lineTo(width * 0.38, height * 0.62); // Neck anterior
      ctx.quadraticCurveTo(width * 0.34, height * 0.52, width * 0.36, height * 0.46); // Chin
      ctx.lineTo(width * 0.34, height * 0.41); // Lower lip
      ctx.quadraticCurveTo(width * 0.33, height * 0.36, width * 0.34, height * 0.33); // Upper lip
      ctx.lineTo(width * 0.31, height * 0.27); // Nose tip
      ctx.lineTo(width * 0.37, height * 0.23); // Nasal bridge
      ctx.quadraticCurveTo(width * 0.42, height * 0.15, width * 0.55, height * 0.14); // Forehead
      ctx.bezierCurveTo(width * 0.75, height * 0.13, width * 0.85, height * 0.28, width * 0.82, height * 0.48); // Cranium
      ctx.bezierCurveTo(width * 0.80, height * 0.62, width * 0.68, height * 0.68, width * 0.58, height * 0.75); // Occiput
      ctx.lineTo(width * 0.52, height * 0.88); // Back
      ctx.closePath();

      // Biological Semi-Translucent Shading
      const skinGrad = ctx.createLinearGradient(width * 0.3, height * 0.2, width * 0.7, height * 0.7);
      skinGrad.addColorStop(0, 'rgba(30, 41, 59, 0.7)');
      skinGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.82)');
      skinGrad.addColorStop(1, 'rgba(10, 15, 28, 0.9)');
      ctx.fillStyle = skinGrad;
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.4;
      ctx.globalAlpha = 0.55;
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      // Closed sleeping eye with realistic eyelid
      ctx.beginPath();
      ctx.arc(width * 0.43, height * 0.26, 6, 0.2 * Math.PI, 0.8 * Math.PI, false);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Ear silhouette
      ctx.beginPath();
      ctx.ellipse(width * 0.58, height * 0.40, 12, 18, 0.3, 0, Math.PI * 2);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // 3. BONY STRUCTURES: Cervical Spine Vertebrae (C1-C6)
      for (let i = 0; i < 5; i++) {
        const vy = height * 0.48 + i * 18;
        const vx = width * 0.52 + i * 2;
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(vx, vy, 24, 12);
        ctx.strokeStyle = '#475569';
        ctx.strokeRect(vx, vy, 24, 12);
        // Intervertebral disc
        if (i < 4) {
          ctx.fillStyle = '#06b6d4';
          ctx.fillRect(vx + 4, vy + 12, 16, 2.5);
        }
      }

      // 4. NASAL CAVITY & HARD PALATE
      ctx.beginPath();
      ctx.moveTo(width * 0.33, height * 0.28); // Nostril
      ctx.bezierCurveTo(width * 0.36, height * 0.24, width * 0.44, height * 0.25, width * 0.46, height * 0.32);
      ctx.lineTo(width * 0.42, height * 0.35); // Hard palate floor
      ctx.lineTo(width * 0.35, height * 0.34);
      ctx.closePath();
      ctx.fillStyle = 'rgba(244, 63, 94, 0.22)';
      ctx.fill();
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Hard Palate Bone
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(width * 0.36, height * 0.34, width * 0.08, 4);

      // 5. TONGUE & SOFT PALATE (Dynamic Medical Deformation & Flutter)
      const isCollapsed = airwayStatus === 'collapsed';
      const isNarrowed = airwayStatus === 'narrowed';
      const isReopening = airwayStatus === 'reopening';

      // Mechanical vibration of soft palate in Step 2 (Snoring)
      const flutterOffset = isNarrowed ? Math.sin(elapsed * 34) * 4.5 : 0;

      // Tongue displacement:
      // Normal: tongueBackX ≈ 0.455
      // Narrowed: tongueBackX ≈ 0.472 (partial sag)
      // Collapsed: tongueBackX ≈ 0.489 (pressed firmly against posterior wall at 0.49!)
      // Reopening: tongueBackX ≈ 0.425 (contracted forward)
      let tongueBackX = width * 0.455;
      let palateBackX = width * 0.46 + flutterOffset;

      if (isNarrowed) {
        tongueBackX = width * 0.472;
      } else if (isCollapsed) {
        tongueBackX = width * 0.489;
        palateBackX = width * 0.488;
      } else if (isReopening) {
        tongueBackX = width * 0.425;
        palateBackX = width * 0.435;
      }

      // Posterior Pharyngeal Wall (Fixed back wall)
      const pharynxWallX = width * 0.49;
      ctx.beginPath();
      ctx.moveTo(width * 0.46, height * 0.30);
      ctx.bezierCurveTo(pharynxWallX, height * 0.36, pharynxWallX, height * 0.55, width * 0.48, height * 0.64);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Soft Palate & Uvula
      ctx.beginPath();
      ctx.moveTo(width * 0.44, height * 0.35);
      ctx.quadraticCurveTo(palateBackX, height * 0.38, palateBackX - 3, height * 0.43);
      ctx.quadraticCurveTo(palateBackX - 8, height * 0.39, width * 0.43, height * 0.36);
      ctx.closePath();
      ctx.fillStyle = isCollapsed ? '#dc2626' : isNarrowed ? '#f59e0b' : '#f43f5e';
      ctx.fill();
      ctx.strokeStyle = isNarrowed ? '#fbbf24' : '#fda4af';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // ACOUSTIC SNORING SOUND RIPPLES (When Narrowed in Step 2)
      if (isNarrowed) {
        ctx.save();
        for (let s = 1; s <= 3; s++) {
          const sRadius = 12 + s * 10 + (elapsed * 35) % 18;
          ctx.beginPath();
          ctx.arc(palateBackX, height * 0.41, sRadius, -0.6 * Math.PI, 0.4 * Math.PI);
          ctx.strokeStyle = `rgba(245, 158, 11, ${Math.max(0, 0.7 - s * 0.2)})`;
          ctx.lineWidth = 2;
          ctx.setLineDash([3, 3]);
          ctx.stroke();
        }
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.fillText('Rung ngáy (30Hz)', palateBackX + 16, height * 0.39);
        ctx.restore();
      }

      // Tongue Muscle Body (Genioglossus) with Realistic Striations
      ctx.beginPath();
      ctx.moveTo(width * 0.39, height * 0.49); // Mandible inner edge
      ctx.bezierCurveTo(width * 0.40, height * 0.41, width * 0.43, height * 0.41, tongueBackX, height * 0.46);
      ctx.quadraticCurveTo(tongueBackX + (isCollapsed ? 4 : -4), height * 0.52, width * 0.44, height * 0.56);
      ctx.lineTo(width * 0.42, height * 0.55);
      ctx.quadraticCurveTo(width * 0.40, height * 0.53, width * 0.39, height * 0.49);
      ctx.closePath();

      const tongueGrad = ctx.createRadialGradient(width * 0.42, height * 0.47, 5, width * 0.43, height * 0.47, 45);
      tongueGrad.addColorStop(0, isCollapsed ? '#9f1239' : '#fb7185');
      tongueGrad.addColorStop(0.7, isCollapsed ? '#881337' : '#e11d48');
      tongueGrad.addColorStop(1, isCollapsed ? '#4c0519' : '#9f1239');
      ctx.fillStyle = tongueGrad;
      ctx.fill();
      ctx.strokeStyle = isCollapsed ? '#f43f5e' : '#fecdd3';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Striated muscle fibers radiating from mandibular symphysis
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.32)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.moveTo(width * 0.39, height * 0.49);
        const targetX = width * 0.41 + i * (tongueBackX - width * 0.41) / 6;
        const targetY = height * 0.42 + i * 2.3;
        ctx.lineTo(targetX, targetY);
        ctx.stroke();
      }
      ctx.restore();

      // Epiglottis Cartilage
      ctx.beginPath();
      ctx.moveTo(width * 0.43, height * 0.56);
      ctx.quadraticCurveTo(width * 0.45, height * 0.54, width * 0.46, height * 0.58);
      ctx.lineTo(width * 0.44, height * 0.60);
      ctx.closePath();
      ctx.fillStyle = '#f43f5e';
      ctx.fill();

      // Trachea with Cartilage C-Rings
      const tracheaX = width * 0.44;
      const tracheaY = height * 0.62;
      for (let r = 0; r < 7; r++) {
        const ry = tracheaY + r * 12;
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(tracheaX - 8, ry, 22, 6);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1;
        ctx.strokeRect(tracheaX - 8, ry, 22, 6);
      }

      // 6. AIRWAY LUMEN & FLUID STREAMLINES
      if (!isCollapsed) {
        // Glowing cyan lumen channel
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(width * 0.33, height * 0.28);
        ctx.quadraticCurveTo(width * 0.42, height * 0.27, width * 0.45, height * 0.34);
        ctx.quadraticCurveTo(width * 0.47, height * 0.42, width * 0.46, height * 0.50);
        ctx.quadraticCurveTo(width * 0.45, height * 0.58, width * 0.44, height * 0.72);
        ctx.strokeStyle = isNarrowed ? 'rgba(245, 158, 11, 0.35)' : 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = isReopening ? 18 : isNarrowed ? 6 : 12;
        ctx.stroke();
        ctx.restore();

        // Moving Streamline Particles
        particles.forEach((p) => {
          const speedMultiplier = isNarrowed ? 1.8 : isReopening ? 2.2 : 1.0;
          p.t += (airflowPercent / 100) * p.speed * speedMultiplier;
          if (p.t > 1) p.t = 0;

          let px = 0, py = 0;
          if (p.t < 0.25) {
            const subT = p.t / 0.25;
            px = width * 0.33 + subT * (width * 0.45 - width * 0.33);
            py = height * 0.28 + subT * (height * 0.34 - height * 0.28);
          } else if (p.t < 0.65) {
            const subT = (p.t - 0.25) / 0.4;
            const swirl = isNarrowed ? Math.sin(subT * 12 + elapsed * 10) * 4 : 0;
            px = width * 0.45 + subT * (width * 0.46 - width * 0.45) + p.offset + swirl;
            py = height * 0.34 + subT * (height * 0.55 - height * 0.34);
          } else {
            const subT = (p.t - 0.65) / 0.35;
            px = width * 0.46 + subT * (width * 0.44 - width * 0.46);
            py = height * 0.55 + subT * (height * 0.76 - height * 0.55);
          }

          ctx.beginPath();
          ctx.arc(px, py, p.size * (isReopening ? 1.4 : 1), 0, Math.PI * 2);
          ctx.fillStyle = isNarrowed ? '#f59e0b' : isReopening ? '#ffffff' : '#38bdf8';
          ctx.shadowColor = isNarrowed ? '#f59e0b' : '#38bdf8';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      } else {
        // COLLAPSED: Airflow blocked, turbulent stagnation outside nose
        ctx.save();
        ctx.fillStyle = '#f43f5e';
        for (let i = 0; i < 16; i++) {
          const jitterX = Math.sin(elapsed * 10 + i * 2) * 8;
          const jitterY = Math.cos(elapsed * 10 + i * 2) * 6;
          ctx.beginPath();
          ctx.arc(width * 0.31 + jitterX, height * 0.27 + jitterY, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // RED OCCLUSION FORCE ARROWS (Negative suction pushing tissue shut)
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(width * 0.43, height * 0.50);
        ctx.lineTo(width * 0.485, height * 0.51);
        ctx.stroke();

        ctx.fillStyle = '#ef4444';
        ctx.font = 'black 11px Inter, sans-serif';
        ctx.fillText('BÍT TẮC 100% (0.0mm)', width * 0.495, height * 0.50);
        ctx.restore();
      }

      // 7. BRAIN AROUSAL & EEG BURST
      ctx.save();
      const brainX = width * 0.62;
      const brainY = height * 0.25;

      ctx.beginPath();
      ctx.ellipse(brainX, brainY, 38, 28, -0.15, 0, Math.PI * 2);
      ctx.fillStyle = isBrainArousal ? 'rgba(245, 158, 11, 0.5)' : 'rgba(139, 92, 246, 0.22)';
      ctx.fill();
      ctx.strokeStyle = isBrainArousal ? '#fbbf24' : '#8b5cf6';
      ctx.lineWidth = isBrainArousal ? 2.5 : 1.5;
      ctx.stroke();

      if (isBrainArousal) {
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 16;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;

        for (let a = 0; a < 6; a++) {
          const angle = a * (Math.PI / 3) + elapsed * 3;
          const r1 = 30 + Math.sin(elapsed * 10 + a) * 8;
          const r2 = 48 + Math.cos(elapsed * 10 + a) * 10;
          ctx.beginPath();
          ctx.moveTo(brainX + Math.cos(angle) * r1, brainY + Math.sin(angle) * r1);
          ctx.lineTo(brainX + Math.cos(angle) * r2, brainY + Math.sin(angle) * r2);
          ctx.stroke();
        }

        // Pulse down Hypoglossal XII nerve to wake up tongue
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

      // 8. CAROTID CHEMORECEPTORS
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

      // 9. LUNGS & PARADOXICAL STRAIN IN CHEST
      const lungsY = height * 0.82;
      const lungBreath = isCollapsed
        ? Math.sin(elapsed * 4) * 6 // Violent paradoxical strain
        : Math.sin(elapsed * 2) * 4;

      ctx.save();
      ctx.beginPath();
      ctx.ellipse(width * 0.35, lungsY + lungBreath, 35, 45, -0.2, 0, Math.PI * 2);
      ctx.ellipse(width * 0.48, lungsY + lungBreath, 32, 42, 0.2, 0, Math.PI * 2);
      ctx.fillStyle = isCollapsed ? 'rgba(244, 63, 94, 0.28)' : 'rgba(236, 72, 153, 0.22)';
      ctx.fill();
      ctx.strokeStyle = isCollapsed ? '#f43f5e' : '#ec4899';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Pulsating Heart
      const heartBeat = isSympathetic
        ? 1 + Math.sin(elapsed * 12) * 0.2
        : 1 + Math.sin(elapsed * 3) * 0.08;
      ctx.beginPath();
      ctx.arc(width * 0.42, lungsY, 14 * heartBeat, 0, Math.PI * 2);
      ctx.fillStyle = isSympathetic ? '#dc2626' : '#991b1b';
      ctx.fill();
      ctx.strokeStyle = '#ef4444';
      ctx.stroke();
      ctx.restore();

      ctx.restore(); // Restore zoom
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [step, airwayStatus, airflowPercent, spo2Percent, isBrainArousal, isSympathetic, zoomLevel, airwayCaliber]);

  return (
    <div className="relative w-full h-[430px] sm:h-[500px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between select-none">
      {/* Simulation Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
      />

      {/* Top Bar Controls */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        {/* Zoom & Label Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 pointer-events-auto shadow-lg">
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              showLabels ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showLabels ? 'Ẩn nhãn' : 'Hiện nhãn'}</span>
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

        {/* Real-time Status Badge */}
        <div className="pointer-events-auto">
          {airwayStatus === 'collapsed' && (
            <div className="px-3 py-1.5 bg-rose-500/25 border border-rose-500/60 rounded-xl text-rose-300 text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>BÍT TẮC HẦU HỌNG 100%</span>
            </div>
          )}
          {airwayStatus === 'narrowed' && (
            <div className="px-3 py-1.5 bg-amber-500/25 border border-amber-500/60 rounded-xl text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md">
              <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>HẸP ĐƯỜNG THỞ • RUNG NGÁY</span>
            </div>
          )}
          {airwayStatus === 'reopening' && (
            <div className="px-3 py-1.5 bg-sky-500/25 border border-sky-500/60 rounded-xl text-sky-300 text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>CƠ CẰM-LƯỠI CO • BẬT MỞ (GASP)</span>
            </div>
          )}
          {airwayStatus === 'open' && (
            <div className="px-3 py-1.5 bg-emerald-500/25 border border-emerald-500/60 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>THÔNG KHÍ BÌNH THƯỜNG</span>
            </div>
          )}
        </div>
      </div>

      {/* LIVE AIRWAY CALIBER GAUGE (Benchmark từ Complete Anatomy & BioDigital Human) */}
      <div className="absolute top-14 left-3 z-10 pointer-events-auto">
        <div className="bg-slate-900/90 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-slate-700/80 shadow-2xl flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-teal-400 flex-shrink-0 border border-slate-700">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Khẩu kính đường thở</span>
              <span className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                airwayCaliber === 0 ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                airwayCaliber < 5 ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {airwayCaliber === 0 ? 'TẮC NGHẼN' : airwayCaliber < 5 ? 'HẸP NẶNG' : 'THÔNG THOÁNG'}
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
                (Bình thường: 10 - 13mm)
              </span>
            </div>
          </div>
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
              <div className="w-4 h-4 rounded-full bg-teal-500/40 border-2 border-teal-400 flex items-center justify-center group-hover:scale-125 transition-transform shadow-md shadow-teal-500/50">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
              <span className="hidden sm:block absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-200 text-[10px] font-medium border border-slate-700/80 shadow-lg pointer-events-none group-hover:block">
                {lbl.name.split('(')[0]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Selected Landmark Info Card */}
      {selectedLabel && (
        <div className="absolute bottom-3 left-3 right-3 z-20 bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-teal-500/60 shadow-2xl flex items-start justify-between gap-3 animate-fadeIn">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>{selectedLabel.name}</span>
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              {selectedLabel.role}
            </p>
          </div>
          <button
            onClick={() => setSelectedLabel(null)}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      )}
    </div>
  );
};

export default AnatomicalSimulator;
