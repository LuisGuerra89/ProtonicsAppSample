import React from 'react';
import {Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors, FontSize, TAB_BAR_HEIGHT} from '../constants';
import {useAuthStore} from '../store';

import {
  SignInScreen,
  SignUpScreen,
  OnboardingScreen,
  DashboardScreen,
  ProgressScreen,
  RecordingScreen,
  HistoryScreen,
  EducationScreen,
  ArticleDetailScreen,
  MilestonesScreen,
  SubscriptionScreen,
  SettingsScreen,
} from '../screens';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const AssessStack = createNativeStackNavigator();
const LearnStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const darkHeader = {
  headerTintColor: Colors.primary,
  headerShadowVisible: false,
  headerStyle: {backgroundColor: Colors.background},
  headerTitleStyle: {color: Colors.text},
};

// ── Tab icon component ───────────────────────────────────
function TabIcon({label, focused}: {label: string; focused: boolean}) {
  const icons: Record<string, {name: string; nameFocused: string}> = {
    Assess: {name: 'walk', nameFocused: 'walk'},
    Progress: {name: 'chart-line-variant', nameFocused: 'chart-line'},
    Learn: {name: 'book-outline', nameFocused: 'book-open-variant'},
    Profile: {name: 'account-outline', nameFocused: 'account'},
  };
  const icon = icons[label] ?? {name: 'circle-outline', nameFocused: 'circle'};
  return (
    <MaterialCommunityIcons
      name={focused ? icon.nameFocused : icon.name}
      size={24}
      color={focused ? Colors.primary : Colors.textMuted}
    />
  );
}

// ── Assess tab stack ─────────────────────────────────────
function AssessStackScreen() {
  return (
    <AssessStack.Navigator screenOptions={{headerShown: false}}>
      <AssessStack.Screen name="DashboardMain" component={DashboardScreen} />
      <AssessStack.Screen
        name="Recording"
        component={RecordingScreen}
        options={{headerShown: true, headerTitle: '', ...darkHeader}}
      />
      <AssessStack.Screen
        name="History"
        component={HistoryScreen}
        options={{headerShown: true, headerTitle: 'History', ...darkHeader}}
      />
    </AssessStack.Navigator>
  );
}

// ── Learn tab stack ──────────────────────────────────────
function LearnStackScreen() {
  return (
    <LearnStack.Navigator screenOptions={{headerShown: false}}>
      <LearnStack.Screen name="EducationMain" component={EducationScreen} />
      <LearnStack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={{headerShown: true, headerTitle: '', ...darkHeader}}
      />
      <LearnStack.Screen
        name="Milestones"
        component={MilestonesScreen}
        options={{
          headerShown: true,
          headerTitle: 'Milestones',
          ...darkHeader,
        }}
      />
    </LearnStack.Navigator>
  );
}

// ── Profile tab stack ────────────────────────────────────
function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{headerShown: false}}>
      <ProfileStack.Screen name="SettingsMain" component={SettingsScreen} />
      <ProfileStack.Screen
        name="Subscription"
        component={SubscriptionScreen}
        options={{headerShown: true, headerTitle: 'Plan', ...darkHeader}}
      />
    </ProfileStack.Navigator>
  );
}

// ── Main tab navigator ──────────────────────────────────
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.surfaceAlt,
          borderTopWidth: 0,
          paddingBottom: 4,
          paddingTop: 6,
          height: TAB_BAR_HEIGHT,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: FontSize.xs,
          fontWeight: '600',
          letterSpacing: 0.3,
        },
      }}>
      <Tab.Screen
        name="Assess"
        component={AssessStackScreen}
        options={{
          tabBarLabel: 'Assess',
          tabBarIcon: ({focused}) => (
            <TabIcon label="Assess" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarLabel: 'Progress',
          tabBarIcon: ({focused}) => (
            <TabIcon label="Progress" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Learn"
        component={LearnStackScreen}
        options={{
          tabBarLabel: 'Learn',
          tabBarIcon: ({focused}) => (
            <TabIcon label="Learn" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({focused}) => (
            <TabIcon label="Profile" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// ── Navigation theme ─────────────────────────────────────
const DarkNavTheme = {
  dark: true,
  colors: {
    primary: Colors.primary,
    background: Colors.background,
    card: Colors.background,
    text: Colors.text,
    border: Colors.cardBorder,
    notification: Colors.primary,
  },
  fonts: {
    regular: {fontFamily: 'System', fontWeight: '400' as const},
    medium: {fontFamily: 'System', fontWeight: '500' as const},
    bold: {fontFamily: 'System', fontWeight: '700' as const},
    heavy: {fontFamily: 'System', fontWeight: '900' as const},
  },
};

// ── Root navigator ───────────────────────────────────────
export function AppNavigator() {
  const {isAuthenticated, onboardingStep, isLoading} = useAuthStore();

  if (isLoading) {
    return null; // splash screen placeholder
  }

  return (
    <NavigationContainer theme={DarkNavTheme}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : onboardingStep !== 'complete' ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
