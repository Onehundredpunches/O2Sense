import React, { useState } from 'react';
import { MedicalKnowledgeHub, GlossaryItem } from '../types/disease';
import { 
  BookOpen, 
  Brain, 
  Heart, 
  Layers, 
  Activity, 
  Sparkles, 
  Stethoscope,
  Clock
} from 'lucide-react';

interface KnowledgeHubViewProps {
  hubData: MedicalKnowledgeHub;
  glossary: GlossaryItem[];
  onOpenGlossary: (termId?: string) => void;
}

export const KnowledgeHubView: React.FC<KnowledgeHubViewProps> = ({
  hubData,
  glossary,
  onOpenGlossary,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'definition' | 'symptoms' | 'differential' | 'sensor' | 'complications'>('definition');
  const [selectedAhiIndex, setSelectedAhiIndex] = useState<number>(0);

  const activeAhiRange = hubData.definitionSection.ahiStandards.ranges[selectedAhiIndex];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 space-y-6 pb-28 md:pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-50 via-teal-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-sky-200/80 dark:border-slate-700/80 rounded-3xl p-5 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/80 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 text-xs font-semibold border border-sky-200 dark:border-sky-800">
              <BookOpen className="w-3.5 h-3.5" />
              <span>BÁCH KHOA TOÀN THƯ Y HỌC ĐỜI THƯỜNG</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Bách Khoa Giấc Ngủ, Hơi Thở & SpO2
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Toàn bộ kiến thức bệnh học, triệu chứng Ngày & Đêm, bảng chẩn đoán phân biệt và nguyên lý cảm biến quang học PPG — biên soạn theo chuẩn AASM & WHO bằng ngôn ngữ ai cũng hiểu.
            </p>
          </div>

          {/* Instant Glossary Quick Button */}
          <button
            onClick={() => onOpenGlossary()}
            className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-500/20 active:scale-95 transition-all flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Từ Điển Ẩn Dụ ({glossary.length} Thuật Ngữ)</span>
          </button>
        </div>

        {/* 5 Topic Sub-Navigation Pills (Clean responsive wrapping, zero clipping) */}
        <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSubTab('definition')}
            className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'definition'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-white/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-stone-200/60 dark:border-slate-700/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="sm:hidden">1. AHI Chuẩn</span>
            <span className="hidden sm:inline">1. Định Nghĩa & Thước Đo AHI</span>
          </button>

          <button
            onClick={() => setActiveSubTab('symptoms')}
            className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'symptoms'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-white/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-stone-200/60 dark:border-slate-700/60'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span className="sm:hidden">2. Triệu Chứng</span>
            <span className="hidden sm:inline">2. Bản Đồ Triệu Chứng Ngày & Đêm</span>
          </button>

          <button
            onClick={() => setActiveSubTab('differential')}
            className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'differential'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-white/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-stone-200/60 dark:border-slate-700/60'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span className="sm:hidden">3. Phân Biệt Bệnh</span>
            <span className="hidden sm:inline">3. Phân Biệt Các Bệnh Lý Hô Hấp</span>
          </button>

          <button
            onClick={() => setActiveSubTab('sensor')}
            className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'sensor'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-white/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-stone-200/60 dark:border-slate-700/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="sm:hidden">4. Cảm Biến PPG</span>
            <span className="hidden sm:inline">4. Nguyên Lý Cảm Biến PPG & Nhẫn</span>
          </button>

          <button
            onClick={() => setActiveSubTab('complications')}
            className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'complications'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-white/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-stone-200/60 dark:border-slate-700/60'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span className="sm:hidden">5. Tim Mạch</span>
            <span className="hidden sm:inline">5. Biến Chứng Tim Mạch & Phục Hồi</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: DEFINITION & AHI STANDARDS */}
      {activeSubTab === 'definition' && (
        <div className="space-y-6">
          {/* Main Definition & Analogy */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span>OSA Là Gì? (Bản Chất Y Học Đơn Giản Hóa)</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              {hubData.definitionSection.whatIsOSA}
            </p>

            <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-slate-800/60 border border-sky-200/70 dark:border-slate-700/80 space-y-1.5">
              <p className="text-xs font-bold text-sky-800 dark:text-sky-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Ẩn Dụ Chiếc Ống Nước Mềm:</span>
              </p>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {hubData.definitionSection.laymanAnalogy}
              </p>
            </div>
          </div>

          {/* Interactive AHI Calculator / Selector */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-4">
            <div>
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                TIÊU CHUẨN VÀNG AASM
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                Thước Đo AHI (Apnea-Hypopnea Index) Phân Độ Nặng
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Bấm vào từng mức để xem ý nghĩa lâm sàng và cách đánh giá của bác sĩ chuyên khoa:
              </p>
            </div>

            {/* 4 AHI Range Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              {hubData.definitionSection.ahiStandards.ranges.map((rng, idx) => {
                const isSelected = idx === selectedAhiIndex;
                return (
                  <button
                    key={rng.label}
                    onClick={() => setSelectedAhiIndex(idx)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 shadow-md ring-2 ring-sky-500/30'
                        : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <p className="text-xs font-bold">{rng.label}</p>
                    <p className={`text-xs font-mono font-semibold mt-0.5 ${
                      isSelected ? 'text-sky-300 dark:text-sky-700' : 'text-slate-500'
                    }`}>
                      {rng.range}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Selected Range Detail Card */}
            {activeAhiRange && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3 mt-2">
                <div className={`w-3.5 h-3.5 rounded-full mt-1 flex-shrink-0 ${
                  activeAhiRange.severityColor === 'emerald' ? 'bg-emerald-500' :
                  activeAhiRange.severityColor === 'sky' ? 'bg-sky-500' :
                  activeAhiRange.severityColor === 'amber' ? 'bg-amber-500' : 'bg-rose-500'
                }`} />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeAhiRange.label}: {activeAhiRange.range}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {activeAhiRange.meaning}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 4 Underlying Causes */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              4 Nguyên Nhân Gốc Rễ Gây Tắc Nghẽn Hầu Họng
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hubData.definitionSection.underlyingCauses.map((c) => (
                <div
                  key={c.title}
                  className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 space-y-1.5"
                >
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                    <span>{c.title}</span>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: DAY VS NIGHT SYMPTOMS */}
      {activeSubTab === 'symptoms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nighttime Symptoms */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80">🌙</span>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Triệu Chứng Ban Đêm (Nighttime)
                </h3>
                <p className="text-[11px] text-slate-500">Những dấu hiệu xảy ra trong khi ngủ</p>
              </div>
            </div>

            <div className="space-y-3">
              {hubData.symptomSection.nighttime.map((s, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5"
                >
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {s.symptom}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong className="text-teal-700 dark:text-teal-400">Cơ chế y học: </strong>
                    {s.why}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Daytime Symptoms */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/80">☀️</span>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Triệu Chứng Ban Ngày (Daytime)
                </h3>
                <p className="text-[11px] text-slate-500">Hệ quả sau một đêm thiếu oxy kéo dài</p>
              </div>
            </div>

            <div className="space-y-3">
              {hubData.symptomSection.daytime.map((s, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5"
                >
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {s.symptom}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong className="text-sky-700 dark:text-sky-400">Cơ chế y học: </strong>
                    {s.why}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: DIFFERENTIAL DIAGNOSIS */}
      {activeSubTab === 'differential' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Bảng So Sánh Phân Biệt Các Bệnh Lý Gây Tụt SpO2 Đêm
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Phân biệt rõ ràng giữa ngưng thở tắc nghẽn (OSA), ngưng thở trung ương do tim (CSA), bệnh phổi (COPD) và béo phì (OHS):
            </p>
          </div>

          <div className="space-y-4">
            {hubData.differentialDiagnosis.map((item) => (
              <div
                key={item.disease}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-2 border-b border-slate-200/60 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                    <span>{item.disease}</span>
                  </h3>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg bg-teal-100/70 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                    {item.spO2DayVsNight}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Bản Chất Cơ Chế:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {item.mechanism}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
                      Điểm Nhận Diện Đặc Thù:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed font-medium">
                      {item.keyDistinction}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: PPG SENSOR SCIENCE */}
      {activeSubTab === 'sensor' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
              KHOA HỌC THIẾT BỊ ĐO QUANG HỌC
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              Cảm Biến Nhẫn O2Ring Đo Chỉ Số SpO2 Như Thế Nào?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
              {hubData.ppgSensorScience.howItWorks}
            </p>
          </div>

          {/* Dual Wavelength Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {hubData.ppgSensorScience.twoWavelengths.map((w, idx) => (
              <div
                key={w.wave}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-3.5 h-3.5 rounded-full ${idx === 0 ? 'bg-rose-500' : 'bg-indigo-500'}`} />
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{w.wave}</h4>
                </div>
                <p className="text-xs font-mono text-teal-600 dark:text-teal-400 font-bold">{w.nanometers}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{w.role}</p>
              </div>
            ))}
          </div>

          {/* Circulation Delay Highlight Box */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Độ Trễ Tuần Hoàn Máu (Circulation Delay 15 - 30 Giây):</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {hubData.ppgSensorScience.circulationDelay}
            </p>
          </div>

          {/* Why Ring > Wrist */}
          <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-900/60 space-y-1.5">
            <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Tại Sao Nhẫn Ngón Tay Nhạy Hơn Đồng Hồ Đeo Cổ Tay?</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {hubData.ppgSensorScience.whyRingBetterThanWrist}
            </p>
          </div>

          {/* Common Artifacts */}
          <div className="space-y-2">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              4 Nguyên Nhân Gây Nhiễu Cảm Biến Cần Lưu Ý:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
              {hubData.ppgSensorScience.commonArtifacts.map((art, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-teal-500 font-bold">•</span>
                  <span>{art}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: CARDIOVASCULAR COMPLICATIONS */}
      {activeSubTab === 'complications' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Tác Động Lâu Dài Lên Tim Mạch & Khả Năng Phục Hồi
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Ngưng thở khi ngủ không chỉ là chuyện ngáy; đó là gánh nặng huyết động học kéo dài suốt nhiều năm:
            </p>
          </div>

          <div className="space-y-4">
            {hubData.cardiovascularComplications.map((c) => (
              <div
                key={c.name}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2"
              >
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>{c.name}</span>
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-800 dark:text-slate-200">Cơ chế phát sinh: </strong>
                  {c.mechanism}
                </p>

                <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                  <strong>Khả năng phục hồi khi can thiệp sớm: </strong>
                  {c.reversibleWithTreatment}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
