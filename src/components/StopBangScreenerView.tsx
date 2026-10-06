import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  Activity, 
  Wind, 
  Stethoscope,
  Info,
  ShieldCheck
} from 'lucide-react';
import { AppTab } from './Header';

interface StopBangQuestion {
  id: string;
  letter: string;
  title: string;
  description: string;
  clarification: string;
  icon: string;
}

const STOP_BANG_QUESTIONS: StopBangQuestion[] = [
  {
    id: 'snoring',
    letter: 'S',
    title: 'Ngáy to khi ngủ (Snoring)',
    description: 'Bạn có ngáy to đến mức người nằm cạnh phải thức giấc, hoặc nghe rõ tiếng ngáy qua cửa phòng đóng kín?',
    clarification: 'Tiếng ngáy phát sinh do mô mềm trong vòm họng rung lên khi luồng khí hít vào bị ép qua khe hẹp.',
    icon: '🗣️'
  },
  {
    id: 'tired',
    letter: 'T',
    title: 'Mệt mỏi, buồn ngủ ban ngày (Tiredness)',
    description: 'Bạn có thường cảm thấy kiệt sức, uể oải hoặc bất chợt ngủ gục khi đang làm việc, xem tivi hoặc lái xe?',
    clarification: 'Dù ngủ đủ 7-8 tiếng, nhưng giấc ngủ bị đứt đoạn liên tục bởi các đợt não vi thức giấc để cấp cứu hô hấp.',
    icon: '🥱'
  },
  {
    id: 'observed',
    letter: 'O',
    title: 'Có người thấy bạn ngưng thở (Observed apnea)',
    description: 'Người thân hoặc bạn cùng phòng có từng thấy bạn ngừng thở, thở hổn hển hoặc sặc nghẹn trong lúc ngủ?',
    clarification: 'Đây là dấu hiệu đặc hiệu quan trọng nhất của tắc nghẽn đường thở hoàn toàn trong giấc ngủ.',
    icon: '👀'
  },
  {
    id: 'pressure',
    letter: 'P',
    title: 'Huyết áp cao (High Blood Pressure)',
    description: 'Bạn có tiền sử tăng huyết áp hoặc hiện đang phải uống thuốc điều trị hạ huyết áp hàng ngày không?',
    clarification: 'Mỗi cơn ngưng thở kích hoạt hệ thần kinh giao cảm phóng thích adrenaline, khiến mạch máu co thắt và huyết áp tăng vọt ban đêm.',
    icon: '💓'
  },
  {
    id: 'bmi',
    letter: 'B',
    title: 'Chỉ số khối cơ thể BMI > 30 (Body Mass Index)',
    description: 'Bạn có thuộc nhóm thừa cân hoặc béo phì rõ rệt? (Ví dụ: Cao 1m70 nặng trên 87kg, hoặc có mỡ thừa quanh ngực cổ)?',
    clarification: 'Mô mỡ tích tụ quanh cổ họng làm hẹp đường kính lòng họng và tăng tải trọng ép xẹp đường thở khi nằm ngửa.',
    icon: '⚖️'
  },
  {
    id: 'age',
    letter: 'A',
    title: 'Tuổi từ 50 trở lên (Age)',
    description: 'Hiện tại bạn đã từ 50 tuổi trở lên chưa?',
    clarification: 'Theo tuổi tác, trương lực cơ vùng hầu họng giảm tự nhiên, khiến các cơ dễ bị chùng xuống và xẹp hơn khi ngủ sâu.',
    icon: '🎂'
  },
  {
    id: 'neck',
    letter: 'N',
    title: 'Vòng cổ lớn (Neck circumference)',
    description: 'Vòng cổ của bạn có lớn không? (Áo sơ mi nam có vòng cổ từ 43cm trở lên, hoặc nữ từ 41cm trở lên)?',
    clarification: 'Chu vi cổ lớn là chỉ số nhân trắc học phản ánh lượng mô mềm bao quanh đường thở trên.',
    icon: '👔'
  },
  {
    id: 'gender',
    letter: 'G',
    title: 'Giới tính Nam (Gender)',
    description: 'Giới tính sinh học của bạn là Nam?',
    clarification: 'Nam giới có tỷ lệ mắc chứng ngưng thở khi ngủ cao gấp 2-3 lần nữ giới trước tuổi mãn kinh do đặc điểm giải phẫu phân bố mỡ.',
    icon: '👤'
  }
];

interface StopBangScreenerViewProps {
  onSelectTab: (tab: AppTab) => void;
}

