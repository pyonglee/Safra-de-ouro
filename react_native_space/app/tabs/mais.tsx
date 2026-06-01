import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius, shadows } from '../../src/theme';

const menuItems = [
  { label: 'Cotações de Café', icon: 'chart-line' as const, route: '/cotacoes' as const, desc: 'Preços e tendências do mercado' },
  { label: 'Relatórios', icon: 'file-chart' as const, route: '/relatorios' as const, desc: 'Despesas, produção e lucros' },
  { label: 'Perfil e Configurações', icon: 'account-cog' as const, route: '/perfil' as const, desc: 'Seus dados e preferências' },
];

export default function MoreScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mais</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {menuItems.map((item, i) => (
          <Pressable
            key={i}
            style={[styles.menuItem, shadows.card]}
            onPress={() => router.push(item.route)}
          >
            <View style={styles.menuIcon}>
              <MaterialCommunityIcons name={item.icon} size={28} color={colors.primary} />
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuDesc}>{item.desc}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.border} />
          </Pressable>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Safra de Ouro v1.0.0</Text>
          <Text style={styles.footerSubtext}>☕ Gestão da lavoura de café</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  headerTitle: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  content: { padding: spacing.md },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  menuIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuText: { flex: 1 },
  menuLabel: { fontSize: 17, fontWeight: '600', color: colors.textPrimary },
  menuDesc: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  footer: { alignItems: 'center', marginTop: spacing.xxl, paddingVertical: spacing.lg },
  footerText: { fontSize: 14, color: colors.textSecondary, fontWeight: '600' },
  footerSubtext: { fontSize: 13, color: colors.disabled, marginTop: 4 },
});
