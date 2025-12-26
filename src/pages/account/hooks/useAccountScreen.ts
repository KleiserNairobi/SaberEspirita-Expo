import { Alert, Linking, Share, Platform } from "react-native";

import { Sun, Moon, Smartphone, type LucideIcon } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "@/routers/types";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuthStore } from "@/stores/authStore";
import { usePreferencesStore } from "@/stores/preferencesStore";
import {
  ALERTS,
  CONTACT_EMAIL,
  INSTAGRAM_URL,
  SHARE_MESSAGE,
  APP_STORE_URL,
  PLAY_STORE_URL,
} from "../constants";

export function useAccountScreen() {
  const { theme, themeType, setThemeType } = useAppTheme();
  const { user, signOut } = useAuthStore();
  const preferences = usePreferencesStore();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  // Computed values
  const displayName = user?.displayName || user?.email?.split("@")[0] || "Usuário";
  const email = user?.email || "";

  // Theme helpers
  function getThemeLabel(): string {
    switch (themeType) {
      case "light":
        return "Claro";
      case "dark":
        return "Escuro";
      case "system":
        return "Sistema";
    }
  }

  function getThemeIcon(): LucideIcon {
    switch (themeType) {
      case "light":
        return Sun;
      case "dark":
        return Moon;
      case "system":
        return Smartphone;
    }
  }

  // Handlers
  function handleThemeChange() {
    const themes: Array<"light" | "dark" | "system"> = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(themeType);
    const nextIndex = (currentIndex + 1) % themes.length;
    setThemeType(themes[nextIndex]);
  }

  function handleContactUs() {
    Linking.openURL(`mailto:${CONTACT_EMAIL}?subject=Contato via App`);
  }

  function handleFAQ() {
    navigation.navigate("FAQ");
  }

  function handleTerms() {
    navigation.navigate("Terms");
  }

  function handlePrivacy() {
    navigation.navigate("Privacy");
  }

  async function handleRateApp() {
    const storeUrl = Platform.OS === "ios" ? APP_STORE_URL : PLAY_STORE_URL;

    try {
      const canOpen = await Linking.canOpenURL(storeUrl);

      if (canOpen) {
        await Linking.openURL(storeUrl);
      } else {
        // Fallback para simulador ou quando o link não pode ser aberto
        Alert.alert(
          "Avaliar App",
          Platform.OS === "ios"
            ? "Para avaliar o app, acesse a App Store em um dispositivo real."
            : "Para avaliar o app, acesse a Play Store em um dispositivo real."
        );
      }
    } catch (error) {
      console.error("Erro ao abrir loja:", error);
      Alert.alert(
        "Erro",
        "Não foi possível abrir a loja. Por favor, tente novamente mais tarde."
      );
    }
  }

  function handleInstagram() {
    Linking.openURL(INSTAGRAM_URL);
  }

  async function handleShareApp() {
    try {
      await Share.share({ message: SHARE_MESSAGE });
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  }

  function handleLogout() {
    Alert.alert(ALERTS.logout.title, ALERTS.logout.message, [
      { text: ALERTS.logout.cancelText, style: "cancel" },
      {
        text: ALERTS.logout.confirmText,
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            console.error("Erro ao fazer logout:", error);
          }
        },
      },
    ]);
  }

  return {
    // Data
    theme,
    displayName,
    email,
    themeIcon: getThemeIcon(),
    themeLabel: getThemeLabel(),
    preferences,

    // Actions
    handleThemeChange,
    handleContactUs,
    handleFAQ,
    handleTerms,
    handlePrivacy,
    handleRateApp,
    handleInstagram,
    handleShareApp,
    handleLogout,
  };
}
