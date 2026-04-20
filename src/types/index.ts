// ── OneStep SDK Types ──
export type OSTState = 'Uninitialized' | 'Ready' | 'Identified' | 'Error';
export type OSTRecorderState =
  | 'INITIALIZED'
  | 'RECORDING'
  | 'FINALIZING'
  | 'DONE';
export type OSTAnalyserState =
  | 'Idle'
  | 'Uploading'
  | 'Analyzing'
  | 'Analyzed'
  | 'Failed';
export type OSTResultState =
  | 'FULL_ANALYSIS'
  | 'PARTIAL_ANALYSIS'
  | 'EMPTY_ANALYSIS';

export interface OSTMotionMeasurement {
  id: string;
  timestamp: number;
  type: string;
  resultState: OSTResultState;
  steps?: number;
  params: Record<string, number>;
  error?: string;
}

export interface OSTDailySummary {
  timestamp: number;
  steps: number;
  walkingBouts: number;
  params: Record<string, number>;
}

export interface OSTInsight {
  textMarkdown: string;
  insightType: string;
  intent: string;
  paramName?: string;
}

// ── App Domain Types ──
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  sex?: 'MALE' | 'FEMALE' | 'OTHER';
  onboardedAt?: string;
  subscriptionTier: 'free' | 'pro';
}

export interface Session {
  id: string;
  date: string;
  durationSeconds: number;
  steps: number;
  walkScore?: number;
  velocity?: number;
  strideLength?: number;
  doubleSupport?: number;
  resultState: OSTResultState;
}

export interface DailyProgress {
  date: string;
  sessionsCompleted: number;
  totalSteps: number;
  bestWalkScore?: number;
  compliancePercent: number;
}

export interface EducationArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'nmre' | 'positioning' | 'pain' | 'progress';
  readTimeMinutes: number;
  imageUrl?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  requirement: {type: 'sessions' | 'streak' | 'score'; value: number};
}

export type OnboardingStep =
  | 'welcome'
  | 'device_setup'
  | 'fit_guidance'
  | 'position_guidance'
  | 'initial_assessment'
  | 'complete';
