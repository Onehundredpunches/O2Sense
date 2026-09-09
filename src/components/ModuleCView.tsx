import React, { useState, useEffect } from 'react';
import { MechanismStep, MedicalSource } from '../types/disease';
import { SourceModal } from './SourceModal';
import { AnatomyScene3D } from './AnatomyScene3D';
import { AnatomicalSimulator } from './AnatomicalSimulator';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  BookOpen, 
  Heart, 
  Wind, 
  Brain, 
  UserCheck, 
  Microscope,
  Sparkles,
  Box,
  Activity,
  Lightbulb,
  HelpCircle
} from 'lucide-react';

interface ModuleCViewProps {
  steps: MechanismStep[];
  sources: MedicalSource[];
  onOpenGlossary: (termId?: string) => void;
}

export const ModuleCView: React.FC<ModuleCViewProps> = ({ steps, sources, onOpenGlossary }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [renderMode, setRenderMode] = useState<'anatomical' | '3d'>('anatomical');
  const [explanationMode, setExplanationMode] = useState<'layman' | 'expert'>('layman');
  const [activeSourceModal, setActiveSourceModal] = useState<{ isOpen: boolean; sourceIds: string[]; title: string }>({
    isOpen: false,
    sourceIds: [],
    title: '',
  });

  const activeStep = steps[currentStepIndex] || steps[0];

  // Auto-play timer
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : 0));
      }, 7000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const handleNext = () => {
    setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentStepIndex((prev) => (prev > 0 ? prev - 1 : steps.length - 1));
  };

  const currentModalSources = sources.filter((s) => activeStep.sourceIds.includes(s.id));

  // Determine visual parameters based on current visual state
  const isBrainArousal = activeStep.visualState.brainArousal;
  const isSympathetic = activeStep.visualState.sympatheticSurge;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 space-y-6 pb-28 md:pb-16">
      {/* Header Banner: Luminous Theme */}
      <div className="bg-gradient-to-r from-teal-50 via-sky-50 to-indigo-50 dark:from-slate-900 dark:via-teal-950/40 dark:to-slate-900 border border-teal-200/80 dark:border-teal-900/60 rounded-3xl p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HÀNH TRÌNH 5 BƯỚC SINH LÝ HỌC ĐỘNG</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Chuyện Gì Xảy Ra Trong Cơ Thể Khi Ngủ?
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
              Từ thông khí phế nang → vòm họng rung ngáy → cuống lưỡi sập cơ học → chuông báo cháy não bộ vi thức giấc kéo mở đường thở.
            </p>
          </div>

          {/* Mode Switcher: Layman vs Medical Expert */}
          <div className="bg-white/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1 flex items-center flex-shrink-0 shadow-sm">
            <button
              onClick={() => setExplanationMode('layman')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                explanationMode === 'layman'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Dành cho người nhà</span>
            </button>
            <button
              onClick={() => setExplanationMode('expert')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                explanationMode === 'expert'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Microscope className="w-3.5 h-3.5" />
              <span>Cơ chế chuyên sâu</span>
            </button>
          </div>
        </div>

        {/* Step Progression Pills (Balanced 5-column grid on mobile, flex on desktop) */}
        <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-800 grid grid-cols-5 gap-1 sm:flex sm:items-center sm:gap-2">
          {steps.map((st, idx) => {
            const isCurrent = idx === currentStepIndex;
            return (
              <button
                key={st.step}
                onClick={() => {
                  setCurrentStepIndex(idx);
                  setIsPlaying(false);
                }}
                className={`px-1.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 ${
                  isCurrent
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md ring-2 ring-teal-500/30'
                    : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900'
                }`}
              >
                <span className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full text-[9px] sm:text-[10px] flex items-center justify-center font-bold ${
                  isCurrent ? 'bg-white/20 dark:bg-slate-900/20' : 'bg-slate-200 dark:bg-slate-800'
                }`}>
                  {st.step}
                </span>
                <span className="sm:hidden font-mono text-[10px]">Pha {st.step}</span>
                <span className="hidden sm:inline truncate">{st.title.split('&')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left/Top: Interactive Animated Stage (2.5D or 3D) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          {/* Top Stage Bar: Live Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Airflow */}
            <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-2.5 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0">
                <Wind className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium">Luồng khí</p>
                <p className={`text-xs font-bold ${activeStep.metrics.airflowPercent === 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {activeStep.metrics.airflowPercent}% {activeStep.metrics.airflowPercent === 0 && '(TẮC)'}
                </p>
              </div>
            </div>

            {/* SpO2 */}
            <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-2.5 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-[10px]">
                O₂
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium">O2Ring SpO2</p>
                <p className={`text-xs font-bold ${activeStep.metrics.spo2Percent < 90 ? 'text-rose-600 dark:text-rose-400 animate-pulse' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {activeStep.metrics.spo2Percent}%
                </p>
              </div>
            </div>

            {/* Heart Rate */}
            <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-2.5 flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isSympathetic ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400 animate-ping' : 'bg-pink-100 dark:bg-pink-950/80 text-pink-600 dark:text-pink-400'
              }`}>
                <Heart className="w-4 h-4 fill-current" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium">Nhịp tim</p>
                <p className={`text-xs font-bold ${isSympathetic ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
                  {activeStep.metrics.heartRateBpm} bpm
                </p>
              </div>
            </div>

            {/* Arousal / EEG State */}
            <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-2.5 flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isBrainArousal ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300' : 'bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400'
              }`}>
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium">Điện não (EEG)</p>
                <p className={`text-[11px] font-bold truncate ${isBrainArousal ? 'text-amber-600 dark:text-amber-300 animate-pulse' : 'text-slate-800 dark:text-slate-200'}`}>
                  {activeStep.metrics.arousalStatus}
                </p>
              </div>
            </div>
          </div>

          {/* 3D WebGL vs 2D Schematic Toggle Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 px-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Mô Phỏng Không Gian Giải Phẫu</span>
            </span>
            <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs w-full sm:w-auto">
              <button
                onClick={() => setRenderMode('anatomical')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                  renderMode === 'anatomical'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-teal-600" />
                <span>Mặt Cắt Y Khoa 2.5D</span>
              </button>
              <button
                onClick={() => setRenderMode('3d')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                  renderMode === '3d'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>3D WebGL (Xoay 360°)</span>
              </button>
            </div>
          </div>

          {/* Main Visualization Stage */}
          <div className="w-full">
            {renderMode === 'anatomical' ? (
              <AnatomicalSimulator
                step={activeStep.step}
                airwayStatus={activeStep.visualState.airwayStatus}
                airflowPercent={activeStep.metrics.airflowPercent}
                spo2Percent={activeStep.metrics.spo2Percent}
                isBrainArousal={isBrainArousal}
                isSympathetic={isSympathetic}
              />
            ) : (
              <AnatomyScene3D
                step={activeStep.step}
                airwayStatus={activeStep.visualState.airwayStatus}
                airflowPercent={activeStep.metrics.airflowPercent}
                spo2Percent={activeStep.metrics.spo2Percent}
                isBrainArousal={isBrainArousal}
                isSympathetic={isSympathetic}
              />
            )}
          </div>

          {/* Controls: Play/Pause, Step navigation */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Tạm dừng' : 'Tự động chạy'}</span>
              </button>

              <button
                onClick={() => {
                  setCurrentStepIndex(0);
                  setIsPlaying(false);
                }}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Bắt đầu lại"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrev}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                title="Bước trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-bold px-2">
                Bước {currentStepIndex + 1} / {steps.length}
              </span>
              <button
                onClick={handleNext}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                title="Bước tiếp theo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right/Bottom: Metaphors & Explanations */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Step Metaphor Card */}
          {activeStep.metaphor && (
            <div className="p-4 sm:p-5 rounded-3xl bg-teal-50/80 dark:bg-slate-900 border border-teal-200/80 dark:border-teal-900/60 shadow-sm space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Ẩn Dụ: {activeStep.metaphor.name}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {activeStep.metaphor.analogy}
              </p>
            </div>
          )}

          {/* Explanation Box (Dual Mode) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                  {activeStep.step}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {activeStep.title}
                </h3>
              </div>
              <button
                onClick={() => onOpenGlossary()}
                className="text-[11px] text-teal-600 dark:text-teal-400 font-bold hover:underline flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Từ điển</span>
              </button>
            </div>

            {explanationMode === 'layman' ? (
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  <span>Cách Giải Thích Cho Người Nhà (Không Chuyên Môn):</span>
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                  "{activeStep.laymanExplanation}"
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
                  <Microscope className="w-4 h-4" />
                  <span>Cơ Chế Y Sinh Chuyên Sâu (Medical Detail):</span>
                </p>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  {activeStep.physiologicalDetail}
                </p>
              </div>
            )}

            {/* Citations & Evidence */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {currentModalSources.length} nguồn y văn xác thực (AASM, NHLBI, JAMA)
              </span>
              <button
                onClick={() =>
                  setActiveSourceModal({
                    isOpen: true,
                    sourceIds: activeStep.sourceIds,
                    title: `Nguồn y khoa bước ${activeStep.step}: ${activeStep.title}`,
                  })
                }
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Xem trích dẫn</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Source Modal */}
      <SourceModal
        isOpen={activeSourceModal.isOpen}
        onClose={() => setActiveSourceModal({ isOpen: false, sourceIds: [], title: '' })}
        title={activeSourceModal.title}
        sources={currentModalSources}
      />
    </div>
  );
};
