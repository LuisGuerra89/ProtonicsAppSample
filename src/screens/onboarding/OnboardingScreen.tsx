import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import {Button, ScreenContainer} from '../../components';
import {Colors, FontSize, Spacing} from '../../constants';
import {useAuthStore} from '../../store';
import type {OnboardingStep} from '../../types';

const STEPS: {key: OnboardingStep; title: string; body: string}[] = [
  {
    key: 'welcome',
    title: 'Welcome to Protonics',
    body: 'Your movement enhancement journey starts here. We\'ll guide you through setting up your device and establishing your baseline.',
  },
  {
    key: 'device_setup',
    title: 'Device Setup',
    body: 'Make sure your Protonics device is charged and ready. You\'ll need it for your initial assessment.\n\n1. Charge the device fully\n2. Download any firmware updates\n3. Ensure straps are in good condition',
  },
  {
    key: 'fit_guidance',
    title: 'Fit & Positioning',
    body: 'Proper fit is essential for accurate results and effective treatment.\n\n• Upper strap: 2 inches above kneecap\n• Lower strap: Mid-calf\n• Resistance bands: Snug, not tight\n• Walk 30 seconds to confirm fit',
  },
  {
    key: 'position_guidance',
    title: 'Usage Guidance',
    body: 'For best results, plan to use your device daily.\n\n• Morning session: 10-15 minutes\n• Start with comfortable walking\n• Complete a 60-second assessment walk\n• Track your progress in the app',
  },
  {
    key: 'initial_assessment',
    title: 'Ready for Assessment',
    body: 'You\'re all set! After completing onboarding, you\'ll take your first 60-second walk assessment.\n\nThis establishes your baseline gait score. You\'ll track improvements over time as you use your Protonics device.',
  },
];

export function OnboardingScreen() {
  const [stepIdx, setStepIdx] = useState(0);
  const {setOnboardingStep, completeOnboarding} = useAuthStore();
  const step = STEPS[stepIdx];
  const isLast = stepIdx === STEPS.length - 1;

  const next = () => {
    if (isLast) {
      completeOnboarding();
    } else {
      setStepIdx(i => i + 1);
      setOnboardingStep(STEPS[stepIdx + 1].key);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.indicator}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === stepIdx && styles.dotActive]}
            />
          ))}
        </View>

        <View style={styles.iconContainer}>
          <Text style={styles.icon}>
            {stepIdx === 0
              ? '🏃'
              : stepIdx === 1
              ? '⚡'
              : stepIdx === 2
              ? '📐'
              : stepIdx === 3
              ? '📋'
              : '✅'}
          </Text>
        </View>

        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.body}>{step.body}</Text>
      </ScrollView>

      <View style={styles.footer}>
        {stepIdx > 0 && (
          <Button
            title="Back"
            variant="ghost"
            onPress={() => setStepIdx(i => i - 1)}
            style={styles.backBtn}
          />
        )}
        <Button
          title={isLast ? "Let's Go!" : 'Next'}
          onPress={next}
          style={styles.nextBtn}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {flexGrow: 1, paddingTop: Spacing.xl},
  indicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  iconContainer: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  icon: {fontSize: 48},
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  body: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 24,
    textAlign: 'left',
    paddingHorizontal: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  backBtn: {flex: 1},
  nextBtn: {flex: 2},
});
