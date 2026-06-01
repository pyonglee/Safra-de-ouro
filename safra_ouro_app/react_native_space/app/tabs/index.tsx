import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import api from '../../src/services/api';
import { useAuth } from '../../src/contexts/AuthContext';
import { colors, spacing, borderRadius, shadows } from '../../src/theme';
import { formatCurrency, formatDate } from '../../src/utils/format';
import { EmptyState } from '../../src/components/EmptyState';
import type { DashboardData } from '../../src/types';

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [selectedHarvestId, setSelectedHarvestId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = useCallback(async (harvestId?: string | null) => {
    try {
      const params: Record<string, string> = {};
      if (harvestId) params.harvestId = harvestId;
      const res = await api.get('/api/dashboard', { params });
      setData(res?.data ?? null);
      if (!harvestId && res?.data?.currentHarvest?.id) {
        setSelectedHarvestId(res.data.currentHarvest.id);
      }
    } catch (e) {
      console.error('Dashboard fetch error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDashboard(selectedHarvestId);
    }, [selectedHarvestId, fetchDashboard])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboard(selectedHarvestId);
  };

  const summaryCards = [
    { label: 'Produ\u00e7\u00e3o', value: `${data?.totalSacks ?? 0} sacas`, icon: 'package-variant' as const, color: colors.success },
    { label: 'Receita', value: formatCurrency(data?.totalRevenue), icon: 'cash' as const, color: colors.accent },
    { label: 'Despesas', value: formatCurrency(data?.grandTotalCosts), icon: 'cash-minus' as const, color: colors.primary },
    { label: 'Lucro', value: formatCurrency(data?.netProfit), icon: 'chart-line' as const, color: (data?.netProfit ?? 0) >= 0 ? colors.success : colors.error },
  ];

  const quickActions = [
    { label: 'Balaios', icon: 'basket' as const, route: '/add-balaio' as const },
    { label: 'Despesa', icon: 'cash-minus' as const, route: '/add-expense' as const },
    { label: 'Produ\u00e7\u00e3o', icon: 'package-variant' as const, route: '/add-production' as const },
    { label: 'Cota\u00e7\u00f5es', icon: 'chart-line' as const, route: '/cotacoes' as const },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Ol\u00e1, {user?.name?.split(' ')?.[0] ?? 'Produtor'} \u2615</Text>
          <Text style={styles.headerTitle}>Safra de Ouro</Text>
        </View>
        <Pressable
          onPress={() => router.push('/perfil')}
          style={styles.profileBtn}
          accessibilityLabel="Perfil"
        >
          <MaterialCommunityIcons name="account-circle" size={36} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        {/* Harvest selector */}
        {(data?.harvests?.length ?? 0) > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.harvestSelector}>
            {(data?.harvests ?? []).map((h) => (
              <Pressable
                key={h?.id}
                onPress={() => setSelectedHarvestId(h?.id ?? null)}
                style={[
                  styles.harvestChip,
                  selectedHarvestId === h?.id && styles.harvestChipActive,
                ]}
              >
                <Text style={[
                  styles.harvestChipText,
                  selectedHarvestId === h?.id && styles.harvestChipTextActive,
                ]}>
                  {h?.name ?? 'Safra'}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* Summary Cards */}
        <View style={styles.cardsRow}>
          {summaryCards.map((card, i) => (
            <View key={i} style={[styles.summaryCard, shadows.card]}>
              <MaterialCommunityIcons name={card.icon} size={28} color={card.color} />
              <Text style={styles.cardValue}>{card.value}</Text>
              <Text style={styles.cardLabel}>{card.label}</Text>
            </View>
          ))}
        </View>

        {/* Profit Margin */}
        {data?.currentHarvest && (
          <View style={[styles.marginCard, shadows.card]}>
            <Text style={styles.marginLabel}>Margem de Lucro</Text>
            <Text style={[
              styles.marginValue,
              { color: (data?.profitMargin ?? 0) >= 0 ? colors.success : colors.error },
            ]}>
              {(data?.profitMargin ?? 0)?.toFixed?.(1) ?? '0'}%
            </Text>
          </View>
        )}

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>A\u00e7\u00f5es R\u00e1pidas</Text>
        <View style={styles.quickActionsRow}>
          {quickActions.map((action, i) => (
            <Pressable
              key={i}
              style={[styles.quickAction, shadows.card]}
              onPress={() => router.push(action.route)}
            >
              <View style={styles.quickActionIcon}>
                <MaterialCommunityIcons name={action.icon} size={24} color={colors.primary} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Atividade Recente</Text>
        {(data?.recentActivity?.length ?? 0) === 0 ? (
          <EmptyState
            icon="history"
            title="Nenhuma atividade recente"
            subtitle="Comece registrando balaios ou despesas"
          />
        ) : (
          (data?.recentActivity ?? []).map((item, i) => (
            <View key={i} style={[styles.activityItem, shadows.card]}>
              <MaterialCommunityIcons
                name={getActivityIcon(item?.type)}
                size={24}
                color={colors.primary}
                style={styles.activityIcon}
              />
              <View style={styles.activityContent}>
                <Text style={styles.activityDesc} numberOfLines={1}>{item?.description ?? ''}</Text>
                <Text style={styles.activityDate}>{formatDate(item?.date)}</Text>
              </View>
              <Text style={styles.activityValue}>{formatCurrency(item?.value)}</Text>
            </View>
          ))
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function getActivityIcon(type: string | undefined): any {
  switch (type) {
    case 'balaio': return 'basket';
    case 'expense': return 'cash-minus';
    case 'production': return 'package-variant';
    default: return 'history';
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scrollContent: { padding: spacing.md },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  },
  greeting: { fontSize: 14, color: colors.textSecondary },
  headerTitle: { fontSize: 24, fontWeight: '700', color: colors.primary },
  profileBtn: { padding: spacing.xs },
  harvestSelector: { marginBottom: spacing.md },
  harvestChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  harvestChipActive: {
    backgroundColor: colors.primary,
  },
  harvestChipText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  harvestChipTextActive: { color: colors.white },
  cardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  summaryCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  cardValue: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.xs },
  cardLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  marginCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  marginLabel: { fontSize: 14, color: colors.textSecondary },
  marginValue: { fontSize: 32, fontWeight: '700', marginTop: spacing.xs },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  quickAction: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  quickActionLabel: { fontSize: 12, fontWeight: '600', color: colors.textPrimary, textAlign: 'center' },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  activityIcon: { marginRight: spacing.md },
  activityContent: { flex: 1 },
  activityDesc: { fontSize: 14, fontWeight: '500', color: colors.textPrimary },
  activityDate: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  activityValue: { fontSize: 14, fontWeight: '700', color: colors.primary },
});
