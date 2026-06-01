import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, RefreshControl, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { FAB } from 'react-native-paper';
import api from '../src/services/api';
import { colors, spacing, borderRadius, shadows } from '../src/theme';
import { formatCurrency, formatDate } from '../src/utils/format';
import { EmptyState } from '../src/components/EmptyState';
import type { Quotation, QuotationLatest } from '../src/types';

const COFFEE_LABELS: Record<string, string> = {
  ARABICA: 'Ar\u00e1bica',
  ROBUSTA: 'Robusta',
  CONILON: 'Conilon',
  BLEND: 'Blend',
};

export default function QuotationsScreen() {
  const router = useRouter();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [latestByType, setLatestByType] = useState<Record<string, QuotationLatest>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get('/api/quotations');
      setQuotations(res?.data?.items ?? []);
      setLatestByType(res?.data?.latestByType ?? {});
    } catch (e) {
      console.error('Quotations fetch error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchData(); }, [fetchData]));

  const latestEntries = Object.entries(latestByType ?? {});

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Cota\u00e7\u00f5es de Caf\u00e9</Text>
        <View style={{ width: 48 }} />
      </View>

      <FlatList
        data={quotations ?? []}
        keyExtractor={(item) => item?.id ?? ''}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} colors={[colors.primary]} />
        }
        ListHeaderComponent={
          latestEntries?.length > 0 ? (
            <View style={styles.latestSection}>
              <Text style={styles.sectionTitle}>Pre\u00e7os Atuais</Text>
              <View style={styles.latestCards}>
                {latestEntries.map(([type, data]) => (
                  <View key={type} style={[styles.latestCard, shadows.card]}>
                    <Text style={styles.latestType}>{COFFEE_LABELS[type] ?? type}</Text>
                    <Text style={styles.latestPrice}>{formatCurrency(data?.current?.pricePerSack)}</Text>
                    <View style={styles.trendRow}>
                      <MaterialCommunityIcons
                        name={data?.trend === 'up' ? 'arrow-up' : data?.trend === 'down' ? 'arrow-down' : 'minus'}
                        size={16}
                        color={data?.trend === 'up' ? colors.success : data?.trend === 'down' ? colors.error : colors.textSecondary}
                      />
                      <Text style={styles.latestDate}>{formatDate(data?.current?.date)}</Text>
                    </View>
                  </View>
                ))}
              </View>
              <Text style={[styles.sectionTitle, { marginTop: spacing.md }]}>Hist\u00f3rico</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={[styles.quoteItem, shadows.card]}>
            <View style={styles.quoteInfo}>
              <Text style={styles.quoteType}>{COFFEE_LABELS[item?.coffeeType ?? ''] ?? item?.coffeeType ?? ''}</Text>
              <Text style={styles.quoteMeta}>{formatDate(item?.date)}{item?.source ? ` \u2022 ${item.source}` : ''}</Text>
            </View>
            <Text style={styles.quotePrice}>{formatCurrency(item?.pricePerSack)}</Text>
          </View>
        )}
        ListEmptyComponent={
          !loading ? (
            <EmptyState icon="chart-line" title="Nenhuma cota\u00e7\u00e3o registrada" subtitle="Toque no + para adicionar" />
          ) : null
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        color={colors.white}
        onPress={() => router.push('/add-cotacao')}
        accessibilityLabel="Adicionar cota\u00e7\u00e3o"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.sm, paddingVertical: spacing.sm },
  backBtn: { padding: spacing.sm },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  list: { padding: spacing.md, paddingBottom: 80 },
  latestSection: { marginBottom: spacing.sm },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.sm },
  latestCards: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  latestCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  latestType: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  latestPrice: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.xs },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.xs },
  latestDate: { fontSize: 12, color: colors.textSecondary },
  quoteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  quoteInfo: { flex: 1 },
  quoteType: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  quoteMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  quotePrice: { fontSize: 16, fontWeight: '700', color: colors.accent },
  fab: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
});