export const StopBangScreenerView: React.FC<StopBangScreenerViewProps> = ({ onSelectTab }) => {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({
    snoring: null,
    tired: null,
    observed: null,
    pressure: null,
    bmi: null,
    age: null,
    neck: null,
    gender: null,
  });

  const handleSelectAnswer = (id: string, value: boolean) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const answeredCount = Object.values(answers).filter(v => v !== null).length;
  const positiveScore = Object.values(answers).filter(v => v === true).length;
  const isFinished = answeredCount === STOP_BANG_QUESTIONS.length;

  const handleReset = () => {
    setAnswers({
      snoring: null,
      tired: null,
      observed: null,
      pressure: null,
      bmi: null,
      age: null,
      neck: null,
      gender: null,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getRiskCategory = () => {
    if (positiveScore <= 2) {
      return {
        level: 'Thấp',
        color: 'emerald',
        badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300',
        headline: 'Nguy cơ Ngưng thở khi ngủ thấp (0 - 2 điểm)',
        description: 'Dựa trên bảng câu hỏi STOP-Bang, bạn ít có khả năng mắc hội chứng ngưng thở khi ngủ mức độ trung bình-nặng.',
        spo2Advice: 'Nếu thiết bị đeo (Apple Watch, Garmin, O2Ring) thỉnh thoảng báo sụt giảm SpO2, hãy kiểm tra các nguyên nhân vật lý: dây đeo quá lỏng, ngón tay bị lạnh co mạch hoặc bạn ngủ nằm đè tì đè lên cánh tay làm giảm tuần hoàn máu.',
        nextSteps: [
          'Tiếp tục theo dõi giấc ngủ 3-5 đêm nữa với tư thế ngủ thoải mái.',
          'Kiểm tra độ vừa vặn của thiết bị đeo trước khi ngủ.',
          'Duy trì thói quen tập thể dục và ngủ đúng giờ giấc.'
        ]
      };
    } else if (positiveScore <= 4) {
      return {
        level: 'Trung bình',
        color: 'amber',
        badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300',
        headline: 'Nguy cơ Ngưng thở khi ngủ Trung bình (3 - 4 điểm)',
        description: 'Bạn có một số yếu tố nguy cơ hoặc triệu chứng nghi ngờ tắc nghẽn đường thở khi ngủ.',
        spo2Advice: 'Nếu thiết bị đeo liên tục ghi nhận các đợt SpO2 tụt xuống dưới 90% kèm tiếng ngáy ngắt quãng, bạn không nên chủ quan nhưng cũng không cần hoảng sợ. Hãy theo dõi xem các đợt tụt có lặp đi lặp lại dạng răng cưa không.',
        nextSteps: [
          'Thử đổi tư thế: Tập nằm ngủ nghiêng một bên (dùng gối ôm chống ngửa) để hạn chế tụt lưỡi gà.',
          'Tránh uống rượu bia hoặc dùng thuốc an thần trong vòng 4 tiếng trước khi ngủ.',
          'Chụp lại ảnh báo cáo SpO2 và trao đổi với bác sĩ chuyên khoa nếu tình trạng mệt mỏi ban ngày kéo dài.'
        ]
      };
    } else {
      return {
        level: 'Cao',
        color: 'rose',
        badgeBg: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300',
        headline: 'Nguy cơ Ngưng thở khi ngủ Cao (5 - 8 điểm)',
        description: 'Kết quả cho thấy bạn có nhiều dấu hiệu điển hình của Hội chứng Ngưng thở Tắc nghẽn khi ngủ (OSA).',
        spo2Advice: 'Đặc biệt nếu thiết bị đo đêm hiển thị các đợt SpO2 sụt giảm sâu lặp đi lặp lại (chu kỳ 30-90 giây), đây là bằng chứng khách quan rất có giá trị để bác sĩ chỉ định thăm dò chuyên sâu.',
        nextSteps: [
          'Đặt lịch khám tại Bệnh viện có Đơn vị Y học Giấc ngủ (chuyên khoa Hô hấp hoặc Tai Mũi Họng).',
          'Đem theo nhật ký ghi nhận SpO2 từ thiết bị đeo để bác sĩ tham khảo sơ bộ.',
          'Bác sĩ có thể chỉ định Đo đa ký giấc ngủ (Polysomnography - PSG) hoặc Đo đa ký hô hấp tại nhà để xác định chính xác chỉ số AHI.'
        ]
      };
    }
  };

  const risk = getRiskCategory();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 space-y-8 pb-28 md:pb-16 font-sans">
      {/* Intro Header */}
      <div className="bg-gradient-to-br from-teal-50 via-sky-50 to-indigo-50/60 dark:from-slate-900 dark:via-slate-800 dark:to-teal-950/40 border border-teal-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs sm:text-sm font-semibold border border-teal-200 dark:border-teal-800">
          <ClipboardCheck className="w-4 h-4" />
          <span>Bảng Sàng Lọc Y Khoa Chuẩn Quốc Tế</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
          Kiểm Tra Nguy Cơ Ngưng Thở Khi Ngủ (STOP-Bang)
        </h1>

        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
          STOP-Bang là công cụ sàng lọc được Hiệp hội Y học Giấc ngủ Quốc tế (AASM) khuyên dùng phổ biến nhất thế giới nhờ tính chính xác cao và dễ thực hiện. 
          Chỉ mất <strong>1 phút</strong> trả lời 8 câu hỏi trắc nghiệm ĐÚNG / SAI dưới đây.
        </p>

        {/* Live Progress Bar */}
        <div className="pt-2 space-y-2">
          <div className="flex justify-between items-center text-sm font-semibold text-slate-600 dark:text-slate-400">
            <span>Tiến độ hoàn thành: {answeredCount} / {STOP_BANG_QUESTIONS.length} câu</span>
            <span>{Math.round((answeredCount / STOP_BANG_QUESTIONS.length) * 100)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-sky-500 rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / STOP_BANG_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 8 Questions List */}
      <div className="space-y-4">
        {STOP_BANG_QUESTIONS.map((q, idx) => {
          const currentVal = answers[q.id];
          return (
            <div 
              key={q.id}
              className={`p-5 sm:p-6 rounded-2xl border transition-all duration-200 ${
                currentVal !== null
                  ? 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 shadow-sm'
                  : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex gap-3.5 items-start flex-1">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 flex items-center justify-center font-bold text-base sm:text-lg flex-shrink-0 shadow-xs">
                    {q.letter}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      Câu {idx + 1}: {q.title}
                    </h3>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                      {q.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-1">
                      <Info className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                      <span>{q.clarification}</span>
                    </div>
                  </div>
                </div>

                {/* Big Accessible Tap Targets (min 48px) */}
                <div className="flex items-center gap-3 sm:self-center flex-shrink-0 pt-2 sm:pt-0">
                  <button
                    onClick={() => handleSelectAnswer(q.id, true)}
                    className={`min-h-[48px] px-6 py-3 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 border-2 ${
                      currentVal === true
                        ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:border-teal-500'
                    }`}
                  >
                    <span>CÓ</span>
                  </button>
                  <button
                    onClick={() => handleSelectAnswer(q.id, false)}
                    className={`min-h-[48px] px-6 py-3 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 border-2 ${
                      currentVal === false
                        ? 'bg-slate-700 text-white border-slate-700 shadow-md'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:border-slate-400'
                    }`}
                  >
                    <span>KHÔNG</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Result Section (Automatically opens or highlights when completed) */}
      {isFinished && (
        <div className="bg-white dark:bg-slate-800 border-2 border-teal-400 dark:border-teal-600 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-teal-600 dark:text-teal-400" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Đánh Giá Nguy Cơ Của Bạn
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Dựa trên 8 câu trả lời theo thang điểm quốc tế STOP-Bang
                </p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 text-sm font-semibold transition-all min-h-[44px]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm lại</span>
            </button>
          </div>

          {/* Risk Level Badge & Score */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
            <div className="space-y-1">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${risk.badgeBg}`}>
                Phân loại nguy cơ: {risk.level}
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {risk.headline}
              </h3>
              <p className="text-base text-slate-600 dark:text-slate-300">
                {risk.description}
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center bg-white dark:bg-slate-800 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-4xl font-black text-teal-600 dark:text-teal-400">{positiveScore}</span>
              <span className="text-slate-400 text-xl font-bold">/ 8 điểm</span>
            </div>
          </div>

          {/* SpO2 Advice for Wearable users */}
          <div className="space-y-3 p-5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800">
            <div className="flex items-center gap-2 text-sky-800 dark:text-sky-300 font-bold text-base sm:text-lg">
              <Activity className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <span>Đối chiếu với dữ liệu SpO2 trên đồng hồ / nhẫn thông minh của bạn:</span>
            </div>
            <p className="text-base text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
              {risk.spo2Advice}
            </p>
          </div>

          {/* Actionable Next Steps */}
          <div className="space-y-3">
            <h4 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>Các bước khuyến nghị nên làm tiếp theo:</span>
            </h4>
            <div className="grid gap-2.5 sm:grid-cols-1">
              {risk.nextSteps.map((step, idx) => (
                <div 
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/80 dark:border-slate-700 text-base text-slate-700 dark:text-slate-300"
                >
                  <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deep Navigation CTAs */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => onSelectTab('waveforms')}
              className="flex-1 min-w-[240px] flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-base shadow-md shadow-teal-600/20 active:scale-95 transition-all min-h-[48px]"
            >
              <Activity className="w-5 h-5" />
              <span>Xem Các Dạng Đồ Thị SpO2</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectTab('story')}
              className="flex-1 min-w-[240px] flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-base active:scale-95 transition-all min-h-[48px]"
            >
              <Wind className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>Xem Mô Phỏng Đường Thở 2D</span>
            </button>

            <button
              onClick={() => onSelectTab('help')}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-base font-semibold transition-all min-h-[44px]"
            >
              <Stethoscope className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Xem Địa Chỉ & Quy Trình Thăm Khám Tại Việt Nam</span>
            </button>
          </div>
        </div>
      )}

      {/* Medical Disclaimer Note */}
      <div className="text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 px-4 py-2 bg-slate-100/70 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
        <p>
          * Công cụ STOP-Bang là bài trắc nghiệm sàng lọc nguy cơ dành cho cộng đồng, không có giá trị thay thế kết luận chẩn đoán lâm sàng của bác sĩ chuyên khoa. 
          Nếu bạn có dấu hiệu buồn ngủ khi lái xe hoặc ngừng thở kèm đau tức ngực, vui lòng đến cơ sở y tế gần nhất.
        </p>
      </div>
    </div>
  );
};
