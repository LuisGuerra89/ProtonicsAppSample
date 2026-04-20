import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {ScreenContainer, Card, ProgressBar, MetricCard} from '../../components';
import {Colors, FontSize, Spacing, TAB_BAR_HEIGHT} from '../../constants';
import {useComplianceStore, useNurtureStore} from '../../store';

export function ProgressScreen() {
  const {getWeeklyProgress, sessions} = useComplianceStore();
  const {weeklyFeedback} = useNurtureStore();
  const weekly = getWeeklyProgress();

  const weekSessions = weekly.reduce((s, d) => s + d.sessionsCompleted, 0);
  const weekSteps = weekly.reduce((s, d) => s + d.totalSteps, 0);
  const weekBestScore = Math.max(
    ...weekly.map(d => d.bestWalkScore ?? 0),
    0,
  );

  // Simple trend calculation
  const recentSessions = sessions.slice(-5);
  const olderSessions = sessions.slice(-10, -5);
  const recentAvg =
    recentSessions.length > 0
      ? recentSessions.reduce((s, x) => s + (x.walkScore ?? 0), 0) /
        recentSessions.length
      : 0;
  const olderAvg =
    olderSessions.length > 0
      ? olderSessions.reduce((s, x) => s + (x.walkScore ?? 0), 0) /
        olderSessions.length
      : 0;
  const trend = recentAvg - olderAvg;

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <ScreenContainer title="Progress" tabScreen>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Weekly overview */}
        <Card title="This Week">
          <View style={styles.metricsRow}>
            <MetricCard
              value={weekSessions}
              label="Sessions"
              color={Colors.primary}
            />
            <MetricCard value={weekSteps} label="Steps" />
            <MetricCard
              value={weekBestScore > 0 ? weekBestScore.toFixed(0) : '—'}
              label="Best Score"
              color={Colors.success}
            />
          </View>
        </Card>

        {/* Daily breakdown */}
        <Card title="Daily Activity">
          {weekly.map((day, i) => {
            const label =
              dayNames[new Date(day.date + 'T00:00:00').getDay() === 0
                ? 6
                : new Date(day.date + 'T00:00:00').getDay() - 1] ??
              day.date.slice(5);
            return (
              <View key={day.date} style={styles.dayRow}>
                <Text style={styles.dayLabel}>{label}</Text>
                <View style={styles.dayBar}>
                  <ProgressBar
                    value={day.compliancePercent}
                    size="sm"
                    color={
                      day.sessionsCompleted > 0
                        ? Colors.primary
                        : Colors.disabled
                    }
                  />
                </View>
                <Text style={styles.dayCount}>
                  {day.sessionsCompleted}
                </Text>
              </View>
            );
          })}
        </Card>

        {/* Trend */}
        {sessions.length >= 5 && (
          <Card title="Walk Score Trend">
            <View style={styles.trendContainer}>
              <Text
                style={[
                  styles.trendValue,
                  {color: trend >= 0 ? Colors.success : Colors.error},
                ]}>
                {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}
              </Text>
              <Text style={styles.trendLabel}>
                vs previous 5 sessions
              </Text>
            </View>
          </Card>
        )}

        {/* Weekly feedback */}
        {weeklyFeedback && (
          <Card title="Weekly Feedback">
            <Text style={styles.feedback}>{weeklyFeedback}</Text>
          </Card>
        )}

        <View style={{height: Spacing.xxl}} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  metricsRow: {flexDirection: 'row', marginTop: Spacing.sm},
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  dayLabel: {
    width: 36,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  dayBar: {flex: 1, marginHorizontal: Spacing.sm},
  dayCount: {
    width: 20,
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'right',
  },
  trendContainer: {alignItems: 'center', paddingVertical: Spacing.md},
  trendValue: {fontSize: FontSize.xxl, fontWeight: '800'},
  trendLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  feedback: {
    fontSize: FontSize.md,
    color: Colors.text,
    lineHeight: 24,
  },
});
