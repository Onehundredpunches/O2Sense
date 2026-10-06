import React from 'react';
import { DiseaseData } from '../types/disease';
import { UserProgress } from '../services/storageService';
import { AppTab } from './Header';
import { 
  Zap, 
  Wind, 
  Activity, 
  BookOpen, 
  HelpCircle, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  ClipboardCheck
} from 'lucide-react';

interface HomeViewProps {
  diseaseData: DiseaseData;
  progress: UserProgress;
  onSelectTab: (tab: AppTab) => void;
  onStartQuickReview: () => void;
  onOpenGlossary: (termId?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  diseaseData,
  progress,
  onSelectTab,
  onStartQuickReview,
  onOpenGlossary,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 space-y-10 pb-28 md:pb-16 font-sans">
      {/* Hero Welcome Banner: Warm, Trustworthy, Medical Wellness Style */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-sky-50 to-indigo-50/70 dark:from-slate-900 dark:via-slate-800 dark:to-teal-950/40 border border-teal-200/80 dark:border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/90 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-sm font-semibold border border-teal-200 dark:border-teal-800">
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Nền tảng Thấu Hiểu Giấc Ngủ & Tín Hiệu SpO2</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Thấu Hiểu Từng Nhịp Thở Đêm
          </h1>

          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
            Bạn vừa thấy đồng hồ cảnh báo SpO2 tụt dưới 90% đêm qua? Bạn hay ngáy to và thức dậy với cảm giác mệt mỏi? 
            Đừng quá hoảng loạn. O2Sense giúp bạn giải mã số liệu từ thiết bị đeo thông minh, hiểu rõ cơ chế đường thở và nhận biết khi nào cần tham vấn bác sĩ.
          </p>

          {/* Quick Action Buttons (min 48px tap targets, 16px text) */}
          <div className="pt-2 flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => onSelectTab('screener')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-base shadow-md shadow-teal-600/20 active:scale-95 transition-all min-h-[48px]"
            >
              <ClipboardCheck className="w-5 h-5" />
              <span>Kiểm Tra Nguy Cơ (STOP-Bang)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectTab('story')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 text-base font-semibold hover:border-teal-500 shadow-sm transition-all min-h-[48px]"
            >
              <Wind className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>Mô Phỏng Đường Thở Sagittal</span>
            </button>

            <button
              onClick={() => onSelectTab('waveforms')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 text-base font-semibold hover:border-teal-500 shadow-sm transition-all min-h-[48px]"
            >
              <Activity className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <span>Giải Mã Đồ Thị SpO2</span>
            </button>
          </div>
        </div>

        {/* Decorative soft glow */}
        <div className="absolute right-0 bottom-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Prominent Screener Card (Bản kiểm tra sàng lọc STOP-Bang) */}
      <div className="bg-white dark:bg-slate-900 border-2 border-teal-200/80 dark:border-teal-800/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-sm uppercase tracking-wider">
              <ClipboardCheck className="w-4 h-4" />
              <span>Sàng lọc chuẩn y khoa AASM</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Đánh Giá Nhanh: Bạn Có Nguy Cơ Mắc Ngưng Thở Khi Ngủ?
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl">
              Chỉ 8 câu hỏi trắc nghiệm đơn giản (chuẩn STOP-Bang) giúp phân loại mức độ rủi ro Thấp, Trung bình hay Cao, đồng thời gợi ý hướng xử lý phù hợp cho đêm nay.
            </p>
          </div>

          <button
            onClick={() => onSelectTab('screener')}
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold text-base shadow-md shadow-teal-600/20 active:scale-95 transition-all flex-shrink-0 min-h-[48px]"
          >
            <span>Bắt Đầu Kiểm Tra (1 Phút)</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 4 Main Core Product Pillar Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            4 Trụ Cột Tri Thức Cốt Lõi
          </h2>
          <span className="text-sm font-medium text-slate-500">Khám phá từng module</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Pillar 1: Mô Phỏng Đường Thở Sagittal */}
          <div 
            onClick={() => onSelectTab('story')}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-teal-400 dark:hover:border-teal-600 transition-all cursor-pointer group space-y-3.5"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  1. Mô Phỏng Đường Thở Sagittal
                </h3>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-base text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Mặt cắt y khoa Sagittal 2D sắc nét mô phỏng cổ họng khi ngủ. Quan sát trực tiếp cơ chế hẹp và xẹp đường thở, biến đổi oxy - CO₂, tín hiệu tăng nỗ lực hô hấp và phản xạ vi thức giấc.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2 text-sm font-semibold text-teal-600 dark:text-teal-400">
              <span>5 pha sinh lý động • Ẩn dụ bình dân</span>
            </div>
          </div>

          {/* Pillar 2: Giải Mã Đồ Thị SpO2 Đêm */}
          <div 
            onClick={() => onSelectTab('waveforms')}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-sky-400 dark:hover:border-sky-600 transition-all cursor-pointer group space-y-3.5"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  2. Giải Mã Đồ Thị SpO2 Đêm
                </h3>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-base text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Đối chiếu 4 dạng sóng SpO₂: Răng cưa lặp lại (OSA điển hình), Trũng sâu kéo dài, Đường oxy ổn định và Nhiễu cảm biến do đè ép ngón tay. Hiểu rõ nguyên lý: Đồ thị đồng hồ ≠ Kết luận chẩn đoán.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2 text-sm font-semibold text-sky-600 dark:text-sky-400">
              <span>Chống hoang mang • Câu hỏi chuẩn bị gặp bác sĩ</span>
            </div>
          </div>

          {/* Pillar 3: Bách Khoa Tri Thức Y Học */}
          <div 
            onClick={() => onSelectTab('knowledge')}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer group space-y-3.5"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  3. Bách Khoa Tri Thức & Tra Cứu
                </h3>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-base text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Định nghĩa theo hướng dẫn AASM, thước đo chỉ số AHI, bảng phân biệt triệu chứng Ngày & Đêm (đau đầu sáng, tiểu đêm), và nguyên lý hoạt động của cảm biến quang học PPG 2 bước sóng.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              <span>Chuẩn y văn quốc tế • Từ điển 15 thuật ngữ 1-chạm</span>
            </div>
          </div>

          {/* Pillar 4: 8 Hiểu Lầm & Tình Huống Thực Tế */}
          <div 
            onClick={() => onSelectTab('cases')}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-purple-400 dark:hover:border-purple-600 transition-all cursor-pointer group space-y-3.5"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  4. Phá Giải 8 Hiểu Lầm & Tình Huống
                </h3>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-base text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                8 thẻ bài lật phá bỏ các hiểu lầm phổ biến (ngáy to = ngủ say?, đo 1 đêm là đủ?) và 6 tình huống thực tế giúp bạn biết cách trao đổi, lắng nghe và chăm sóc người thân đúng cách.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400">
              <span>Rèn luyện quan sát • Tránh bẫy lo âu</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Quick Review Card */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>Tiến Độ Làm Chủ Kiến Thức Của Bạn</span>
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Đã hiểu {progress.understoodTrapIds.length} / {diseaseData.traps.length} thẻ hiểu lầm • Đã hoàn thành {progress.completedScenarioIds.length} / {diseaseData.scenarios.length} tình huống thực tế
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenGlossary()}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold hover:bg-slate-100 transition-all min-h-[44px]"
            >
              Mở Từ Điển Ẩn Dụ
            </button>
            <button
              onClick={onStartQuickReview}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold transition-all shadow-sm min-h-[44px]"
            >
              <Zap className="w-4 h-4 fill-current text-amber-300" />
              <span>Ôn Nhanh 5 Phút</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
