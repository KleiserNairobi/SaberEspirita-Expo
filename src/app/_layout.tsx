import { AuthProvider } from "@/contexts/AuthContext";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  Oswald_300Light,
  Oswald_400Regular,
  useFonts,
} from "@expo-google-fonts/oswald";

import {
  BarlowCondensed_300Light,
  BarlowCondensed_400Regular,
  BarlowCondensed_500Medium,
  BarlowCondensed_600SemiBold,
  BarlowCondensed_700Bold,
} from "@expo-google-fonts/barlow-condensed";

import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    Oswald_300Light,
    Oswald_400Regular,
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
          // Adicione aqui qualquer outra inicialização assíncrona
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

  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(public)" />
        <Stack.Screen name="(private)" />
      </Stack>
    </AuthProvider>
  );
}
