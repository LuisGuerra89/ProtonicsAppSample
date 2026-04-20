import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors, FontSize, Spacing} from '../constants';

interface Props {
  value: string | number;
  label: string;
  unit?: string;
  color?: string;
}

export function MetricCard({value, label, unit, color = Colors.primary}: Props) {
  return (
    <View style={styles.container}>
      <Text style={[styles.value, {color}]}>
        {value}
        {unit && <Text style={styles.unit}> {unit}</Text>}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: Spacing.sm,
  },
  value: {
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  unit: {
    fontSize: FontSize.sm,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  label: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
});
