import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../../../src/services/api';
import { colors, spacing, borderRadius, shadows } from '../../../src/theme';
import { formatCurrency, formatDate, getCategoryLabel } from '../../../src/utils/format';
import type { HarvestDetail } from '../../../src/types';

export default function HarvestDetailScreen() {
  const router = useRouter();
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const [harvest, setHarvest] = useState<HarvestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    if (!id) return;
    try {
      const res = await api.get(`/api/harvests/${id}`);
      setHarvest(res?.data ?? null);
    } catch (e) {
      console.error('Harvest detail fetch error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleDelete = () => {
    Alert.alert('Excluir Safra', `Tem certeza que deseja excluir ${harvest?.name ?? ''}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/api/harvests/${id}`);
            router.back();
          } catch (e) {
            console.error('Delete harvest error:', e);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  const profit = harvest?.netProfit ?? 0;
  const isPositive = profit >= 0;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>{harvest?.name ?? 'Safra'}</Text>
        <Pressable onPress={handleDelete} style={styles.deleteBtn}>
          <MaterialCommunityIcons name="delete-outline" size={22} color={colors.error} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} colors={[colors.primary]} />
        }
      >
        {/* Profit Card */}
        <View style={[styles.profitCard, shadows.cardElevated, { borderLeftColor: isPositive ? colors.success : colors.error }]}>
          <Text style={styles.profitLabel}>Lucro L\u00edquido</Text>
          <Text style={[styles.profitValue, { color: isPositive ? colors.success : colors.error }]}>
            {formatCurrency(profit)}
          </Text>
          <Text style={[styles.profitMargin, { color: isPositive ? colors.success : colors.error }]}>
            Margem: {(harvest?.profitMargin ?? 0)?.toFixed?.(1) ?? '0'}%
          </Text>
        </View>

        {/* Revenue */}
        <View style={[styles.card, shadows.card]}>
          <Text style={styles.cardTitle}>💰 Receita</Text>
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>{harvest?.totalSacks ?? 0} sacas × {formatCurrency(harvest?.salePricePerSack)}</Text>
            <Text style={[styles.cardRowValue, { color: colors.success }]}>{formatCurrency(harvest?.totalRevenue)}</Text>
          </View>
        </View>

        {/* Expenses */}
        <View style={[styles.card, shadows.card]}>
          <Text style={styles.cardTitle}>📊 Despesas</Text>
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Adubo</Text>
            <Text style={styles.cardRowValue}>{formatCurrency(harvest?.expenseBreakdown?.fertilizer)}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Pulveriza\u00e7\u00e3o</Text>
            <Text style={styles.cardRowValue}>{formatCurrency(harvest?.expenseBreakdown?.spraying)}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Outros</Text>
            <Text style={styles.cardRowValue}>{formatCurrency(harvest?.expenseBreakdown?.other)}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Pagamentos Trabalhadores</Text>
            <Text style={styles.cardRowValue}>{formatCurrency(harvest?.totalWorkerPayments)}</Text>
          </View>
          <View style={[styles.cardRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Custos</Text>
            <Text style={[styles.totalValue, { color: colors.error }]}>{formatCurrency(harvest?.grandTotalCosts)}</Text>
          </View>
        </View>

        {/* Production Records */}
        <View style={[styles.card, shadows.card]}>
          <Text style={styles.cardTitle}>📦 Registros de Produ\u00e7\u00e3o</Text>
          {(harvest?.productionRecords?.length ?? 0) === 0 ? (
            <Text style={styles.emptyText}>Nenhum registro de produ\u00e7\u00e3o</Text>
          ) : (
            (harvest?.productionRecords ?? []).map((pr) => (
              <View key={pr?.id} style={styles.cardRow}>
                <Text style={styles.cardRowLabel}>{formatDate(pr?.date)}</Text>
                <Text style={styles.cardRowValue}>{pr?.sacks ?? 0} sacas</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.sm, paddingVertical: spacing.sm },
  backBtn: { padding: spacing.sm },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  deleteBtn: { padding: spacing.sm },
  scroll: { padding: spacing.md },
  profitCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    borderLeftWidth: 4,
  },
  profitLabel: { fontSize: 14, color: colors.textSecondary },
  profitValue: { fontSize: 32, fontWeight: '700', marginTop: spacing.xs },
  profitMargin: { fontSize: 16, fontWeight: '600', marginTop: spacing.xs },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.md },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceSecondary,
  },
  cardRowLabel: { fontSize: 14, color: colors.textSecondary },
  cardRowValue: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  totalRow: { borderBottomWidth: 0, borderTopWidth: 2, borderTopColor: colors.primary, marginTop: spacing.sm, paddingTop: spacing.sm },
  totalLabel: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  totalValue: { fontSize: 16, fontWeight: '700' },
  emptyText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', paddingVertical: spacing.md },
});
