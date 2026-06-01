import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, IconButton } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../src/services/api';
import { GradientButton } from '../src/components/GradientButton';
import { colors, spacing, borderRadius } from '../src/theme';
import type { Harvest, Expense } from '../src/types';

const CATEGORY_OPTIONS = [
  { key: 'FERTILIZER', label: 'Adubo' },
  { key: 'SPRAYING', label: 'Pulverização' },
  { key: 'OTHER', label: 'Outros' },
];

export default function AddExpenseScreen() {
  const router = useRouter();
  const { expenseId = '' } = useLocalSearchParams<{ expenseId?: string }>();
  const isEditing = !!expenseId;

  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [selectedHarvestId, setSelectedHarvestId] = useState<string | null>(null);
  const [category, setCategory] = useState('FERTILIZER');
  const [productName, setProductName] = useState('');
  const [cost, setCost] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [appliedArea, setAppliedArea] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const hRes = await api.get('/api/harvests');
        const h = hRes?.data?.items ?? [];
        setHarvests(h);
        if (!selectedHarvestId && h?.length > 0) setSelectedHarvestId(h[0]?.id ?? null);

        if (isEditing) {
          const eRes = await api.get(`/api/expenses/${expenseId}`);
          const exp: Expense = eRes?.data;
          if (exp) {
            setSelectedHarvestId(exp.harvestId ?? null);
            setCategory(exp.category ?? 'OTHER');
            setProductName(exp.productName ?? '');
            setCost(String(exp.cost ?? ''));
            setQuantity(exp.quantity != null ? String(exp.quantity) : '');
            setUnit(exp.unit ?? '');
            setAppliedArea(exp.appliedArea != null ? String(exp.appliedArea) : '');
            setNotes(exp.notes ?? '');
          }
        }
      } catch (e) {
        console.error('AddExpense fetch error:', e);
      }
    })();
  }, []);

  const handleSave = async () => {
    if (!selectedHarvestId) { setError('Selecione uma safra'); return; }
    if (!productName?.trim()) { setError('Informe o produto/tipo'); return; }
    const costNum = parseFloat(cost?.replace(',', '.') ?? '0');
    if (!costNum || costNum <= 0) { setError('Informe o custo'); return; }
    setError('');
    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        harvestId: selectedHarvestId,
        category,
        productName: productName.trim(),
        date: new Date().toISOString(),
        cost: costNum,
      };
      if (quantity) body.quantity = parseFloat(quantity);
      if (unit) body.unit = unit;
      if (appliedArea) body.appliedArea = parseFloat(appliedArea);
      if (notes?.trim()) body.notes = notes.trim();

      if (isEditing) {
        await api.patch(`/api/expenses/${expenseId}`, body);
      } else {
        await api.post('/api/expenses', body);
      }
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
        <Text style={styles.headerTitle}>{isEditing ? 'Editar Despesa' : 'Nova Despesa'}</Text>
        <View style={{ width: 48 }} />
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Category */}
          <Text style={styles.label}>Categoria</Text>
          <View style={styles.catRow}>
            {CATEGORY_OPTIONS.map((c) => (
              <Pressable
                key={c.key}
                style={[styles.catChip, category === c.key && styles.catChipActive]}
                onPress={() => setCategory(c.key)}
              >
                <Text style={[styles.catChipText, category === c.key && styles.catChipTextActive]}>{c.label}</Text>
              </Pressable>
            ))}
          </View>

          {/* Harvest */}
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

          <TextInput label="Produto / Tipo" value={productName} onChangeText={setProductName}
            mode="outlined" outlineColor={colors.border} activeOutlineColor={colors.accent}
            style={styles.input} />

          <TextInput label="Custo (R$)" value={cost} onChangeText={setCost}
            keyboardType="decimal-pad" mode="outlined" outlineColor={colors.border}
            activeOutlineColor={colors.accent} style={styles.input}
            left={<TextInput.Icon icon="currency-brl" />} />

          <View style={styles.row}>
            <TextInput label="Quantidade" value={quantity} onChangeText={setQuantity}
              keyboardType="decimal-pad" mode="outlined" outlineColor={colors.border}
              activeOutlineColor={colors.accent} style={[styles.input, styles.halfInput]} />
            <TextInput label="Unidade" value={unit} onChangeText={setUnit}
              mode="outlined" outlineColor={colors.border} activeOutlineColor={colors.accent}
              style={[styles.input, styles.halfInput]} placeholder="kg, L, un" />
          </View>

          <TextInput label="Área aplicada (ha)" value={appliedArea} onChangeText={setAppliedArea}
            keyboardType="decimal-pad" mode="outlined" outlineColor={colors.border}
            activeOutlineColor={colors.accent} style={styles.input} />

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
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },
  label: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginBottom: spacing.xs, marginTop: spacing.sm },
  catRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  catChip: {
    flex: 1,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  catChipActive: { backgroundColor: colors.primary },
  catChipText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  catChipTextActive: { color: colors.white },
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
  row: { flexDirection: 'row', gap: spacing.sm },
  halfInput: { flex: 1 },
  error: { color: colors.error, fontSize: 14, marginBottom: spacing.md, textAlign: 'center' },
});
