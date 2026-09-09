import React from 'react';
import { MedicalSource } from '../types/disease';
import { ExternalLink, X, BookOpen, CheckCircle2 } from 'lucide-react';

interface SourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  sources: MedicalSource[];
  title?: string;
}

export const SourceModal: React.FC<SourceModalProps> = ({
  isOpen,
  onClose,
  sources,
  title = 'Nguồn Chứng Cứ Y Khoa Chính Thức',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-slate-900 border border-slate-700 w-full max-w-2xl max-h-[85vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center space-x-2 text-sky-400">
            <BookOpen className="w-5 h-5" />
            <h3 className="font-semibold text-slate-100">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-3 bg-sky-950/40 border border-sky-800/40 rounded-xl text-xs text-sky-200/90 leading-relaxed">
            <span className="font-semibold text-sky-300">Tiêu chuẩn nguồn bắt buộc:</span> Toàn bộ thông tin được dẫn trực tiếp từ các tổ chức y tế công và hiệp hội chuyên ngành (NHLBI, AASM, USPSTF, JAMA, PubMed). Tuyệt đối không dùng blog sức khỏe thương mại hay diễn đàn.
          </div>

          {sources.map((src) => (
            <div
              key={src.id}
              className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 hover:border-sky-500/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 text-xs font-medium rounded-md border border-sky-500/30">
                      {src.organization}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">({src.year})</span>
                  </div>
                  <h4 className="font-medium text-slate-100 text-sm leading-snug">{src.title}</h4>
                  <p className="text-xs text-slate-400 italic">{src.citation}</p>
                </div>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 p-2 text-sky-400 hover:text-sky-300 bg-sky-950/40 hover:bg-sky-900/50 rounded-lg border border-sky-800/50 transition-colors flex items-center gap-1 text-xs"
                  title="Mở bài báo gốc"
                >
                  <span>Xem link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {src.keyFinding && (
                <div className="mt-3 pt-3 border-t border-slate-700/40 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <span className="font-semibold text-emerald-400">Kết luận chính:</span> {src.keyFinding}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors"
          >
            Đã hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
