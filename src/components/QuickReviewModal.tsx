import React, { useState, useEffect } from 'react';
import { CognitiveTrap, RoleplayScenario } from '../types/disease';
import confetti from 'canvas-confetti';
import { 
  Zap, 
  X, 
  RotateCw, 
  ChevronRight, 
  ChevronLeft, 
  Award
} from 'lucide-react';

interface QuickReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  traps: CognitiveTrap[];
  scenarios: RoleplayScenario[];
  onCompleteReview: () => void;
}

export const QuickReviewModal: React.FC<QuickReviewModalProps> = ({
  isOpen,
  onClose,
  traps,
  scenarios,
  onCompleteReview,
}) => {
  const [selectedTraps, setSelectedTraps] = useState<CognitiveTrap[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<RoleplayScenario | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [pickedOptionId, setPickedOptionId] = useState<string | null>(null);
  const [isDone, setIsDone] = useState<boolean>(false);

  // Initialize randomized review set whenever modal opens
  useEffect(() => {
    if (isOpen) {
      // Pick 4 random traps
      const shuffledTraps = [...traps].sort(() => 0.5 - Math.random());
      const pickedTraps = shuffledTraps.slice(0, 4);
      setSelectedTraps(pickedTraps);

      // Pick 1 random scenario
      const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      setSelectedScenario(randomScenario);

      setCurrentIndex(0);
      setIsFlipped(false);
      setPickedOptionId(null);
      setIsDone(false);
    }
  }, [isOpen, traps, scenarios]);

  if (!isOpen) return null;

  const totalSteps = selectedTraps.length + 1; // 4 traps + 1 scenario = 5 steps
  const isTrapStep = currentIndex < selectedTraps.length;
  const currentTrap = isTrapStep ? selectedTraps[currentIndex] : null;

  const handleNext = () => {
    if (currentIndex < totalSteps - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      // Completed all 5 steps!
      setIsDone(true);
      onCompleteReview();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-slate-900 border border-slate-700 w-full max-w-xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-bold">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Ôn Nhanh 5 Phút Trước Phỏng Vấn</h3>
              <p className="text-[11px] text-slate-400">4 thẻ bẫy suy diễn ngẫu nhiên + 1 tình huống phỏng vấn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5">
          <div
            className="bg-gradient-to-r from-amber-500 to-orange-500 h-1.5 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 flex flex-col justify-between space-y-4">
          {!isDone ? (
            <>
              {isTrapStep && currentTrap ? (
                /* FLASHCARD STEP */
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[11px] font-semibold border border-sky-500/30">
                      Thẻ {currentIndex + 1} / 4: Bẫy suy diễn
                    </span>
                    <button
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>{isFlipped ? 'Xem mặt trước' : 'Lật xem đáp án'}</span>
                    </button>
                  </div>

                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="p-5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 rounded-2xl cursor-pointer min-h-[220px] flex flex-col justify-between transition-all"
                  >
                    {!isFlipped ? (
                      <div className="space-y-3">
                        <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                          Điều quan sát được:
                        </span>
                        <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed">
                          "{currentTrap.observation}"
                        </p>
                        <div className="pt-2 text-center text-xs text-sky-400 font-medium">
                          👉 Chạm vào đây để xem bạn KHÔNG ĐƯỢC kết luận điều gì
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 animate-fadeIn">
                        <div className="p-2.5 bg-rose-950/40 border border-rose-800/40 rounded-xl">
                          <span className="text-[10px] font-bold text-rose-400 uppercase">
                            ❌ KHÔNG ĐƯỢC KẾT LUẬN:
                          </span>
                          <p className="text-xs font-semibold text-rose-100 mt-0.5">
                            {currentTrap.fallacy}
                          </p>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-amber-400 uppercase">
                            💡 BẢN CHẤT & CÂU HỎI AN TOÀN:
                          </span>
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                            {currentTrap.why}
                          </p>
                          <div className="mt-2 text-xs text-sky-200 bg-sky-950/40 p-2.5 rounded-lg border border-sky-800/40 italic">
                            "{currentTrap.betterQuestion}"
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : selectedScenario ? (
                /* SCENARIO STEP */
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-semibold border border-purple-500/30">
                      Thử thách cuối: Kịch bản phỏng vấn
                    </span>
                    <span className="text-xs text-slate-400">{selectedScenario.userProfile.name} ({selectedScenario.userProfile.age}t)</span>
                  </div>

                  {/* Speech bubble */}
                  <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 text-xs sm:text-sm leading-relaxed">
                    "{selectedScenario.userStatement}"
                  </div>

                  {/* Question Choices */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-300">
                      Bạn sẽ chọn câu hỏi tiếp theo nào?
                    </p>

                    {selectedScenario.options.map((opt) => {
                      const isSelected = pickedOptionId === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setPickedOptionId(opt.id)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            isSelected
                              ? opt.isSafe
                                ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                                : 'bg-rose-950/40 border-rose-500 text-rose-200'
                              : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          <p className="font-medium">"{opt.text}"</p>
                          {isSelected && (
                            <div className="mt-2 pt-2 border-t border-slate-700/50 text-[11px]">
                              <p className="font-bold">{opt.feedback}</p>
                              <p className="text-slate-200 mt-1">{opt.explanation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            /* COMPLETION SCREEN */
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 text-slate-950">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Hoàn Thành Ôn Tập 5 Phút!</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto leading-relaxed">
                  Não bộ của bạn đã được kích hoạt chế độ <strong className="text-sky-400">"nhận diện bẫy suy diễn"</strong>. Bạn đã sẵn sàng bước vào buổi phỏng vấn người dùng thật mà không gán nhãn hay mớm cung.
                </p>
              </div>

              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
              >
                Sẵn sàng phỏng vấn!
              </button>
            </div>
          )}
        </div>

        {/* Modal Bottom Controls */}
        {!isDone && (
          <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>

            <span className="text-xs text-slate-400 font-medium">
              Bước {currentIndex + 1} / {totalSteps}
            </span>

            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md active:scale-95 transition-all"
            >
              <span>{currentIndex === totalSteps - 1 ? 'Hoàn tất' : 'Tiếp theo'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
