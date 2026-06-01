import React, { useState } from 'react';
import {
  View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable, Alert,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/contexts/AuthContext';
import { GradientButton } from '../../src/components/GradientButton';
import { colors, spacing, borderRadius } from '../../src/theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email?.trim() || !password?.trim()) {
      setError('Preencha todos os campos');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? 'Erro ao fazer login. Verifique suas credenciais.';
      setError(typeof msg === 'string' ? msg : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>☕</Text>
            <Text style={styles.logoTitle}>Safra de Ouro</Text>
            <Text style={styles.logoSubtitle}>Gestão da sua lavoura de café</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              mode="outlined"
              outlineColor={colors.border}
              activeOutlineColor={colors.accent}
              style={styles.input}
              left={<TextInput.Icon icon="email" />}
            />

            <TextInput
              label="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              mode="outlined"
              outlineColor={colors.border}
              activeOutlineColor={colors.accent}
              style={styles.input}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <GradientButton
              title="Entrar"
              onPress={handleLogin}
              loading={loading}
              style={styles.button}
            />

            <Pressable onPress={() => router.push('/auth/signup')} style={styles.linkWrap}>
              <Text style={styles.link}>Ainda não tem conta? <Text style={styles.linkBold}>Criar conta</Text></Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  logoContainer: { alignItems: 'center', marginBottom: spacing.xl },
  logoEmoji: { fontSize: 64, marginBottom: spacing.sm },
  logoTitle: { fontSize: 32, fontWeight: '700', color: colors.primary, marginBottom: spacing.xs },
  logoSubtitle: { fontSize: 16, color: colors.textSecondary },
  form: { width: '100%', maxWidth: 400, alignSelf: 'center' },
  input: { marginBottom: spacing.md, backgroundColor: colors.white },
  error: { color: colors.error, fontSize: 14, marginBottom: spacing.md, textAlign: 'center' },
  button: { marginTop: spacing.sm },
  linkWrap: { marginTop: spacing.lg, alignItems: 'center', padding: spacing.sm },
  link: { color: colors.textSecondary, fontSize: 15 },
  linkBold: { color: colors.primary, fontWeight: '700' },
});
