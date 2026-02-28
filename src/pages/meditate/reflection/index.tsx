import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Clock, Tag, User } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ReadingToolbar } from "@/components/ReadingToolbar";
import { useAppTheme } from "@/hooks/useAppTheme";
import { MeditateStackParamList } from "@/routers/types";
import { logMeditationUsage } from "@/services/firebase/meditationService";
import { getReflectionById } from "@/services/firebase/reflectionService";
import { useAuth } from "@/stores/authStore";
import { usePrayerPreferencesStore } from "@/stores/prayerPreferencesStore";
import { useReflectionFavoritesStore } from "@/stores/reflectionFavoritesStore";
import { REFLECTION_TOPICS } from "@/types/reflection";
import { shareReflection } from "@/utils/sharing";
import { isSpeaking, speakText, stopSpeaking } from "@/utils/textToSpeech";
import { createStyles } from "./styles";

type ReflectionScreenRouteProp = RouteProp<MeditateStackParamList, "Reflection">;

export default function ReflectionScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const route = useRoute<ReflectionScreenRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<MeditateStackParamList>>();
  const { user, isGuest } = useAuth();

  const [isNarrating, setIsNarrating] = useState(false);
  const hasLogged = useRef(false);

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

  // Registrar leitura da reflexão
  useEffect(() => {
    if (reflection && (user || isGuest) && !hasLogged.current) {
      const userId = user?.uid || "guest";
      logMeditationUsage(reflection.id, userId, "reflection");
      hasLogged.current = true;
    }
  }, [reflection, user, isGuest]);

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
          `${reflection.title}. ${reflection.subtitle || ""}. ${reflection.content}`,
          undefined,
          () => setIsNarrating(false),
          () => setIsNarrating(false)
        );
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
        {/* Header (Título e Subtítulo) */}
        <View style={styles.header}>
          <Text style={styles.title}>{reflection.title}</Text>
          {reflection.subtitle && (
            <Text style={styles.subtitle}>{reflection.subtitle}</Text>
          )}
        </View>

        {/* Conteúdo */}
        <View style={styles.content}>
          {/* Metadados - Envolvidos em uma View para gerenciar margem caso a caso */}
          <View style={styles.metadata}>
            {/* 1. Referência / Fonte */}
            {reflection.source && (
              <View style={styles.metadataItem}>
                <BookOpen size={16} color={theme.colors.muted} />
                <Text style={styles.metadataText}>{reflection.source}</Text>
              </View>
            )}

            {/* 2. Autor */}
            {reflection.author && (
              <View style={styles.metadataItem}>
                <User size={16} color={theme.colors.muted} />
                <Text style={styles.metadataText}>{reflection.author}</Text>
              </View>
            )}

            {/* 3. Tempo de leitura */}
            <View style={styles.metadataItem}>
              <Clock size={16} color={theme.colors.muted} />
              <Text style={styles.metadataText}>
                {reflection.readingTimeMinutes} min de leitura
              </Text>
            </View>

            {/* 4. Tópico / Categoria */}
            <View style={styles.metadataItem}>
              <Tag size={16} color={theme.colors.muted} />
              <Text style={styles.metadataText}>{topicLabel}</Text>
            </View>
          </View>

          {/* Barra de Ações alinhada espacialmente e sem exceder a margem do texto */}
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
            isFavorite={isFavorite(route.params.id)}
            onFavorite={handleToggleFavorite}
          />

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
