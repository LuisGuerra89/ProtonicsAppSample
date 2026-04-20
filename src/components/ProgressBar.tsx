import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors, FontSize, Spacing, BorderRadius} from '../constants';

interface Props {
  value: number; // 0-100
  label?: string;
  size?: 'sm' | 'md';
  color?: string;
}

export function ProgressBar({
  value,
  label,
  size = 'md',
  color = Colors.primary,
}: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  const height = size === 'sm' ? 6 : 10;

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.percent}>{Math.round(clamped)}%</Text>
        </View>
      )}
      <View style={[styles.track, {height}]}>
        <View
          style={[
            styles.fill,
            {width: `${clamped}%`, height, backgroundColor: color},
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {marginVertical: Spacing.xs},
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {fontSize: FontSize.sm, color: Colors.textSecondary},
  percent: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  track: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  fill: {borderRadius: BorderRadius.full},
});
