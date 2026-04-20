import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {ScreenContainer, Card, MetricCard} from '../../components';
import {Colors, FontSize, Spacing} from '../../constants';
import {useComplianceStore} from '../../store';
import type {Session} from '../../types';

export function HistoryScreen() {
  const {sessions} = useComplianceStore();
  const sorted = [...sessions].reverse();

  const renderItem = ({item}: {item: Session}) => (
    <Card>
      <View style={styles.header}>
        <Text style={styles.date}>{item.date}</Text>
        <Text
          style={[
            styles.badge,
            item.resultState === 'FULL_ANALYSIS'
              ? styles.badgeSuccess
              : styles.badgePending,
          ]}>
          {item.resultState === 'FULL_ANALYSIS' ? 'Analyzed' : 'Pending'}
        </Text>
      </View>
      <View style={styles.metricsRow}>
        <MetricCard
          value={item.walkScore?.toFixed(0) ?? '—'}
          label="Walk Score"
          color={Colors.primary}
        />
        <MetricCard value={item.steps} label="Steps" />
        <MetricCard
          value={item.velocity?.toFixed(1) ?? '—'}
          label="Velocity"
          unit="m/s"
        />
      </View>
    </Card>
  );

  return (
    <ScreenContainer title="Session History">
      <FlatList
        data={sorted}
        keyExtractor={s => s.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyText}>
              No sessions yet. Start your first assessment!
            </Text>
          </View>
        }
        contentContainerStyle={[{paddingBottom: Spacing.xxl}, sorted.length === 0 && styles.emptyContainer]}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  date: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  badge: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  badgeSuccess: {
    backgroundColor: Colors.success + '20',
    color: Colors.success,
  },
  badgePending: {
    backgroundColor: Colors.warning + '20',
    color: Colors.warning,
  },
  metricsRow: {flexDirection: 'row'},
  empty: {alignItems: 'center', paddingTop: Spacing.xxl},
  emptyIcon: {fontSize: 48, marginBottom: Spacing.md},
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  emptyContainer: {flex: 1, justifyContent: 'center'},
});
