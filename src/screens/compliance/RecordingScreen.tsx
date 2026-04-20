import React, {useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, Alert, ScrollView} from 'react-native';
import {ScreenContainer, Button, Card, MetricCard} from '../../components';
import {Colors, FontSize, Spacing, Config, TAB_BAR_HEIGHT} from '../../constants';
import {useComplianceStore} from '../../store';
import {OneStepService} from '../../services';
import type {Session} from '../../types';

interface Props {
  navigation: any;
}

export function RecordingScreen({navigation}: Props) {
  const {
    isRecording,
    recorderState,
    analyserState,
    liveSteps,
    setRecording,
    setRecorderState,
    setAnalyserState,
    setLiveSteps,
    addSession,
  } = useComplianceStore();

  useEffect(() => {
    const unsub1 = OneStepService.onRecorderStateChange(state => {
      setRecorderState(state);
      if (state === 'DONE') {
        setRecording(false);
        handleAnalysis();
      }
    });
    const unsub2 = OneStepService.onAnalyserStateChange(setAnalyserState);
    const unsub3 = OneStepService.onStepsUpdate(n => setLiveSteps(Number(n)));
    return () => {
      unsub1();
      unsub2();
      unsub3();
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setLiveSteps(0);
      setRecording(true);
      setRecorderState('RECORDING');
      await OneStepService.startRecording(Config.DEFAULT_RECORDING_DURATION_MS);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to start recording');
      setRecording(false);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    try {
      await OneStepService.stopRecording();
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to stop recording');
    }
  }, []);

  const handleAnalysis = useCallback(async () => {
    try {
      setAnalyserState('Uploading');
      const result = await OneStepService.analyze(Config.ANALYSIS_TIMEOUT_MS);
      if (result) {
        const session: Session = {
          id: result.id,
          date: new Date().toISOString().slice(0, 10),
          durationSeconds: Config.DEFAULT_RECORDING_DURATION_MS / 1000,
          steps: result.steps ?? 0,
          walkScore: result.params?.WALKING_WALK_SCORE,
          velocity: result.params?.WALKING_VELOCITY,
          strideLength: result.params?.WALKING_STRIDE_LENGTH,
          doubleSupport: result.params?.WALKING_DOUBLE_SUPPORT,
          resultState: result.resultState,
        };
        addSession(session);
        Alert.alert(
          'Assessment Complete',
          `Walk Score: ${session.walkScore?.toFixed(0) ?? 'N/A'}\nSteps: ${session.steps}`,
          [{text: 'View Dashboard', onPress: () => navigation.goBack()}],
        );
      } else {
        Alert.alert('Analysis', 'No result available. Try again later.');
      }
    } catch (e: any) {
      Alert.alert('Analysis Error', e.message ?? 'Analysis failed');
    }
  }, []);

  const stateLabel =
    recorderState === 'RECORDING'
      ? 'Recording...'
      : recorderState === 'FINALIZING'
      ? 'Finalizing...'
      : analyserState !== 'Idle'
      ? `Analyzing: ${analyserState}`
      : 'Ready';

  return (
    <ScreenContainer title="Walk Assessment">
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Card>
          <View style={styles.stateContainer}>
            <View
              style={[
                styles.pulse,
                isRecording && styles.pulseActive,
              ]}
            />
            <Text style={styles.stateText}>{stateLabel}</Text>
          </View>

          {isRecording && (
            <View style={styles.liveMetrics}>
              <MetricCard
                value={liveSteps}
                label="Steps"
                color={Colors.primary}
              />
            </View>
          )}
        </Card>

        <Card title="Instructions">
          <Text style={styles.instructions}>
            1. Put on your Protonics device{'\n'}
            2. Stand up and prepare to walk{'\n'}
            3. Tap "Start" and walk normally for 60 seconds{'\n'}
            4. The recording will stop automatically{'\n'}
            5. Wait for your results
          </Text>
        </Card>
      </ScrollView>

      <View style={styles.buttonContainer}>
        {!isRecording ? (
          <Button
            title="Start Assessment"
            onPress={startRecording}
            size="lg"
            disabled={analyserState !== 'Idle'}
          />
        ) : (
          <Button
            title="Stop Early"
            onPress={stopRecording}
            variant="outline"
            size="lg"
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {flex: 1},
  scrollContent: {flexGrow: 1, paddingBottom: Spacing.md},
  stateContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  pulse: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surfaceAlt,
    marginBottom: Spacing.md,
  },
  pulseActive: {
    backgroundColor: Colors.primary,
    opacity: 0.8,
  },
  stateText: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
  },
  liveMetrics: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  instructions: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 26,
  },
  buttonContainer: {
    paddingVertical: Spacing.md,
    paddingBottom: TAB_BAR_HEIGHT + Spacing.md,
  },
});
