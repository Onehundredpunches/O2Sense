import React, { useState } from 'react';
import { CognitiveTrap, MedicalSource } from '../types/disease';
import { SourceModal } from './SourceModal';
import { 
  RotateCw, 
  CheckCircle2, 
  HelpCircle, 
  BookOpen, 
  AlertTriangle, 
  Lightbulb, 
  MessageCircleQuestion, 
  Sparkles,
  Search
} from 'lucide-react';

interface ModuleAViewProps {
  traps: CognitiveTrap[];
  sources: MedicalSource[];
  understoodIds: string[];
  needsReviewIds: string[];
  onToggleStatus: (trapId: string, status: 'understood' | 'needsReview' | 'reset') => void;
  onOpenGlossary: (termId?: string) => void;
}

export const ModuleAView: React.FC<ModuleAViewProps> = ({
  traps,
  sources,
  understoodIds,
  needsReviewIds,
  onToggleStatus,
  onOpenGlossary,
}) => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [filterStatus, setFilterStatus] = useState<'all' | 'understood' | 'needsReview'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeSourceModal, setActiveSourceModal] = useState<{ isOpen: boolean; sourceIds: string[]; title: string }>({
    isOpen: false,
    sourceIds: [],
    title: '',
  });

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredTraps = traps.filter((trap) => {
    if (filterStatus === 'understood' && !understoodIds.includes(trap.id)) return false;
    if (filterStatus === 'needsReview' && !needsReviewIds.includes(trap.id)) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        trap.title.toLowerCase().includes(term) ||
        trap.observation.toLowerCase().includes(term) ||
        trap.fallacy.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const openSourceModal = (sourceIds: string[], title: string) => {
    setActiveSourceModal({
      isOpen: true,
      sourceIds,
      title,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-teal-50 via-sky-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-teal-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="max-w-2xl space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>8 HIỂU LẦM KINH ĐIỂN VỀ NGÁY & SPO2</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Phá Giải 8 Hiểu Lầm Thường Gặp
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Mặt trước là điều mắt thấy tai nghe. Chạm lật mặt sau để thấy bản chất y sinh và cách hỏi chuyện an toàn, không kết luận vội.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenGlossary()}
              className="px-3 py-2 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition-all"
            >
              Mở từ điển ẩn dụ
            </button>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <span>Đã hiểu:</span>
              <span className="text-teal-600 dark:text-teal-400 font-black text-sm">{understoodIds.length} / {traps.length}</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo từ khóa (SpO2, ngáy to, mệt mỏi, phụ nữ)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-2 rounded-xl font-bold transition-all ${
                filterStatus === 'all'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Tất cả ({traps.length})
            </button>
            <button
              onClick={() => setFilterStatus('understood')}
              className={`px-3 py-2 rounded-xl font-bold transition-all ${
                filterStatus === 'understood'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Đã hiểu ({understoodIds.length})
            </button>
            <button
              onClick={() => setFilterStatus('needsReview')}
              className={`px-3 py-2 rounded-xl font-bold transition-all ${
                filterStatus === 'needsReview'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Cần ôn ({needsReviewIds.length})
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Flashcards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTraps.map((trap) => {
          const isFlipped = !!flippedCards[trap.id];
          const isUnderstood = understoodIds.includes(trap.id);
          const isNeedsReview = needsReviewIds.includes(trap.id);

          return (
            <div
              key={trap.id}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              {/* Card Header & Status Badges */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  {trap.category.toUpperCase()}
                </span>
                <div className="flex items-center gap-1.5">
                  {isUnderstood && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                      ✓ Đã hiểu
                    </span>
                  )}
                  {isNeedsReview && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      Cần ôn lại
                    </span>
                  )}
                </div>
              </div>

              {/* Front / Back Toggle Body */}
              <div className="min-h-[160px] space-y-3">
                {!isFlipped ? (
                  /* FRONT: Observation */
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {trap.title}
                    </h3>
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Điều quan sát được từ thiết bị / người dùng:
                      </p>
                      <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                        "{trap.observation}"
                      </p>
                    </div>
                  </div>
                ) : (
                  /* BACK: Fallacy & Truth & Better Question */
                  <div className="space-y-3 text-xs sm:text-sm animate-fadeIn">
                    <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-900/60 text-rose-900 dark:text-rose-200">
                      <p className="font-bold flex items-center gap-1.5 text-xs text-rose-700 dark:text-rose-400">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>KHÔNG ĐƯỢC SUY DIỄN:</span>
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed">{trap.fallacy}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200/80 dark:border-teal-900/60 text-teal-900 dark:text-teal-200">
                      <p className="font-bold flex items-center gap-1.5 text-xs text-teal-700 dark:text-teal-400">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>BẢN CHẤT Y SINH:</span>
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed">{trap.why}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200/80 dark:border-sky-900/60 text-sky-900 dark:text-sky-200">
                      <p className="font-bold flex items-center gap-1.5 text-xs text-sky-700 dark:text-sky-400">
                        <MessageCircleQuestion className="w-3.5 h-3.5" />
                        <span>CÂU HỎI AN TOÀN ĐỀ XUẤT:</span>
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed font-medium">"{trap.betterQuestion}"</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => toggleFlip(trap.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all"
                >
                  <RotateCw className="w-3.5 h-3.5 text-teal-600" />
                  <span>{isFlipped ? 'Xem mặt trước' : 'Lật xem bản chất'}</span>
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onToggleStatus(trap.id, isUnderstood ? 'reset' : 'understood')}
                    className={`p-2 rounded-xl text-xs font-bold transition-all ${
                      isUnderstood
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-slate-800'
                    }`}
                    title={isUnderstood ? 'Bỏ đánh dấu Đã hiểu' : 'Đánh dấu Đã hiểu'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onToggleStatus(trap.id, isNeedsReview ? 'reset' : 'needsReview')}
                    className={`p-2 rounded-xl text-xs font-bold transition-all ${
                      isNeedsReview
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800'
                    }`}
                    title={isNeedsReview ? 'Bỏ đánh dấu Cần ôn' : 'Đánh dấu Cần ôn'}
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => openSourceModal(trap.sourceIds, trap.title)}
                    className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                    title="Xem trích dẫn y khoa"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Citations Modal */}
      <SourceModal
        isOpen={activeSourceModal.isOpen}
        onClose={() => setActiveSourceModal({ isOpen: false, sourceIds: [], title: '' })}
        title={activeSourceModal.title}
        sources={sources.filter((s) => activeSourceModal.sourceIds.includes(s.id))}
      />
    </div>
  );
};
