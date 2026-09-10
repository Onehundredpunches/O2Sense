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
  UserCheck, 
  Microscope,
  Sparkles,
  Compass
} from 'lucide-react';

export type AppTab = 'home' | 'story' | 'waveforms' | 'knowledge' | 'cases' | 'help';

interface HeaderProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onStartQuickReview: () => void;
  disclaimer: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  userMode: 'general' | 'founder';
  onToggleUserMode: () => void;
  onOpenGlossary: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onStartQuickReview,
  disclaimer,
  isDarkMode,
  onToggleTheme,
  userMode,
  onToggleUserMode,
  onOpenGlossary,
}) => {
  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#fcfbf9]/95 dark:bg-[#0f172a]/95 backdrop-blur-md border-b border-stone-200/90 dark:border-slate-800 transition-colors shadow-sm">
        {/* Persistent Medical Disclaimer Bar */}
        <div className="bg-amber-50/90 dark:bg-amber-950/60 border-b border-amber-200/70 dark:border-amber-900/60 px-3 py-1.5 text-center text-[11px] sm:text-xs text-amber-900 dark:text-amber-200/90 flex items-center justify-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <span className="font-medium tracking-wide">{disclaimer}</span>
        </div>

        {/* Main Nav Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Name */}
            <div 
              className="cursor-pointer select-none py-1 transition-opacity hover:opacity-95" 
              onClick={() => onSelectTab('home')}
              title="Về trang chủ O2Sense"
            >
              <BrandLogo userMode={userMode} size="md" />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              <button
                onClick={() => onSelectTab('home')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  currentTab === 'home'
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Tổng quan</span>
              </button>

              <button
                onClick={() => onSelectTab('story')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  currentTab === 'story'
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Wind className="w-3.5 h-3.5" />
                <span>1 Đêm Thở Nghẽn (3D)</span>
              </button>

              <button
                onClick={() => onSelectTab('waveforms')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  currentTab === 'waveforms'
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Giải Mã SpO2 Đêm</span>
              </button>

              <button
                onClick={() => onSelectTab('knowledge')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  currentTab === 'knowledge'
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Bách Khoa Y Học</span>
              </button>

              <button
                onClick={() => onSelectTab('cases')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  currentTab === 'cases'
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Hiểu Lầm & Tình Huống</span>
              </button>

              <button
                onClick={() => onSelectTab('help')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  currentTab === 'help'
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Cẩm Nang</span>
              </button>
            </nav>

            {/* Right Utility Buttons */}
            <div className="flex items-center space-x-2">
              {/* Persona Switcher (Đại chúng vs Founder) */}
              <button
                onClick={onToggleUserMode}
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  userMode === 'founder'
                    ? 'bg-purple-100/70 border-purple-300 text-purple-900 dark:bg-purple-950/80 dark:border-purple-800 dark:text-purple-300'
                    : 'bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                }`}
                title={userMode === 'founder' ? 'Đang ở Chế độ Founder' : 'Đang ở Chế độ Đại chúng'}
              >
                {userMode === 'founder' ? (
                  <>
                    <Microscope className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Mode: Founder</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>Mode: Đại chúng</span>
                  </>
                )}
              </button>

              {/* Quick Glossary Button */}
              <button
                onClick={onOpenGlossary}
                className="p-2 rounded-xl text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Mở Từ Điển Ẩn Dụ Y Khoa"
              >
                <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </button>

              {/* Light / Dark Mode Toggle */}
              <button
                onClick={onToggleTheme}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-slate-800 transition-colors"
                title={isDarkMode ? 'Chuyển sang Chế độ Dịu Mắt (Eye-Care Light)' : 'Chuyển sang Chế độ Ban Đêm (Midnight Navy)'}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              </button>

              {/* Quick 5-Minute Review Button */}
              <button
                data-testid="quick-review-header-btn"
                onClick={onStartQuickReview}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                title="Ôn tập nhanh 5 phút trước phỏng vấn"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">Ôn nhanh 5p</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Thumb-Friendly for Phones, Eye-Care styled) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#fcfbf9]/95 dark:bg-[#0f172a]/95 backdrop-blur-lg border-t border-stone-200/90 dark:border-slate-800 lg:hidden px-2 py-1.5 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all ${
            currentTab === 'home'
              ? 'text-teal-600 dark:text-teal-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Tổng quan</span>
        </button>

        <button
          onClick={() => onSelectTab('story')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all ${
            currentTab === 'story'
              ? 'text-teal-600 dark:text-teal-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Wind className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">1 Đêm (3D)</span>
        </button>

        <button
          onClick={() => onSelectTab('waveforms')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all ${
            currentTab === 'waveforms'
              ? 'text-teal-600 dark:text-teal-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Đồ thị SpO2</span>
        </button>

        <button
          onClick={() => onSelectTab('knowledge')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all ${
            currentTab === 'knowledge'
              ? 'text-teal-600 dark:text-teal-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Bách khoa</span>
        </button>

        <button
          onClick={() => onSelectTab('cases')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all ${
            currentTab === 'cases'
              ? 'text-teal-600 dark:text-teal-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Tình huống</span>
        </button>

        <button
          onClick={() => onSelectTab('help')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all ${
            currentTab === 'help'
              ? 'text-teal-600 dark:text-teal-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Cẩm nang</span>
        </button>
      </nav>
    </>
  );
};
