import React, { useRef, useState } from "react";

import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { ReaderPreferencesBottomSheet } from "@/components/ReaderPreferencesBottomSheet";
import { ReadingToolbar } from "@/components/ReadingToolbar";
import { useAppTheme } from "@/hooks/useAppTheme";
import { MeditateStackParamList } from "@/routers/types";
import { reflectionApiService } from "@/services/api/reflectionApiService";
import { statsApiService } from "@/services/api/statsApiService";
import { useReaderPreferencesStore } from "@/stores/readerPreferencesStore";
import { useReflectionFavoritesStore } from "@/stores/reflectionFavoritesStore";
import { shareReflection } from "@/utils/sharing";
import { isSpeaking, speakText, stopSpeaking } from "@/utils/textToSpeech";
import { getFooterVerticalPadding } from "@/utils/layout";

import { createStyles } from "./styles";

type ReflectionScreenRouteProp = RouteProp<MeditateStackParamList, "Reflection">;

export function ReflectionScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const route = useRoute<ReflectionScreenRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<MeditateStackParamList>>();
  const insets = useSafeAreaInsets();

  const [isNarrating, setIsNarrating] = useState(false);
  const hasLogged = useRef(false);

  const {
    getFontSize,
    getLineHeight,
    getScreenTitleSize,
    getAuthorSize,
    getSourceSize,
  } = useReaderPreferencesStore();
  const readerPreferencesRef = useRef<BottomSheetModal>(null);

  const handleOpenPreferences = () => {
    readerPreferencesRef.current?.present();
  };

  const { isFavorite, toggleFavorite } = useReflectionFavoritesStore();

  // Buscar reflexão do Firestore usando React Query
  const {
    data: reflection,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["reflection", route.params.id],
    queryFn: () => reflectionApiService.getReflectionById(route.params.id),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Registrar leitura da reflexão
  function handleFinishReading() {
    if (reflection && !hasLogged.current) {
      statsApiService.logEvent({
        eventName: "reflection_read",
        category: "reflection",
        label: reflection.title,
      });
      hasLogged.current = true;
    }

    // Retorna para a tela de onde o usuário veio
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Fallback caso não haja histórico na pilha
      navigation.navigate("MeditateHome");
    }
  }

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

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* 1. Barra de Ações no Topo (Voltar à esquerda; Favoritar, Narrar, Compartilhar, Aa à direita) */}
      <ReadingToolbar
        onBack={handleGoBack}
        onShare={handleShare}
        onNarrate={handleNarrate}
        isNarrating={isNarrating}
        onPreferences={handleOpenPreferences}
        showFavorite={true}
        isFavorite={isFavorite(route.params.id)}
        onFavorite={handleToggleFavorite}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header (Título e Subtítulo alinhados à esquerda) */}
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              {
                fontSize: getScreenTitleSize(),
                lineHeight: Math.round(getScreenTitleSize() * 1.25),
              },
            ]}
          >
            {reflection.title}
          </Text>
          {reflection.subtitle && (
            <Text
              style={[
                styles.subtitle,
                {
                  fontSize: getFontSize(),
                  lineHeight: Math.round(getFontSize() * 1.3),
                },
              ]}
            >
              {reflection.subtitle}
            </Text>
          )}
        </View>

        {/* Conteúdo da reflexão */}
        <Text
          style={[
            styles.bodyText,
            { fontSize: getFontSize(), lineHeight: getLineHeight() },
          ]}
        >
          {reflection.content}
        </Text>

        {/* Assinatura Literária ao Final (Sem travessão, em duas linhas em Baskervville Italic escalável) */}
        {(reflection.author || reflection.source) && (
          <View style={styles.signatureContainer}>
            {reflection.author ? (
              <Text
                style={[
                  styles.signatureAuthor,
                  {
                    fontSize: getAuthorSize(),
                    lineHeight: Math.round(getAuthorSize() * 1.35),
                  },
                ]}
              >
                {reflection.author}
              </Text>
            ) : null}
            {reflection.source ? (
              <Text
                style={[
                  styles.signatureSource,
                  {
                    fontSize: getSourceSize(),
                    lineHeight: Math.round(getSourceSize() * 1.35),
                  },
                ]}
              >
                {reflection.source}
              </Text>
            ) : null}
          </View>
        )}

        {/* Tags */}
        {Array.isArray(reflection.tags) && reflection.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {reflection.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Rodapé Fixo com Botão Finalizar */}
      <View
        style={[
          styles.fixedFooter,
          getFooterVerticalPadding(insets, theme.spacing.md),
        ]}
      >
        <TouchableOpacity
          style={styles.finishButton}
          onPress={handleFinishReading}
          activeOpacity={0.8}
        >
          <Text style={styles.finishButtonText}>Finalizei a Leitura</Text>
        </TouchableOpacity>
      </View>

      <ReaderPreferencesBottomSheet ref={readerPreferencesRef} />
    </SafeAreaView>
  );
}
