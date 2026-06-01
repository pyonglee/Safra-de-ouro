import React, { useState } from 'react';
import {
  View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/contexts/AuthContext';
import { GradientButton } from '../../src/components/GradientButton';
import { colors, spacing } from '../../src/theme';

export default function SignupScreen() {
  const { signup } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      setError('Preencha todos os campos');
      return;
    }
    if ((password?.length ?? 0) < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signup(name.trim(), email.trim(), password);
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? 'Erro ao criar conta';
      setError(typeof msg === 'string' ? msg : 'Erro ao criar conta');
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
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>☕</Text>
            <Text style={styles.logoTitle}>Criar Conta</Text>
            <Text style={styles.logoSubtitle}>Comece a gerenciar sua lavoura</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Nome"
              value={name}
              onChangeText={setName}
              mode="outlined"
              outlineColor={colors.border}
              activeOutlineColor={colors.accent}
              style={styles.input}
              left={<TextInput.Icon icon="account" />}
            />
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
              title="Criar conta"
              onPress={handleSignup}
              loading={loading}
              style={styles.button}
            />

            <Pressable onPress={() => router.back()} style={styles.linkWrap}>
              <Text style={styles.link}>Já tem conta? <Text style={styles.linkBold}>Entrar</Text></Text>
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
  logoEmoji: { fontSize: 48, marginBottom: spacing.sm },
  logoTitle: { fontSize: 28, fontWeight: '700', color: colors.primary, marginBottom: spacing.xs },
  logoSubtitle: { fontSize: 16, color: colors.textSecondary },
  form: { width: '100%', maxWidth: 400, alignSelf: 'center' },
  input: { marginBottom: spacing.md, backgroundColor: colors.white },
  error: { color: colors.error, fontSize: 14, marginBottom: spacing.md, textAlign: 'center' },
  button: { marginTop: spacing.sm },
  linkWrap: { marginTop: spacing.lg, alignItems: 'center', padding: spacing.sm },
  link: { color: colors.textSecondary, fontSize: 15 },
  linkBold: { color: colors.primary, fontWeight: '700' },
});
