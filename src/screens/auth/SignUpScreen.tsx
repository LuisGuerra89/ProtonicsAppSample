import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {Button, TextInput, ScreenContainer} from '../../components';
import {Colors, FontSize, Spacing} from '../../constants';
import {useAuthStore} from '../../store';

interface Props {
  navigation: any;
}

export function SignUpScreen({navigation}: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const signUp = useAuthStore(s => s.signUp);

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim() || !firstName.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await signUp(email.trim(), password, firstName.trim(), lastName.trim());
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join the Protonics movement</Text>

        <View style={styles.form}>
          <View style={styles.row}>
            <View style={styles.half}>
              <TextInput
                label="First Name"
                placeholder="John"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View style={styles.half}>
              <TextInput
                label="Last Name"
                placeholder="Doe"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
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
            placeholder="Min 8 characters"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button
            title="Create Account"
            onPress={handleSignUp}
            loading={loading}
          />
        </View>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.link}>
          <Text style={styles.linkText}>
            Already have an account?{' '}
            <Text style={styles.linkBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {flex: 1, justifyContent: 'center', paddingBottom: Spacing.xxl},
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  form: {gap: Spacing.xs},
  row: {flexDirection: 'row', gap: Spacing.md},
  half: {flex: 1},
  link: {alignSelf: 'center', marginTop: Spacing.lg},
  linkText: {fontSize: FontSize.md, color: Colors.textSecondary},
  linkBold: {color: Colors.primary, fontWeight: '600'},
});
