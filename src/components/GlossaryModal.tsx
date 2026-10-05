import React, { useState } from 'react';
import { GlossaryItem } from '../types/disease';
import { Search, Sparkles, BookOpen, X, HelpCircle } from 'lucide-react';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  glossary: GlossaryItem[];
  initialTermId?: string | null;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({
  isOpen,
  onClose,
  glossary,
  initialTermId,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTermId, setSelectedTermId] = useState<string>(
    initialTermId || (glossary[0] ? glossary[0].id : '')
  );

  if (!isOpen) return null;

  const filteredItems = glossary.filter(
    (item) =>
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vietnameseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.metaphor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeItem = glossary.find((g) => g.id === selectedTermId) || filteredItems[0] || glossary[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Từ Điển Ẩn Dụ Y Khoa 1-Chạm</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                15 thuật ngữ then chốt được giải mã bằng hình ảnh đời thường — Ai cũng hiểu!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-3 sm:p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên thuật ngữ, tên tiếng Việt, hoặc ẩn dụ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Modal Body: Split view on desktop, stacked on mobile */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* List column */}
          <div className="md:col-span-5 border-r border-slate-100 dark:border-slate-800 overflow-y-auto max-h-[220px] md:max-h-[460px] p-2 space-y-1 bg-slate-50/40 dark:bg-slate-950/20">
            {filteredItems.map((item) => {
              const isSelected = item.id === activeItem?.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedTermId(item.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-teal-500 text-white font-semibold shadow-md shadow-teal-500/20'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="truncate pr-2">
                    <p className="text-xs font-bold leading-snug">{item.vietnameseName}</p>
                    <p className={`text-[11px] truncate ${isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
                      {item.term}
                    </p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {item.metaphor.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detail column */}
          <div className="md:col-span-7 p-4 sm:p-6 overflow-y-auto max-h-[340px] md:max-h-[460px] space-y-4">
            {activeItem ? (
              <div className="space-y-4">
                {/* Term title & Metaphor badge */}
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-semibold mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ẩn dụ: {activeItem.metaphor}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {activeItem.vietnameseName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">
                    Thuật ngữ y khoa: {activeItem.term}
                  </p>
                </div>

                {/* Plain language definition */}
                <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-slate-800/60 border border-teal-100 dark:border-slate-700/60 space-y-1.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Hiểu Bằng Lời Bình Dân:</span>
                  </p>
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {activeItem.plainDefinition}
                  </p>
                </div>

                {/* Why it matters to O2Ring user */}
                <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700/60 space-y-1.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Tại Sao Bạn Cần Biết Điều Này?</span>
                  </p>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {activeItem.whyItMatters}
                  </p>
                </div>

                {/* Clinical detail */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    Bản chất cơ chế sinh lý (Dành cho tra cứu sâu):
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                    {activeItem.clinicalDetail}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center p-8 text-slate-400 text-sm">
                Không tìm thấy thuật ngữ phù hợp.
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Mẹo: Bất cứ lúc nào thấy chữ gạch chân trong app, chạm vào để mở thẻ này!
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
