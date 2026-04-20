# ProtonicsApp

A React Native sample app demonstrating the integration of the [OneStep SDK](https://www.onestep.co) for Android. The app performs gait analysis through walk assessments, background monitoring, and provides progress tracking and educational content.

## Tech Stack

- **React Native** 0.85.1 (New Architecture / Fabric)
- **React** 19.2.3
- **TypeScript** 5.x
- **OneStep Android SDK** `co.onestep.android:core:2.+`
- **Navigation**: `@react-navigation/native` + bottom-tabs + native-stack
- **State Management**: Zustand
- **Icons**: react-native-vector-icons (MaterialCommunityIcons)

---

## Prerequisites

- **Node.js** >= 22.11.0
- **Java Development Kit** (JDK 17+)
- **Android Studio** with SDK 36 (compileSdk) and SDK 26+ (minSdk)
- **Android Emulator** or physical device
- **OneStep SDK credentials** (client token + identity verification secret)

---

## 1. Clone & Install Dependencies

```bash
git clone https://github.com/LuisGuerra89/ProtonicsAppSample.git
cd ProtonicsAppSample
npm install
```

---

## 2. Configure OneStep SDK Keys

Open the config file at:

```
src/constants/config.ts
```

Replace the placeholder values with your OneStep sandbox (or production) credentials:

```ts
export const Config = {
  ONESTEP_CLIENT_TOKEN: '<YOUR_CLIENT_TOKEN>',
  ONESTEP_IDENTITY_SECRET: '<YOUR_IDENTITY_VERIFICATION_SECRET>',
  // ...
};
```

> **Where to get the keys:**
> Contact [OneStep](https://www.onestep.co) or check the OneStep Developer Portal for your sandbox/production credentials.

These keys are used in `App.tsx` during the SDK initialization sequence:

```ts
await OneStepService.initialize(Config.ONESTEP_CLIENT_TOKEN);
await OneStepService.identify('user-id', Config.ONESTEP_IDENTITY_SECRET);
await OneStepService.enableMonitoring();
```

---

## 3. Run the App

### Start Metro bundler

```bash
npm start
```

### Build & run on Android

In a separate terminal:

```bash
npm run android
```

Or target a specific device/emulator:

```bash
npx react-native run-android --deviceId emulator-5554
```

---

## 4. Android Permissions

The app requires the following permissions, already declared in `android/app/src/main/AndroidManifest.xml`:

| Permission | Purpose |
|---|---|
| `INTERNET` | Network access for SDK communication |
| `ACTIVITY_RECOGNITION` | Step counting and gait analysis |
| `BODY_SENSORS` | Access to body/motion sensors |
| `POST_NOTIFICATIONS` | Show foreground service notifications |
| `FOREGROUND_SERVICE` | Keep SDK running in background |
| `FOREGROUND_SERVICE_HEALTH` | Health-type foreground service |
| `HIGH_SAMPLING_RATE_SENSORS` | High-frequency sensor sampling for accurate gait data |

> **Runtime permissions:** `ACTIVITY_RECOGNITION` and `BODY_SENSORS` require runtime permission requests on Android 10+. The app handles this automatically through the SDK.

---

## 5. Android Native Bridge

The native bridge to the OneStep SDK is located at:

```
android/app/src/main/java/com/protonicsapp/onestep/
├── OneStepSDKModule.kt      # Bridge methods (initialize, identify, startRecording, etc.)
└── OneStepSDKPackage.kt      # React Native package registration
```

The `AndroidManifest.xml` also declares two required services:

```xml
<service
  android:name="co.onestep.android.core.external.services.OSTRecordingService"
  android:foregroundServiceType="health"
  android:exported="false" />
<service
  android:name="co.onestep.android.core.external.services.OSTForegroundService"
  android:foregroundServiceType="health"
  android:exported="false" />
```

---

## 6. Project Structure

```
src/
├── components/          # Reusable UI components (ScreenContainer, etc.)
├── constants/           # Theme, config, spacing
│   ├── config.ts        # ← OneStep SDK keys go here
│   └── theme.ts         # Colors, spacing, font sizes
├── navigation/          # App navigator with bottom tabs
├── screens/             # All app screens
│   ├── compliance/      # Dashboard, Recording, History
│   ├── nurture/         # Education, ArticleDetail, Milestones
│   └── settings/        # Settings, Subscription
├── services/            # OneStepService (JS wrapper for native module)
├── store/               # Zustand stores (auth, compliance, nurture)
└── types/               # TypeScript type definitions
```

---

## Troubleshooting

- **SDK not initializing:** Verify your `ONESTEP_CLIENT_TOKEN` is correct in `src/constants/config.ts`.
- **Permissions denied:** Ensure the device/emulator is running Android 10+ and permissions are granted at runtime.
- **Build fails:** Run `cd android && ./gradlew clean` then rebuild.
- **Metro issues:** Clear cache with `npm start -- --reset-cache`.

---

## License

This is a sample application for demonstration purposes.
