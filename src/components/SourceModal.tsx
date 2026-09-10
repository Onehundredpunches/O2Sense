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
          <div className="p-3.5 bg-sky-950/40 border border-sky-800/40 rounded-xl text-xs text-sky-200/90 leading-relaxed">
            <span className="font-semibold text-sky-300">Phân cấp nguồn chứng cứ:</span> Nguồn được ưu tiên theo loại bằng chứng: guideline/consensus từ cơ quan và hiệp hội chuyên môn; nghiên cứu bình duyệt trên các tạp chí khoa học; và cơ sở dữ liệu dùng để truy xuất tài liệu.
          </div>

          {sources.map((src) => {
            const orgType = src.organization.includes('AASM')
              ? 'Hiệp hội chuyên môn / Guideline'
              : src.organization.includes('NHLBI')
              ? 'Viện nghiên cứu y tế công'
              : src.organization.includes('USPSTF')
              ? 'Hội đồng khuyến cáo độc lập'
              : 'Tạp chí y khoa bình duyệt';

            return (
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
                      <span className="px-2 py-0.5 bg-slate-700/60 text-slate-300 text-[10px] font-semibold rounded-md">
                        {orgType}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">({src.year})</span>
                    </div>
                    <h4 className="font-medium text-slate-100 text-sm leading-snug">{src.title}</h4>
                    {src.authors && (
                      <p className="text-xs text-slate-300 font-medium">{src.authors}</p>
                    )}
                    <p className="text-xs text-slate-400 italic">
                      {src.journal && !src.citation.includes(src.journal) ? `${src.journal}. ` : ''}{src.citation}
                    </p>
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {src.pmid && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-700/80 text-sky-300 border border-slate-600/60">
                          PMID: {src.pmid}
                        </span>
                      )}
                      {src.pmcid && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-700/80 text-sky-300 border border-slate-600/60">
                          PMCID: {src.pmcid}
                        </span>
                      )}
                      {src.doi && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-700/80 text-teal-300 border border-slate-600/60">
                          DOI: {src.doi}
                        </span>
                      )}
                      {src.evidenceType && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/60">
                          {src.evidenceType}
                        </span>
                      )}
                    </div>
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

                {src.supportedClaims && (
                  <div className="mt-2.5 pt-2 border-t border-slate-700/30 text-xs text-slate-300">
                    <span className="font-semibold text-sky-400">Luận điểm O2Sense hỗ trợ: </span>
                    {src.supportedClaims}
                  </div>
                )}

                {src.keyFinding && (
                  <div className="mt-2.5 pt-2 border-t border-slate-700/40 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <span className="font-semibold text-emerald-400">Kết luận chính:</span> {src.keyFinding}
                    </p>
                  </div>
                )}
            </div>
          );
        })}
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
