import React, { useState } from 'react';
import { CognitiveTrap, RoleplayScenario, MedicalSource } from '../types/disease';
import { ModuleAView } from './ModuleAView';
import { ModuleBView } from './ModuleBView';
import { HelpCircle, MessageSquare } from 'lucide-react';

interface CasesAndTrapsViewProps {
  traps: CognitiveTrap[];
  scenarios: RoleplayScenario[];
  sources: MedicalSource[];
  understoodIds: string[];
  needsReviewIds: string[];
  completedIds: string[];
  savedAnswers: Record<string, { selectedOptionId: string; reflection: string; timestamp: string }>;
  onToggleTrapStatus: (trapId: string, status: 'understood' | 'needsReview' | 'reset') => void;
  onSaveScenario: (scenarioId: string, optionId: string, reflection: string) => void;
  userMode: 'general' | 'founder';
  onOpenGlossary: (termId?: string) => void;
}

export const CasesAndTrapsView: React.FC<CasesAndTrapsViewProps> = ({
  traps,
  scenarios,
  sources,
  understoodIds,
  needsReviewIds,
  completedIds,
  savedAnswers,
  onToggleTrapStatus,
  onSaveScenario,
  userMode,
  onOpenGlossary,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'traps' | 'scenarios'>('traps');

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 space-y-6 pb-28 md:pb-16">
      {/* Subtab Switcher Header */}
      <div className="flex items-center justify-center">
        <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center shadow-sm">
          <button
            onClick={() => setActiveSubTab('traps')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'traps'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>8 Hiểu Lầm Kinh Điển (MythBusters)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('scenarios')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'scenarios'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>6 Tình Huống Thực Tế & Luyện Hỏi</span>
          </button>
        </div>
      </div>

      {/* Render Active Subtab */}
      {activeSubTab === 'traps' ? (
        <ModuleAView
          traps={traps}
          sources={sources}
          understoodIds={understoodIds}
          needsReviewIds={needsReviewIds}
          onToggleStatus={onToggleTrapStatus}
          onOpenGlossary={onOpenGlossary}
        />
      ) : (
        <ModuleBView
          scenarios={scenarios}
          completedIds={completedIds}
          savedAnswers={savedAnswers}
          onSaveScenario={onSaveScenario}
          userMode={userMode}
          onOpenGlossary={onOpenGlossary}
        />
      )}
    </div>
  );
};
