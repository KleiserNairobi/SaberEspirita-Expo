import React, { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NavigationState } from "@react-navigation/native";

import { RootStackParamList } from "./types";
import { useAuthStore } from "@/stores/authStore";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { AuthNavigator } from "./AuthNavigator";
import { AppNavigator } from "./AppNavigator";
import { WelcomeScreen } from "@/pages/onboarding/welcome";
import { logScreenView } from "@/services/analytics/analyticsService";

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Mapeia nomes técnicos de rotas para nomes amigáveis
 */
const SCREEN_NAME_MAP: Record<string, string> = {
  // Tabs principais
  StudyTab: "Estude",
  FixTab: "Fixe",
  MeditateTab: "Medite",
  PrayTab: "Ore",
  AccountTab: "Conta",

  // Navegadores internos - Pray
  PrayHome: "Ore - Home",
  PrayCategory: "Ore - Categoria",
  Prayer: "Ore - Oração",

  // Navegadores internos - Meditate
  MeditateHome: "Medite - Home",
  AllReflections: "Medite - Todas Reflexões",
  Reflection: "Medite - Reflexão",

  // Navegadores internos - Fix
  FixHome: "Fixe - Home",
  Subcategories: "Fixe - Subcategorias",
  Quiz: "Fixe - Quiz",
  QuizResult: "Fixe - Resultado",
  QuizReview: "Fixe - Revisão",
  TruthOrFalseHome: "Fixe - V ou F Home",
  TruthOrFalseQuestion: "Fixe - V ou F Questão",
  TruthOrFalseResult: "Fixe - V ou F Resultado",
  TruthOrFalseHistory: "Fixe - V ou F Histórico",

  // Telas modais/stack do App
  FAQ: "FAQ",
  Privacy: "Privacidade",
  Terms: "Termos",
  EmotionalChat: "Chat Emocional",
  ScientificChat: "Chat Científico",
  Glossary: "Glossário",
  AllTerms: "Glossário - Todos Termos",
  TermDetail: "Glossário - Detalhe",
  CoursesCatalog: "Catálogo de Cursos",
  CourseDetails: "Detalhes do Curso",
  CourseCurriculum: "Currículo do Curso",
  LessonPlayer: "Player de Lição",
  CourseQuiz: "Quiz do Curso",
  CourseCertificate: "Certificado do Curso",

  // Auth
  Login: "Login",
  Register: "Registro",
  Welcome: "Boas-vindas",
};

/**
 * Extrai o nome da rota ativa da árvore de navegação
 */
function getActiveRouteName(state: NavigationState | undefined): string | undefined {
  if (!state) return undefined;

  const route = state.routes[state.index];

  // Se a rota tem estado aninhado, buscar recursivamente
  if (route.state) {
    return getActiveRouteName(route.state as NavigationState);
  }

  return route.name;
}

export function RootNavigator() {
  const { user, isGuest, initialized, initializeAuth } = useAuthStore();
  const { hasSeenWelcome } = useOnboardingStore();
  const routeNameRef = useRef<string | undefined>(undefined);

  // Inicializar listener do Firebase uma única vez
  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [initializeAuth]);

  // Exibir tela de carregamento até inicialização
  if (!initialized) {
    return null; // Ou tela de splash
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        // Captura o nome da tela inicial
        const initialRoute = getActiveRouteName(navigationRef.current?.getRootState());
        if (initialRoute) {
          routeNameRef.current = initialRoute;
        }
      }}
      onStateChange={(state) => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = getActiveRouteName(state);

        if (previousRouteName !== currentRouteName && currentRouteName) {
          // Mapear nome técnico para nome amigável
          // @ts-ignore - SCREEN_NAME_MAP pode não ter todas as chaves
          const friendlyName = SCREEN_NAME_MAP[currentRouteName] || currentRouteName;

          // Logar visualização de tela
          logScreenView(friendlyName, currentRouteName);

          // Salvar nome atual
          routeNameRef.current = currentRouteName;
        }
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {(!user && !isGuest) || (user && !user.emailVerified) ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : !hasSeenWelcome ? (
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
        ) : (
          <Stack.Screen name="App" component={AppNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Ref para acessar o estado de navegação e analytics
export const navigationRef = React.createRef<any>();
