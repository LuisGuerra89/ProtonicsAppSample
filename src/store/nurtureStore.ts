import {create} from 'zustand';
import type {EducationArticle, Milestone} from '../types';

interface NurtureState {
  articles: EducationArticle[];
  milestones: Milestone[];
  weeklyFeedback: string | null;

  loadContent: () => void;
  unlockMilestone: (id: string) => void;
  setWeeklyFeedback: (fb: string) => void;
}

const SEED_ARTICLES: EducationArticle[] = [
  {
    id: '1',
    title: 'What is NMRE Technology?',
    summary:
      'Learn how Neuromuscular Re-Education helps retrain movement patterns to reduce pain.',
    content:
      'Neuromuscular Re-Education (NMRE) is a technique used to restore normal movement. The Protonics device delivers gentle resistance that activates key muscle groups, retraining your neuromuscular system to move more efficiently.\n\nOver time, consistent use of NMRE technology can:\n• Reduce joint pain\n• Improve walking stability\n• Increase stride confidence\n• Strengthen supporting muscles\n\nThe key to success is consistent daily usage with proper device positioning.',
    category: 'nmre',
    readTimeMinutes: 3,
  },
  {
    id: '2',
    title: 'Proper Device Positioning',
    summary:
      'Getting the most out of your Protonics device starts with correct fit.',
    content:
      'Correct positioning ensures the Protonics device targets the right muscle groups.\n\nStep 1: Secure the upper strap 2 inches above the knee cap\nStep 2: The lower strap sits mid-calf\nStep 3: Resistance bands should be snug but not tight\nStep 4: Walk normally for 30 seconds to confirm fit\n\nIf you feel pinching or numbness, readjust immediately.',
    category: 'positioning',
    readTimeMinutes: 2,
  },
  {
    id: '3',
    title: 'How Movement Impacts Pain',
    summary:
      'Understanding the connection between gait quality and chronic pain.',
    content:
      'Research shows that poor gait mechanics contribute to chronic knee, hip, and lower back pain. When your body compensates for weakness or instability, it creates abnormal stress on joints.\n\nThe OneStep gait analysis tracks key parameters:\n• Walking velocity\n• Stride length\n• Double support time\n• Walk score\n\nImproving these metrics through NMRE training directly correlates with pain reduction.',
    category: 'pain',
    readTimeMinutes: 4,
  },
  {
    id: '4',
    title: 'Understanding Your Walk Score',
    summary: 'What your walk score means and how to improve it over time.',
    content:
      'Your Walk Score is a composite metric calculated from multiple gait parameters. It ranges from 0-100.\n\n• 80-100: Excellent — optimal gait mechanics\n• 60-79: Good — minor areas for improvement\n• 40-59: Fair — noticeable gait deviations\n• Below 40: Needs attention — consult your provider\n\nConsistency is key. Users who complete 5+ sessions per week see an average 15-point improvement in walk score within 4 weeks.',
    category: 'progress',
    readTimeMinutes: 3,
  },
  {
    id: '5',
    title: 'Daily Usage Best Practices',
    summary: 'Maximize results with an optimal daily routine.',
    content:
      'For best results, follow this daily routine:\n\n1. Morning session (10-15 minutes)\n   - Put on device with proper positioning\n   - Walk at a comfortable pace\n   - Complete a 60-second assessment walk\n\n2. Afternoon movement (5-10 minutes)\n   - Short walk with device\n   - Focus on smooth, even strides\n\n3. Track your progress\n   - Review your daily dashboard\n   - Note any pain changes\n   - Celebrate improvements!',
    category: 'nmre',
    readTimeMinutes: 3,
  },
];

const SEED_MILESTONES: Milestone[] = [
  {
    id: 'first_session',
    title: 'First Steps',
    description: 'Complete your first assessment session',
    icon: 'shoe-print',
    requirement: {type: 'sessions', value: 1},
  },
  {
    id: 'five_sessions',
    title: 'Getting Consistent',
    description: 'Complete 5 assessment sessions',
    icon: 'trending-up',
    requirement: {type: 'sessions', value: 5},
  },
  {
    id: 'week_streak',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: 'fire',
    requirement: {type: 'streak', value: 7},
  },
  {
    id: 'score_60',
    title: 'Moving Well',
    description: 'Achieve a walk score of 60+',
    icon: 'star',
    requirement: {type: 'score', value: 60},
  },
  {
    id: 'twenty_sessions',
    title: 'Dedicated Mover',
    description: 'Complete 20 assessment sessions',
    icon: 'medal',
    requirement: {type: 'sessions', value: 20},
  },
  {
    id: 'score_80',
    title: 'Gait Master',
    description: 'Achieve a walk score of 80+',
    icon: 'trophy',
    requirement: {type: 'score', value: 80},
  },
];

export const useNurtureStore = create<NurtureState>((set, _get) => ({
  articles: [],
  milestones: [],
  weeklyFeedback: null,

  loadContent: () => {
    set({articles: SEED_ARTICLES, milestones: SEED_MILESTONES});
  },

  unlockMilestone: id => {
    set(state => ({
      milestones: state.milestones.map(m =>
        m.id === id ? {...m, unlockedAt: new Date().toISOString()} : m,
      ),
    }));
  },

  setWeeklyFeedback: fb => set({weeklyFeedback: fb}),
}));
