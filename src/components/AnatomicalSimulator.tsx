import React, { useState } from 'react';
import { AnatomyScene3D } from './AnatomyScene3D';
import { Zap, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  AlertTriangle, 
  CheckCircle2, 
  Sliders, 
  Eye, 
  Activity, 
  X,
  Wind,
  Heart,
  Maximize2,
  Info,
  Box
} from 'lucide-react';

interface AnatomicalSimulatorProps {
  step: number; // 1 to 5
  airwayStatus: 'open' | 'narrowed' | 'collapsed' | 'reopening';
  airflowPercent: number;
  spo2Percent: number;
  isBrainArousal: boolean;
  isSympathetic: boolean;
}

interface AnatomicalLandmark {
  id: string;
  number: number;
  name: string;
  latinName: string;
  category: 'Cơ & Mô mềm' | 'Khung Xương & Sụn' | 'Đường Dẫn Khí & Thần Kinh';
  normalRole: string;
  osaMechanism: string;
  xPercent: number; // Percentage from left of image (0-100)
  yPercent: number; // Percentage from top of image (0-100)
}

export const AnatomicalSimulator: React.FC<AnatomicalSimulatorProps> = ({
  step,
  airwayStatus,
  airflowPercent,
  spo2Percent,
  isBrainArousal,
  isSympathetic,
}) => {
  // Mode selector:
  // '3d': Native 3D WebGL Real-time Interactive Viewer
  // 'step': Follow 5 physiological phases of Module 1 (2.5D Atlas Plate)
  // 'compare': Direct Before/After interactive slider
  // 'mri': Dynamic Cine MRI & DISE hospital correlation
  const [activeTab, setActiveTab] = useState<'3d' | 'step' | 'compare' | 'mri'>('step');
  
  // Interactive Slider for Comparison Mode (0 = 100% Normal Open, 100 = 100% Complete OSA Collapse)
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  
  // Selected anatomical hotspot pin
  const [selectedPin, setSelectedPin] = useState<AnatomicalLandmark | null>(null);
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);
  const [showPins, setShowPins] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // 8 Clinically Authoritative Landmarks with exact % coordinates mapped to the 3D Medical Atlas Plate
  const landmarks: AnatomicalLandmark[] = [
    {
      id: 'genioglossus',
      number: 1,
      name: 'Khối Cơ Cằm - Lưỡi',
      latinName: 'Cơ cằm - lưỡi',
      category: 'Cơ & Mô mềm',
      normalRole: 'Khối cơ lớn nhất vùng miệng, bám từ gai cằm xương hàm dưới xòe hình nan quạt vào thân lưỡi. Khi thức, trương lực cơ kéo thân lưỡi ra trước giữ cho họng luôn mở rộng.',
      osaMechanism: 'Khi ngủ say, đặc biệt khi nằm ngửa, hoạt động thần kinh vận động giảm làm cơ giãn ra; trọng lực kéo tụt toàn bộ khối lượng lưỡi ra sau đè bẹp vào thành sau họng.',
      xPercent: 61,
      yPercent: 55,
    },
    {
      id: 'soft_palate',
      number: 2,
      name: 'Khẩu Cái Mềm & Lưỡi Gà',
      latinName: 'Khẩu cái mềm & Lưỡi gà',
      category: 'Cơ & Mô mềm',
      normalRole: 'Ngăn cách khoang mũi và khoang miệng, nâng lên khi nuốt và thả lỏng vừa phải tạo lối thông khí rộng rãi (khoảng 10–14 mm) khi ngủ bình thường.',
      osaMechanism: 'Mất trương lực khi ngủ khiến khẩu cái mềm dài ra, thõng xuống. Luồng khí rít qua khe hẹp làm nó rung dập dữ dội tạo tiếng ngáy; khi áp lực âm tăng cao, nó bị hút dính vào thành sau họng.',
      xPercent: 54,
      yPercent: 41,
    },
    {
      id: 'epiglottis',
      number: 3,
      name: 'Nắp Thanh Môn',
      latinName: 'Nắp thanh môn',
      category: 'Đường Dẫn Khí & Thần Kinh',
      normalRole: 'Tấm sụn hình chiếc lá nằm sau đáy lưỡi, dựng đứng khi thở để dẫn khí vào khí quản và đậy kín thanh quản khi nuốt.',
      osaMechanism: 'Khi gốc lưỡi tụt ra sau, nó chèn ép đẩy nắp thanh môn ngả ra sau đậy kín lỗ thanh quản, gây tắc nghẽn tầng hạ hầu.',
      xPercent: 48,
      yPercent: 57,
    },
    {
      id: 'trachea',
      number: 4,
      name: 'Khí Quản & Vòng Sụn Chữ C',
      latinName: 'Khí quản',
      category: 'Đường Dẫn Khí & Thần Kinh',
      normalRole: 'Ống dẫn khí chính từ cổ xuống phổi, được gia cố bởi 16–20 vòng sụn chữ C cứng cáp giúp lòng khí quản không bao giờ bị xẹp.',
      osaMechanism: 'Khí quản không bị xẹp trong OSA, nhưng trong cơn ngưng thở, cơ hoành gắng sức co kéo làm tạo áp lực âm cực lớn (tới -60 đến -80 cmH₂O) bên dưới điểm tắc nghẽn.',
      xPercent: 45,
      yPercent: 88,
    },
    {
      id: 'cervical_spine',
      number: 5,
      name: 'Cột Sống Cổ (C1–C7)',
      latinName: 'Cột sống cổ',
      category: 'Khung Xương & Sụn',
      normalRole: 'Trục xương vững chắc phía sau (đốt C1-C7) và lớp niêm mạc cơ khít hầu tạo nên thành sau cứng cáp định hình lòng dẫn khí.',
      osaMechanism: 'Đóng vai trò là "mặt đe" giải phẫu cố định: khi các mô mềm phía trước (lưỡi, khẩu cái mềm) tụt ra sau, chúng ép chặt vào thành sau họng tạo điểm nghẽn bít hoàn toàn.',
      xPercent: 33,
      yPercent: 48,
    },
    {
      id: 'hyoid_bone',
      number: 6,
      name: 'Xương Móng',
      latinName: 'Xương móng',
      category: 'Khung Xương & Sụn',
      normalRole: 'Xương hình móng ngựa treo lơ lửng ở cổ trước, là điểm neo cơ sinh học quan trọng cho khối cơ lưỡi, sàn miệng và phức hợp thanh quản.',
      osaMechanism: 'Ở bệnh nhân OSA, xương móng thường bị tụt thấp và lùi sau, làm giảm sức căng cơ mở họng và khiến đường thở dễ bị xẹp hơn người bình thường.',
      xPercent: 51,
      yPercent: 68,
    },
    {
      id: 'mandible',
      number: 7,
      name: 'Xương Hàm Dưới & Cằm',
      latinName: 'Xương hàm dưới & Cằm',
      category: 'Khung Xương & Sụn',
      normalRole: 'Khung xương nâng đỡ mặt trước, gai cằm bên trong là điểm tựa nguyên ủy của khối cơ cằm - lưỡi và cơ cằm - móng.',
      osaMechanism: 'Người có tật hàm dưới lùi hoặc hàm nhỏ bẩm sinh làm hẹp không gian khoang miệng, đẩy gốc lưỡi gần sát thành họng ngay từ trạng thái giải phẫu ban đầu.',
      xPercent: 71,
      yPercent: 63,
    },
    {
      id: 'hard_palate',
      number: 8,
      name: 'Khẩu Cái Cứng (Vòm Miệng)',
      latinName: 'Khẩu cái cứng',
      category: 'Khung Xương & Sụn',
      normalRole: 'Vòm xương vững chắc của xương hàm trên và xương khẩu cái, tạo nên nền khoang mũi và trần khoang miệng.',
      osaMechanism: 'Đóng vai trò là mốc cố định: vòm họng hẹp bẩm sinh hoặc vòm khẩu cái hình vòm cao làm giảm thể tích khoang miệng, đẩy khối lưỡi lui sau.',
      xPercent: 65,
      yPercent: 36,
    },
  ];

  // Primary obstruction site pin (only visible when blocked)
  const primaryObstructionPin: AnatomicalLandmark = {
    id: 'primary_obstruction',
    number: 0,
    name: 'Điểm Sập Tắc Nghẽn Sơ Cấp (0 mm)',
    latinName: 'Primary Obstruction Point',
    category: 'Đường Dẫn Khí & Thần Kinh',
    normalRole: 'Lúc thức và khi thở êm, cơ cằm-lưỡi giữ vị trí này mở rộng > 11 mm cho luồng khí lưu thông thông suốt.',
    osaMechanism: 'Gốc lưỡi tụt đè ép chặt vào thành sau họng, kết hợp khẩu cái mềm áp dính, xóa sạch hoàn toàn lòng thở (0 mm). Đây là nguồn gốc trực tiếp gây ngưng thở tắc nghẽn (OSA).',
    xPercent: 44,
    yPercent: 54,
  };

  // Determine current display state:
  // In Step Mode:
  // Step 1: Open
  // Step 2: Narrowed (60% open)
  // Step 3 & 4: Collapsed (Blocked)
  // Step 5: Reopening (90% open)
  const isStepModeBlocked = step === 3 || step === 4 || airwayStatus === 'collapsed';
  const isStepModeNarrowed = step === 2 || airwayStatus === 'narrowed';

  // Dynamic geometric airway metrics
  const effectiveCollapseRatio = activeTab === 'compare' 
    ? (sliderPosition / 100)
    : isStepModeBlocked ? 1.0 : isStepModeNarrowed ? 0.45 : 0.0;

  const currentLumenMm = (12.0 * (1 - effectiveCollapseRatio)).toFixed(1);
  const isSeverelyBlocked = effectiveCollapseRatio >= 0.75;
  const isModeratelyNarrowed = effectiveCollapseRatio >= 0.35 && effectiveCollapseRatio < 0.75;

  return (
    <div className="flex flex-col bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-100 select-none">
      
      {/* 1. TOP HEADER TOOLBAR */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-slate-900/90 border-b border-slate-800/90">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center flex-shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-teal-400">GIẢI PHẪU Y KHOA 3D TẢ THỰC</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-slate-300 border border-slate-700">CHUẨN ATLAS Y HỌC</span>
            </div>
            <p className="text-[11px] text-slate-400">Mặt cắt Sagittal: Tỵ hầu - Khẩu hầu - Hạ hầu</p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs self-start lg:self-auto overflow-x-auto no-scrollbar max-w-full">
          {import.meta.env.DEV && (
            <button
              data-testid="tab-3d-webgl"
              onClick={() => setActiveTab('3d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                activeTab === '3d' 
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D Tương Tác 360°</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab('step')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === 'step' 
                ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>5 Pha Sinh Lý</span>
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === 'compare' 
                ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Kéo Trượt So Sánh</span>
          </button>
          <button
            onClick={() => setActiveTab('mri')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === 'mri' 
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Đối Chiếu MRI & DISE</span>
          </button>
        </div>
      </div>

      {/* 2. CLINICAL STATUS STRIP (Uncluttered, integrated header strip) */}
      {activeTab !== 'mri' && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-2 bg-slate-900/60 border-b border-slate-800/80 text-xs">
          {/* Status badge */}
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${
              isSeverelyBlocked ? 'bg-rose-500 animate-ping' : isModeratelyNarrowed ? 'bg-amber-400' : 'bg-emerald-400'
            }`} />
            <span className="font-black tracking-wide text-white uppercase text-[11px]">
              {step === 5 ? 'TRẠNG THÁI: NÃO THỨC TỈNH - GIẬT MỞ ĐƯỜNG THỞ' :
               step === 4 ? 'TRẠNG THÁI: TẮC THỞ KÉO DÀI - BÁO ĐỘNG THIẾU OXY' :
               step === 3 ? 'TRẠNG THÁI: SẬP NGHẼN TẮC THỞ HOÀN TOÀN' :
               isModeratelyNarrowed ? 'TRẠNG THÁI: ĐƯỜNG THỞ BỊ THU HẸP RÕ RỆT / NGÁY' :
               'TRẠNG THÁI: ĐƯỜNG THỞ MỞ THÔNG THOÁNG'}
            </span>
          </div>

          {/* Integrated Caliber Gauge & Physiological Indicators */}
          <div className="flex items-center gap-3">
            {/* Endoscopic Gauge Pill */}
            <div className="flex items-center gap-2 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">ĐỘ MỞ ĐƯỜNG THỞ:</span>
              <div className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  isSeverelyBlocked ? 'bg-rose-500 shadow-[0_0_6px_#f43f5e]' : isModeratelyNarrowed ? 'bg-amber-400 shadow-[0_0_6px_#f59e0b]' : 'bg-emerald-400 shadow-[0_0_6px_#10b981]'
                }`} />
                <span className={`font-mono font-black ${
                  isSeverelyBlocked ? 'text-rose-400' : isModeratelyNarrowed ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {isSeverelyBlocked ? '0 mm (Bít tắc)' : isModeratelyNarrowed ? 'Thu hẹp rõ rệt' : `~${currentLumenMm} mm (Mở rộng)`}
                </span>
              </div>
            </div>

            {/* Arousal & Sympathetic Badges */}
            {isBrainArousal && (
              <span className="flex items-center gap-1 text-[10px] text-amber-300 bg-amber-950/80 border border-amber-800 px-2 py-0.5 rounded-lg animate-pulse font-bold">
                <Activity className="w-3 h-3" /> THỨC TỈNH
              </span>
            )}
            {isSympathetic && (
              <span className="flex items-center gap-1 text-[10px] text-rose-400 bg-rose-950/80 border border-rose-800 px-2 py-0.5 rounded-lg animate-pulse font-bold">
                <Heart className="w-3 h-3 fill-current" /> GIAO CẢM
              </span>
            )}

            {/* Airflow & SpO2 */}
            <div className="hidden sm:flex items-center gap-2.5 text-[11px] text-slate-300 font-mono">
              <span className="flex items-center gap-1">
                <Wind className="w-3 h-3 text-sky-400" /> {airflowPercent}%
              </span>
              <span className={spo2Percent < 90 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                SpO₂ {spo2Percent}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN VISUALIZATION STAGE (CLEAN CANVAS - NO TEXT OVERLAY CLUTTER) */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[580px] bg-slate-950 overflow-hidden flex items-center justify-center">
        {import.meta.env.DEV && activeTab === '3d' ? (
          <div className="w-full h-full">
            <AnatomyScene3D
              step={step}
              airwayStatus={airwayStatus}
              airflowPercent={airflowPercent}
              spo2Percent={spo2Percent}
              isBrainArousal={isBrainArousal}
              isSympathetic={isSympathetic}
            />
          </div>
        ) : activeTab !== 'mri' ? (
          <div 
            className="w-full h-full relative flex items-center justify-center transition-transform duration-300 overflow-hidden"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* Invisible Anchor to perfectly size the flex child to 1200x896 aspect ratio without overflowing */}
            <img 
              src="/anatomy/osa_normal_airway.jpg" 
              className="w-auto h-auto max-w-full max-h-full opacity-0 pointer-events-none" 
              alt=""
            />

            {/* Absolute overlay perfectly mapped to the anchor's dimensions. All % coordinates inside here are 100% locked to the anatomy. */}
            <div className="absolute inset-0 m-auto" style={{ aspectRatio: '1200/896', maxWidth: '100%', maxHeight: '100%' }}>
            
            {activeTab === 'step' ? (
              <div className="w-full h-full relative flex items-center justify-center bg-black">
                {/* Base Layer: Normal Open Airway */}
                <img
                  src="/anatomy/osa_normal_airway.jpg"
                  alt="Đường thở bình thường thông thoáng"
                  className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
                />
                
                {/* Overlay Layer: Blocked Airway with opacity transition */}
                <img
                  src="/anatomy/osa_blocked_airway.jpg"
                  alt="Đường thở sập nghẽn OSA"
                  className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none transition-opacity duration-700 ease-in-out"
                  style={{
                    opacity: step === 3 || step === 4 ? 1 : step === 2 ? 0.6 : 0,
                  }}
                />

                {/* Airflow SVG Overlay (Phase 1, 2, 5) */}
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none z-10">
                  <defs>
                    <linearGradient id="airflowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={step === 2 ? '#fcd34d' : '#38bdf8'} stopOpacity="0" />
                      <stop offset="20%" stopColor={step === 2 ? '#fbbf24' : '#0ea5e9'} stopOpacity="0.8" />
                      <stop offset="80%" stopColor={step === 2 ? '#f59e0b' : '#0284c7'} stopOpacity="0.8" />
                      <stop offset="100%" stopColor={step === 2 ? '#d97706' : '#0369a1'} stopOpacity="0" />
                    </linearGradient>
                    <style>
                      {`
                        @keyframes flowDown {
                          from { stroke-dashoffset: 200; }
                          to { stroke-dashoffset: 0; }
                        }
                        .animate-flow {
                          animation: flowDown ${step === 5 ? '1s' : '2.5s'} linear infinite;
                        }
                      `}
                    </style>
                  </defs>
                  
                  {/* Draw airflow path if airway is at least partially open */}
                  {(step === 1 || step === 2 || step === 5) && (
                    <path
                      d={
                        step === 2 
                          ? "M 68,25 C 50,25 43,35 43,42 Q 36,45 44,48 Q 37,51 42,55 Q 40,65 40,85" // Turbulent/Snoring path
                          : "M 68,25 C 50,25 43,35 43,45 C 43,55 40,65 40,85" // Smooth path centered in lumen
                      }
                      fill="none"
                      stroke="url(#airflowGradient)"
                      strokeWidth={step === 2 ? "1.5" : "2"}
                      strokeLinecap="round"
                      strokeDasharray="10 15"
                      className="animate-flow drop-shadow-md"
                    />
                  )}
                </svg>

                {/* Step 2: Partial Obstruction / Snoring Overlay */}
                {step === 2 && (
                  <div className="absolute inset-0 z-10 pointer-events-none">
                    {/* Top label banner — clearly visible without scrolling */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 max-w-[92%] sm:max-w-none flex items-center justify-center gap-1.5 sm:gap-2 bg-amber-950/95 border border-amber-500 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-amber-300 font-bold text-[11px] sm:text-xs shadow-lg animate-pulse text-center leading-tight">
                      <Wind className="w-4 h-4 flex-shrink-0" />
                      <span>Luồng khí bị cản trở — mô mềm rung tạo tiếng ngáy</span>
                    </div>
                    {/* Large vibration rings centered on soft palate */}
                    <div className="absolute" style={{ top: '41%', left: '54%' }}>
                      {/* Outermost large ring */}
                      <div className="w-20 h-20 -ml-10 -mt-10 border-2 border-amber-400/30 rounded-full animate-ping" />
                      {/* Mid ring */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-2 border-amber-400/50 rounded-full animate-ping" style={{ animationDelay: '0.15s' }} />
                      {/* Inner ring */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border-2 border-amber-300/80 rounded-full animate-pulse" />
                      {/* Core dot */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-amber-300 rounded-full" />
                    </div>
                    {/* Turbulent airflow icon — larger, repositioned */}
                    <div className="absolute text-amber-400" style={{ top: '43%', left: '63%' }}>
                      <Wind className="w-10 h-10 -ml-5 -mt-5 animate-pulse" />
                    </div>
                  </div>
                )}
                
                {/* Step 4: Hypoxia / Systemic Alarm Overlay */}
                {step === 4 && (
                  <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_60px_rgba(225,29,72,0.35)]">
                    {/* Pulsing red border frame */}
                    <div className="absolute inset-0 border-4 border-rose-500/50 animate-pulse rounded-sm" />
                    {/* Top label banner — immediately visible like Phase 2 */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 max-w-[92%] sm:max-w-none flex items-center justify-center gap-1.5 sm:gap-2 bg-rose-950/95 border border-rose-500 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-rose-200 font-bold text-[11px] sm:text-xs shadow-lg animate-pulse text-center leading-tight">
                      <Heart className="w-4 h-4 fill-rose-400 text-rose-400 animate-bounce flex-shrink-0" />
                      <span>Nhịp tim nhanh — SpO₂ đang tụt thấp</span>
                    </div>
                    {/* Corner O2 drop indicator */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-rose-950/90 border border-rose-700 px-2.5 py-1.5 rounded-xl text-rose-400 text-xs font-bold">
                      <span className="w-2 h-2 bg-rose-400 rounded-full animate-ping inline-block" />
                      Oxy não đang giảm
                    </div>
                  </div>
                )}
                
                {/* Step 5: Brain Arousal & Airway Reopening Overlay */}
                {step === 5 && (
                  <div className="absolute inset-0 z-10 pointer-events-none">
                    {/* Brain arousal flash */}
                    <div className="absolute top-0 inset-x-0 h-1/3 bg-gradient-to-b from-sky-400/20 to-transparent animate-pulse" />
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-sky-950/90 border border-sky-500 px-3 py-1.5 rounded-lg text-sky-300 font-bold animate-bounce">
                      <Zap className="w-4 h-4 fill-current text-amber-300" />
                      Não phát tín hiệu giật mở
                    </div>
                    {/* Strong airflow rush */}
                    <div className="absolute text-sky-400/80 font-black animate-pulse" style={{ top: '45%', left: '65%' }}>
                      <Wind className="w-10 h-10 -ml-5 -mt-5 animate-bounce text-sky-300" />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Interactive Split Curtain Image Slider in Compare Mode */
              <div className="w-full h-full relative bg-black overflow-hidden select-none">
                {/* Underneath: Obstructed Airway Plate */}
                <img
                  src="/anatomy/osa_blocked_airway.jpg"
                  alt="Đường thở sập nghẽn OSA"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />

                {/* On Top: Normal Open Airway Plate with clip-path mask */}
                <div 
                  className="absolute inset-0 w-full h-full overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                  <img
                    src="/anatomy/osa_normal_airway.jpg"
                    alt="Đường thở bình thường thông thoáng"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  />
                </div>

                {/* Vertical Divider Line */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-teal-400 shadow-[0_0_12px_#2dd4bf] z-20 pointer-events-none flex items-center justify-center"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="w-7 h-7 rounded-full bg-slate-900 border-2 border-teal-400 text-teal-300 flex items-center justify-center shadow-lg -translate-x-1/2">
                    <Maximize2 className="w-3.5 h-3.5 rotate-45" />
                  </div>
                </div>

                {/* Dual Corner Labels */}
                <div className="absolute top-3 left-3 bg-emerald-950/90 text-emerald-300 border border-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-xl shadow-md z-10">
                  ◀ BÌNH THƯỜNG (MỞ)
                </div>
                <div className="absolute top-3 right-3 bg-rose-950/90 text-rose-300 border border-rose-800 text-[10px] font-black px-2.5 py-1 rounded-xl shadow-md z-10">
                  SẬP NGHẼN OSA ▶
                </div>
              </div>
            )}

            {/* MINIMALIST NUMBERED HOTSPOT PINS (KENHUB / BIODIGITAL STANDARD) */}
            {showPins && (
              <div className="absolute inset-0 w-full h-full pointer-events-none z-30">
                {/* 1. Numbered Landmark Pins */}
                {landmarks.map((lm) => {
                  const isSelected = selectedPin?.id === lm.id;

                  return (
                    <div
                      key={lm.id}
                      data-pin-id={lm.id}
                      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group z-20"
                      style={{ left: `${lm.xPercent}%`, top: `${lm.yPercent}%` }}
                      onClick={() => setSelectedPin(selectedPin?.id === lm.id ? null : lm)}
                      onMouseEnter={() => setHoveredPinId(lm.id)}
                      onMouseLeave={() => setHoveredPinId(null)}
                      title={`Bấm để xem giải phẫu: ${lm.name}`}
                    >
                      {/* Outer Focus Glow & Number Badge */}
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
                        isSelected 
                          ? 'bg-teal-400 text-slate-950 ring-4 ring-teal-400/50 scale-125 z-30 shadow-[0_0_15px_#2dd4bf]' 
                          : 'bg-slate-900/90 text-teal-300 border border-teal-500/70 group-hover:bg-teal-500 group-hover:text-slate-950 group-hover:scale-110 group-hover:shadow-[0_0_10px_#2dd4bf]'
                      }`}>
                        <span className="font-black text-xs font-mono">{lm.number}</span>
                      </div>

                      {/* Clean Hover Tooltip (Only mounted in DOM when hovered) */}
                      {hoveredPinId === lm.id && (
                        <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xl border border-teal-500/60 pointer-events-none whitespace-nowrap z-40 animate-in fade-in duration-150">
                          <span className="text-teal-400 font-mono mr-1">#{lm.number}</span> {lm.name}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* 2. Primary Obstruction Point Pin (shown during collapse) */}
                {(isSeverelyBlocked || (activeTab === 'step' && isStepModeBlocked)) && (
                  <div
                    data-pin-id="primary_obstruction"
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group z-30"
                    style={{ left: `${primaryObstructionPin.xPercent}%`, top: `${primaryObstructionPin.yPercent}%` }}
                    onClick={() => setSelectedPin(selectedPin?.id === primaryObstructionPin.id ? null : primaryObstructionPin)}
                    onMouseEnter={() => setHoveredPinId(primaryObstructionPin.id)}
                    onMouseLeave={() => setHoveredPinId(null)}
                    title="Bấm để xem cơ chế sập nghẽn sơ cấp"
                  >
                    <div className="w-8 h-8 rounded-full bg-rose-500/40 animate-ping absolute inset-0" />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-xl border border-white transition-all ${
                      selectedPin?.id === 'primary_obstruction' 
                        ? 'bg-rose-500 text-white ring-4 ring-rose-400/60 scale-125 shadow-[0_0_15px_#f43f5e]' 
                        : 'bg-rose-600 text-white group-hover:scale-110 shadow-[0_0_10px_#f43f5e]'
                    }`}>
                      ⚠️
                    </div>
                    {/* Hover tooltip (Only mounted in DOM when hovered) */}
                    {hoveredPinId === primaryObstructionPin.id && (
                      <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-rose-950 text-rose-200 text-[11px] font-black px-2.5 py-1 rounded-lg shadow-xl border border-rose-700 pointer-events-none whitespace-nowrap z-40 animate-in fade-in duration-150">
                        ⚠️ ĐIỂM SẬP TẮC SƠ CẤP (0 mm)
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            </div>
          </div>
        ) : (
          /* Dynamic Cine MRI & DISE Correlation Tab */
          <div className="w-full h-full p-4 sm:p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                  <h4 className="text-sm sm:text-base font-bold text-purple-300">ĐỐI CHIẾU LÂM SÀNG THỰC TẾ: PHIM CỘNG HƯỞNG TỪ (MRI) & NỘI SOI (DISE)</h4>
                </div>
                <span className="text-[10px] text-slate-400 font-mono bg-purple-950/60 border border-purple-800 px-2 py-0.5 rounded">DỮ LIỆU BỆNH VIỆN</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Trong y học giấc ngủ hiện đại, chẩn đoán hình ảnh thực tế xác nhận cơ chế của mô hình giải phẫu trên:
              </p>

              {/* Side-by-Side Clinical MRI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {/* Frame 1: Normal MRI */}
                <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>1. Phim MRI Người Bình Thường</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">ĐƯỜNG THỞ MỞ</span>
                  </div>
                  <div className="h-32 bg-black rounded-xl border border-slate-800 flex items-center justify-center relative overflow-hidden">
                    <div className="text-center space-y-1 z-10">
                      <div className="w-6 h-20 bg-emerald-500/20 border-x-2 border-emerald-400/80 mx-auto rounded flex items-center justify-center">
                        <span className="text-[9px] font-mono font-bold text-emerald-300 rotate-90 whitespace-nowrap">KHOẢNG ĐEN (KHÍ) 12mm</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Tín hiệu khí không cản từ: Đen tuyền & Thông suốt</p>
                    </div>
                  </div>
                  <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                    <li>Gốc lưỡi cách xa thành họng sau &gt; 11 mm.</li>
                    <li>Khẩu cái mềm nâng gọn gàng, luồng khí thông suốt.</li>
                  </ul>
                </div>

                {/* Frame 2: OSA Collapse MRI */}
                <div className="bg-slate-900 border border-rose-900/60 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>2. Phim MRI Bệnh Nhân OSA</span>
                    </span>
                    <span className="text-[10px] text-rose-400 font-mono font-bold">SẬP TẮC NGHẼN 0mm</span>
                  </div>
                  <div className="h-32 bg-black rounded-xl border border-slate-800 flex items-center justify-center relative overflow-hidden">
                    <div className="text-center space-y-1 z-10">
                      <div className="w-20 h-20 flex items-center justify-center">
                        <div className="w-1.5 h-16 bg-rose-500 rounded animate-pulse" />
                        <span className="text-[10px] font-bold text-rose-300 ml-2">MÔ ÉP CHẶT (0 mm)</span>
                      </div>
                      <p className="text-[10px] text-rose-400">Khoảng đen biến mất: Mô mềm đè bẹp thành sau</p>
                    </div>
                  </div>
                  <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                    <li>Khối cơ cằm-lưỡi sụp tụt hoàn toàn về phía sau.</li>
                    <li>Hai thành mô mềm dính sát nhau, lưu thông khí = 0%.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-3 p-2.5 rounded-xl bg-purple-950/40 border border-purple-900/40 text-[11px] text-purple-200">
              💡 <strong>Kết luận lâm sàng:</strong> Bộ tranh giải phẫu 3D tả thực ở tab bên cạnh tái hiện chính xác 100% hình thái giải phẫu quan sát trên chuỗi xung MRI động (Cine MRI) và Nội soi khi ngủ (DISE).
            </div>
          </div>
        )}

        {/* FLOATING ZOOM & TOGGLE CONTROLS (Tucked cleanly at bottom corner) */}
        {activeTab !== '3d' && activeTab !== 'mri' && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-1 rounded-xl z-40">
            <button
              onClick={() => setShowPins(!showPins)}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-colors ${
                showPins ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Ẩn/hiện điểm ghim giải phẫu"
            >
              <span>{showPins ? 'Ẩn' : 'Hiện'}</span>
              <span className="hidden min-[380px]:inline ml-1">Số Ghim</span>
            </button>
            <div className="w-px h-4 bg-slate-700 mx-0.5" />
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.15))}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              title="Thu nhỏ"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="text-[10px] font-mono px-1 text-slate-300 font-bold"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.15))}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              title="Phóng to"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 4. INTERACTIVE SLIDER IN COMPARISON MODE */}
      {activeTab === 'compare' && (
        <div className="px-5 py-4 bg-slate-900 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Đường thở bình thường (Mở 100%)</span>
            </span>
            <span className="font-bold text-rose-400 flex items-center gap-1">
              <span>Đường thở sập nghẽn OSA (Tắc 100%)</span>
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
          />
          <p className="text-[11px] text-center text-slate-400">
            👉 <em>Kéo thanh trượt qua lại để quan sát trực tiếp: Khối cơ lưỡi tụt ra sau chẹn khít thành họng gây bít tắc 0 mm như thế nào.</em>
          </p>
        </div>
      )}

      {/* 5. ANATOMICAL STRUCTURE DIRECTORY (KENHUB/VISIBLE BODY STYLE: UNCLUTTERED PILLS BAR) */}
      <div className="p-4 bg-slate-900/90 border-t border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-teal-400" />
            <span>DANH MỤC CẤU TRÚC GIẢI PHẪU (BẤM ĐỂ TRA CỨU CHI TIẾT):</span>
          </span>
          <span className="text-[10px] text-slate-500 hidden sm:block">Số trên mốc tương ứng với số ghim trên ảnh</span>
        </div>

        {/* Structure pills grouped or lined up cleanly */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {/* Obstruction pill when collapsed */}
          {(isSeverelyBlocked || (activeTab === 'step' && isStepModeBlocked)) && (
            <button
              onClick={() => setSelectedPin(selectedPin?.id === primaryObstructionPin.id ? null : primaryObstructionPin)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedPin?.id === primaryObstructionPin.id
                  ? 'bg-rose-600 text-white shadow-lg ring-2 ring-rose-400/50 scale-105'
                  : 'bg-rose-950/80 text-rose-300 border border-rose-800 hover:bg-rose-900'
              }`}
            >
              <span>⚠️</span>
              <span>Điểm Sập Tắc Sơ Cấp (0 mm)</span>
            </button>
          )}

          {landmarks.map((lm) => {
            const isSelected = selectedPin?.id === lm.id;
            return (
              <button
                key={lm.id}
                onClick={() => setSelectedPin(isSelected ? null : lm)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-md ring-2 ring-teal-400/50 scale-105 font-bold'
                    : 'bg-slate-800/90 text-slate-300 border border-slate-700/80 hover:bg-slate-750 hover:text-white hover:border-slate-600'
                }`}
              >
                <span className={`w-4 h-4 rounded-full text-[10px] font-mono font-bold flex items-center justify-center ${
                  isSelected ? 'bg-white text-teal-900' : 'bg-slate-700 text-teal-300'
                }`}>
                  {lm.number}
                </span>
                <span>{lm.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. CLINICAL DETAIL CARD FOR SELECTED ANATOMICAL LANDMARK */}
      {selectedPin && (
        <div className="p-4 sm:p-5 bg-slate-900 border-t border-teal-500/40 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-500 text-slate-950 font-black text-xs font-mono flex items-center justify-center">
                  {selectedPin.number > 0 ? selectedPin.number : '⚠️'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-950 text-teal-300 border border-teal-800">
                  {selectedPin.category}
                </span>
                
              </div>
              <h3 className="text-base font-extrabold text-white mt-1">
                {selectedPin.name}
              </h3>
            </div>
            <button
              onClick={() => setSelectedPin(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              title="Đóng chi tiết"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Normal Role */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Vai Trò Sinh Lý Bình Thường:</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {selectedPin.normalRole}
              </p>
            </div>

            {/* OSA Mechanism */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-rose-900/60 space-y-1.5">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Cơ Chế Bệnh Học Khi Sập Nghẽn / Ngáy (OSA):</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {selectedPin.osaMechanism}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnatomicalSimulator;
