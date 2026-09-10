import React, { useState } from 'react';
import { SpO2WaveformPattern } from '../types/disease';
import { 
  Activity, 
  ShieldCheck, 
  ShieldAlert,
  CheckCircle2, 
  Sparkles, 
  Info,
  Clock,
  Share2,
  Stethoscope,
  Lightbulb
} from 'lucide-react';

interface WaveformDetectiveViewProps {
  patterns: SpO2WaveformPattern[];
  onOpenGlossary: (termId?: string) => void;
}

export const WaveformDetectiveView: React.FC<WaveformDetectiveViewProps> = ({
  patterns,
  onOpenGlossary,
}) => {
  const [selectedPatternId, setSelectedPatternId] = useState<string>(patterns[0]?.id || 'pattern_sawtooth');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const activePattern = patterns.find((p) => p.id === selectedPatternId) || patterns[0];

  const handleToggleCheck = (index: number) => {
    const key = `${activePattern.id}_${index}`;
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopyQuestions = () => {
    const textToCopy = `Bác sĩ cho tôi hỏi về dữ liệu SpO2 ban đêm đo bằng nhẫn của tôi:\n1. Đặc điểm đồ thị quan sát: ${activePattern.name}\n2. Gợi ý tham khảo: ${activePattern.primaryCause}\n3. Câu hỏi: Dữ liệu này có cần kết hợp xét nghiệm chẩn đoán như đo đa ký giấc ngủ (PSG) hoặc đo chức năng hô hấp không?`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 space-y-6 pb-28 md:pb-16">
      {/* Top Banner: Reassuring & Anti-Panic Header */}
      <div className="bg-gradient-to-r from-teal-50 via-sky-50 to-indigo-50 dark:from-slate-900 dark:via-teal-950/40 dark:to-slate-900 border border-teal-200/80 dark:border-teal-900/60 rounded-3xl p-5 sm:p-8 shadow-sm">
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/80 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 text-xs font-semibold border border-teal-200 dark:border-teal-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>KHOA HỌC DỮ LIỆU ĐEO TAY • BẢO VỆ TÂM LÝ NGƯỜI DÙNG</span>
            </div>
            <button
              onClick={() => onOpenGlossary('term_spo2')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-slate-700 shadow-sm hover:bg-teal-50 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Xem ẩn dụ khoa học SpO2</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Bộ Giải Mã Đồ Thị SpO2 Ban Đêm
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Sáng thức dậy thấy nhẫn O2Ring báo tụt SpO2? <strong className="text-teal-700 dark:text-teal-300">Khoan hoảng hốt!</strong> Dữ liệu SpO₂ từ wearable có thể giúp quan sát xu hướng, nhưng không đủ để tự chẩn đoán hoặc loại trừ ngưng thở khi ngủ. Tụt SpO₂ đêm có nhiều nguyên nhân khác nhau (từ tư thế tì đè ngón tay, đến rượu bia, ngáy to hoặc bệnh hô hấp/tim mạch). Hãy hiểu đúng nguyên tắc <strong className="text-rose-600 dark:text-rose-400">Dạng sóng ≠ Chẩn đoán bệnh</strong>.
          </p>
        </div>
      </div>

      {/* 4 Interactive Pattern Selector Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {patterns.map((p) => {
          const isSelected = p.id === activePattern.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPatternId(p.id)}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 border-teal-500 ring-2 ring-teal-500/20 shadow-md'
                  : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-start gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                  <Activity className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                    p.category === 'sensor_artifact' ? 'text-emerald-500' :
                    p.category === 'airway_osa' ? 'text-rose-500' :
                    p.category === 'pulmonary' ? 'text-amber-500' : 'text-purple-500'
                  }`} />
                  <span className="leading-snug font-bold">{p.name.split('(')[0].trim()}</span>
                </div>
                {p.isArtifact && (
                  <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    Điểm giảm đơn lẻ — cần kiểm tra chất lượng tín hiệu
                  </span>
                )}
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {p.shapeTitle}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span>{p.frequency.split(' ')[0]} {p.frequency.split(' ')[1]}</span>
                <span className="font-semibold text-teal-600 dark:text-teal-400">Xem chi tiết →</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Pattern != Diagnosis Global Callout */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <div>
            <span className="font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider">NGUYÊN TẮC Y KHOA: Dạng sóng ≠ Chẩn đoán bệnh</span>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
              Dạng sóng SpO₂ giúp quan sát hình thái dao động nhưng không đủ để xác định nguyên nhân hoặc chẩn đoán xác định bệnh lý hô hấp.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:items-end gap-0.5 self-start sm:self-center flex-shrink-0">
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-bold">
            O2Sense Medical Rule CMC-09
          </span>
          <span className="text-[9px] text-amber-700/80 dark:text-amber-400/80 font-medium">
            Aligned with AASM diagnostic guidance
          </span>
        </div>
      </div>

      {/* Main Interactive Detective Canvas & Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Waveform Visualizer */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider mb-1 ${
                activePattern.category === 'sensor_artifact' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                activePattern.category === 'airway_osa' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                activePattern.category === 'pulmonary' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
              }`}>
                {activePattern.primaryCause}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {activePattern.name}
              </h2>
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <Clock className="w-3.5 h-3.5 text-teal-500" />
              <span>{activePattern.typicalDipDuration}</span>
            </div>
          </div>

          {/* SVG Waveform Simulation Stage (Dedicated Non-Overlapping Layout) */}
          <div className="bg-slate-950 rounded-3xl p-4 sm:p-5 overflow-hidden shadow-inner border border-slate-800 space-y-3">
            {/* Top SpO2 Level Indicator Legend (MED-P0-019) */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80 text-[11px]">
              <span className="text-slate-400 font-mono text-[10px] sm:text-xs uppercase tracking-wider font-semibold">
                Thang Đo SpO2 (Giá trị tham chiếu):
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1 text-slate-300 font-mono text-[10px] sm:text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>≥95% (Tham chiếu lúc thức)</span>
                </span>
                <span className="inline-flex items-center gap-1 text-amber-300 font-mono text-[10px] sm:text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Đường chuẩn 90% (Quan sát T90)</span>
                </span>
              </div>
            </div>

            {/* Visual Waveform Canvas with Dedicated Y-Axis */}
            <div className="flex items-stretch gap-2.5 h-44 sm:h-52">
              {/* Dedicated Left Y-Axis */}
              <div className="w-12 sm:w-14 flex flex-col justify-between py-1 text-right text-[10px] sm:text-[11px] font-mono select-none flex-shrink-0">
                <span className="text-emerald-400 font-bold">100%</span>
                <span className="text-sky-400">95%</span>
                <span className="text-amber-400 font-bold">90%</span>
                <span className="text-rose-400 font-bold">80%</span>
              </div>

              {/* Waveform SVG Plot Area */}
              <div className="flex-1 relative bg-slate-900/40 rounded-2xl border border-slate-800/70 p-2 overflow-hidden flex items-center">
                {/* SVG Graph */}
                <svg viewBox="0 10 130 65" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="130" y2="20" stroke="#334155" strokeWidth="0.6" strokeDasharray="2,2" opacity="0.4" />
                  <line x1="0" y1="35" x2="130" y2="35" stroke="#334155" strokeWidth="0.6" strokeDasharray="2,2" opacity="0.4" />
                  {/* 90% Threshold Reference Line */}
                  <line x1="0" y1="50" x2="130" y2="50" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="3,2" opacity="0.8" />
                  <line x1="0" y1="65" x2="130" y2="65" stroke="#334155" strokeWidth="0.6" strokeDasharray="2,2" opacity="0.4" />

                  {/* 90% Threshold Pill Label */}
                  <rect x="90" y="44" width="38" height="11" rx="3" fill="#451a03" stroke="#d97706" strokeWidth="0.6" opacity="0.9" />
                  <text x="109" y="52" textAnchor="middle" fill="#fef3c7" fontSize="4.5" fontWeight="bold" fontFamily="sans-serif">Mốc chuẩn 90%</text>

                  {/* Animated Glowing Waveform Path */}
                  <path
                    d={activePattern.sampleSvgWave}
                    fill="none"
                    stroke={activePattern.badgeColor === 'emerald' ? '#10b981' : activePattern.badgeColor === 'rose' ? '#f43f5e' : activePattern.badgeColor === 'amber' ? '#f59e0b' : '#a855f7'}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="filter drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
                  />

                  {/* Pulsing indicator at dip */}
                  <circle cx="65" cy="55" r="3.5" fill="#f43f5e" className="animate-ping" opacity="0.75" />
                  <circle cx="65" cy="55" r="2.2" fill="#ffffff" />
                </svg>
              </div>
            </div>

            {/* Bottom Timeline Axis */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono">23:00 (Nửa đêm)</span>
              <span className="text-teal-400 font-mono font-medium px-2 py-0.5 rounded-full bg-slate-900 border border-teal-900/60 text-[10px] sm:text-[11px]">
                {activePattern.frequency}
              </span>
              <span className="font-mono">06:00 (Sáng dậy)</span>
            </div>

            {/* Context footnote */}
            <p className="text-[10px] text-slate-500 italic pt-1">
              * Ý nghĩa lâm sàng của SpO₂ phụ thuộc vào đường nền cá nhân, triệu chứng, bệnh đồng mắc, độ cao và giới hạn kỹ thuật của cảm biến.
            </p>
          </div>

          {/* Everyday Metaphor Box */}
          <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-slate-800/60 border border-teal-200/70 dark:border-slate-700/80 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800 dark:text-teal-300">
              <Lightbulb className="w-4 h-4" />
              <span>Ẩn Dụ Đời Thường Dễ Hiểu:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {activePattern.analogy}
            </p>
          </div>

          {/* Mechanism Explanation */}
          <div className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Info className="w-4 h-4 text-sky-500" />
              <span>Tại sao dạng sóng lại có hình thái này?</span>
            </p>
            <p>{activePattern.mechanismWhy}</p>
          </div>
        </div>

        {/* Right: Anti-Panic Reassurance & Interactive Action Planner */}
        <div className="lg:col-span-5 space-y-5">
          {/* Reassuring Message Banner */}
          <div className={`p-4 sm:p-5 rounded-3xl border shadow-sm ${
            activePattern.isArtifact
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80'
              : 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/80'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl text-white flex-shrink-0 ${
                activePattern.isArtifact ? 'bg-emerald-600' : 'bg-sky-600'
              }`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className={`text-sm font-bold ${
                  activePattern.isArtifact ? 'text-emerald-900 dark:text-emerald-200' : 'text-sky-900 dark:text-sky-200'
                }`}>
                  Thông Điệp An Tâm & Khoa Học
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activePattern.reassuringMessage}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Exclusion Checklist (Tự kiểm tra 1 phút) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Câu Hỏi Tự Kiểm Tra Nhanh (1 Phút)</span>
              </h3>
              <span className="text-[11px] text-slate-400">Chọn dấu hiệu của bạn</span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hãy bấm chọn nếu bạn nhận thấy những yếu tố dưới đây để tự khoanh vùng nguyên nhân:
            </p>

            <div className="space-y-2 pt-1">
              {activePattern.exclusionChecklist.map((q, idx) => {
                const key = `${activePattern.id}_${idx}`;
                const isChecked = !!checkedItems[key];
                return (
                  <button
                    key={idx}
                    onClick={() => handleToggleCheck(idx)}
                    className={`w-full text-left p-3 rounded-2xl border text-xs sm:text-sm transition-all flex items-start gap-2.5 ${
                      isChecked
                        ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-300 dark:border-teal-700 text-teal-900 dark:text-teal-100 font-medium'
                        : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md mt-0.5 flex items-center justify-center flex-shrink-0 border transition-all ${
                      isChecked
                        ? 'bg-teal-600 border-teal-600 text-white'
                        : 'border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}>
                      {isChecked && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                    <span className="leading-snug">{q}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Steps (Việc cần làm cụ thể) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Kế Hoạch Hành Động Thực Tế</span>
            </h3>

            <div className="space-y-3 text-xs sm:text-sm">
              {/* Step 1: Immediate Tonight */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                <div className="w-6 h-6 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-xs">Việc làm ngay tối nay:</p>
                  <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5 leading-relaxed">
                    {activePattern.actionSteps.immediate}
                  </p>
                </div>
              </div>

              {/* Step 2: Monitoring */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                <div className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-xs">Theo dõi khoa học nhiều đêm:</p>
                  <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5 leading-relaxed">
                    {activePattern.actionSteps.monitoring}
                  </p>
                </div>
              </div>

              {/* Step 3: Clinical */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                <div className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-xs">Khi nào cần gặp bác sĩ:</p>
                  <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5 leading-relaxed">
                    {activePattern.actionSteps.clinical}
                  </p>
                </div>
              </div>
            </div>

            {/* Copy Questions to Ask Doctor Button */}
            <button
              onClick={handleCopyQuestions}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{isCopied ? '✓ Đã sao chép câu hỏi bỏ túi cho Bác sĩ!' : 'Sao chép gợi ý câu hỏi để trao đổi với Bác sĩ'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
