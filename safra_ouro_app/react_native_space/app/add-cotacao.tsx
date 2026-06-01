import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import api from '../src/services/api';
import { GradientButton } from '../src/components/GradientButton';
import { colors, spacing, borderRadius } from '../src/theme';

const COFFEE_TYPES = ['ARABICA', 'ROBUSTA', 'CONILON', 'BLEND'];
const COFFEE_LABELS: Record<string, string> = {
  ARABICA: 'Ar\u00e1bica',
  ROBUSTA: 'Robusta',
  CONILON: 'Conilon',
  BLEND: 'Blend',
};

export default function AddQuotationScreen() {
  const router = useRouter();
  const [coffeeType, setCoffeeType] = useState('ARABICA');
  const [pricePerSack, setPricePerSack] = useState('');
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    const price = parseFloat(pricePerSack?.replace(',', '.') ?? '0');
    if (!price || price <= 0) { setError('Informe o pre\u00e7o por saca'); return; }
    setError('');
    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        coffeeType,
        pricePerSack: price,
        date: new Date().toISOString(),
      };
      if (source?.trim()) body.source = source.trim();
      await api.post('/api/quotations', body);
      router.back();
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
        <Text style={styles.headerTitle}>Nova Cota\u00e7\u00e3o</Text>
        <View style={{ width: 48 }} />
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>Tipo de Caf\u00e9</Text>
          <View style={styles.typeRow}>
            {COFFEE_TYPES.map((t) => (
              <Pressable
                key={t}
                style={[styles.typeChip, coffeeType === t && styles.typeChipActive]}
                onPress={() => setCoffeeType(t)}
              >
                <Text style={[styles.typeChipText, coffeeType === t && styles.typeChipTextActive]}>
                  {COFFEE_LABELS[t] ?? t}
                </Text>
              </Pressable>
            ))}
          </View>

          <TextInput label="Pre\u00e7o por Saca (R$)" value={pricePerSack}
            onChangeText={setPricePerSack} keyboardType="decimal-pad" mode="outlined"
            outlineColor={colors.border} activeOutlineColor={colors.accent} style={styles.input}
            left={<TextInput.Icon icon="currency-brl" />} />

          <TextInput label="Fonte (opcional)" value={source} onChangeText={setSource}
            mode="outlined" outlineColor={colors.border} activeOutlineColor={colors.accent}
            style={styles.input} />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <GradientButton title="Salvar" onPress={handleSave} loading={loading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingRight: spacing.sm },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  scroll: { padding: spacing.md },
  label: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginBottom: spacing.xs, marginTop: spacing.sm },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  typeChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.full,
  },
  typeChipActive: { backgroundColor: colors.primary },
  typeChipText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  typeChipTextActive: { color: colors.white },
  input: { marginBottom: spacing.md, backgroundColor: colors.white },
  error: { color: colors.error, fontSize: 14, marginBottom: spacing.md, textAlign: 'center' },
});
