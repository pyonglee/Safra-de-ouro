import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import api from '../src/services/api';
import { GradientButton } from '../src/components/GradientButton';
import { colors, spacing, borderRadius } from '../src/theme';
import type { Harvest } from '../src/types';

export default function AddProductionScreen() {
  const router = useRouter();
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [selectedHarvestId, setSelectedHarvestId] = useState<string | null>(null);
  const [sacks, setSacks] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/harvests');
        const h = res?.data?.items ?? [];
        setHarvests(h);
        if (h?.length > 0) setSelectedHarvestId(h[0]?.id ?? null);
      } catch (e) {
        console.error('AddProduction fetch error:', e);
      }
    })();
  }, []);

  const handleSave = async () => {
    if (!selectedHarvestId) { setError('Selecione uma safra'); return; }
    const sacksNum = parseInt(sacks, 10);
    if (!sacksNum || sacksNum <= 0) { setError('Informe o número de sacas'); return; }
    setError('');
    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        harvestId: selectedHarvestId,
        date: new Date().toISOString(),
        sacks: sacksNum,
      };
      if (notes?.trim()) body.notes = notes.trim();
      await api.post('/api/production-records', body);
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
        <Text style={styles.headerTitle}>Registrar Produção</Text>
        <View style={{ width: 48 }} />
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>Safra</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {(harvests ?? []).map((h) => (
              <Pressable
                key={h?.id}
                onPress={() => setSelectedHarvestId(h?.id ?? null)}
                style={[styles.chip, selectedHarvestId === h?.id && styles.chipActive]}
              >
                <Text style={[styles.chipText, selectedHarvestId === h?.id && styles.chipTextActive]}>
                  {h?.name ?? 'Safra'}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <TextInput label="Número de Sacas" value={sacks} onChangeText={setSacks}
            keyboardType="numeric" mode="outlined" outlineColor={colors.border}
            activeOutlineColor={colors.accent} style={styles.input}
            left={<TextInput.Icon icon="package-variant" />} />

          <TextInput label="Observações" value={notes} onChangeText={setNotes}
            mode="outlined" outlineColor={colors.border} activeOutlineColor={colors.accent}
            style={styles.input} multiline numberOfLines={3} />

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
  chipRow: { marginBottom: spacing.sm, maxHeight: 40 },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  chipActive: { backgroundColor: colors.primary },
  chipText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  chipTextActive: { color: colors.white },
  input: { marginBottom: spacing.md, backgroundColor: colors.white },
  error: { color: colors.error, fontSize: 14, marginBottom: spacing.md, textAlign: 'center' },
});
