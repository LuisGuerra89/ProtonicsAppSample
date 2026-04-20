import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppNavigator} from './src/navigation';
import {useAuthStore, useNurtureStore} from './src/store';
import {OneStepService} from './src/services/OneStepService';
import {Config} from './src/constants';
import {SDKStatusBar} from './src/components';

function App() {
  const {loadPersistedAuth, user} = useAuthStore();
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

        // Use the persisted user id when available, otherwise fall back to
        // the sandbox test id so the SDK can be exercised without a login.
        const userId = user?.id ?? 'user-sandbox-test-001';

        // The HMAC-SHA256 is computed by the native bridge using the secret.
        // WARNING: For development/testing only.
        // In production, generate the HMAC on your backend and pass it here.
        const hmac = await OneStepService.buildHmac(
          userId,
          Config.ONESTEP_IDENTITY_SECRET,
        );

        const identifyResult = await OneStepService.identify(userId, hmac);
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
      <StatusBar barStyle="light-content" backgroundColor="#000000" translucent={false} />
      {/* Remove SDKStatusBar (or set visible={false}) before shipping to production */}
      <SDKStatusBar visible={__DEV__} />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;
