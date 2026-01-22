import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { RootStackParamList } from "./types";
import { useAuthStore } from "@/stores/authStore";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { AuthNavigator } from "./AuthNavigator";
import { AppNavigator } from "./AppNavigator";
import { WelcomeScreen } from "@/pages/onboarding/welcome";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { user, initialized, initializeAuth } = useAuthStore();
  const { hasSeenWelcome } = useOnboardingStore();

  // Inicializar listener do Firebase uma única vez
  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Exibir tela de carregamento até inicialização
  if (!initialized) {
    return null; // Ou tela de splash
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // Usuário não autenticado - mostrar telas de autenticação
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : !hasSeenWelcome ? (
          // Usuário autenticado mas ainda não viu a tela de boas-vindas
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
        ) : (
          // Usuário autenticado e já viu a tela de boas-vindas - mostrar app
          <Stack.Screen name="App" component={AppNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
