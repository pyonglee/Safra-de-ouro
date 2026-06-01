import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '../src/contexts/AuthContext';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { colors } from '../src/theme';

const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.accent,
    background: colors.background,
    surface: colors.surface,
    error: colors.error,
    onPrimary: colors.white,
    onBackground: colors.textPrimary,
    onSurface: colors.textPrimary,
  },
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={paperTheme}>
          <ErrorBoundary>
            <AuthProvider>
              <StatusBar style="dark" />
              <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="auth" />
                <Stack.Screen name="tabs" />
                <Stack.Screen name="add-worker" options={{ presentation: 'card' }} />
                <Stack.Screen name="add-balaio" options={{ presentation: 'card' }} />
                <Stack.Screen name="add-expense" options={{ presentation: 'card' }} />
                <Stack.Screen name="add-harvest" options={{ presentation: 'card' }} />
                <Stack.Screen name="add-production" options={{ presentation: 'card' }} />
                <Stack.Screen name="add-cotacao" options={{ presentation: 'card' }} />
                <Stack.Screen name="config-preco" options={{ presentation: 'card' }} />
                <Stack.Screen name="cotacoes" options={{ presentation: 'card' }} />
                <Stack.Screen name="relatorios" options={{ presentation: 'card' }} />
                <Stack.Screen name="perfil" options={{ presentation: 'card' }} />
                <Stack.Screen name="worker" />
                <Stack.Screen name="expense" />
                <Stack.Screen name="harvest" />
              </Stack>
            </AuthProvider>
          </ErrorBoundary>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
