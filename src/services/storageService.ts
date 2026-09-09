export interface UserProgress {
  understoodTrapIds: string[];
  needsReviewTrapIds: string[];
  completedScenarioIds: string[];
  scenarioAnswers: Record<string, { selectedOptionId: string; reflection: string; timestamp: string }>;
  lastQuickReviewDate: string | null;
  quickReviewCount: number;
}

const STORAGE_KEY = 'o2learn_user_progress_v1';

const defaultProgress: UserProgress = {
  understoodTrapIds: [],
  needsReviewTrapIds: [],
  completedScenarioIds: [],
  scenarioAnswers: {},
  lastQuickReviewDate: null,
  quickReviewCount: 0,
};

export const getProgress = (): UserProgress => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    return { ...defaultProgress, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Error reading localStorage:', err);
    return defaultProgress;
  }
};

export const saveProgress = (progress: UserProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Error saving localStorage:', err);
  }
};

export const markTrapStatus = (trapId: string, status: 'understood' | 'needsReview' | 'reset'): UserProgress => {
  const progress = getProgress();
  const understoodSet = new Set(progress.understoodTrapIds);
  const reviewSet = new Set(progress.needsReviewTrapIds);

  if (status === 'understood') {
    understoodSet.add(trapId);
    reviewSet.delete(trapId);
  } else if (status === 'needsReview') {
    reviewSet.add(trapId);
    understoodSet.delete(trapId);
  } else {
    understoodSet.delete(trapId);
    reviewSet.delete(trapId);
  }

  const updated: UserProgress = {
    ...progress,
    understoodTrapIds: Array.from(understoodSet),
    needsReviewTrapIds: Array.from(reviewSet),
  };
  saveProgress(updated);
  return updated;
};

export const saveScenarioResult = (scenarioId: string, selectedOptionId: string, reflection: string): UserProgress => {
  const progress = getProgress();
  const completedSet = new Set(progress.completedScenarioIds);
  completedSet.add(scenarioId);

  const updated: UserProgress = {
    ...progress,
    completedScenarioIds: Array.from(completedSet),
    scenarioAnswers: {
      ...progress.scenarioAnswers,
      [scenarioId]: {
        selectedOptionId,
        reflection,
        timestamp: new Date().toISOString(),
      },
    },
  };
  saveProgress(updated);
  return updated;
};

export const recordQuickReviewCompletion = (): UserProgress => {
  const progress = getProgress();
  const updated: UserProgress = {
    ...progress,
    lastQuickReviewDate: new Date().toISOString(),
    quickReviewCount: (progress.quickReviewCount || 0) + 1,
  };
  saveProgress(updated);
  return updated;
};
