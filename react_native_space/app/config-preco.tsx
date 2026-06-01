import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import api from '../src/services/api';
import { GradientButton } from '../src/components/GradientButton';
import { colors, spacing, borderRadius, shadows } from '../src/theme';
import { formatCurrency } from '../src/utils/format';

export default function ConfigPrecoScreen() {
  const router = useRouter();
  const [currentPrice, setCurrentPrice] = useState(0);
  const [newPrice, setNewPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/settings');
        const price = res?.data?.pricePerBalaio ?? 40;
        setCurrentPrice(price);
        setNewPrice(String(price).replace('.', ','));
      } catch (e) {
        console.error('Settings fetch error:', e);
      }
    })();
  }, []);

  const handleSave = async () => {
    const price = parseFloat(newPrice?.replace(',', '.') ?? '0');
    if (!price || price <= 0) { setError('Informe um preço válido'); return; }
    setError('');
    setLoading(true);
    try {
      await api.patch('/api/settings', { pricePerBalaio: price });
      setCurrentPrice(price);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} iconColor={colors.textPrimary} />
        <Text style={styles.headerTitle}>Preço por Balaio</Text>
        <View style={{ width: 48 }} />
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <View style={styles.content}>
          <View style={[styles.currentCard, shadows.card]}>
            <Text style={styles.currentLabel}>Preço Atual</Text>
            <Text style={styles.currentValue}>{formatCurrency(currentPrice)}</Text>
          </View>

          <TextInput
            label="Novo Preço (R$)"
            value={newPrice}
            onChangeText={setNewPrice}
            keyboardType="decimal-pad"
            mode="outlined"
            outlineColor={colors.border}
            activeOutlineColor={colors.accent}
            style={styles.input}
            left={<TextInput.Icon icon="currency-brl" />}
          />

          <Text style={styles.note}>
            O novo preço será aplicado apenas aos registros futuros
          </Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {success ? <Text style={styles.success}>Preço atualizado com sucesso!</Text> : null}

          <GradientButton title="Salvar" onPress={handleSave} loading={loading} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingRight: spacing.sm },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  content: { padding: spacing.md },
  currentCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  currentLabel: { fontSize: 14, color: colors.textSecondary },
  currentValue: { fontSize: 36, fontWeight: '700', color: colors.primary, marginTop: spacing.xs },
  input: { marginBottom: spacing.md, backgroundColor: colors.white },
  note: { fontSize: 13, color: colors.textSecondary, marginBottom: spacing.md, fontStyle: 'italic' },
  error: { color: colors.error, fontSize: 14, marginBottom: spacing.md, textAlign: 'center' },
  success: { color: colors.success, fontSize: 14, marginBottom: spacing.md, textAlign: 'center', fontWeight: '600' },
});
