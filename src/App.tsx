import React, { useState, useEffect } from 'react';
import rawData from './data/osa.json';
import { DiseaseData } from './types/disease';
import { Header, AppTab } from './components/Header';
import { HomeView } from './components/HomeView';
import { ModuleCView } from './components/ModuleCView';
import { WaveformDetectiveView } from './components/WaveformDetectiveView';
import { KnowledgeHubView } from './components/KnowledgeHubView';
import { CasesAndTrapsView } from './components/CasesAndTrapsView';
import { QuickReviewModal } from './components/QuickReviewModal';
import { GlossaryModal } from './components/GlossaryModal';
import { 
  getProgress, 
  markTrapStatus, 
  saveScenarioResult, 
  recordQuickReviewCompletion, 
  UserProgress 
} from './services/storageService';

const diseaseData = rawData as DiseaseData;

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<AppTab>('home');
  const [isQuickReviewOpen, setIsQuickReviewOpen] = useState<boolean>(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [selectedGlossaryTermId, setSelectedGlossaryTermId] = useState<string | null>(null);

  // Theme: Defaults to false (Light Mode) for Luminous Medical Wellness!
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('o2sense_theme');
    return saved === 'dark';
  });

  // User Mode: 'general' (Đại chúng) by default, or 'founder'
  const [userMode, setUserMode] = useState<'general' | 'founder'>(() => {
    const saved = localStorage.getItem('o2sense_mode');
    return saved === 'founder' ? 'founder' : 'general';
  });

  const [progress, setProgress] = useState<UserProgress>(getProgress());

  // Synchronize HTML dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('o2sense_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('o2sense_theme', 'light');
    }
  }, [isDarkMode]);

  // Synchronize user mode in localStorage
  useEffect(() => {
    localStorage.setItem('o2sense_mode', userMode);
  }, [userMode]);

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleToggleUserMode = () => {
    setUserMode((prev) => (prev === 'general' ? 'founder' : 'general'));
  };

  const handleOpenGlossary = (termId?: string) => {
    if (termId) setSelectedGlossaryTermId(termId);
    setIsGlossaryOpen(true);
  };

  const handleToggleTrapStatus = (trapId: string, status: 'understood' | 'needsReview' | 'reset') => {
    const updated = markTrapStatus(trapId, status);
    setProgress(updated);
  };

  const handleSaveScenario = (scenarioId: string, optionId: string, reflection: string) => {
    const updated = saveScenarioResult(scenarioId, optionId, reflection);
    setProgress(updated);
  };

  const handleCompleteQuickReview = () => {
    const updated = recordQuickReviewCompletion();
    setProgress(updated);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDarkMode ? 'bg-[#090d16] text-slate-100' : 'bg-[#f7f6f2] text-slate-800'
    } selection:bg-teal-500 selection:text-white`}>
      {/* Top Header & Sticky Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onStartQuickReview={() => setIsQuickReviewOpen(true)}
        disclaimer={diseaseData.disclaimer}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        userMode={userMode}
        onToggleUserMode={handleToggleUserMode}
        onOpenGlossary={() => handleOpenGlossary()}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeView
            diseaseData={diseaseData}
            progress={progress}
            onSelectTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onStartQuickReview={() => setIsQuickReviewOpen(true)}
            userMode={userMode}
            onOpenGlossary={handleOpenGlossary}
          />
        )}

        {currentTab === 'story' && (
          <ModuleCView
            steps={diseaseData.mechanismSteps}
            sources={diseaseData.sources}
            onOpenGlossary={handleOpenGlossary}
          />
        )}

        {currentTab === 'waveforms' && (
          <WaveformDetectiveView
            patterns={diseaseData.waveformPatterns || []}
            onOpenGlossary={handleOpenGlossary}
          />
        )}

        {currentTab === 'knowledge' && (
          <KnowledgeHubView
            hubData={diseaseData.knowledgeHub}
            glossary={diseaseData.glossary || []}
            onOpenGlossary={handleOpenGlossary}
          />
        )}

        {currentTab === 'cases' && (
          <CasesAndTrapsView
            traps={diseaseData.traps}
            scenarios={diseaseData.scenarios}
            sources={diseaseData.sources}
            understoodIds={progress.understoodTrapIds}
            needsReviewIds={progress.needsReviewTrapIds}
            completedIds={progress.completedScenarioIds}
            savedAnswers={progress.scenarioAnswers}
            onToggleTrapStatus={handleToggleTrapStatus}
            onSaveScenario={handleSaveScenario}
            userMode={userMode}
            onOpenGlossary={handleOpenGlossary}
          />
        )}
      </main>

      {/* 5-Minute Quick Review Modal */}
      <QuickReviewModal
        isOpen={isQuickReviewOpen}
        onClose={() => setIsQuickReviewOpen(false)}
        traps={diseaseData.traps}
        scenarios={diseaseData.scenarios}
        onCompleteReview={handleCompleteQuickReview}
      />

      {/* 1-Touch Visual Metaphor Glossary Modal */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => {
          setIsGlossaryOpen(false);
          setSelectedGlossaryTermId(null);
        }}
        glossary={diseaseData.glossary || []}
        initialTermId={selectedGlossaryTermId}
      />
    </div>
  );
};

export default App;
