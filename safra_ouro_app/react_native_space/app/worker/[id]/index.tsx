import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, RefreshControl, Pressable, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter, useLocalSearchParams } from 'expo-router';
import api from '../../../src/services/api';
import { colors, spacing, borderRadius, shadows } from '../../../src/theme';
import { formatCurrency, formatDate } from '../../../src/utils/format';
import { EmptyState } from '../../../src/components/EmptyState';
import type { Worker, BalaioRecord, Harvest } from '../../../src/types';

export default function WorkerDetailScreen() {
  const router = useRouter();
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [records, setRecords] = useState<BalaioRecord[]>([]);
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [selectedHarvestId, setSelectedHarvestId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  if (!id) {
    return (
      <SafeAreaView style={styles.safe}>
        <EmptyState icon="account" title="Trabalhador n\u00e3o encontrado" />
      </SafeAreaView>
    );
  }

  const fetchData = useCallback(async () => {
    try {
      const params: Record<string, string> = {};
      if (selectedHarvestId) params.harvestId = selectedHarvestId;

      const [wRes, bRes, hRes] = await Promise.all([
        api.get(`/api/workers/${id}`, { params }),
        api.get('/api/balaio-records', { params: { workerId: id, ...(selectedHarvestId ? { harvestId: selectedHarvestId } : {}) } }),
        api.get('/api/harvests'),
      ]);
      setWorker(wRes?.data ?? null);
      setRecords(bRes?.data?.items ?? []);
      const h = hRes?.data?.items ?? [];
      setHarvests(h);
      if (!selectedHarvestId && h?.length > 0) setSelectedHarvestId(h[0]?.id ?? null);
    } catch (e) {
      console.error('Worker detail fetch error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id, selectedHarvestId]);

  useFocusEffect(useCallback(() => { fetchData(); }, [fetchData]));

  const handleDelete = () => {
    Alert.alert('Excluir Trabalhador', `Tem certeza que deseja excluir ${worker?.name ?? ''}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/api/workers/${id}`);
            router.back();
          } catch (e) {
            console.error('Delete worker error:', e);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>{worker?.name ?? 'Trabalhador'}</Text>
        <Pressable onPress={handleDelete} style={styles.deleteBtn}>
          <MaterialCommunityIcons name="delete-outline" size={22} color={colors.error} />
        </Pressable>
      </View>

      {/* Summary */}
      <View style={[styles.summaryCard, shadows.card]}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{worker?.totalBalaios ?? 0}</Text>
          <Text style={styles.statLabel}>Balaios</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatCurrency(worker?.totalEarned)}</Text>
          <Text style={styles.statLabel}>Total Ganho</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{(worker?.avgBalaiosPerDay ?? 0)?.toFixed?.(1) ?? '0'}</Text>
          <Text style={styles.statLabel}>M\u00e9dia/Dia</Text>
        </View>
      </View>

      {/* Harvest filter */}
      {harvests?.length > 0 && (
        <FlatList
          horizontal
          data={harvests}
          keyExtractor={(h) => h?.id ?? ''}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          style={styles.filterRow}
          renderItem={({ item: h }) => (
            <Pressable
              onPress={() => setSelectedHarvestId(h?.id ?? null)}
              style={[styles.chip, selectedHarvestId === h?.id && styles.chipActive]}
            >
              <Text style={[styles.chipText, selectedHarvestId === h?.id && styles.chipTextActive]}>
                {h?.name ?? 'Safra'}
              </Text>
            </Pressable>
          )}
        />
      )}

      <FlatList
        data={records ?? []}
        keyExtractor={(item) => item?.id ?? ''}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} colors={[colors.primary]} />
        }
        renderItem={({ item }) => (
          <View style={[styles.recordCard, shadows.card]}>
            <View style={styles.recordInfo}>
              <Text style={styles.recordDate}>{formatDate(item?.date)}</Text>
              <Text style={styles.recordQty}>{item?.quantity ?? 0} balaios × {formatCurrency(item?.pricePerBalaio)}</Text>
            </View>
            <Text style={styles.recordTotal}>{formatCurrency(item?.totalValue)}</Text>
          </View>
        )}
        ListEmptyComponent={
          !loading ? <EmptyState icon="basket" title="Nenhum registro" subtitle="Registre balaios para este trabalhador" /> : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.sm, paddingVertical: spacing.sm },
  backBtn: { padding: spacing.sm },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  deleteBtn: { padding: spacing.sm },
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700', color: colors.primary },
  statLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  filterRow: { paddingHorizontal: spacing.md, marginBottom: spacing.sm, maxHeight: 40 },
  filterList: { gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.full,
  },
  chipActive: { backgroundColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  chipTextActive: { color: colors.white },
  list: { paddingHorizontal: spacing.md, paddingBottom: 20 },
  recordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  recordInfo: { flex: 1 },
  recordDate: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  recordQty: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  recordTotal: { fontSize: 15, fontWeight: '700', color: colors.success },
});
