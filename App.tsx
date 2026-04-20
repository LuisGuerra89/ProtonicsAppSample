import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppNavigator} from './src/navigation';
import {useAuthStore, useNurtureStore} from './src/store';
import {OneStepService} from './src/services/OneStepService';
import {Config} from './src/constants';

function App() {
  const {loadPersistedAuth} = useAuthStore();
  const {loadContent} = useNurtureStore();

  useEffect(() => {
    loadPersistedAuth();
    loadContent();

    // Initialize SDK → Identify → Enable Monitoring
    (async () => {
      try {
        const initialized = await OneStepService.initialize(
          Config.ONESTEP_CLIENT_TOKEN,
        );
        if (!initialized) {
          console.warn('[OneStep] SDK initialization failed');
          return;
        }

        const identifyResult = await OneStepService.identify(
          'user-sandbox-test-001',
          Config.ONESTEP_IDENTITY_SECRET,
        );
        if (!identifyResult.success) {
          console.warn('[OneStep] Identify failed:', identifyResult.message);
          return;
        }

        // Enable background monitoring after successful identification
        await OneStepService.enableMonitoring();
      } catch (e) {
        console.warn('[OneStep] Init sequence error:', e);
      }
    })();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;
