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
import { formatCurrency, formatDate, getCategoryLabel, getCategoryIcon } from '../../src/utils/format';
import { EmptyState } from '../../src/components/EmptyState';
import type { Expense, Harvest } from '../../src/types';

const CATEGORIES = [
  { key: 'ALL', label: 'Todos' },
  { key: 'FERTILIZER', label: 'Adubo' },
  { key: 'SPRAYING', label: 'Pulverização' },
  { key: 'OTHER', label: 'Outros' },
];

export default function ExpensesScreen() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [selectedHarvestId, setSelectedHarvestId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const params: Record<string, string> = {};
      if (selectedHarvestId) params.harvestId = selectedHarvestId;
      if (selectedCategory !== 'ALL') params.category = selectedCategory;

      const [expRes, harvestRes] = await Promise.all([
        api.get('/api/expenses', { params }),
        api.get('/api/harvests'),
      ]);
      setExpenses(expRes?.data?.items ?? []);
      setTotalCost(expRes?.data?.totalCost ?? 0);
      const h = harvestRes?.data?.items ?? [];
      setHarvests(h);
      if (!selectedHarvestId && h?.length > 0) {
        setSelectedHarvestId(h[0]?.id ?? null);
      }
    } catch (e) {
      console.error('Expenses fetch error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedHarvestId, selectedCategory]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const renderExpense = ({ item }: { item: Expense }) => (
    <Pressable
      style={[styles.expenseCard, shadows.card]}
      onPress={() => router.push(`/expense/${item?.id}`)}
    >
      <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(item?.category) + '20' }]}>
        <MaterialCommunityIcons
          name={getCategoryIcon(item?.category) as any}
          size={24}
          color={getCategoryColor(item?.category)}
        />
      </View>
      <View style={styles.expenseInfo}>
        <Text style={styles.expenseName} numberOfLines={1}>{item?.productName ?? ''}</Text>
        <Text style={styles.expenseMeta}>
          {getCategoryLabel(item?.category)} • {formatDate(item?.date)}
        </Text>
      </View>
      <Text style={styles.expenseCost}>{formatCurrency(item?.cost)}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Despesas</Text>
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

      {/* Category filter */}
      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(c) => c.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
        style={styles.filterRow}
        renderItem={({ item: c }) => (
          <Pressable
            onPress={() => setSelectedCategory(c.key)}
            style={[styles.catChip, selectedCategory === c.key && styles.catChipActive]}
          >
            <Text style={[styles.catChipText, selectedCategory === c.key && styles.catChipTextActive]}>
              {c.label}
            </Text>
          </Pressable>
        )}
      />

      {/* Total */}
      <View style={styles.totalBanner}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatCurrency(totalCost)}</Text>
      </View>

      <FlatList
        data={expenses ?? []}
        keyExtractor={(item) => item?.id ?? ''}
        renderItem={renderExpense}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} colors={[colors.primary]} />
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState icon="cash-minus" title="Nenhuma despesa registrada" subtitle="Toque no + para adicionar" />
          ) : null
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        color={colors.white}
        onPress={() => router.push('/add-expense')}
        accessibilityLabel="Adicionar despesa"
      />
    </SafeAreaView>
  );
}

function getCategoryColor(category: string | undefined): string {
  switch (category) {
    case 'FERTILIZER': return colors.success;
    case 'SPRAYING': return '#1565C0';
    case 'OTHER': return colors.accent;
    default: return colors.textSecondary;
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  filterRow: { paddingHorizontal: spacing.md, marginBottom: spacing.xs, maxHeight: 40 },
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
  catChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  catChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  catChipText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  catChipTextActive: { color: colors.white },
  totalBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  totalLabel: { fontSize: 16, fontWeight: '600', color: colors.white },
  totalValue: { fontSize: 20, fontWeight: '700', color: colors.white },
  list: { paddingHorizontal: spacing.md, paddingBottom: 80 },
  expenseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  expenseInfo: { flex: 1 },
  expenseName: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  expenseMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  expenseCost: { fontSize: 15, fontWeight: '700', color: colors.error },
  fab: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
});
