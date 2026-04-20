import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import {Colors, FontSize, BorderRadius, Spacing} from '../constants';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
}: Props) {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.base,
        sizes[size],
        isPrimary && styles.primary,
        variant === 'secondary' && styles.secondary,
        isOutline && styles.outline,
        isGhost && styles.ghost,
        disabled && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator
          color={isPrimary ? Colors.textLight : Colors.primary}
        />
      ) : (
        <Text
          style={[
            styles.text,
            textSizes[size],
            isPrimary && styles.textPrimary,
            variant === 'secondary' && styles.textSecondary,
            isOutline && styles.textOutline,
            isGhost && styles.textGhost,
            disabled && styles.textDisabled,
          ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const sizes: Record<string, ViewStyle> = {
  sm: {paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md},
  md: {paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg},
  lg: {paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xl},
};

const textSizes = {
  sm: {fontSize: FontSize.sm},
  md: {fontSize: FontSize.md},
  lg: {fontSize: FontSize.lg},
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: {backgroundColor: Colors.primary},
  secondary: {backgroundColor: Colors.secondary},
  outline: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  ghost: {backgroundColor: 'transparent'},
  disabled: {opacity: 0.5},
  text: {fontWeight: '600'},
  textPrimary: {color: Colors.textLight},
  textSecondary: {color: Colors.textLight},
  textOutline: {color: Colors.text},
  textGhost: {color: Colors.textSecondary},
  textDisabled: {color: Colors.disabled},
});
