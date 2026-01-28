import React, { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";
import { OneSignal, LogLevel } from "react-native-onesignal";
import { registerRootComponent } from "expo";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
  BarlowCondensed_400Regular_Italic,
  BarlowCondensed_500Medium,
  BarlowCondensed_600SemiBold,
  BarlowCondensed_700Bold,
} from "@expo-google-fonts/barlow-condensed";

import { RootNavigator } from "./src/routers/RootNavigator";
import { useAppTheme } from "./src/hooks/useAppTheme";
import { useVersionControl } from "./src/hooks/useVersionControl";
import { useUpdateModal } from "./src/hooks/useUpdateModal";
import { UpdateModal } from "./src/components/UpdateModal";

// Criar QueryClient fora do componente para evitar recriação
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutos
    },
  },
});

function useCheckUpdate(appIsReady: boolean) {
  const { versionData, loading, error, checkVersion } = useVersionControl();
  const { modalVisible, modalConfig, showModal, hideModal } = useUpdateModal();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Só executa a verificação quando o app estiver pronto e ainda não tiver verificado
    if (appIsReady && !hasChecked && !loading && versionData) {
      const versionCheck = checkVersion();

      if (versionCheck.needUpdate) {
        showModal({
          critical: versionCheck.critical,
          maintenance: versionCheck.maintenance,
          message: versionCheck.message,
          updateUrl: versionCheck.updateUrl,
        });
      }

      setHasChecked(true);
    }
  }, [appIsReady, hasChecked, loading, versionData, checkVersion, showModal]);

  return {
    modalVisible,
    modalConfig,
    hideModal,
  };
}

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

  const { modalVisible, modalConfig, hideModal } = useCheckUpdate(appIsReady);

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

  // Inicializar OneSignal
  useEffect(() => {
    if (appIsReady) {
      // App IDs do OneSignal
      const oneSignalAppId =
        Platform.OS === "ios"
          ? "53fdc0bb-07b5-49c2-822e-963720610ebd"
          : "10a5e77f-2de1-43ed-8bdb-817d357df2d9";

      // Configurar log level para debug
      OneSignal.Debug.setLogLevel(LogLevel.Verbose);

      // Inicializar OneSignal
      OneSignal.initialize(oneSignalAppId);

      // Solicitar permissões de notificação
      OneSignal.Notifications.requestPermission(true);

      // Sincronizar tags de preferências
      try {
        const { usePreferencesStore } = require("./src/stores/preferencesStore");
        const preferences = usePreferencesStore.getState();

        OneSignal.User.addTags({
          app_updates: preferences.appUpdateNotifications.toString(),
          course_reminders: preferences.courseNotifications.toString(),
        });
        console.log("OneSignal: Tags iniciais sincronizadas");
      } catch (error) {
        console.error("Erro ao sincronizar tags iniciais:", error);
      }
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <>
      <AppContent />
      <UpdateModal
        visible={modalVisible}
        critical={modalConfig.critical}
        maintenance={modalConfig.maintenance}
        message={modalConfig.message}
        updateUrl={modalConfig.updateUrl}
        onClose={hideModal}
      />
    </>
  );
}

function AppContent() {
  const { resolvedThemeType } = useAppTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <QueryClientProvider client={queryClient}>
            <StatusBar style={resolvedThemeType === "dark" ? "light" : "dark"} />
            <RootNavigator />
          </QueryClientProvider>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

if (__DEV__) {
  require("./ReactotronConfig");
}

// Registra o componente raiz com Expo
registerRootComponent(App);
