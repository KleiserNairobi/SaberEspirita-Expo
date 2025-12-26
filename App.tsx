import React, { useEffect, useState } from "react";
import { registerRootComponent } from "expo";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";

import { Allura_400Regular } from "@expo-google-fonts/allura";
import { Baskervville_400Regular_Italic } from "@expo-google-fonts/baskervville";
import {
  Oswald_300Light,
  Oswald_400Regular,
  Oswald_500Medium,
  Oswald_600SemiBold,
  Oswald_700Bold,
  useFonts,
} from "@expo-google-fonts/oswald";
import {
  BarlowCondensed_300Light,
  BarlowCondensed_400Regular,
  BarlowCondensed_500Medium,
  BarlowCondensed_600SemiBold,
  BarlowCondensed_700Bold,
} from "@expo-google-fonts/barlow-condensed";

import { RootNavigator } from "./src/routers/RootNavigator";
import { useAppTheme } from "./src/hooks/useAppTheme";

// Criar QueryClient fora do componente para evitar recriação
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutos
    },
  },
});

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    Allura_400Regular,
    Baskervville_400Regular_Italic,
    Oswald_300Light,
    Oswald_400Regular,
    Oswald_500Medium,
    Oswald_600SemiBold,
    Oswald_700Bold,
    BarlowCondensed_300Light,
    BarlowCondensed_400Regular,
    BarlowCondensed_500Medium,
    BarlowCondensed_600SemiBold,
    BarlowCondensed_700Bold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        if (fontsLoaded) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          setAppIsReady(true);
        }
      } catch (e: any) {
        console.error(e);
      }
    }
    prepare();
  }, [fontsLoaded]);

  if (!appIsReady) {
    return null;
  }

  return <AppContent />;
}

function AppContent() {
  const { resolvedThemeType } = useAppTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style={resolvedThemeType === "dark" ? "light" : "dark"} />
          <RootNavigator />
        </QueryClientProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

if (__DEV__) {
  require("./ReactotronConfig");
}

// Registra o componente raiz com Expo
registerRootComponent(App);
