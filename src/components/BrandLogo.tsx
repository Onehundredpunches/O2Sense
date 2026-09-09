import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  className?: string;
  userMode?: 'general' | 'founder';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showWordmark = true,
  className = '',
  userMode
}) => {
  const iconDimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* High-End MedTech Vector Logo Icon */}
      <div className={`relative ${iconDimensions} rounded-2xl bg-gradient-to-br from-teal-500 via-teal-600 to-sky-600 p-[1.5px] shadow-lg shadow-teal-500/20 hover:shadow-teal-500/35 transition-all duration-300 group flex-shrink-0`}>
        {/* Subtle glass reflection overlay */}
        <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-slate-950 flex items-center justify-center overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/15 via-transparent to-sky-400/20 pointer-events-none" />
          
          <svg 
            viewBox="0 0 36 36" 
            className="w-full h-full p-1.5 drop-shadow-[0_0_8px_rgba(20,184,166,0.5)]" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="o2RingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2dd4bf" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
              <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="45%" stopColor="#38bdf8" />
                <stop offset="85%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>

            {/* Continuous Breath / Oxygen Ring Orbit */}
            <circle 
              cx="18" 
              cy="18" 
              r="12.5" 
              stroke="url(#o2RingGrad)" 
              strokeWidth="2" 
              strokeDasharray="4 2 8 2"
              className="opacity-75 group-hover:opacity-100 transition-opacity" 
            />

            {/* Physiological SpO2 & Respiratory Waveform traversing the core */}
            <path 
              d="M7 18.5 H12 C13 18.5 13.8 17.2 14.5 15.5 L16.5 11 L19 25 L21 16 L22.5 20 C23 21 23.8 21 24.5 18.5 H29" 
              stroke="url(#waveGrad)" 
              strokeWidth="2.2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />

            {/* Subscript O2 Satellite Node */}
            <circle cx="25.5" cy="11.5" r="2.2" fill="#38bdf8" className="animate-pulse" />
            <circle cx="25.5" cy="11.5" r="3.6" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.4" />
          </svg>
        </div>
      </div>

      {/* Typography & Brand Wordmark */}
      {showWordmark && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-baseline">
              <span>O</span>
              <span className="text-sm sm:text-base font-black text-teal-600 dark:text-teal-400 mx-[1px] tracking-normal">2</span>
              <span className="bg-gradient-to-r from-teal-600 via-sky-600 to-indigo-600 dark:from-teal-300 dark:via-sky-400 dark:to-teal-200 bg-clip-text text-transparent font-extrabold ml-[1px]">
                Sense
              </span>
            </span>

            {userMode && (
              <span className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full border transition-colors shadow-xs ${
                userMode === 'founder'
                  ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800/80'
                  : 'bg-teal-50 text-teal-700 dark:bg-teal-950/80 dark:text-teal-300 border-teal-200 dark:border-teal-800/80'
              }`}>
                {userMode === 'founder' ? 'Founder Pro' : 'Đại Chúng'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
