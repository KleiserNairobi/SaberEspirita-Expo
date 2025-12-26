import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PrayStackParamList } from "@/routers/types";
import {
  Heart,
  Share2,
  Volume2,
  VolumeX,
  ArrowLeft,
  AArrowDown,
  AArrowUp,
} from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { usePrayerFavoritesStore } from "@/stores/prayerFavoritesStore";
import { usePrayerPreferencesStore } from "@/stores/prayerPreferencesStore";
import { usePrayer } from "@/pages/pray/hooks/usePrayer";
import { createStyles } from "@/pages/pray/prayer/styles";
import { sharePrayer } from "@/utils/sharing";
import { speakText, stopSpeaking, isSpeaking } from "@/utils/tts";

export function PrayerScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<PrayStackParamList>>();
  const route = useRoute<RouteProp<PrayStackParamList, "Prayer">>();
  const { id } = route.params;

  const [isNarrating, setIsNarrating] = useState(false);

  const { data: prayer, isLoading } = usePrayer(id);
  const { isFavorite, toggleFavorite } = usePrayerFavoritesStore();
  const { fontSizeLevel, increaseFontSize, decreaseFontSize, getFontSize } =
    usePrayerPreferencesStore();

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
        await speakText(`${prayer.title}. ${prayer.content}`);
        setIsNarrating(false);
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
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleGoBack}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color={theme.colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleToggleFavorite}
            activeOpacity={0.7}
          >
            <Heart
              size={20}
              color={theme.colors.primary}
              fill={isFav ? theme.colors.primary : "transparent"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleNarrate}
            activeOpacity={0.7}
          >
            {isNarrating ? (
              <VolumeX size={20} color={theme.colors.primary} />
            ) : (
              <Volume2 size={20} color={theme.colors.primary} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Share2 size={20} color={theme.colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={decreaseFontSize}
            activeOpacity={0.7}
            disabled={fontSizeLevel === 0}
          >
            <AArrowDown
              size={20}
              color={fontSizeLevel === 0 ? theme.colors.muted : theme.colors.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={increaseFontSize}
            activeOpacity={0.7}
            disabled={fontSizeLevel === 4}
          >
            <AArrowUp
              size={20}
              color={fontSizeLevel === 4 ? theme.colors.muted : theme.colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Conteúdo */}
        <Text style={[styles.content, { fontSize: getFontSize() }]}>
          {prayer.content}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
