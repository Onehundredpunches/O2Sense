import React, { useState } from 'react';

type Step = 'landing' | 'assessment' | 'results';

export const FunnelFlow: React.FC<{ onEnterLibrary: () => void }> = ({ onEnterLibrary }) => {
  const [currentStep, setCurrentStep] = useState<Step>('landing');
  
  // STOP-Bang Answers
  const [answers, setAnswers] = useState({
    snoring: null as boolean | null,
    tired: null as boolean | null,
    observed: null as boolean | null,
    pressure: null as boolean | null,
    bmi: null as boolean | null,
    age: null as boolean | null,
    neck: null as boolean | null,
    gender: null as boolean | null,
  });

  const handleAnswer = (key: keyof typeof answers, value: boolean) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const getScore = () => {
    return Object.values(answers).filter(v => v === true).length;
  };

  const isComplete = Object.values(answers).every(v => v !== null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex justify-center items-start">
      <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-4 md:mt-12">
        
        {/* Header */}
        <div className="bg-teal-600 text-white p-6 text-center">
          <h1 className="text-2xl font-bold">O2Sense</h1>
          <p className="text-teal-100 mt-1 text-sm md:text-base">Kiểm tra nguy cơ Ngưng thở khi ngủ</p>
        </div>

        <div className="p-6 md:p-8">
          {currentStep === 'landing' && (
            <div className="space-y-6 text-center">
              <h2 className="text-xl md:text-2xl font-semibold text-slate-800">
                Bạn lo lắng vì chỉ số SpO2 rớt thấp khi ngủ?
              </h2>
              <p className="text-slate-600 text-base md:text-lg">
                Nhiều người dùng đồng hồ thông minh (Apple Watch, Garmin...) cảm thấy hoang mang khi thấy cảnh báo về giấc ngủ hoặc nồng độ oxy trong máu.
              </p>
              <p className="text-slate-600 text-base md:text-lg">
                Hãy trả lời 8 câu hỏi ngắn (chuẩn STOP-Bang) để đánh giá nhanh nguy cơ Ngưng thở khi ngủ (OSA) của bạn.
              </p>
              <button 
                onClick={() => setCurrentStep('assessment')}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 px-6 rounded-xl text-lg transition-colors"
              >
                Bắt đầu kiểm tra (1 phút)
              </button>
            </div>
          )}

          {currentStep === 'assessment' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-4">Trả lời các câu hỏi sau:</h2>
              
              <div className="space-y-4">
                <Question 
                  label="1. Bạn có ngáy to không? (Ngáy to đến mức người khác nghe thấy qua cửa đóng)"
                  value={answers.snoring}
                  onChange={(v) => handleAnswer('snoring', v)}
                />
                <Question 
                  label="2. Bạn có thường xuyên thấy mệt mỏi, uể oải hoặc buồn ngủ vào ban ngày không?"
                  value={answers.tired}
                  onChange={(v) => handleAnswer('tired', v)}
                />
                <Question 
                  label="3. Đã có ai thấy bạn ngưng thở hoặc thở nghẹn, sặc trong lúc ngủ chưa?"
                  value={answers.observed}
                  onChange={(v) => handleAnswer('observed', v)}
                />
                <Question 
                  label="4. Bạn có đang bị cao huyết áp hoặc đang dùng thuốc trị cao huyết áp không?"
                  value={answers.pressure}
                  onChange={(v) => handleAnswer('pressure', v)}
                />
                <Question 
                  label="5. Chỉ số BMI của bạn có lớn hơn 35 không? (Bạn có bị thừa cân nhiều không?)"
                  value={answers.bmi}
                  onChange={(v) => handleAnswer('bmi', v)}
                />
                <Question 
                  label="6. Bạn đã trên 50 tuổi chưa?"
                  value={answers.age}
                  onChange={(v) => handleAnswer('age', v)}
                />
                <Question 
                  label="7. Vòng cổ của bạn có lớn không? (Cỡ áo sơ mi nam >43cm, nữ >41cm)"
                  value={answers.neck}
                  onChange={(v) => handleAnswer('neck', v)}
                />
                <Question 
                  label="8. Giới tính của bạn là Nam?"
                  value={answers.gender}
                  onChange={(v) => handleAnswer('gender', v)}
                />
              </div>

              <button 
                onClick={() => setCurrentStep('results')}
                disabled={!isComplete}
                className={`w-full font-semibold py-4 px-6 rounded-xl text-lg transition-colors mt-8 ${
                  isComplete 
                    ? 'bg-teal-600 hover:bg-teal-700 text-white' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Xem Kết Quả
              </button>
            </div>
          )}

          {currentStep === 'results' && (
            <div className="space-y-6 text-center">
              <h2 className="text-2xl font-bold">Kết quả Đánh giá rủi ro</h2>
              
              <div className={`p-6 rounded-xl border ${
                getScore() >= 5 ? 'bg-red-50 border-red-200 text-red-800' :
                getScore() >= 3 ? 'bg-orange-50 border-orange-200 text-orange-800' :
                'bg-green-50 border-green-200 text-green-800'
              }`}>
                <div className="text-4xl font-bold mb-2">{getScore()} / 8</div>
                <div className="text-xl font-semibold">
                  {getScore() >= 5 ? 'Nguy cơ CAO' :
                   getScore() >= 3 ? 'Nguy cơ TRUNG BÌNH' :
                   'Nguy cơ THẤP'}
                </div>
              </div>

              <div className="text-left text-slate-700 space-y-4">
                <p>
                  <strong>Lưu ý:</strong> Đây chỉ là công cụ sàng lọc nhanh, không thay thế cho chẩn đoán y khoa.
                </p>
                {getScore() >= 3 && (
                  <p>
                    Với mức điểm này, kết hợp với việc bạn thấy SpO2 thấp trên đồng hồ, bạn nên đặt lịch hẹn với <strong>Bác sĩ chuyên khoa Tai Mũi Họng hoặc Hô hấp (Chuyên khoa Giấc ngủ)</strong> để được tư vấn đo đa ký giấc ngủ (Polysomnography).
                  </p>
                )}
                {getScore() < 3 && (
                  <p>
                    Nguy cơ mắc Hội chứng ngưng thở khi ngủ của bạn khá thấp. Sự sụt giảm SpO2 trên đồng hồ có thể do nguyên nhân khác (tay bị đè, tư thế nằm). Tuy nhiên, nếu bạn vẫn lo lắng, hãy tham khảo ý kiến bác sĩ.
                  </p>
                )}
              </div>

              <button 
                onClick={() => {
                  setAnswers({
                    snoring: null, tired: null, observed: null, pressure: null,
                    bmi: null, age: null, neck: null, gender: null
                  });
                  setCurrentStep('landing');
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-4 px-6 rounded-xl text-lg transition-colors mt-4"
              >
                Làm lại bài test
              </button>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <p className="text-sm text-slate-500 mb-3">Bạn là người muốn tìm hiểu sâu về kiến thức y khoa, cơ chế sinh lý và cách đọc sóng PPG?</p>
                <button 
                  onClick={onEnterLibrary}
                  className="text-teal-600 hover:text-teal-700 font-medium underline"
                >
                  Vào Thư Viện Kiến Thức Chuyên Sâu
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Question: React.FC<{
  label: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
}> = ({ label, value, onChange }) => (
  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
    <p className="font-medium text-slate-800 mb-3 text-base md:text-lg leading-relaxed">{label}</p>
    <div className="flex gap-3">
      <button 
        onClick={() => onChange(true)}
        className={`flex-1 py-3 px-4 rounded-lg font-medium border-2 transition-colors ${
          value === true 
            ? 'bg-teal-50 border-teal-500 text-teal-700' 
            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
        }`}
      >
        Có
      </button>
      <button 
        onClick={() => onChange(false)}
        className={`flex-1 py-3 px-4 rounded-lg font-medium border-2 transition-colors ${
          value === false 
            ? 'bg-teal-50 border-teal-500 text-teal-700' 
            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
        }`}
      >
        Không
      </button>
    </div>
  </div>
);
