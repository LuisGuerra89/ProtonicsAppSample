import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {OneStepService} from '../services/OneStepService';
import {Colors, FontSize, Spacing} from '../constants';
import type {OSTState} from '../types';

interface SDKStatusInfo {
  state: OSTState;
  userId: string;
  message: string;
}

interface LogEntry {
  time: string;
  label: string;
  detail: string;
  ok: boolean;
}

interface Props {
  /** Set to false to hide the component in production builds */
  visible?: boolean;
}

export function SDKStatusBar({visible = true}: Props) {
  const insets = useSafeAreaInsets();
  const [sdkInfo, setSdkInfo] = useState<SDKStatusInfo>({
    state: 'Uninitialized',
    userId: '',
    message: '',
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [expanded, setExpanded] = useState(false);

  const addLog = (label: string, detail: string, ok: boolean) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [{time, label, detail, ok}, ...prev].slice(0, 20));
  };

  useEffect(() => {
    if (!visible) {return;}

    // Get current state immediately
    OneStepService.getSDKState()
      .then(info => {
        setSdkInfo(info);
        addLog('getSDKState()', info.state + (info.userId ? ` · ${info.userId}` : ''), info.state !== 'Error');
      })
      .catch(err => addLog('getSDKState()', String(err), false));

    // Subscribe to future state changes
    const unsub = OneStepService.onSDKStateChange(info => {
      setSdkInfo(info);
      const detail =
        info.state === 'Identified'
          ? `${info.state} · ${info.userId}`
          : info.state === 'Error'
          ? `${info.state} · ${info.message}`
          : info.state;
      addLog('onSDKStateChange', detail, info.state !== 'Error');
    });

    return unsub;
  }, [visible]);

  if (!visible) {return null;}

  const stateColor =
    sdkInfo.state === 'Identified'
      ? Colors.success
      : sdkInfo.state === 'Ready'
      ? Colors.info
      : sdkInfo.state === 'Error'
      ? Colors.error
      : Colors.textMuted;

  return (
    <TouchableOpacity
      onPress={() => setExpanded(e => !e)}
      activeOpacity={0.8}
      style={[styles.container, {marginTop: insets.top + Spacing.xs}]}>
      {/* Status pill */}
      <View style={styles.pill}>
        <View style={[styles.dot, {backgroundColor: stateColor}]} />
        <Text style={styles.pillText}>
          SDK · <Text style={{color: stateColor}}>{sdkInfo.state}</Text>
          {sdkInfo.userId ? `  ${sdkInfo.userId}` : ''}
        </Text>
        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
      </View>

      {/* Expanded log */}
      {expanded && (
        <View style={styles.logContainer}>
          {sdkInfo.message ? (
            <Text style={styles.errorMsg}>{sdkInfo.message}</Text>
          ) : null}
          {logs.length === 0 && (
            <Text style={styles.emptyLog}>No events yet</Text>
          )}
          {logs.map((entry, i) => (
            <View key={i} style={styles.logRow}>
              <Text style={styles.logTime}>{entry.time}</Text>
              <Text style={[styles.logLabel, {color: entry.ok ? Colors.success : Colors.error}]}>
                {entry.label}
              </Text>
              <Text style={styles.logDetail} numberOfLines={1}>
                {entry.detail}
              </Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2c2c2e',
    borderWidth: 1,
    borderColor: '#48484a',
    borderRadius: 8,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    overflow: 'hidden',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pillText: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
  chevron: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  logContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  errorMsg: {
    fontSize: FontSize.xs,
    color: Colors.error,
    fontFamily: 'monospace',
    marginBottom: Spacing.xs,
  },
  emptyLog: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontStyle: 'italic',
    paddingVertical: 4,
  },
  logRow: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 2,
  },
  logTime: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontFamily: 'monospace',
    minWidth: 70,
  },
  logLabel: {
    fontSize: FontSize.xs,
    fontFamily: 'monospace',
    minWidth: 120,
  },
  logDetail: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
});
