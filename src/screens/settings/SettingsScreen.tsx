import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import {ScreenContainer, Card, Button} from '../../components';
import {Colors, FontSize, Spacing, BorderRadius} from '../../constants';
import {useAuthStore} from '../../store';

interface Props {
  navigation: any;
}

export function SettingsScreen({navigation}: Props) {
  const {user, signOut} = useAuthStore();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Sign Out', style: 'destructive', onPress: signOut},
    ]);
  };

  return (
    <ScreenContainer title="Settings" tabScreen>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile */}
        <Card title="Profile">
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.firstName?.[0]?.toUpperCase() ?? '?'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>
                {user?.firstName} {user?.lastName}
              </Text>
              <Text style={styles.email}>{user?.email}</Text>
              <Text style={styles.tier}>
                {user?.subscriptionTier === 'pro' ? 'PRO' : 'Free'} Plan
              </Text>
            </View>
          </View>
        </Card>

        {/* Subscription */}
        <Card>
          <SettingsRow
            title="Subscription"
            value={user?.subscriptionTier === 'pro' ? 'PRO' : 'Free'}
            onPress={() => navigation.navigate('Subscription')}
          />
        </Card>

        {/* Support */}
        <Card title="Support">
          <SettingsRow
            title="Book Expert Appointment"
            onPress={() => Linking.openURL('https://protonics.com/book')}
          />
          <SettingsRow
            title="Help Center"
            onPress={() => Linking.openURL('https://protonics.com/help')}
          />
          <SettingsRow
            title="Privacy Policy"
            onPress={() => Linking.openURL('https://protonics.com/privacy')}
          />
        </Card>

        {/* Sign Out */}
        <View style={styles.signOut}>
          <Button
            title="Sign Out"
            variant="outline"
            onPress={handleSignOut}
          />
        </View>

        <View style={{height: Spacing.xxl}} />
      </ScrollView>
    </ScreenContainer>
  );
}

function SettingsRow({
  title,
  value,
  onPress,
}: {
  title: string;
  value?: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.settingsRow}
      onPress={onPress}
      activeOpacity={0.6}>
      <Text style={styles.settingsTitle}>{title}</Text>
      <View style={styles.settingsRight}>
        {value && <Text style={styles.settingsValue}>{value}</Text>}
        <Text style={styles.chevron}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  profileRow: {flexDirection: 'row', alignItems: 'center'},
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textLight,
  },
  profileInfo: {flex: 1},
  name: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  email: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  tier: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 4,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  settingsTitle: {
    fontSize: FontSize.md,
    color: Colors.text,
  },
  settingsRight: {flexDirection: 'row', alignItems: 'center'},
  settingsValue: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginRight: Spacing.xs,
  },
  chevron: {
    fontSize: FontSize.xl,
    color: Colors.disabled,
  },
  signOut: {marginTop: Spacing.lg},
});
