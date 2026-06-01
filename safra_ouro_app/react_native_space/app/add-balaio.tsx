import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Pressable, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, IconButton } from 'react-native-paper';
import { useFocusEffect, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../src/services/api';
import { GradientButton } from '../src/components/GradientButton';
import { colors, spacing, borderRadius, shadows } from '../src/theme';
import { formatCurrency, formatDate } from '../src/utils/format';
import type { Worker, Harvest, BalaioRecord, Settings } from '../src/types';

export default function AddBalaioScreen() {
  const router = useRouter();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [selectedHarvestId, setSelectedHarvestId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState('');
  const [todayRecords, setTodayRecords] = useState<BalaioRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [wRes, hRes, sRes] = await Promise.all([
        api.get('/api/workers'),
        api.get('/api/harvests'),
        api.get('/api/settings'),
      ]);
      setWorkers(wRes?.data?.items ?? []);
      const h = hRes?.data?.items ?? [];
      setHarvests(h);
      if (!selectedHarvestId && h?.length > 0) setSelectedHarvestId(h[0]?.id ?? null);
      setSettings(sRes?.data ?? null);

      // Fetch today's records
      const today = new Date().toISOString().split('T')[0];
      const bRes = await api.get('/api/balaio-records', { params: { date: today } });
      setTodayRecords(bRes?.data?.items ?? []);
    } catch (e) {
      console.error('AddBalaio fetch error:', e);
    }
  }, [selectedHarvestId]);

  useFocusEffect(useCallback(() => { fetchData(); }, [fetchData]));

  const pricePerBalaio = settings?.pricePerBalaio ?? 40;
  const total = (parseInt(quantity, 10) || 0) * pricePerBalaio;

  const handleSave = async () => {
    if (!selectedWorkerId) { setError('Selecione um trabalhador'); return; }
    if (!selectedHarvestId) { setError('Selecione uma safra'); return; }
    const qty = parseInt(quantity, 10);
    if (!qty || qty <= 0) { setError('Informe a quantidade de balaios'); return; }
    setError('');
    setLoading(true);
    try {
      await api.post('/api/balaio-records', {
        workerId: selectedWorkerId,
        harvestId: selectedHarvestId,
        date: new Date().toISOString(),
        quantity: qty,
      });
      setQuantity('');
      setSelectedWorkerId(null);
      // Refresh today's records
      const today = new Date().toISOString().split('T')[0];
      const bRes = await api.get('/api/balaio-records', { params: { date: today } });
      setTodayRecords(bRes?.data?.items ?? []);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/balaio-records/${id}`);
      setTodayRecords((prev) => (prev ?? []).filter((r) => r?.id !== id));
    } catch (e) {
      console.error('Delete balaio error:', e);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} iconColor={colors.textPrimary} />
        <Text style={styles.headerTitle}>Registrar Balaios</Text>
        <View style={{ width: 48 }} />
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Harvest selector */}
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

          {/* Worker selector */}
          <Text style={styles.label}>Trabalhador</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {(workers ?? []).map((w) => (
              <Pressable
                key={w?.id}
                onPress={() => setSelectedWorkerId(w?.id ?? null)}
                style={[styles.chip, selectedWorkerId === w?.id && styles.chipActive]}
              >
                <Text style={[styles.chipText, selectedWorkerId === w?.id && styles.chipTextActive]}>
                  {w?.name ?? 'Trabalhador'}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Quantity */}
          <TextInput
            label="Quantidade de Balaios"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            mode="outlined"
            outlineColor={colors.border}
            activeOutlineColor={colors.accent}
            style={styles.input}
            left={<TextInput.Icon icon="basket" />}
          />

          {/* Price & Total */}
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Pre\u00e7o: {formatCurrency(pricePerBalaio)}/balaio</Text>
            <Text style={styles.totalLabel}>Total: <Text style={styles.totalValue}>{formatCurrency(total)}</Text></Text>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <GradientButton title="Salvar" onPress={handleSave} loading={loading} />

          {/* Today's records */}
          {(todayRecords?.length ?? 0) > 0 && (
            <>
              <Text style={styles.sectionTitle}>Registros de Hoje</Text>
              {(todayRecords ?? []).map((record) => (
                <View key={record?.id} style={[styles.recordCard, shadows.card]}>
                  <View style={styles.recordInfo}>
                    <Text style={styles.recordName}>{record?.workerName ?? ''}</Text>
                    <Text style={styles.recordMeta}>
                      {record?.quantity ?? 0} balaios • {formatCurrency(record?.totalValue)}
                    </Text>
                  </View>
                  <Pressable onPress={() => handleDelete(record?.id ?? '')}>
                    <MaterialCommunityIcons name="delete-outline" size={22} color={colors.error} />
                  </Pressable>
                </View>
              ))}
            </>
          )}
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
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
  },
  priceLabel: { fontSize: 14, color: colors.textSecondary },
  totalLabel: { fontSize: 14, color: colors.textPrimary, fontWeight: '600' },
  totalValue: { color: colors.success, fontWeight: '700' },
  error: { color: colors.error, fontSize: 14, marginBottom: spacing.md, textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.lg, marginBottom: spacing.sm },
  recordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  recordInfo: { flex: 1 },
  recordName: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  recordMeta: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
});
