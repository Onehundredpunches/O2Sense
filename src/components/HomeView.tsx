import React, { useState } from 'react';
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
  CheckCircle2
} from 'lucide-react';

interface HomeViewProps {
  diseaseData: DiseaseData;
  progress: UserProgress;
  onSelectTab: (tab: AppTab) => void;
  onStartQuickReview: () => void;
  userMode: 'general' | 'founder';
  onOpenGlossary: (termId?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  diseaseData,
  progress,
  onSelectTab,
  onStartQuickReview,
  userMode,
  onOpenGlossary,
}) => {
  // 1-Minute Self Screener State
  const [screenerAnswers, setScreenerAnswers] = useState<Record<number, boolean>>({});

  const screenerQuestions = [
    { id: 1, text: 'Bạn (hoặc người thân) có ngáy to ngắt quãng hoặc giật mình thở dốc trong đêm?' },
    { id: 2, text: 'Buổi sáng thức dậy bạn thường bị đau đầu âm ỉ hoặc khô khốc cổ họng?' },
    { id: 3, text: 'Ban ngày bạn thường xuyên buồn ngủ rũ mắt khi ngồi họp, làm việc hoặc xem tivi?' },
    { id: 4, text: 'Nhẫn O2Ring hoặc đồng hồ của bạn từng cảnh báo tụt SpO2 dưới 90% khi ngủ?' },
  ];

  const positiveAnswersCount = Object.values(screenerAnswers).filter(Boolean).length;

  const handleToggleScreener = (id: number) => {
    setScreenerAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 space-y-8 pb-28 md:pb-16">
      {/* Hero Welcome Banner: Luminous Medical Wellness Style */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-sky-50 to-indigo-50/70 dark:from-slate-900 dark:via-slate-800 dark:to-teal-950/40 border border-teal-200/80 dark:border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/80 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-semibold border border-teal-200 dark:border-teal-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{userMode === 'founder' ? 'Dành riêng cho Founder Wearable SpO2 & Nghiên cứu' : 'Nền tảng Thấu Hiểu Giấc Ngủ & Tín Hiệu SpO2'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Thấu Hiểu Từng Nhịp Thở Trong Đêm
          </h1>

          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            Không cần kiến thức y khoa chuyên sâu. O2Sense giúp bạn tự tin giải thích mọi biểu hiện giấc ngủ (ngáy to, ngạt thở, tụt SpO2, vi thức giấc) cho người thân lớn tuổi bằng lời mộc mạc — và giúp Founder nhận diện ngay lập tức lúc nào mình đang suy diễn sai khi phỏng vấn người dùng thật.
          </p>

          {/* Quick Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectTab('story')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-500/20 active:scale-95 transition-all"
            >
              <Wind className="w-4 h-4" />
              <span>Khám phá 1 Đêm Thở Nghẽn (3D)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectTab('waveforms')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold hover:border-slate-300 shadow-sm transition-all"
            >
              <Activity className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Giải mã Đồ thị SpO2</span>
            </button>

            <button
              onClick={onStartQuickReview}
              className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-sm font-bold hover:bg-amber-100 transition-all"
            >
              <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-current" />
              <span>Ôn nhanh 5 phút</span>
            </button>
          </div>
        </div>

        {/* Decorative soft glow */}
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 1-Minute Self Screener (Trắc nghiệm tự khám phá 1 phút) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
              TỰ KHÁM PHÁ BẢN THÂN
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              Trắc Nghiệm Nhanh 1 Phút: Bạn Có Dấu Hiệu Tắc Nghẽn Đêm Không?
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-500">Bấm chọn các ô đúng với bạn</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {screenerQuestions.map((q) => {
            const isChecked = !!screenerAnswers[q.id];
            return (
              <button
                key={q.id}
                onClick={() => handleToggleScreener(q.id)}
                className={`p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 ${
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
                <span className="leading-snug">{q.text}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Screener Result */}
        {positiveAnswersCount > 0 ? (
          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fadeIn">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-teal-900 dark:text-teal-100">
                  Bạn có {positiveAnswersCount}/4 dấu hiệu gợi ý đường thở có sự hẹp khi ngủ.
                </p>
                <p className="text-xs text-teal-700 dark:text-teal-300 mt-0.5">
                  Đừng lo lắng! Hãy khám phá Tab "1 Đêm Thở Nghẽn" để xem hình 3D cổ họng hoạt động ra sao.
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectTab('story')}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors flex-shrink-0 self-start sm:self-center"
            >
              Xem Cơ Chế Ngay →
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center pt-1">
            Chọn ít nhất 1 câu hỏi để xem lời khuyên giải phẫu học tương ứng.
          </p>
        )}
      </div>

      {/* 4 Main Core Product Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Pillar 1: 1 Đêm Thở Nghẽn (3D/2.5D) */}
        <div 
          onClick={() => onSelectTab('story')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-teal-400 dark:hover:border-teal-600 transition-all cursor-pointer group space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
            <Wind className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                1. Hành Trình 1 Đêm Thở Nghẽn
              </h3>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Mô phỏng 3D WebGL xoay 360° tư thế nằm ngủ trên gối. Quan sát cuống lưỡi tụt bẹp đường thở, chuông báo cháy não bộ vi thức giấc và nhịp tim tăng tốc.
            </p>
          </div>
          <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400">
            <span>5 pha sinh lý động • Ẩn dụ bình dân</span>
          </div>
        </div>

        {/* Pillar 2: Giải Mã Đồ Thị SpO2 Đêm */}
        <div 
          onClick={() => onSelectTab('waveforms')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-sky-400 dark:hover:border-sky-600 transition-all cursor-pointer group space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                2. Bộ Giải Mã Đồ Thị SpO2 Đêm
              </h3>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Đối chiếu 4 dạng sóng nhẫn thực tế: Răng cưa OSA, Trũng sâu phổi, Đáy nhọn do nằm đè tay (nhiễu), và Hình sin tim mạch. Loại trừ lo lắng ảo, hành động tự tin.
            </p>
          </div>
          <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400">
            <span>Chống hoang mang • Câu hỏi bỏ túi gặp bác sĩ</span>
          </div>
        </div>

        {/* Pillar 3: Bách Khoa Tri Thức Y Học */}
        <div 
          onClick={() => onSelectTab('knowledge')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer group space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                3. Bách Khoa Tri Thức & Tra Cứu
              </h3>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Định nghĩa chuẩn AASM/WHO, thước đo AHI, bảng phân biệt triệu chứng Ngày & Đêm (đau đầu sáng, tiểu đêm), và nguyên lý cảm biến quang học PPG 660/940nm.
            </p>
          </div>
          <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <span>Chuẩn y văn quốc tế • Từ điển 15 thuật ngữ 1-chạm</span>
          </div>
        </div>

        {/* Pillar 4: 8 Hiểu Lầm & Kịch Bản Phỏng Vấn */}
        <div 
          onClick={() => onSelectTab('cases')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-purple-400 dark:hover:border-purple-600 transition-all cursor-pointer group space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                4. Phá Giải 8 Hiểu Lầm & Kịch Bản
              </h3>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              8 thẻ bài lật phá bỏ các hiểu lầm kinh điển (ngáy to = ngủ say?, đo 1 đêm là đủ?) và 6 tình huống hội thoại thực tế giúp luyện hỏi đúng, không mớm cung.
            </p>
          </div>
          <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400">
            <span>Chế độ Người thân & Founder • Tự đúc kết</span>
          </div>
        </div>
      </div>

      {/* Progress & Quick Stats Card */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Tiến Độ Làm Chủ Kiến Thức Của Bạn</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Đã hiểu {progress.understoodTrapIds.length} / {diseaseData.traps.length} thẻ hiểu lầm • Đã đúc kết {progress.completedScenarioIds.length} / {diseaseData.scenarios.length} tình huống thực tế
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenGlossary()}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 transition-all"
            >
              Mở Từ Điển Ẩn Dụ
            </button>
            <button
              onClick={onStartQuickReview}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              Ôn Nhanh 5 Phút
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
