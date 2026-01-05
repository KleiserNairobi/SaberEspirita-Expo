import React, { useState } from "react";
import { ScrollView, Text, View, Image, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import {
  Clock,
  User,
  BookOpen,
  Tag,
  Heart,
  Share2,
  Volume2,
  VolumeX,
  ArrowLeft,
  AArrowDown,
  AArrowUp,
} from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { getReflectionById } from "@/services/firebase/reflectionService";
import { REFLECTION_TOPICS } from "@/types/reflection";
import { MeditateStackParamList } from "@/routers/types";
import { usePrayerPreferencesStore } from "@/stores/prayerPreferencesStore";
import { useReflectionFavoritesStore } from "@/stores/reflectionFavoritesStore";
import { speakText, stopSpeaking, isSpeaking } from "@/utils/textToSpeech";
import { shareReflection } from "@/utils/sharing";
import { createStyles } from "./styles";

type ReflectionScreenRouteProp = RouteProp<MeditateStackParamList, "Reflection">;

export default function ReflectionScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const route = useRoute<ReflectionScreenRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<MeditateStackParamList>>();

  const [isNarrating, setIsNarrating] = useState(false);

  const { fontSizeLevel, increaseFontSize, decreaseFontSize, getFontSize } =
    usePrayerPreferencesStore();

  const { isFavorite, toggleFavorite } = useReflectionFavoritesStore();

  // Buscar reflexão do Firestore usando React Query
  const {
    data: reflection,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["reflection", route.params.id],
    queryFn: () => getReflectionById(route.params.id),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  async function handleShare() {
    if (!reflection) return;

    try {
      await shareReflection(reflection);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível compartilhar a reflexão");
    }
  }

  async function handleNarrate() {
    if (!reflection) return;

    try {
      const speaking = await isSpeaking();

      if (speaking || isNarrating) {
        await stopSpeaking();
        setIsNarrating(false);
      } else {
        setIsNarrating(true);
        await speakText(
          `${reflection.title}. ${reflection.subtitle || ""}. ${reflection.content}`
        );
        setIsNarrating(false);
      }
    } catch (error) {
      setIsNarrating(false);
      Alert.alert("Erro", "Não foi possível narrar a reflexão");
    }
  }

  function handleToggleFavorite() {
    if (!reflection) return;
    toggleFavorite(reflection.id);
  }

  function handleGoBack() {
    navigation.goBack();
  }

  // Estado de loading
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Estado de erro ou reflexão não encontrada
  if (isError || !reflection) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Reflexão não encontrada</Text>
        </View>
      </SafeAreaView>
    );
  }

  const topicLabel = REFLECTION_TOPICS[reflection.topic]?.label || reflection.topic;

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Imagem de capa com degradê e título sobreposto */}
        {reflection.imageUrl && (
          <View style={styles.coverImageContainer}>
            <Image source={{ uri: reflection.imageUrl }} style={styles.coverImage} />
            <LinearGradient
              colors={["transparent", "rgba(0, 0, 0, 0.8)"]}
              style={styles.imageGradient}
              locations={[0, 1]}
            />

            {/* Título e subtítulo sobrepostos */}
            <View style={styles.overlayContent}>
              <Text style={styles.overlayTitle}>{reflection.title}</Text>
              {reflection.subtitle && (
                <Text style={styles.overlaySubtitle}>{reflection.subtitle}</Text>
              )}
            </View>
          </View>
        )}

        {/* Conteúdo */}
        <View style={styles.content}>
          {/* Metadados */}
          <View style={styles.metadata}>
            {/* Primeira linha: Autor e Fonte */}
            <View style={styles.metadataRow}>
              {/* Autor */}
              {reflection.author && (
                <View style={styles.metadataItem}>
                  <User size={16} color={theme.colors.muted} />
                  <Text style={styles.metadataText}>{reflection.author}</Text>
                </View>
              )}

              {/* Fonte */}
              {reflection.source && (
                <View style={styles.metadataItem}>
                  <BookOpen size={16} color={theme.colors.muted} />
                  <Text style={styles.metadataText}>{reflection.source}</Text>
                </View>
              )}
            </View>

            {/* Segunda linha: Tempo de leitura e Tópico */}
            <View style={styles.metadataRow}>
              {/* Tempo de leitura */}
              <View style={styles.metadataItem}>
                <Clock size={16} color={theme.colors.muted} />
                <Text style={styles.metadataText}>
                  {reflection.readingTimeMinutes} min de leitura
                </Text>
              </View>

              {/* Tópico */}
              <View style={styles.metadataItem}>
                <Tag size={16} color={theme.colors.muted} />
                <Text style={styles.metadataText}>{topicLabel}</Text>
              </View>
            </View>
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
                fill={isFavorite(route.params.id) ? theme.colors.primary : "transparent"}
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

          {/* Divisor */}
          {/* <View style={styles.divider} /> */}

          {/* Conteúdo da reflexão */}
          <Text style={[styles.bodyText, { fontSize: getFontSize() }]}>
            {reflection.content}
          </Text>

          {/* Tags */}
          {reflection.tags && reflection.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {reflection.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
