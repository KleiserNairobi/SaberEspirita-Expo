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

import { useRateApp } from "@/hooks/useRateApp";

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

  const { openStore } = useRateApp();

  // ... (existing code)

  async function handleRateApp() {
    await openStore();
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
    signOut,
  };
}
