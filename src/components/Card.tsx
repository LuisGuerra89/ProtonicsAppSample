import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import {Colors, FontSize, BorderRadius, Spacing} from '../constants';

interface Props {
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({title, children, style}: Props) {
  return (
    <View style={[styles.card, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  title: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
});
