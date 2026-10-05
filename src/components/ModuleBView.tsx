import React, { useState } from 'react';
import { RoleplayScenario, ScenarioOption } from '../types/disease';
import confetti from 'canvas-confetti';
import { 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  PenTool, 
  Check,
  MessageSquare
} from 'lucide-react';

interface ModuleBViewProps {
  scenarios: RoleplayScenario[];
  completedIds: string[];
  savedAnswers: Record<string, { selectedOptionId: string; reflection: string; timestamp: string }>;
  onSaveScenario: (scenarioId: string, optionId: string, reflection: string) => void;
  userMode: 'general' | 'founder';
  onOpenGlossary: (termId?: string) => void;
}

export const ModuleBView: React.FC<ModuleBViewProps> = ({
  scenarios,
  completedIds,
  savedAnswers,
  onSaveScenario,
  userMode,
  onOpenGlossary,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(scenarios[0]?.id || '');
  const [selectedOption, setSelectedOption] = useState<ScenarioOption | null>(null);
  const [reflectionText, setReflectionText] = useState<string>('');
  const [showSavedFeedback, setShowSavedFeedback] = useState<boolean>(false);

  const activeScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];
  const isCompleted = completedIds.includes(activeScenario.id);

  // When switching scenario, load saved reflection if exists
  const handleSelectScenario = (id: string) => {
    setSelectedScenarioId(id);
    setSelectedOption(null);
    setShowSavedFeedback(false);

    if (savedAnswers[id]) {
      const saved = savedAnswers[id];
      const opt = activeScenario.options.find((o) => o.id === saved.selectedOptionId);
      if (opt) setSelectedOption(opt);
      setReflectionText(saved.reflection);
    } else {
      setReflectionText('');
    }
  };

  const handlePickOption = (option: ScenarioOption) => {
    setSelectedOption(option);
  };

  const handleCompleteScenario = () => {
    if (!selectedOption) return;
    if (reflectionText.trim().length < 10) {
      alert('Vui lòng viết ít nhất 1-2 câu đúc kết trước khi hoàn tất tình huống này!');
      return;
    }

    onSaveScenario(activeScenario.id, selectedOption.id, reflectionText);
    setShowSavedFeedback(true);

    if (selectedOption.isSafe) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }

    setTimeout(() => setShowSavedFeedback(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-purple-50 via-sky-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-purple-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="max-w-2xl space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>6 TÌNH HUỐNG THỰC TẾ & LUYỆN HỎI ĐÚNG</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {userMode === 'founder' ? 'Thực Hành Nhập Vai Đối Thoại Người Dùng' : 'Tình Huống Thực Tế Ở Người Thân'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Luyện phản xạ nhận diện ngay khi câu hỏi hoặc lời tư vấn đang bị bẫy "mớm cung", gán nhãn bệnh vội vàng, hoặc tư vấn y tế trái phép.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenGlossary()}
              className="px-3 py-2 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-all"
            >
              Mở từ điển ẩn dụ
            </button>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <span>Đã xong:</span>
              <span className="text-purple-600 dark:text-purple-400 font-black text-sm">{completedIds.length} / {scenarios.length}</span>
            </div>
          </div>
        </div>

        {/* 6 Scenario Selector Pills */}
        <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {scenarios.map((sc, idx) => {
            const isSelected = sc.id === activeScenario.id;
            const isDone = completedIds.includes(sc.id);

            return (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc.id)}
                className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md ring-2 ring-purple-500/30'
                    : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900'
                }`}
              >
                <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                  isDone ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}>
                  {isDone ? '✓' : idx + 1}
                </span>
                <span>{sc.userProfile.name}</span>
                <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">
                  ({sc.difficulty})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Scenario Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: User Statement & Persona */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {activeScenario.userProfile.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {activeScenario.userProfile.age} tuổi • {activeScenario.userProfile.gender} • {activeScenario.userProfile.occupation}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {activeScenario.userProfile.deviceUsed}
            </span>
          </div>

          {/* Context Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <strong className="text-slate-800 dark:text-slate-200">Bối cảnh: </strong>
            {activeScenario.context}
          </div>

          {/* Direct Speech Bubble */}
          <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-900/60 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Lời Người Dùng Chia Sẻ:</span>
            </p>
            <blockquote className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 italic leading-relaxed">
              "{activeScenario.userStatement}"
            </blockquote>
          </div>
        </div>

        {/* Right: Question Options & Feedback */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Bạn sẽ hỏi câu tiếp theo như thế nào?
            </h4>

            {/* 3-4 Options */}
            <div className="space-y-2.5">
              {activeScenario.options.map((opt) => {
                const isSelected = selectedOption?.id === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handlePickOption(opt)}
                    className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm transition-all ${
                      isSelected
                        ? opt.isSafe
                          ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 ring-2 ring-teal-500/20 text-teal-950 dark:text-teal-100'
                          : 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 ring-2 ring-rose-500/20 text-rose-950 dark:text-rose-100'
                        : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 ${
                        isSelected
                          ? opt.isSafe ? 'bg-teal-600 text-white' : 'bg-rose-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {opt.id}
                      </span>
                      <div className="space-y-1">
                        <p className="font-medium leading-snug">{opt.text}</p>
                        {isSelected && (
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            opt.isSafe ? 'bg-teal-200 text-teal-900 dark:bg-teal-900 dark:text-teal-200' : 'bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-200'
                          }`}>
                            {opt.typeLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Instant Option Feedback */}
            {selectedOption && (
              <div className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-1.5 animate-fadeIn ${
                selectedOption.isSafe
                  ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200'
                  : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
              }`}>
                <div className="flex items-center gap-1.5 font-bold">
                  {selectedOption.isSafe ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      <span>Tuyệt vời! Cách hỏi rất khách quan & an toàn:</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>Cảnh báo: Bẫy phỏng vấn nguy hiểm!</span>
                    </>
                  )}
                </div>
                <p className="text-xs leading-relaxed">{selectedOption.feedback}</p>
              </div>
            )}
          </div>

          {/* Mandatory Reflection Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <PenTool className="w-3.5 h-3.5 text-purple-600" />
                <span>Tự Viết 1-2 Câu Đúc Kết Của Bạn (Bắt Buộc):</span>
              </label>
              {isCompleted && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Đã lưu vào máy
                </span>
              )}
            </div>

            <textarea
              rows={2}
              placeholder={activeScenario.reflectionPrompt}
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              className="w-full p-3 rounded-2xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              onClick={handleCompleteScenario}
              disabled={!selectedOption}
              className={`w-full py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
                selectedOption
                  ? 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer active:scale-95'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {showSavedFeedback ? '✓ Đã Lưu Đúc Kết Thành Công!' : 'Lưu Đúc Kết & Hoàn Tất Tình Huống'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
