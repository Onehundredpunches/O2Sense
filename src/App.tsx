import React, { useEffect } from 'react';
import { FunnelFlow } from './components/FunnelFlow';

export const App: React.FC = () => {
  // We keep the dark mode sync in case they want a dark mode toggle later,
  // but we default to light mode for a brighter, medical-wellness feel.
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('o2sense_theme', 'light');
    // Ensure founder mode is wiped from local storage for existing users
    localStorage.removeItem('o2sense_mode');
  }, []);

  return (
    <div className="font-sans min-h-screen bg-slate-50 text-slate-800 selection:bg-teal-500 selection:text-white">
      <FunnelFlow />
    </div>
  );
};

export default App;
