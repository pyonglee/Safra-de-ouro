import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, RefreshControl, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { FAB } from 'react-native-paper';
import api from '../../src/services/api';
import { colors, spacing, borderRadius, shadows } from '../../src/theme';
import { formatCurrency, formatDate } from '../../src/utils/format';
import { EmptyState } from '../../src/components/EmptyState';
import type { Worker, Harvest, Settings } from '../../src/types';

export default function WorkersScreen() {
  const router = useRouter();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [selectedHarvestId, setSelectedHarvestId] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [workersRes, harvestsRes, settingsRes] = await Promise.all([
        api.get('/api/workers', { params: selectedHarvestId ? { harvestId: selectedHarvestId } : {} }),
        api.get('/api/harvests'),
        api.get('/api/settings'),
      ]);
      setWorkers(workersRes?.data?.items ?? []);
      const h = harvestsRes?.data?.items ?? [];
      setHarvests(h);
      if (!selectedHarvestId && h?.length > 0) {
        setSelectedHarvestId(h[0]?.id ?? null);
      }
      setSettings(settingsRes?.data ?? null);
    } catch (e) {
      console.error('Workers fetch error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedHarvestId]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const renderWorker = ({ item }: { item: Worker }) => (
    <Pressable
      style={[styles.workerCard, shadows.card]}
      onPress={() => router.push(`/worker/${item?.id}`)}
    >
      <View style={styles.workerAvatar}>
        <MaterialCommunityIcons name="account" size={28} color={colors.primary} />
      </View>
      <View style={styles.workerInfo}>
        <Text style={styles.workerName}>{item?.name ?? 'Trabalhador'}</Text>
        <Text style={styles.workerMeta}>
          {item?.totalBalaios ?? 0} balaios • {formatCurrency(item?.totalEarned)}
        </Text>
        {item?.lastRecordDate ? (
          <Text style={styles.workerDate}>Último registro: {formatDate(item?.lastRecordDate)}</Text>
        ) : null}
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color={colors.border} />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trabalhadores</Text>
        <Pressable
          style={styles.priceChip}
          onPress={() => router.push('/config-preco')}
        >
          <MaterialCommunityIcons name="cash" size={16} color={colors.accent} />
          <Text style={styles.priceChipText}>
            {formatCurrency(settings?.pricePerBalaio)}/balaio
          </Text>
        </Pressable>
      </View>

      {/* Harvest filter */}
      {harvests?.length > 0 && (
        <View style={styles.filterRow}>
          <FlatList
            horizontal
            data={harvests}
            keyExtractor={(h) => h?.id ?? ''}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
            renderItem={({ item: h }) => (
              <Pressable
                onPress={() => setSelectedHarvestId(h?.id ?? null)}
                style={[
                  styles.chip,
                  selectedHarvestId === h?.id && styles.chipActive,
                ]}
              >
                <Text style={[
                  styles.chipText,
                  selectedHarvestId === h?.id && styles.chipTextActive,
                ]}>{h?.name ?? 'Safra'}</Text>
              </Pressable>
            )}
          />
        </View>
      )}

      {/* Register balaios button */}
      <Pressable
        style={styles.registerBtn}
        onPress={() => router.push('/add-balaio')}
      >
        <MaterialCommunityIcons name="basket" size={20} color={colors.white} />
        <Text style={styles.registerBtnText}>Registrar Balaios</Text>
      </Pressable>

      <FlatList
        data={workers ?? []}
        keyExtractor={(item) => item?.id ?? ''}
        renderItem={renderWorker}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} colors={[colors.primary]} />
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon="account-group"
              title="Nenhum trabalhador cadastrado"
              subtitle="Toque no + para adicionar um trabalhador"
            />
          ) : null
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        color={colors.white}
        onPress={() => router.push('/add-worker')}
        accessibilityLabel="Adicionar trabalhador"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  priceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  priceChipText: { fontSize: 13, fontWeight: '600', color: colors.accent },
  filterRow: { paddingHorizontal: spacing.md, marginBottom: spacing.sm },
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
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  registerBtnText: { color: colors.white, fontWeight: '700', fontSize: 15 },
  list: { paddingHorizontal: spacing.md, paddingBottom: 80 },
  workerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  workerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  workerInfo: { flex: 1 },
  workerName: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  workerMeta: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  workerDate: { fontSize: 12, color: colors.disabled, marginTop: 2 },
  fab: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
});
