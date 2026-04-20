import React from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import {Colors, FontSize, BorderRadius, Spacing} from '../constants';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
}

export function TextInput({label, error, style, ...rest}: Props) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNTextInput
        placeholderTextColor={Colors.disabled}
        style={[styles.input, error && styles.inputError, style]}
        {...rest}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {marginBottom: Spacing.md},
  label: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    fontSize: FontSize.md,
    color: Colors.text,
    backgroundColor: Colors.card,
  },
  inputError: {borderColor: Colors.error},
  error: {
    fontSize: FontSize.xs,
    color: Colors.error,
    marginTop: 4,
  },
});
