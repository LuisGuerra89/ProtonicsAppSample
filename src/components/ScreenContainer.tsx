import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, ViewStyle} from 'react-native';
import {Colors, FontSize, Spacing, TAB_BAR_HEIGHT} from '../constants';

interface Props {
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
  padded?: boolean;
  /** Set true for screens rendered inside the bottom tab navigator */
  tabScreen?: boolean;
}

export function ScreenContainer({
  title,
  children,
  style,
  padded = true,
  tabScreen = false,
}: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View
        style={[
          styles.container,
          padded && styles.padded,
          tabScreen && {paddingBottom: TAB_BAR_HEIGHT},
          style,
        ]}>
        {title && <Text style={styles.title}>{title}</Text>}
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.background},
  container: {flex: 1},
  padded: {paddingHorizontal: Spacing.lg},
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
});
