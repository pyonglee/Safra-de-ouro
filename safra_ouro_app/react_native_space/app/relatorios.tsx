import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl, Pressable, Share, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../src/services/api';
import { colors, spacing, borderRadius, shadows } from '../src/theme';
import { formatCurrency } from '../src/utils/format';
import type { Harvest, ExpenseReport, WorkerReport, ProductionReport, ProfitReport } from '../src/types';

type ReportType = 'expenses' | 'workers' | 'production' | 'profit';

const REPORT_CONFIG = [
  { key: 'expenses' as ReportType, label: 'Despesas por Produto', icon: 'cash-minus' as const },
  { key: 'workers' as ReportType, label: 'Pagamentos de Trabalhadores', icon: 'account-group' as const },
  { key: 'production' as ReportType, label: 'Produção por Safra', icon: 'package-variant' as const },
  { key: 'profit' as ReportType, label: 'Lucro Detalhado', icon: 'chart-bar' as const },
];

const CATEGORY_LABELS: Record<string, string> = { FERTILIZER: 'Adubo', SPRAYING: 'Pulverização', OTHER: 'Outros' };

export default function ReportsScreen() {
  const router = useRouter();
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [selectedHarvestId, setSelectedHarvestId] = useState<string | null>(null);
  const [expandedReport, setExpandedReport] = useState<ReportType | null>(null);
  const [reportData, setReportData] = useState<Record<string, unknown>>({});
  const [loadingReport, setLoadingReport] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/harvests');
        const h = res?.data?.items ?? [];
        setHarvests(h);
        if (h?.length > 0) setSelectedHarvestId(h[0]?.id ?? null);
      } catch (e) {
        console.error('Reports fetch error:', e);
      }
    })();
  }, []);

  const loadReport = async (type: ReportType) => {
    if (expandedReport === type) {
      setExpandedReport(null);
      return;
    }
    setLoadingReport(true);
    setExpandedReport(type);
    try {
      const params: Record<string, string> = {};
      if (selectedHarvestId) params.harvestId = selectedHarvestId;
      const res = await api.get(`/api/reports/${type}`, { params });
      setReportData((prev) => ({ ...(prev ?? {}), [type]: res?.data }));
    } catch (e) {
      console.error('Report load error:', e);
    } finally {
      setLoadingReport(false);
    }
  };

  const handleShare = async (type: ReportType) => {
    try {
      const data = reportData?.[type];
      if (!data) return;
      let text = `Relatório - ${REPORT_CONFIG.find((r) => r.key === type)?.label ?? type}\n\n`;
      if (type === 'profit') {
        const p = data as ProfitReport;
        text += `Receita: ${formatCurrency(p?.totalRevenue)}\nDespesas: ${formatCurrency(p?.totalExpenses)}\nPagamentos: ${formatCurrency(p?.totalWorkerPayments)}\nLucro: ${formatCurrency(p?.netProfit)}\nMargem: ${(p?.profitMargin ?? 0)?.toFixed?.(1) ?? '0'}%`;
      }
      await Share.share({ message: text });
    } catch (e) {
      console.error('Share error:', e);
    }
  };

  const renderExpenseReport = () => {
    const data = reportData?.expenses as ExpenseReport | undefined;
    if (!data) return null;
    return (
      <View style={styles.reportContent}>
        {(data?.byCategory ?? []).map((cat, i) => (
          <View key={i} style={styles.reportGroup}>
            <Text style={styles.reportGroupTitle}>{CATEGORY_LABELS[cat?.category ?? ''] ?? cat?.category ?? ''}</Text>
            <Text style={styles.reportGroupTotal}>{formatCurrency(cat?.total)}</Text>
            {(cat?.items ?? []).map((item, j) => (
              <View key={j} style={styles.reportRow}>
                <Text style={styles.reportRowLabel}>{item?.productName ?? ''}</Text>
                <Text style={styles.reportRowValue}>{formatCurrency(item?.totalCost)}</Text>
              </View>
            ))}
          </View>
        ))}
        <View style={styles.grandTotal}>
          <Text style={styles.grandTotalLabel}>Total Geral</Text>
          <Text style={styles.grandTotalValue}>{formatCurrency(data?.grandTotal)}</Text>
        </View>
      </View>
    );
  };

  const renderWorkerReport = () => {
    const data = reportData?.workers as WorkerReport | undefined;
    if (!data) return null;
    return (
      <View style={styles.reportContent}>
        {(data?.workers ?? []).map((w) => (
          <View key={w?.id} style={styles.reportRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.reportRowLabel}>{w?.name ?? ''}</Text>
              <Text style={styles.reportRowSub}>{w?.totalBalaios ?? 0} balaios</Text>
            </View>
            <Text style={styles.reportRowValue}>{formatCurrency(w?.totalEarned)}</Text>
          </View>
        ))}
        <View style={styles.grandTotal}>
          <Text style={styles.grandTotalLabel}>Total: {data?.grandTotalBalaios ?? 0} balaios</Text>
          <Text style={styles.grandTotalValue}>{formatCurrency(data?.grandTotalPaid)}</Text>
        </View>
      </View>
    );
  };

  const renderProductionReport = () => {
    const data = reportData?.production as ProductionReport | undefined;
    if (!data) return null;
    return (
      <View style={styles.reportContent}>
        {(data?.harvests ?? []).map((h) => (
          <View key={h?.id} style={styles.reportRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.reportRowLabel}>{h?.name ?? ''}</Text>
              <Text style={styles.reportRowSub}>{h?.totalSacks ?? 0} sacas • {formatCurrency(h?.salePricePerSack)}/saca</Text>
            </View>
            <Text style={styles.reportRowValue}>{formatCurrency(h?.totalRevenue)}</Text>
          </View>
        ))}
        <View style={styles.grandTotal}>
          <Text style={styles.grandTotalLabel}>Total: {data?.grandTotalSacks ?? 0} sacas</Text>
          <Text style={styles.grandTotalValue}>{formatCurrency(data?.grandTotalRevenue)}</Text>
        </View>
      </View>
    );
  };

  const renderProfitReport = () => {
    const data = reportData?.profit as ProfitReport | undefined;
    if (!data) return null;
    return (
      <View style={styles.reportContent}>
        <View style={styles.reportRow}>
          <Text style={styles.reportRowLabel}>Receita Total</Text>
          <Text style={[styles.reportRowValue, { color: colors.success }]}>{formatCurrency(data?.totalRevenue)}</Text>
        </View>
        {(data?.expenseBreakdown ?? []).map((cat, i) => (
          <View key={i} style={styles.reportRow}>
            <Text style={styles.reportRowLabel}>{CATEGORY_LABELS[cat?.category ?? ''] ?? cat?.category ?? ''}</Text>
            <Text style={[styles.reportRowValue, { color: colors.error }]}>- {formatCurrency(cat?.total)}</Text>
          </View>
        ))}
        <View style={styles.reportRow}>
          <Text style={styles.reportRowLabel}>Pagamentos Trabalhadores</Text>
          <Text style={[styles.reportRowValue, { color: colors.error }]}>- {formatCurrency(data?.totalWorkerPayments)}</Text>
        </View>
        <View style={styles.grandTotal}>
          <Text style={styles.grandTotalLabel}>Lucro Líquido</Text>
          <Text style={[styles.grandTotalValue, { color: (data?.netProfit ?? 0) >= 0 ? colors.success : colors.error }]}>
            {formatCurrency(data?.netProfit)} ({(data?.profitMargin ?? 0)?.toFixed?.(1) ?? '0'}%)
          </Text>
        </View>
      </View>
    );
  };

  const renderReportData = (type: ReportType) => {
    if (loadingReport && expandedReport === type) return <ActivityIndicator color={colors.primary} style={{ padding: spacing.md }} />;
    switch (type) {
      case 'expenses': return renderExpenseReport();
      case 'workers': return renderWorkerReport();
      case 'production': return renderProductionReport();
      case 'profit': return renderProfitReport();
      default: return null;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Relatórios</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); setExpandedReport(null); setTimeout(() => setRefreshing(false), 500); }} colors={[colors.primary]} />
      }>
        {/* Harvest filter */}
        {harvests?.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {(harvests ?? []).map((h) => (
              <Pressable
                key={h?.id}
                onPress={() => { setSelectedHarvestId(h?.id ?? null); setExpandedReport(null); }}
                style={[styles.chip, selectedHarvestId === h?.id && styles.chipActive]}
              >
                <Text style={[styles.chipText, selectedHarvestId === h?.id && styles.chipTextActive]}>
                  {h?.name ?? 'Safra'}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {REPORT_CONFIG.map((report) => (
          <View key={report.key} style={styles.reportCard}>
            <Pressable style={[styles.reportHeader, shadows.card]} onPress={() => loadReport(report.key)}>
              <View style={styles.reportIconWrap}>
                <MaterialCommunityIcons name={report.icon} size={24} color={colors.primary} />
              </View>
              <Text style={styles.reportLabel}>{report.label}</Text>
              <View style={styles.reportActions}>
                {expandedReport === report.key && (
                  <Pressable onPress={() => handleShare(report.key)} style={styles.shareBtn}>
                    <MaterialCommunityIcons name="share-variant" size={20} color={colors.primary} />
                  </Pressable>
                )}
                <MaterialCommunityIcons
                  name={expandedReport === report.key ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color={colors.textSecondary}
                />
              </View>
            </Pressable>
            {expandedReport === report.key && renderReportData(report.key)}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.sm, paddingVertical: spacing.sm },
  backBtn: { padding: spacing.sm },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  scroll: { padding: spacing.md },
  chipRow: { marginBottom: spacing.md, maxHeight: 40 },
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
  reportCard: { marginBottom: spacing.sm },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  reportIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  reportLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  reportActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  shareBtn: { padding: spacing.xs },
  reportContent: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: -spacing.sm,
  },
  reportGroup: { marginBottom: spacing.md },
  reportGroupTitle: { fontSize: 15, fontWeight: '700', color: colors.primary, marginBottom: spacing.xs },
  reportGroupTotal: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginBottom: spacing.sm },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceSecondary,
  },
  reportRowLabel: { fontSize: 14, color: colors.textPrimary, flex: 1 },
  reportRowSub: { fontSize: 12, color: colors.textSecondary },
  reportRowValue: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    marginTop: spacing.sm,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
  grandTotalLabel: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  grandTotalValue: { fontSize: 18, fontWeight: '700', color: colors.primary },
});
