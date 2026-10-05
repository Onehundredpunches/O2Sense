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
  userMode?: 'general' | 'founder';
}

export const KnowledgeHubView: React.FC<KnowledgeHubViewProps> = ({
  hubData,
  glossary,
  onOpenGlossary,
  userMode,
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
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/80 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 text-xs font-semibold border border-sky-200 dark:border-sky-800">
                <BookOpen className="w-3.5 h-3.5" />
                <span>BÁCH KHOA TOÀN THƯ Y HỌC ĐỜI THƯỜNG</span>
              </div>
              {userMode === 'founder' && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-100/90 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800">
                  <span>Chế độ: Chuyên sâu</span>
                </div>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Bách Khoa Giấc Ngủ, Hơi Thở & SpO2
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Toàn bộ kiến thức bệnh học, triệu chứng Ngày & Đêm, bảng chẩn đoán phân biệt và nguyên lý cảm biến quang học PPG — tham khảo hướng dẫn AASM bằng ngôn ngữ dễ hiểu.
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
            data-testid="subtab-symptoms"
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
            data-testid="subtab-differential"
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
                Phân tầng AHI theo quy ước sử dụng trong y học giấc ngủ
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

            {/* AASM Scoring Rule Note (MED-P0-023) */}
            {hubData.definitionSection.ahiStandards.scoringRuleNote && (
              <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300 leading-relaxed font-medium">
                <span className="font-bold">Lưu ý chuẩn chấm điểm AASM: </span>
                {hubData.definitionSection.ahiStandards.scoringRuleNote}
              </div>
            )}

            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1">
              * AHI phải được hiểu trong bối cảnh lâm sàng và phương pháp đo/chấm điểm.
            </p>
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
                  Triệu Chứng Ban Đêm
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
                    <strong className="text-teal-700 dark:text-teal-400">Cơ chế y học & liên quan: </strong>
                    {s.why}
                  </p>
                  {s.whyPro && (
                    <div className="mt-2 p-2.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/40 text-[11px] text-indigo-950 dark:text-indigo-200 leading-relaxed">
                      <span className="font-semibold text-indigo-700 dark:text-indigo-400">Góc nhìn chuyên sâu: </span>
                      {s.whyPro}
                    </div>
                  )}
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
                  Triệu Chứng Ban Ngày
                </h3>
                <p className="text-[11px] text-slate-500">Biểu hiện trong ngày có thể liên quan đến rối loạn hô hấp khi ngủ</p>
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
                    <strong className="text-sky-700 dark:text-sky-400">Cơ chế y học & liên quan: </strong>
                    {s.why}
                  </p>
                  {s.whyPro && (
                    <div className="mt-2 p-2.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/40 text-[11px] text-indigo-950 dark:text-indigo-200 leading-relaxed">
                      <span className="font-semibold text-indigo-700 dark:text-indigo-400">Góc nhìn chuyên sâu: </span>
                      {s.whyPro}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: DIFFERENTIAL DIAGNOSIS (V11-P0-004) */}
      {activeSubTab === 'differential' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Bảng Phân Biệt Các Bệnh Lý Gây Dao Động & Hạ SpO2 Đêm
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Phân định rõ cơ chế, SpO₂ quan sát được, dữ liệu cần thêm để phân biệt và giới hạn không được suy diễn (O2Sense Medical Rule CMC-09 • Aligned with AASM diagnostic guidance):
            </p>
          </div>

          <div className="space-y-4">
            {hubData.differentialDiagnosis.map((item) => (
              <div
                key={item.condition}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-200/60 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500 flex-shrink-0" />
                    <span>{item.condition}</span>
                  </h3>
                  <div className="text-[11px] px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
                    <strong className="text-rose-700 dark:text-rose-400">Không được suy diễn: </strong>
                    <span>{item.doNotInfer}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm">
                  <div className="p-3 bg-white/80 dark:bg-slate-900/70 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Cơ Chế Chính
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item.mainMechanism}
                    </p>
                  </div>

                  <div className="p-3 bg-white/80 dark:bg-slate-900/70 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
                      SpO2 Có Thể Quan Sát
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item.observableSpO2}
                    </p>
                  </div>

                  <div className="p-3 bg-white/80 dark:bg-slate-900/70 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
                      Dữ Liệu Cần Thêm Để Phân Biệt
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {item.additionalDataNeeded}
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
              Cảm Biến Quang Học (PPG) Đo Chỉ Số SpO2 Như Thế Nào?
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
              <span>Độ Trễ Tuần Hoàn Máu (Circulation Delay):</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {hubData.ppgSensorScience.circulationDelay}
            </p>
          </div>

          {/* Sensor comparison: Finger vs Wrist */}
          <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-900/60 space-y-1.5">
            <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Vị Trí Cảm Biến: Ngón Tay và Cổ Tay</span>
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
              Tác Động Lâu Dài Lên Tim Mạch & Ghi Nhận Lâm Sàng
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              OSA có liên quan với tăng nguy cơ tim mạch ở nhiều nhóm người. Điều trị OSA có thể cải thiện một số triệu chứng và chỉ số sức khỏe, nhưng mức lợi ích đối với từng biến cố tim mạch phụ thuộc vào người bệnh, mức độ bệnh, bệnh đi kèm và việc tuân thủ điều trị.
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
                  <strong>Ghi nhận đáp ứng điều trị: </strong>
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
