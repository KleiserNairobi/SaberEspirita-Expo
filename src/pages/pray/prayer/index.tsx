import React, { useState, useEffect, useRef } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PrayStackParamList } from "@/routers/types";

import { useAppTheme } from "@/hooks/useAppTheme";
import { usePrayerFavoritesStore } from "@/stores/prayerFavoritesStore";
import { usePrayerPreferencesStore } from "@/stores/prayerPreferencesStore";
import { usePrayer } from "@/pages/pray/hooks/usePrayer";
import { useAuth } from "@/stores/authStore";
import { logPrayerUsage } from "@/services/firebase/prayerUsageService";
import { createStyles } from "@/pages/pray/prayer/styles";
import { sharePrayer } from "@/utils/sharing";
import { useQueryClient } from "@tanstack/react-query";

import { useAmbientPlayerStore } from "@/stores/ambientPlayerStore";
import { speakText, stopSpeaking, isSpeaking } from "@/utils/textToSpeech";
import { ReadingToolbar } from "@/components/ReadingToolbar";
import { AmbientPlayerControls } from "@/pages/pray/components/AmbientPlayerControls";

export function PrayerScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<PrayStackParamList>>();
  const route = useRoute<RouteProp<PrayStackParamList, "Prayer">>();
  const { id } = route.params;
  const { user, isGuest } = useAuth();

  const hasLogged = useRef(false);
  const [isNarrating, setIsNarrating] = useState(false);

  const { data: prayer, isLoading } = usePrayer(id);
  const { isFavorite, toggleFavorite } = usePrayerFavoritesStore();
  const { fontSizeLevel, increaseFontSize, decreaseFontSize, getFontSize } = usePrayerPreferencesStore();
  const queryClient = useQueryClient();
  const { setPlaying, setCurrentTrack } = useAmbientPlayerStore();

  // Extermina som instataneamente se houver regressão na pilha (Back Hardware, Seta ou Cancelamento)
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (e.data.action.type === "GO_BACK" || e.data.action.type === "POP") {
        // Para a música e reseta a seleção visual, exigindo nova seleção se quiser.
        // Isso é a lógica à prova de falhas demandada.
        setPlaying(false);
        setCurrentTrack(null, null);
      }
    });
    return unsubscribe;
  }, [navigation, setPlaying, setCurrentTrack]);

  // Removemos o log precipitado. O uso agora é garantido apenas perante o encerramento da prece.

  async function handleShare() {
    if (!prayer) return;

    try {
      await sharePrayer(prayer);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível compartilhar a oração");
    }
  }

  async function handleNarrate() {
    if (!prayer) return;

    try {
      const speaking = await isSpeaking();

      if (speaking || isNarrating) {
        await stopSpeaking();
        setIsNarrating(false);
      } else {
        setIsNarrating(true);
        await speakText(
          `${prayer.title}. ${prayer.content}`,
          undefined,
          () => setIsNarrating(false),
          () => setIsNarrating(false)
        );
      }
    } catch (error) {
      setIsNarrating(false);
      Alert.alert("Erro", "Não foi possível narrar a oração");
    }
  }

  function handleToggleFavorite() {
    if (!prayer) return;
    toggleFavorite(prayer.id);
  }

  function handleGoBack() {
    navigation.goBack();
  }

  function handleFinishPrayer() {
    // 1. Registra com fidelidade que o usuário concluiu esta prece
    if (prayer && !hasLogged.current) {
      const userId = user?.uid || "guest";
      logPrayerUsage(prayer.id, userId);
      hasLogged.current = true;
      queryClient.invalidateQueries({ queryKey: ["prayers", "trending"] });
    }

    // 2. Quando finalizamos e saímos, garantimos a destruição da trilha
    setPlaying(false);
    setCurrentTrack(null, null);

    if (navigation.canGoBack()) {
      // Retorna e mata a Preparação do caminho, parando nas listas (Origens)!
      navigation.pop(2);
    } else {
      navigation.navigate("PrayHome");
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!prayer) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Oração não encontrada</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isFav = isFavorite(prayer.id);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.safeArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{prayer.title}</Text>

          {/* Metadata */}
          {(prayer.author || prayer.source) && (
            <View style={styles.metadata}>
              {prayer.author && <Text style={styles.metadataText}>{prayer.author}</Text>}
              {prayer.author && prayer.source && <View style={styles.divider} />}
              {prayer.source && <Text style={styles.metadataText}>{prayer.source}</Text>}
            </View>
          )}
        </View>

        {/* Barra de Ações */}
        <ReadingToolbar
          onBack={handleGoBack}
          onShare={handleShare}
          onNarrate={handleNarrate}
          isNarrating={isNarrating}
          onIncreaseFontSize={increaseFontSize}
          onDecreaseFontSize={decreaseFontSize}
          canIncreaseFontSize={fontSizeLevel < 4}
          canDecreaseFontSize={fontSizeLevel > 0}
          showFavorite={true}
          isFavorite={isFav}
          onFavorite={handleToggleFavorite}
        />

        {/* Conteúdo */}
        <Text style={[styles.content, { fontSize: getFontSize() }]}>
          {prayer.content}
        </Text>
      </ScrollView>

      <View style={[
        styles.fixedFooter, 
        { paddingBottom: insets.bottom > 0 ? insets.bottom + 8 : 32 }
      ]}>
        <AmbientPlayerControls />

        <TouchableOpacity 
          style={styles.finishButton}
          onPress={handleFinishPrayer}
          activeOpacity={0.8}
        >
          <Text style={styles.finishButtonText}>Finalizei Minha Prece</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
