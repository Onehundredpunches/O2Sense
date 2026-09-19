import React from 'react';

export interface AnatomyScene3DProps {
  step: number; // 1 to 5
  airwayStatus: 'open' | 'narrowed' | 'collapsed' | 'reopening';
  airflowPercent: number;
  spo2Percent: number;
  isBrainArousal: boolean;
  isSympathetic: boolean;
}

/**
 * Production Zero-Overhead Stub for AnatomyScene3D.
 *
 * In production builds (Vercel / npm run build):
 * - Replaces the ~824 kB Three.js interactive scene via Vite alias.
 * - Imports zero Three.js / WebGL / @react-three dependencies.
 * - Maintains 100% type parity with AnatomyScene3D.tsx so `npx tsc --noEmit` passes cleanly.
 * - Preserves container dimensions (h-[460px] sm:h-[520px]) to prevent layout shifts.
 */
export const AnatomyScene3D: React.FC<AnatomyScene3DProps> = ({
  step,
  airwayStatus,
  airflowPercent,
  spo2Percent,
  isBrainArousal,
  isSympathetic,
}) => {
  return (
    <div
      data-testid="anatomy-scene-3d-stub"
      data-step={step}
      data-airway-status={airwayStatus}
      data-airflow={airflowPercent}
      data-spo2={spo2Percent}
      data-brain-arousal={isBrainArousal ? 'true' : 'false'}
      data-sympathetic={isSympathetic ? 'true' : 'false'}
      className="relative w-full h-[460px] sm:h-[520px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col items-center justify-center p-6 text-center select-none"
    >
      <div className="max-w-md p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-xl backdrop-blur-sm flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-slate-100">
          Chế Độ Xem Giải Phẫu Đứng Dọc Sagittal Y Khoa
        </h3>

        <p className="text-xs text-slate-400 leading-relaxed">
          Phiên bản trực tuyến tối ưu hóa hiệu năng với Bản đồ Sagittal 2D độ phân giải cao (độ trễ 0ms, không tiêu tốn GPU). Mô hình 3D WebGL 360° được bảo lưu hoàn chỉnh trong môi trường phát triển cục bộ.
        </p>

        <div className="flex items-center gap-2 mt-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-950/80 text-teal-300 border border-teal-800/60">
            Giai đoạn {step}/5
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-slate-800 text-slate-300 border border-slate-700">
            {airwayStatus}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnatomyScene3D;
