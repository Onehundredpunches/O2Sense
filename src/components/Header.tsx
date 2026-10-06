import React from 'react';
import { BrandLogo } from './BrandLogo';
import { 
  ShieldAlert, 
  Zap, 
  Home, 
  Wind, 
  Activity, 
  BookOpen, 
  HelpCircle, 
  Sun, 
  Moon, 
  Sparkles, 
  Compass,
  ClipboardCheck
} from 'lucide-react';

export type AppTab = 'home' | 'screener' | 'story' | 'waveforms' | 'knowledge' | 'cases' | 'help';

interface HeaderProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onStartQuickReview: () => void;
  disclaimer: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenGlossary: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onStartQuickReview,
  disclaimer,
  isDarkMode,
  onToggleTheme,
  onOpenGlossary,
}) => {
  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#fcfbf9]/95 dark:bg-[#0f172a]/95 backdrop-blur-md border-b border-stone-200/90 dark:border-slate-800 transition-colors shadow-sm max-w-full overflow-hidden">
        {/* Persistent Medical Disclaimer Bar */}
        <div className="bg-amber-50/90 dark:bg-amber-950/60 border-b border-amber-200/70 dark:border-amber-900/60 px-3 py-1.5 text-center text-xs sm:text-sm text-amber-900 dark:text-amber-200/90 flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <span className="font-medium tracking-wide truncate max-w-4xl">{disclaimer}</span>
        </div>

        {/* Main Nav Bar */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 w-full">
          <div className="flex items-center justify-between h-16 gap-1">
            {/* Brand Logo & Name */}
            <div 
              className="cursor-pointer select-none py-1 transition-opacity hover:opacity-95 flex-shrink-0" 
              onClick={() => onSelectTab('home')}
              title="Về trang chủ O2Sense"
            >
              <BrandLogo size="md" />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 flex-shrink">
              <button
                onClick={() => onSelectTab('home')}
                className={`flex items-center space-x-1 px-2.5 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all min-h-[44px] whitespace-nowrap ${
                  currentTab === 'home'
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Home className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                <span>Tổng quan</span>
              </button>

              <button
                onClick={() => onSelectTab('screener')}
                className={`flex items-center space-x-1 px-2.5 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all min-h-[44px] whitespace-nowrap ${
                  currentTab === 'screener'
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ClipboardCheck className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-teal-600 dark:text-teal-400" />
                <span>STOP-Bang</span>
              </button>

              <button
                data-testid="nav-tab-story"
                onClick={() => onSelectTab('story')}
                className={`flex items-center space-x-1 px-2.5 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all min-h-[44px] whitespace-nowrap ${
                  currentTab === 'story'
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Wind className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                <span>1 Đêm Thở Nghẽn</span>
              </button>

              <button
                onClick={() => onSelectTab('waveforms')}
                className={`flex items-center space-x-1 px-2.5 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all min-h-[44px] whitespace-nowrap ${
                  currentTab === 'waveforms'
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Activity className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                <span>Đồ thị SpO2</span>
              </button>

              <button
                onClick={() => onSelectTab('knowledge')}
                className={`flex items-center space-x-1 px-2.5 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all min-h-[44px] whitespace-nowrap ${
                  currentTab === 'knowledge'
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                <span>Bách Khoa</span>
              </button>

              <button
                onClick={() => onSelectTab('cases')}
                className={`flex items-center space-x-1 px-2.5 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all min-h-[44px] whitespace-nowrap ${
                  currentTab === 'cases'
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                <span>Tình Huống</span>
              </button>

              <button
                onClick={() => onSelectTab('help')}
                className={`flex items-center space-x-1 px-2.5 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all min-h-[44px] whitespace-nowrap ${
                  currentTab === 'help'
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Compass className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                <span>Cẩm Nang</span>
              </button>
            </nav>

            {/* Right Utility Buttons */}
            <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0">
              {/* Quick Glossary Button */}
              <button
                onClick={onOpenGlossary}
                className="flex items-center gap-1 p-2 xl:px-2.5 xl:py-2 rounded-xl text-slate-600 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[40px] xl:min-h-[44px]"
                title="Mở Từ Điển Ẩn Dụ Y Khoa"
              >
                <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="hidden 2xl:inline text-xs font-semibold">Từ điển</span>
              </button>

              {/* Light / Dark Mode Toggle */}
              <button
                onClick={onToggleTheme}
                className="p-2 xl:p-2.5 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-slate-800 transition-colors min-h-[40px] xl:min-h-[44px] flex items-center justify-center"
                title={isDarkMode ? 'Chuyển sang Giao diện Sáng Dịu Mắt' : 'Chuyển sang Giao diện Ban Đêm'}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              </button>

              {/* Quick 5-Minute Review Button */}
              <button
                data-testid="quick-review-header-btn"
                onClick={onStartQuickReview}
                className="flex items-center gap-1 px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold text-xs shadow-sm active:scale-95 transition-all min-h-[40px] xl:min-h-[44px]"
                title="Ôn tập nhanh 5 phút kiến thức quan trọng"
              >
                <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
                <span className="hidden xl:inline">Ôn 5p</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Thumb-Friendly, min 48px tap targets, legible text) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#fcfbf9]/98 dark:bg-[#0f172a]/98 backdrop-blur-lg border-t border-stone-200 dark:border-slate-800 lg:hidden px-1 py-1 flex items-center justify-around shadow-2xl safe-area-pb">
        <button
          onClick={() => onSelectTab('home')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all min-h-[48px] ${
            currentTab === 'home'
              ? 'text-teal-700 dark:text-teal-400 font-bold bg-teal-50/70 dark:bg-teal-950/40'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-xs mt-1 font-medium">Trang chủ</span>
        </button>

        <button
          onClick={() => onSelectTab('screener')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all min-h-[48px] ${
            currentTab === 'screener'
              ? 'text-teal-700 dark:text-teal-400 font-bold bg-teal-50/70 dark:bg-teal-950/40'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <ClipboardCheck className="w-4 h-4" />
          <span className="text-xs mt-1 font-medium">Kiểm tra</span>
        </button>

        <button
          onClick={() => onSelectTab('story')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all min-h-[48px] ${
            currentTab === 'story'
              ? 'text-teal-700 dark:text-teal-400 font-bold bg-teal-50/70 dark:bg-teal-950/40'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Wind className="w-4 h-4" />
          <span className="text-xs mt-1 font-medium">Thở nghẽn</span>
        </button>

        <button
          onClick={() => onSelectTab('waveforms')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all min-h-[48px] ${
            currentTab === 'waveforms'
              ? 'text-teal-700 dark:text-teal-400 font-bold bg-teal-50/70 dark:bg-teal-950/40'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span className="text-xs mt-1 font-medium">Đồ thị</span>
        </button>

        <button
          onClick={() => onSelectTab('cases')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all min-h-[48px] ${
            currentTab === 'cases'
              ? 'text-teal-700 dark:text-teal-400 font-bold bg-teal-50/70 dark:bg-teal-950/40'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span className="text-xs mt-1 font-medium">Tình huống</span>
        </button>

        <button
          onClick={() => onSelectTab('help')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all min-h-[48px] ${
            currentTab === 'help'
              ? 'text-teal-700 dark:text-teal-400 font-bold bg-teal-50/70 dark:bg-teal-950/40'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span className="text-xs mt-1 font-medium">Cẩm nang</span>
        </button>
      </nav>
    </>
  );
};
