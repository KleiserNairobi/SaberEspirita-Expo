import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { GlossaryStackParamList } from "@/routers/types";
import { ArrowLeft, MessageCircle } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useGlossaryFavoritesStore } from "@/stores/glossaryFavoritesStore";
import { usePrayerPreferencesStore } from "@/stores/prayerPreferencesStore";
import { useGlossaryTerm } from "../hooks/useGlossaryTerms";
import { GLOSSARY_CATEGORIES } from "@/types/glossary";
import { createStyles } from "./styles";
import { speakText, stopSpeaking, isSpeaking } from "@/utils/textToSpeech";
import { ReadingToolbar } from "@/components/ReadingToolbar";

export function TermDetailScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<GlossaryStackParamList>>();
  const route = useRoute<RouteProp<GlossaryStackParamList, "TermDetail">>();
  const { id } = route.params;

  const [isNarrating, setIsNarrating] = useState(false);

  const { data: term, isLoading } = useGlossaryTerm(id);
  const isFavorite = useGlossaryFavoritesStore((s) => s.isFavorite(id));
  const toggleFavorite = useGlossaryFavoritesStore((s) => s.toggleFavorite);
  const { fontSizeLevel, increaseFontSize, decreaseFontSize, getFontSize } =
    usePrayerPreferencesStore();

  async function handleShare() {
    if (!term) return;

    try {
      await Share.share({
        message: `${term.term}\n\n${term.definition}\n\nReferências:\n${term.references.join("\n")}`,
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível compartilhar o termo");
    }
  }

  async function handleNarrate() {
    if (!term) return;

    try {
      const speaking = await isSpeaking();

      if (speaking || isNarrating) {
        await stopSpeaking();
        setIsNarrating(false);
      } else {
        setIsNarrating(true);
        const fullText = `${term.term}. ${term.definition}. Referências: ${term.references.join(". ")}`;
        await speakText(fullText);
        setIsNarrating(false);
      }
    } catch (error) {
      setIsNarrating(false);
      Alert.alert("Erro", "Não foi possível narrar o termo");
    }
  }

  function handleToggleFavorite() {
    if (!term) return;
    toggleFavorite(term.id);
  }

  function handleGoBack() {
    navigation.goBack();
  }

  function handleAskAllan() {
    if (!term) return;

    // Navega para o chat científico com mensagem inicial sobre o termo
    navigation.navigate("ScientificChat" as any, {
      initialMessage: `Gostaria de saber mais sobre ${term.term}`,
    });
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

  if (!term) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Termo não encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  const CategoryIcon = GLOSSARY_CATEGORIES[term.category].icon;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.safeArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{term.term}</Text>

          {/* Metadata */}
          <View style={styles.metadata}>
            <CategoryIcon size={14} color={theme.colors.textSecondary} strokeWidth={2} />
            <View style={styles.divider} />
            <Text style={styles.metadataText}>{term.category}</Text>
          </View>
        </View>

        {/* Barra de Ações Reutilizável */}
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
          isFavorite={isFavorite}
          onFavorite={handleToggleFavorite}
        />

        {/* Definição */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Definição</Text>
          <Text style={[styles.content, { fontSize: getFontSize() }]}>
            {term.definition}
          </Text>
        </View>

        {/* Referências */}
        {term.references.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Referências</Text>
            {term.references.map((ref, index) => (
              <Text
                key={index}
                style={[styles.reference, { fontSize: getFontSize() - 2 }]}
              >
                • {ref}
              </Text>
            ))}
          </View>
        )}

        {/* Sinônimos */}
        {term.synonyms && term.synonyms.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sinônimos</Text>
            {term.synonyms.map((syn, index) => (
              <Text
                key={index}
                style={[styles.reference, { fontSize: getFontSize() - 2 }]}
              >
                • {syn}
              </Text>
            ))}
          </View>
        )}

        {/* Botão Perguntar ao Sr. Allan */}
        <TouchableOpacity
          style={styles.askButton}
          onPress={handleAskAllan}
          activeOpacity={0.8}
        >
          <MessageCircle size={20} color="#fff" />
          <Text style={styles.askButtonText}>Perguntar ao Sr. Allan</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
