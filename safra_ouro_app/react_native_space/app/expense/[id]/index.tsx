import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../../../src/services/api';
import { colors, spacing, borderRadius, shadows } from '../../../src/theme';
import { formatCurrency, formatDate, getCategoryLabel, getCategoryIcon } from '../../../src/utils/format';
import type { Expense } from '../../../src/types';

export default function ExpenseDetailScreen() {
  const router = useRouter();
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await api.get(`/api/expenses/${id}`);
        setExpense(res?.data ?? null);
      } catch (e) {
        console.error('Expense detail fetch error:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDelete = () => {
    Alert.alert('Excluir Despesa', 'Tem certeza que deseja excluir esta despesa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/api/expenses/${id}`);
            router.back();
          } catch (e) {
            console.error('Delete expense error:', e);
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

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Detalhe da Despesa</Text>
        <Pressable onPress={() => router.push(`/add-expense?expenseId=${id}`)} style={styles.editBtn}>
          <MaterialCommunityIcons name="pencil" size={22} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.card, shadows.card]}>
          <View style={styles.row}>
            <MaterialCommunityIcons name={getCategoryIcon(expense?.category) as any} size={32} color={colors.primary} />
            <View style={styles.mainInfo}>
              <Text style={styles.productName}>{expense?.productName ?? ''}</Text>
              <Text style={styles.category}>{getCategoryLabel(expense?.category)}</Text>
            </View>
            <Text style={styles.cost}>{formatCurrency(expense?.cost)}</Text>
          </View>

          <View style={styles.divider} />

          <DetailRow label="Data" value={formatDate(expense?.date)} />
          {expense?.quantity != null && (
            <DetailRow label="Quantidade" value={`${expense.quantity} ${expense?.unit ?? ''}`} />
          )}
          {expense?.appliedArea != null && (
            <DetailRow label="Área aplicada" value={`${expense.appliedArea} ha`} />
          )}
          {expense?.notes ? <DetailRow label="Observações" value={expense.notes} /> : null}
        </View>

        <Pressable style={styles.deleteBtn} onPress={handleDelete}>
          <MaterialCommunityIcons name="delete-outline" size={20} color={colors.error} />
          <Text style={styles.deleteBtnText}>Excluir Despesa</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={drStyles.row}>
      <Text style={drStyles.label}>{label}</Text>
      <Text style={drStyles.value}>{value}</Text>
    </View>
  );
}

const drStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  label: { fontSize: 14, color: colors.textSecondary },
  value: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, flex: 1, textAlign: 'right' },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.sm, paddingVertical: spacing.sm },
  backBtn: { padding: spacing.sm },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  editBtn: { padding: spacing.sm },
  scroll: { padding: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  mainInfo: { flex: 1, marginLeft: spacing.md },
  productName: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  category: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  cost: { fontSize: 20, fontWeight: '700', color: colors.error },
  divider: { height: 1, backgroundColor: colors.surfaceSecondary, marginVertical: spacing.md },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.error,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  deleteBtnText: { fontSize: 16, fontWeight: '700', color: colors.error },
});
