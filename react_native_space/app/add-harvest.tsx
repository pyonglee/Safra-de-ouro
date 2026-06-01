import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import api from '../src/services/api';
import { GradientButton } from '../src/components/GradientButton';
import { colors, spacing } from '../src/theme';

export default function AddHarvestScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [salePricePerSack, setSalePricePerSack] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!name?.trim()) { setError('Informe o nome da safra'); return; }
    const price = parseFloat(salePricePerSack?.replace(',', '.') ?? '0');
    if (!price || price <= 0) { setError('Informe o preço por saca'); return; }
    setError('');
    setLoading(true);
    try {
      await api.post('/api/harvests', { name: name.trim(), salePricePerSack: price });
      router.back();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} iconColor={colors.textPrimary} />
        <Text style={styles.headerTitle}>Nova Safra</Text>
        <View style={{ width: 48 }} />
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TextInput label="Nome (ex: Safra 2024)" value={name} onChangeText={setName}
            mode="outlined" outlineColor={colors.border} activeOutlineColor={colors.accent}
            style={styles.input} left={<TextInput.Icon icon="sprout" />} autoFocus />

          <TextInput label="Preço por Saca (R$)" value={salePricePerSack}
            onChangeText={setSalePricePerSack} keyboardType="decimal-pad" mode="outlined"
            outlineColor={colors.border} activeOutlineColor={colors.accent} style={styles.input}
            left={<TextInput.Icon icon="currency-brl" />} />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <GradientButton title="Salvar" onPress={handleSave} loading={loading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingRight: spacing.sm },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  scroll: { padding: spacing.md },
  input: { marginBottom: spacing.md, backgroundColor: colors.white },
  error: { color: colors.error, fontSize: 14, marginBottom: spacing.md, textAlign: 'center' },
});
