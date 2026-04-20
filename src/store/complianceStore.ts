import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {Session, DailyProgress} from '../types';
import {Config} from '../constants';

interface ComplianceState {
  sessions: Session[];
  todayProgress: DailyProgress;
  weeklyStreak: number;
  isRecording: boolean;
  recorderState: string;
  analyserState: string;
  liveSteps: number;

  addSession: (session: Session) => void;
  setRecording: (val: boolean) => void;
  setRecorderState: (s: string) => void;
  setAnalyserState: (s: string) => void;
  setLiveSteps: (n: number) => void;
  loadSessions: () => Promise<void>;
  getTodayProgress: () => DailyProgress;
  getWeeklyProgress: () => DailyProgress[];
}

const emptyDay = (date: string): DailyProgress => ({
  date,
  sessionsCompleted: 0,
  totalSteps: 0,
  compliancePercent: 0,
});

const todayStr = () => new Date().toISOString().slice(0, 10);

export const useComplianceStore = create<ComplianceState>((set, get) => ({
  sessions: [],
  todayProgress: emptyDay(todayStr()),
  weeklyStreak: 0,
  isRecording: false,
  recorderState: 'INITIALIZED',
  analyserState: 'Idle',
  liveSteps: 0,

  addSession: async (session: Session) => {
    const sessions = [...get().sessions, session];
    await AsyncStorage.setItem('sessions', JSON.stringify(sessions));

    const today = todayStr();
    const todaySessions = sessions.filter(s => s.date === today);
    const todayProgress: DailyProgress = {
      date: today,
      sessionsCompleted: todaySessions.length,
      totalSteps: todaySessions.reduce((sum, s) => sum + s.steps, 0),
      bestWalkScore: Math.max(
        ...todaySessions.map(s => s.walkScore ?? 0),
        0,
      ),
      compliancePercent: Math.min(
        (todaySessions.length / Config.WEEKLY_GOAL_SESSIONS) * 100,
        100,
      ),
    };
    set({sessions, todayProgress});
  },

  setRecording: val => set({isRecording: val}),
  setRecorderState: s => set({recorderState: s}),
  setAnalyserState: s => set({analyserState: s}),
  setLiveSteps: n => set({liveSteps: n}),

  loadSessions: async () => {
    try {
      const raw = await AsyncStorage.getItem('sessions');
      if (raw) {
        const sessions = JSON.parse(raw) as Session[];
        const today = todayStr();
        const todaySessions = sessions.filter(s => s.date === today);
        set({
          sessions,
          todayProgress: {
            date: today,
            sessionsCompleted: todaySessions.length,
            totalSteps: todaySessions.reduce((sum, s) => sum + s.steps, 0),
            bestWalkScore: todaySessions.length
              ? Math.max(...todaySessions.map(s => s.walkScore ?? 0))
              : undefined,
            compliancePercent: Math.min(
              (todaySessions.length / Config.WEEKLY_GOAL_SESSIONS) * 100,
              100,
            ),
          },
        });
      }
    } catch {
      /* ignore */
    }
  },

  getTodayProgress: () => get().todayProgress,

  getWeeklyProgress: () => {
    const sessions = get().sessions;
    const days: DailyProgress[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const daySessions = sessions.filter(s => s.date === dateStr);
      days.push({
        date: dateStr,
        sessionsCompleted: daySessions.length,
        totalSteps: daySessions.reduce((sum, s) => sum + s.steps, 0),
        bestWalkScore: daySessions.length
          ? Math.max(...daySessions.map(s => s.walkScore ?? 0))
          : undefined,
        compliancePercent: Math.min(
          (daySessions.length / Config.WEEKLY_GOAL_SESSIONS) * 100,
          100,
        ),
      });
    }
    return days;
  },
}));
