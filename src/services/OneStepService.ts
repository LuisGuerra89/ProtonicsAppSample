import {NativeModules, NativeEventEmitter, Platform} from 'react-native';
import type {
  OSTState,
  OSTMotionMeasurement,
  OSTDailySummary,
  OSTRecorderState,
  OSTAnalyserState,
} from '../types';

const {OneStepSDK: NativeOneStep} = NativeModules;
const emitter = NativeOneStep
  ? new NativeEventEmitter(NativeOneStep)
  : undefined;

/**
 * OneStep SDK service — wraps the native Android module.
 * On iOS this is a no-op stub until the iOS SDK is integrated.
 */
export const OneStepService = {
  // ─── Lifecycle ────────────────────────────
  async initialize(clientToken: string): Promise<boolean> {
    if (!NativeOneStep) {
      console.warn('[OneStep] Native module not available');
      return false;
    }
    return NativeOneStep.initialize(clientToken);
  },

  async identify(
    userId: string,
    identityVerification: string,
  ): Promise<{success: boolean; message?: string}> {
    if (!NativeOneStep) {
      return {success: false, message: 'Native module not available'};
    }
    return NativeOneStep.identify(userId, identityVerification);
  },

  // ─── Monitoring (Background) ──────────────
  async enableMonitoring(): Promise<boolean> {
    if (!NativeOneStep) {
      return false;
    }
    return NativeOneStep.enableMonitoring();
  },

  async optInMonitoring(): Promise<boolean> {
    if (!NativeOneStep) {
      return false;
    }
    return NativeOneStep.optInMonitoring();
  },

  async optOutMonitoring(): Promise<boolean> {
    if (!NativeOneStep) {
      return false;
    }
    return NativeOneStep.optOutMonitoring();
  },

  async syncData(): Promise<boolean> {
    if (!NativeOneStep) {
      return false;
    }
    return NativeOneStep.syncData();
  },

  async getDailySummaries(): Promise<OSTDailySummary[]> {
    if (!NativeOneStep) {
      return [];
    }
    return NativeOneStep.getDailySummaries();
  },

  // ─── Active Measurement (MotionLab) ───────
  async startRecording(durationMs: number): Promise<void> {
    if (!NativeOneStep) {
      return;
    }
    return NativeOneStep.startRecording(durationMs);
  },

  async stopRecording(): Promise<void> {
    if (!NativeOneStep) {
      return;
    }
    return NativeOneStep.stopRecording();
  },

  async analyze(
    timeoutMs: number,
  ): Promise<OSTMotionMeasurement | null> {
    if (!NativeOneStep) {
      return null;
    }
    return NativeOneStep.analyze(timeoutMs);
  },

  async readMeasurements(
    afterTimestamp?: number,
  ): Promise<OSTMotionMeasurement[]> {
    if (!NativeOneStep) {
      return [];
    }
    return NativeOneStep.readMeasurements(afterTimestamp ?? 0);
  },

  // ─── User Attributes ─────────────────────
  async updateUserAttributes(attrs: {
    firstName?: string;
    lastName?: string;
    sex?: string;
    dateOfBirth?: string;
  }): Promise<void> {
    if (!NativeOneStep) {
      return;
    }
    return NativeOneStep.updateUserAttributes(attrs);
  },

  // ─── Mock for emulator testing ────────────
  async enableMockSensors(): Promise<void> {
    if (!NativeOneStep) {
      return;
    }
    return NativeOneStep.enableMockSensors();
  },

  // ─── HMAC (dev/testing only — use backend in production) ──
  async buildHmac(userId: string, secret: string): Promise<string> {
    if (!NativeOneStep) {
      return '';
    }
    return NativeOneStep.buildHmac(userId, secret);
  },

  // ─── SDK State ────────────────────────────
  async getSDKState(): Promise<{state: OSTState; userId: string; message: string}> {
    if (!NativeOneStep) {
      return {state: 'Uninitialized', userId: '', message: 'Native module not available'};
    }
    return NativeOneStep.getSDKState();
  },

  onSDKStateChange(
    cb: (info: {state: OSTState; userId: string; message: string}) => void,
  ): () => void {
    if (!emitter) {
      return () => {};
    }
    const sub = emitter.addListener('onSDKStateChange', cb);
    return () => sub.remove();
  },

  // ─── Events ───────────────────────────────
  onRecorderStateChange(
    cb: (state: OSTRecorderState) => void,
  ): () => void {
    if (!emitter) {
      return () => {};
    }
    const sub = emitter.addListener('onRecorderStateChange', cb);
    return () => sub.remove();
  },

  onAnalyserStateChange(
    cb: (state: OSTAnalyserState) => void,
  ): () => void {
    if (!emitter) {
      return () => {};
    }
    const sub = emitter.addListener('onAnalyserStateChange', cb);
    return () => sub.remove();
  },

  onStepsUpdate(cb: (steps: number) => void): () => void {
    if (!emitter) {
      return () => {};
    }
    const sub = emitter.addListener('onStepsUpdate', cb);
    return () => sub.remove();
  },
};
