import React from 'react';
import {View, Text, StyleSheet, ScrollView, Alert, Linking} from 'react-native';
import {ScreenContainer, Button, Card} from '../../components';
import {Colors, FontSize, Spacing, BorderRadius} from '../../constants';
import {useAuthStore} from '../../store';

export function SubscriptionScreen() {
  const {user, updateProfile} = useAuthStore();
  const isPro = user?.subscriptionTier === 'pro';

  const handlePurchase = async (tier: 'pro') => {
    // TODO: Integrate RevenueCat / In-App Purchases
    Alert.alert(
      'Upgrade to PRO',
      'In-app purchase will be configured with RevenueCat. For now, this simulates the upgrade.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Simulate Upgrade',
          onPress: () => updateProfile({subscriptionTier: tier}),
        },
      ],
    );
  };

  return (
    <ScreenContainer title="Subscription">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: Spacing.xxl}}>
        {/* Current plan */}
        <Card>
          <View style={styles.currentPlan}>
            <Text style={styles.planLabel}>Current Plan</Text>
            <Text style={styles.planName}>
              {isPro ? 'PRO' : 'Free'}
            </Text>
          </View>
        </Card>

        {/* Free tier */}
        <Card style={!isPro ? styles.activePlan : undefined}>
          <Text style={styles.tierName}>Free</Text>
          <Text style={styles.tierPrice}>$0</Text>
          <View style={styles.features}>
            <Text style={styles.feature}>✓ Initial OneStep assessment</Text>
            <Text style={styles.feature}>✓ Basic progress tracking</Text>
            <Text style={styles.feature}>✓ Education library</Text>
            <Text style={styles.feature}>✗ Unlimited assessments</Text>
            <Text style={styles.feature}>✗ Advanced analytics</Text>
            <Text style={styles.feature}>✗ Expert consultation</Text>
          </View>
        </Card>

        {/* Pro tier */}
        <Card style={isPro ? styles.activePlan : undefined}>
          <View style={styles.proHeader}>
            <Text style={styles.tierName}>PRO</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>RECOMMENDED</Text>
            </View>
          </View>
          <Text style={styles.tierPrice}>
            $19.99<Text style={styles.perMonth}>/mo</Text>
          </Text>
          <View style={styles.features}>
            <Text style={styles.feature}>✓ Everything in Free</Text>
            <Text style={styles.feature}>✓ Unlimited assessments</Text>
            <Text style={styles.feature}>✓ Full gait analytics</Text>
            <Text style={styles.feature}>✓ Weekly progress reports</Text>
            <Text style={styles.feature}>✓ Milestone tracking</Text>
            <Text style={styles.feature}>✓ Book expert consultation</Text>
          </View>
          {!isPro && (
            <Button
              title="Upgrade to PRO"
              onPress={() => handlePurchase('pro')}
              style={styles.upgradeBtn}
            />
          )}
        </Card>

        {/* Book appointment */}
        {isPro && (
          <Card title="Expert Consultation">
            <Text style={styles.consultText}>
              As a PRO member, you can book a session with a movement specialist
              for personalized guidance.
            </Text>
            <Button
              title="Book Appointment"
              variant="outline"
              onPress={() =>
                Linking.openURL('https://protonics.com/book')
              }
            />
          </Card>
        )}

        <View style={{height: Spacing.xxl}} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  currentPlan: {alignItems: 'center'},
  planLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  planName: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.primary,
  },
  activePlan: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  tierName: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
  },
  tierPrice: {
    fontSize: FontSize.hero,
    fontWeight: '900',
    color: Colors.primary,
    marginVertical: Spacing.sm,
  },
  perMonth: {
    fontSize: FontSize.md,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  proHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.textLight,
  },
  features: {marginVertical: Spacing.md, gap: Spacing.sm},
  feature: {
    fontSize: FontSize.md,
    color: Colors.text,
  },
  upgradeBtn: {marginTop: Spacing.sm},
  consultText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 22,
  },
});
