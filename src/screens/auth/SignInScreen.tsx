import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Dimensions,
  Modal,
} from 'react-native';
import {Button, TextInput} from '../../components';
import {Colors, FontSize, Spacing, BorderRadius} from '../../constants';
import {useAuthStore} from '../../store';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

interface Props {
  navigation: any;
}

export function SignInScreen({navigation}: Props) {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const signIn = useAuthStore(s => s.signIn);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoIconText}>P</Text>
          </View>
          <Text style={styles.logoText}>PROTONICS</Text>
        </View>

        {/* Hero area */}
        <View style={styles.hero}>
          <Text style={styles.subtitle}>NEUROMUSCULAR RETRAINING</Text>
          <Text style={styles.headline}>
            ALIGN TO{'\n'}
            <Text style={styles.headlineAccent}>RESTORE</Text>
          </Text>
          <Text style={styles.description}>
            The only alignment-restoration system that actively retrains your
            movement pattern.
          </Text>
        </View>

        {/* Bottom buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.darkButton}
            onPress={() => setShowLogin(true)}
            activeOpacity={0.7}>
            <Text style={styles.darkButtonTextAccent}>LOG IN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.darkButton}
            onPress={() => setShowLogin(true)}
            activeOpacity={0.7}>
            <Text style={styles.darkButtonText}>
              I ALREADY HAVE A PROTONICS
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('SignUp')}
            activeOpacity={0.7}>
            <Text style={styles.primaryButtonText}>
              GET STARTED — IT'S FREE
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Login Modal */}
      <Modal
        visible={showLogin}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowLogin(false)}>
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log In</Text>
              <TouchableOpacity onPress={() => setShowLogin(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              label="Email"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              label="Password"
              placeholder="Your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Button
              title="Sign In"
              onPress={handleSignIn}
              loading={loading}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.background},
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'space-between',
  },

  // Logo
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  logoIconText: {
    color: Colors.textLight,
    fontWeight: '900',
    fontSize: 18,
  },
  logoText: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 4,
  },

  // Hero
  hero: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: Spacing.xl,
  },
  subtitle: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  headline: {
    fontSize: 48,
    fontWeight: '900',
    color: Colors.text,
    lineHeight: 52,
    marginBottom: Spacing.lg,
  },
  headlineAccent: {
    color: Colors.primary,
  },
  description: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    lineHeight: 26,
  },

  // Buttons
  buttons: {
    gap: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  darkButton: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  darkButtonText: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: FontSize.md,
    letterSpacing: 1,
  },
  darkButtonTextAccent: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: FontSize.md,
    letterSpacing: 1,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: Colors.textLight,
    fontWeight: '700',
    fontSize: FontSize.md,
    letterSpacing: 1,
  },

  // Modal
  modalSafe: {flex: 1, backgroundColor: Colors.background},
  modalContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  modalTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
  },
  modalClose: {
    fontSize: FontSize.xl,
    color: Colors.textSecondary,
    padding: Spacing.sm,
  },
});
