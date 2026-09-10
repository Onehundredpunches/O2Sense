import React, { useState, useMemo } from 'react';
import { 
  HELP_TOPICS 
} from '../data/helpCenterData';
import { AppTab } from './Header';
import { 
  Search, 
  BookOpen, 
  Compass, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Lightbulb, 
  Maximize2, 
  Keyboard, 
  Microscope, 
  RotateCcw,
  Sparkles,
  Zap,
  UserCheck
} from 'lucide-react';

interface HelpCenterViewProps {
  onSelectTab: (tab: AppTab) => void;
  initialTopicId?: string;
  userMode: 'general' | 'founder';
  onOpenGlossary: (termId?: string) => void;
  onStartQuickReview: () => void;
}

export const HelpCenterView: React.FC<HelpCenterViewProps> = ({
  onSelectTab,
  initialTopicId,
  userMode,
  onOpenGlossary,
  onStartQuickReview,
}) => {
  const [activeTopicId, setActiveTopicId] = useState<string>(
    initialTopicId || HELP_TOPICS[0].id
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPinId, setSelectedPinId] = useState<number | null>(null);

  // Filter topics based on search query
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return HELP_TOPICS;
    const q = searchQuery.toLowerCase();
    return HELP_TOPICS.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.badges.some((b) => b.toLowerCase().includes(q)) ||
        t.hotspots.some((h) => h.label.toLowerCase().includes(q) || h.description.toLowerCase().includes(q)) ||
        t.actionSteps.some((s) => s.action.toLowerCase().includes(q) || s.detail.toLowerCase().includes(q)) ||
        t.proTips.some((p) => p.toLowerCase().includes(q)) ||
        t.commonMistakes.some((m) => m.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Current active topic
  const currentTopic = useMemo(() => {
    const found = HELP_TOPICS.find((t) => t.id === activeTopicId);
    return found || filteredTopics[0] || HELP_TOPICS[0];
  }, [activeTopicId, filteredTopics]);

  // Navigation: Next and Prev topic
  const currentIndex = HELP_TOPICS.findIndex((t) => t.id === currentTopic.id);
  const prevTopic = currentIndex > 0 ? HELP_TOPICS[currentIndex - 1] : null;
  const nextTopic = currentIndex < HELP_TOPICS.length - 1 ? HELP_TOPICS[currentIndex + 1] : null;

  // Active pin details
  const selectedPin = useMemo(() => {
    if (selectedPinId === null) return null;
    return currentTopic.hotspots.find((h) => h.id === selectedPinId) || null;
  }, [selectedPinId, currentTopic]);

  const selectedPinIndex = useMemo(() => {
    if (!selectedPin) return -1;
    return currentTopic.hotspots.findIndex((h) => h.id === selectedPin.id);
  }, [selectedPin, currentTopic]);

  const handleNavigatePin = (delta: number) => {
    if (selectedPinIndex === -1) return;
    const nextIdx = selectedPinIndex + delta;
    if (nextIdx >= 0 && nextIdx < currentTopic.hotspots.length) {
      setSelectedPinId(currentTopic.hotspots[nextIdx].id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24 animate-fadeIn">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 via-sky-950 to-slate-900 text-white p-6 sm:p-10 mb-10 shadow-xl border border-teal-500/20">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-4 border border-teal-500/30">
            <Compass className="w-3.5 h-3.5" />
            <span>Cẩm Nang Vận Hành & Hướng Dẫn Trực Quan</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-3">
            Cẩm Nang Vận Hành & Hướng Dẫn Sử Dụng
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Tài liệu hướng dẫn trực quan đối chiếu chuẩn xác từng module: <strong>Ảnh chụp giao diện thực tế</strong> kết hợp <strong>các điểm ghim tương tác</strong>, quy trình thao tác lâm sàng và lưu ý cốt lõi.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span><strong>6</strong> Chuyên đề bao quát</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <Layers className="w-4 h-4 text-sky-400" />
              <span><strong>{HELP_TOPICS.reduce((sum, t) => sum + t.hotspots.length, 0)}</strong> Điểm ghim tương tác UI</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span><strong>100%</strong> Trực quan thực chiến</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-teal-300">
              {userMode === 'founder' ? (
                <>
                  <Microscope className="w-4 h-4 text-purple-400" />
                  <span>Chế độ: <strong>Bản Chuyên Sâu</strong></span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 text-teal-400" />
                  <span>Chế độ: <strong>Bản Phổ Thông</strong></span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Sidebar Navigation & Search (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm tính năng, ODI, răng cưa, 3D..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                Xóa
              </button>
            )}
          </div>

          {/* Topics List Card */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-3 border border-stone-200/80 dark:border-slate-800 shadow-sm">
            <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Danh mục chuyên đề ({filteredTopics.length})
            </div>
            <div className="space-y-1.5 mt-1">
              {filteredTopics.map((topic, idx) => {
                const isActive = topic.id === currentTopic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => {
                      setActiveTopicId(topic.id);
                      setSelectedPinId(null);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-start gap-3 group ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-500/10 to-sky-500/10 dark:from-teal-950/70 dark:to-sky-950/70 border border-teal-500/30 text-teal-950 dark:text-teal-200 shadow-sm'
                        : 'hover:bg-stone-100/80 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${
                      isActive 
                        ? 'bg-teal-600 text-white shadow-sm' 
                        : 'bg-stone-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-stone-200 dark:group-hover:bg-slate-700'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-black truncate">
                          {topic.title}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider flex-shrink-0 ${
                          topic.category === 'Cơ bản' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300' :
                          topic.category === 'Mô phỏng' ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300' :
                          topic.category === 'Phân tích' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300' :
                          'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                        }`}>
                          {topic.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {topic.subtitle}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                        <span>{topic.hotspots.length} điểm ghim UI</span>
                        <span>•</span>
                        <span>{topic.actionSteps.length} bước thao tác</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Fast Actions Card */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-5 border border-stone-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Công cụ bổ trợ nhanh
            </div>
            <button
              onClick={() => onOpenGlossary()}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-teal-50/70 dark:bg-teal-950/50 hover:bg-teal-100/70 dark:hover:bg-teal-900/50 border border-teal-200/80 dark:border-teal-800/80 text-teal-800 dark:text-teal-200 text-xs font-bold transition-all"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Từ Điển Ẩn Dụ Y Khoa</span>
              </div>
              <span className="text-[10px] bg-teal-200 dark:bg-teal-800 px-2 py-0.5 rounded-full">Tra cứu</span>
            </button>

            <button
              onClick={onStartQuickReview}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/50 hover:bg-amber-100/70 dark:hover:bg-amber-900/50 border border-amber-200/80 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs font-bold transition-all"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Ôn Nhanh 5 Phút Phản Xạ</span>
              </div>
              <span className="text-[10px] bg-amber-200 dark:bg-amber-800 px-2 py-0.5 rounded-full">Luyện tập</span>
            </button>
          </div>

          {/* Quick Global Shortcuts Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-slate-300 rounded-3xl p-5 border border-slate-800 shadow-md">
            <div className="flex items-center gap-2 text-xs font-black text-amber-400 uppercase tracking-wider mb-3">
              <Keyboard className="w-4 h-4" />
              <span>Phím tắt thao tác nhanh</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-slate-800/80 px-2.5 py-1.5 rounded-xl flex items-center justify-between border border-slate-700">
                <span className="text-slate-400">Đổi Tab:</span>
                <kbd className="bg-slate-900 px-1.5 py-0.5 rounded font-mono font-bold text-teal-400">1 - 6</kbd>
              </div>
              <div className="bg-slate-800/80 px-2.5 py-1.5 rounded-xl flex items-center justify-between border border-slate-700">
                <span className="text-slate-400">Ôn 5 phút:</span>
                <kbd className="bg-slate-900 px-1.5 py-0.5 rounded font-mono font-bold text-amber-400">Q</kbd>
              </div>
              <div className="bg-slate-800/80 px-2.5 py-1.5 rounded-xl flex items-center justify-between border border-slate-700">
                <span className="text-slate-400">Từ điển:</span>
                <kbd className="bg-slate-900 px-1.5 py-0.5 rounded font-mono font-bold text-sky-400">G</kbd>
              </div>
              <div className="bg-slate-800/80 px-2.5 py-1.5 rounded-xl flex items-center justify-between border border-slate-700">
                <span className="text-slate-400">Giao diện:</span>
                <kbd className="bg-slate-900 px-1.5 py-0.5 rounded font-mono font-bold text-slate-200">T</kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Topic Guide Canvas (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Active Topic Header & Live Jump Button */}
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200/70 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 uppercase tracking-wide">
                    Chuyên đề {currentIndex + 1} / {HELP_TOPICS.length}
                  </span>
                  {currentTopic.badges.map((b) => (
                    <span
                      key={b}
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      #{b}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {currentTopic.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {currentTopic.subtitle}
                </p>
              </div>

              {/* Live Jump CTA */}
              <button
                onClick={() => {
                  onSelectTab(currentTopic.targetTab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-500/20 active:scale-95 transition-all flex-shrink-0"
              >
                <span>Mở tính năng này</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            {/* Interactive Visual UI Canvas with Hotspot Pins */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    Bản đồ giao diện & Điểm ghim tương tác
                  </span>
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    (Click vào số tròn trên ảnh hoặc danh sách bên dưới để xem chỉ dẫn)
                  </span>
                </div>
                {selectedPinId !== null && (
                  <button
                    onClick={() => setSelectedPinId(null)}
                    className="text-xs text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Bỏ chọn ghim
                  </button>
                )}
              </div>

              {/* Image Container with Pins: OVERFLOW VISIBLE to completely eliminate clipping */}
              <div className="relative rounded-2xl border-2 border-stone-200/90 dark:border-slate-700/80 shadow-lg bg-slate-950">
                {/* Rounded wrapper for the screenshot */}
                <div className="rounded-2xl overflow-hidden">
                  <img
                    src={currentTopic.imageSrc}
                    alt={currentTopic.title}
                    className="w-full h-auto object-cover select-none block transition-transform duration-300"
                  />
                </div>

                {/* Hotspot Pins Overlay */}
                {currentTopic.hotspots.map((pin) => {
                  const isSelected = selectedPinId === pin.id;
                  const isTopHalf = pin.yPercent < 42;
                  const isLeftEdge = pin.xPercent < 28;
                  const isRightEdge = pin.xPercent > 72;

                  let tooltipPositionClass = '';
                  if (isTopHalf) {
                    tooltipPositionClass += ' top-full mt-3';
                  } else {
                    tooltipPositionClass += ' bottom-full mb-3';
                  }

                  if (isLeftEdge) {
                    tooltipPositionClass += ' left-0';
                  } else if (isRightEdge) {
                    tooltipPositionClass += ' right-0';
                  } else {
                    tooltipPositionClass += ' left-1/2 -translate-x-1/2';
                  }

                  return (
                    <div
                      key={pin.id}
                      style={{
                        left: `${pin.xPercent}%`,
                        top: `${pin.yPercent}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      className="absolute z-20"
                    >
                      <button
                        onClick={() => setSelectedPinId(isSelected ? null : pin.id)}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-xs transition-all shadow-lg cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/50 scale-125'
                            : 'bg-teal-500 text-white ring-2 ring-white hover:scale-110 hover:bg-teal-400 animate-pulse'
                        }`}
                        title={pin.label}
                      >
                        {pin.id}
                      </button>

                      {/* Smart Directional Tooltip (Desktop/Tablet) */}
                      {isSelected && (
                        <div
                          className={`hidden sm:block absolute ${tooltipPositionClass} w-64 sm:w-72 p-3.5 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-amber-400/50 text-xs z-30 pointer-events-auto animate-fadeIn`}
                        >
                          <div className="font-bold text-amber-400 flex items-center justify-between gap-1.5 mb-1.5">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 inline-flex items-center justify-center text-[10px] font-black flex-shrink-0">
                                {pin.id}
                              </span>
                              <span className="truncate">{pin.label}</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPinId(null);
                              }}
                              className="text-slate-400 hover:text-white text-xs font-bold px-1"
                            >
                              ✕
                            </button>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed mb-2">
                            {pin.description}
                          </p>
                          <div className="text-[10px] bg-slate-800 px-2 py-1 rounded text-teal-300 font-medium">
                            👉 Thao tác: {pin.actionHint}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ACTIVE FOCUS INSPECTOR PANEL: Always full-width, never clipped, perfect for all screens */}
              {selectedPin && (
                <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-teal-500/10 to-sky-500/10 border-2 border-amber-400/80 dark:border-amber-400/60 shadow-md animate-fadeIn flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-9 h-9 rounded-2xl bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center flex-shrink-0 shadow-md ring-4 ring-amber-400/20">
                      {selectedPin.id}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                          Điểm ghim #{selectedPin.id} / {currentTopic.hotspots.length}
                        </span>
                        <span className="text-slate-400 dark:text-slate-600">•</span>
                        <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                          {selectedPin.label}
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {selectedPin.description}
                      </p>
                      <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 dark:bg-teal-950/60 border border-teal-500/30 text-xs font-bold text-teal-800 dark:text-teal-300">
                        <span>👉 Thao tác:</span>
                        <span>{selectedPin.actionHint}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                    <button
                      onClick={() => handleNavigatePin(-1)}
                      disabled={selectedPinIndex <= 0}
                      className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs border border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-700 disabled:opacity-40 transition-all shadow-sm"
                      title="Điểm trước"
                    >
                      ← Trước
                    </button>
                    <button
                      onClick={() => handleNavigatePin(1)}
                      disabled={selectedPinIndex >= currentTopic.hotspots.length - 1}
                      className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs border border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-700 disabled:opacity-40 transition-all shadow-sm"
                      title="Điểm tiếp"
                    >
                      Tiếp →
                    </button>
                    <button
                      onClick={() => setSelectedPinId(null)}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              )}

              {/* Pins Quick Drawer Grid with Bidirectional Selection */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentTopic.hotspots.map((pin) => {
                  const isSelected = selectedPinId === pin.id;
                  return (
                    <div
                      key={pin.id}
                      onClick={() => setSelectedPinId(isSelected ? null : pin.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'bg-amber-500/15 dark:bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/50 shadow-md text-slate-900 dark:text-white scale-[1.01]'
                          : 'bg-stone-50 dark:bg-slate-800/40 border-stone-200 dark:border-slate-800/80 hover:border-teal-500/40 text-slate-700 dark:text-slate-300 hover:bg-stone-100/80'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5 shadow-sm ${
                        isSelected ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-400/50' : 'bg-teal-600 text-white'
                      }`}>
                        {pin.id}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">{pin.label}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {pin.actionHint}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step-by-Step Action Guide */}
            <div className="mt-10 pt-8 border-t border-stone-200/70 dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Chỉ dẫn thao tác từng bước</span>
              </h3>
              <div className="space-y-3">
                {currentTopic.actionSteps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/50 border border-stone-200/80 dark:border-slate-800 flex items-start gap-3.5"
                  >
                    <div className="w-6 h-6 rounded-xl bg-teal-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {step.stepNumber}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {step.action}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {step.detail}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Tips & Common Mistakes Two-Box Grid */}
            <div className="mt-10 pt-8 border-t border-stone-200/70 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pro Tips */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/40">
                <div className="flex items-center gap-2 text-xs font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-2">
                  <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Mẹo thực chiến & Ghi nhớ</span>
                </div>
                <ul className="space-y-2 text-xs text-emerald-900/90 dark:text-emerald-200/80 leading-relaxed">
                  {currentTopic.proTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Common Mistakes */}
              <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40">
                <div className="flex items-center gap-2 text-xs font-black text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Bẫy lâm sàng thường gặp</span>
                </div>
                <ul className="space-y-2 text-xs text-amber-900/90 dark:text-amber-200/80 leading-relaxed">
                  {currentTopic.commonMistakes.map((err, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="font-bold">•</span>
                      <span>{err}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Next/Prev Topic Navigation */}
            <div className="mt-10 pt-6 border-t border-stone-200/70 dark:border-slate-800 flex items-center justify-between gap-4">
              {prevTopic ? (
                <button
                  onClick={() => {
                    setActiveTopicId(prevTopic.id);
                    setSelectedPinId(null);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <span>← Bài trước:</span>
                  <span className="hidden sm:inline text-teal-600 dark:text-teal-400">{prevTopic.title}</span>
                </button>
              ) : <div />}

              {nextTopic && (
                <button
                  onClick={() => {
                    setActiveTopicId(nextTopic.id);
                    setSelectedPinId(null);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>Bài tiếp theo:</span>
                  <span className="hidden sm:inline">{nextTopic.title}</span>
                  <span>→</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterView;
