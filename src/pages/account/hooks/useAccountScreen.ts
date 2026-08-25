import { Linking, Share } from "react-native";

import { Sun, Moon, Smartphone, type LucideIcon } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "@/routers/types";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuthStore } from "@/stores/authStore";
import { usePreferencesStore } from "@/stores/preferencesStore";
import {
  CONTACT_EMAIL,
  INSTAGRAM_URL,
  SHARE_MESSAGE,
} from "../constants";
import { useRateApp } from "@/hooks/useRateApp";
import { authApiService } from "@/services/api/authApiService";

import { useQueryClient } from "@tanstack/react-query";
import { mediaApiService } from "@/services/api/mediaApiService";
import { useUserProfile } from "@/hooks/queries/useUserProfile";

export function useAccountScreen() {
  const { theme, themeType, setThemeType } = useAppTheme();
  const { user, signOut, isGuest } = useAuthStore();
  const preferences = usePreferencesStore();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const queryClient = useQueryClient();

  // Dispara a busca e sincronização do perfil do usuário via GET /users/me
  useUserProfile();

  // Computed values
  const displayName = isGuest
    ? "Visitante"
    : user?.displayName || user?.email?.split("@")[0] || "Usuário";
  const email = isGuest ? "Crie uma conta para salvar seu progresso" : user?.email || "";

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

  async function handleUpdateProfile(newName: string, newPhotoUri?: string | null) {
    if (!user) return;
    try {
      let finalPhotoUrl = user.photoURL;

      if (newPhotoUri === "") {
        await authApiService.updateProfile({ userName: newName, photoUrl: "" });
        finalPhotoUrl = null;
      } else if (newPhotoUri && (newPhotoUri.startsWith("file://") || newPhotoUri.startsWith("content://") || newPhotoUri.startsWith("ph://"))) {
        const res = await mediaApiService.uploadAvatar(newPhotoUri, "avatar.jpg");
        finalPhotoUrl = res.url;
        await authApiService.updateProfile({ userName: newName, photoUrl: res.url });
      } else {
        await authApiService.updateProfile({ userName: newName });
      }

      useAuthStore.getState().setUser({
        ...user,
        displayName: newName,
        photoURL: finalPhotoUrl,
      });

      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    } catch (error) {
      console.error("Erro ao atualizar perfil no hook:", error);
      throw error;
    }
  }

  return {
    // Data
    theme,
    isGuest,
    displayName,
    email,
    photoURL: isGuest ? null : (user?.photoURL ?? null),
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
    handleUpdateName: handleUpdateProfile,
    signOut,
    user,
  };
}
