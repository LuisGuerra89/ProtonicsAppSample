import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {User, OnboardingStep} from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  onboardingStep: OnboardingStep;
  isLoading: boolean;

  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  setOnboardingStep: (step: OnboardingStep) => void;
  completeOnboarding: () => void;
  loadPersistedAuth: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  onboardingStep: 'welcome',
  isLoading: true,

  signIn: async (email, _password) => {
    // TODO: Replace with real auth API
    const user: User = {
      id: `user-${Date.now()}`,
      email,
      firstName: email.split('@')[0],
      lastName: '',
      subscriptionTier: 'free',
    };
    await AsyncStorage.setItem('user', JSON.stringify(user));
    await AsyncStorage.setItem('onboardingComplete', 'false');
    set({user, isAuthenticated: true});
  },

  signUp: async (email, _password, firstName, lastName) => {
    const user: User = {
      id: `user-${Date.now()}`,
      email,
      firstName,
      lastName,
      subscriptionTier: 'free',
    };
    await AsyncStorage.setItem('user', JSON.stringify(user));
    await AsyncStorage.setItem('onboardingComplete', 'false');
    set({user, isAuthenticated: true, onboardingStep: 'welcome'});
  },

  signOut: async () => {
    await AsyncStorage.multiRemove(['user', 'onboardingComplete']);
    set({user: null, isAuthenticated: false, onboardingStep: 'welcome'});
  },

  setOnboardingStep: step => set({onboardingStep: step}),

  completeOnboarding: async () => {
    await AsyncStorage.setItem('onboardingComplete', 'true');
    const user = get().user;
    if (user) {
      const updated = {...user, onboardedAt: new Date().toISOString()};
      await AsyncStorage.setItem('user', JSON.stringify(updated));
      set({user: updated, onboardingStep: 'complete'});
    }
  },

  loadPersistedAuth: async () => {
    try {
      const raw = await AsyncStorage.getItem('user');
      const onboarded = await AsyncStorage.getItem('onboardingComplete');
      if (raw) {
        const user = JSON.parse(raw) as User;
        set({
          user,
          isAuthenticated: true,
          onboardingStep: onboarded === 'true' ? 'complete' : 'welcome',
          isLoading: false,
        });
      } else {
        set({isLoading: false});
      }
    } catch {
      set({isLoading: false});
    }
  },

  updateProfile: updates => {
    const user = get().user;
    if (user) {
      const updated = {...user, ...updates};
      AsyncStorage.setItem('user', JSON.stringify(updated));
      set({user: updated});
    }
  },
}));
