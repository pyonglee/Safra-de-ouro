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
import { formatCurrency } from '../../src/utils/format';
import { EmptyState } from '../../src/components/EmptyState';
import type { Harvest } from '../../src/types';

export default function ProductionScreen() {
  const router = useRouter();
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get('/api/harvests');
      setHarvests(res?.data?.items ?? []);
    } catch (e) {
      console.error('Harvests fetch error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const renderHarvest = ({ item }: { item: Harvest }) => {
    const profit = item?.netProfit ?? 0;
    const isPositive = profit >= 0;
    return (
      <Pressable
        style={[styles.harvestCard, shadows.card]}
        onPress={() => router.push(`/harvest/${item?.id}`)}
      >
        <View style={styles.harvestHeader}>
          <View style={styles.harvestIcon}>
            <MaterialCommunityIcons name="sprout" size={24} color={colors.success} />
          </View>
          <View style={styles.harvestNameWrap}>
            <Text style={styles.harvestName}>{item?.name ?? 'Safra'}</Text>
            <Text style={styles.harvestPrice}>{formatCurrency(item?.salePricePerSack)}/saca</Text>
          </View>
          <View style={[styles.profitBadge, { backgroundColor: isPositive ? colors.success + '20' : colors.error + '20' }]}>
            <Text style={[styles.profitBadgeText, { color: isPositive ? colors.success : colors.error }]}>
              {(item?.profitMargin ?? 0)?.toFixed?.(1) ?? '0'}%
            </Text>
          </View>
        </View>
        <View style={styles.harvestStats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{item?.totalSacks ?? 0}</Text>
            <Text style={styles.statLabel}>Sacas</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatCurrency(item?.totalRevenue)}</Text>
            <Text style={styles.statLabel}>Receita</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: isPositive ? colors.success : colors.error }]}>
              {formatCurrency(profit)}
            </Text>
            <Text style={styles.statLabel}>Lucro</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Produ\u00e7\u00e3o</Text>
        <Pressable style={styles.newHarvestBtn} onPress={() => router.push('/add-harvest')}>
          <MaterialCommunityIcons name="plus" size={18} color={colors.white} />
          <Text style={styles.newHarvestBtnText}>Nova Safra</Text>
        </Pressable>
      </View>

      <FlatList
        data={harvests ?? []}
        keyExtractor={(item) => item?.id ?? ''}
        renderItem={renderHarvest}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} colors={[colors.primary]} />
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState icon="sprout" title="Nenhuma safra cadastrada" subtitle="Crie sua primeira safra para come\u00e7ar" />
          ) : null
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        color={colors.white}
        onPress={() => router.push('/add-production')}
        accessibilityLabel="Registrar produ\u00e7\u00e3o"
        label="Produção"
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
  newHarvestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: 4,
  },
  newHarvestBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  list: { paddingHorizontal: spacing.md, paddingBottom: 80 },
  harvestCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  harvestHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  harvestIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.success + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  harvestNameWrap: { flex: 1 },
  harvestName: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  harvestPrice: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  profitBadge: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.full },
  profitBadgeText: { fontSize: 13, fontWeight: '700' },
  harvestStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: colors.surfaceSecondary,
    paddingTop: spacing.md,
  },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  statLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  fab: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
});
