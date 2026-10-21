import React from "react";

import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import { BookOpen, Heart } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { AIChatCard } from "@/pages/pray/components/AIChatCard";
import { MoodSelector } from "@/pages/pray/components/MoodSelector";
import { TrendingPrayers } from "@/pages/pray/components/TrendingPrayers";
import { WelcomingHero } from "@/pages/pray/components/WelcomingHero";
import { createStyles } from "@/pages/pray/styles";
import { PrayStackParamList } from "@/routers/types";
import { useAmbientPlayerStore } from "@/stores/ambientPlayerStore";
import { useAuth } from "@/stores/authStore";
import { useMoodStore } from "@/stores/moodStore";
import { usePrayerFavoritesStore } from "@/stores/prayerFavoritesStore";

// Removed MOMENT_ICONS mapping

export default function PrayScreen() {
  const { theme } = useAppTheme();
  const { isCompact } = useResponsiveLayout();
  const isTablet = !isCompact;
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<PrayStackParamList>>();
  const { user } = useAuth();
  const { currentMood } = useMoodStore();

  const { setPlaying, setCurrentTrack } = useAmbientPlayerStore();
  const { syncWithFirebase } = usePrayerFavoritesStore();

  React.useEffect(() => {
    if (user?.uid) {
      syncWithFirebase(user.uid);
    }
  }, [user?.uid, syncWithFirebase]);

  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["prayers"] }),
        queryClient.invalidateQueries({ queryKey: ["prayerCategories"] }),
        queryClient.invalidateQueries({ queryKey: ["trendingPrayers"] }),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [queryClient]);

  // Desliga áudio da Oração passada ao retornar
  useFocusEffect(
    React.useCallback(() => {
      setPlaying(false);
      setCurrentTrack(null);
    }, [setPlaying, setCurrentTrack])
  );

  function handleAIChatPress() {
    const moodContext = currentMood
      ? `Estou me sentindo ${currentMood.toLowerCase()}.`
      : "";
    navigation.navigate("EmotionalChat", {
      initialMessage: `Olá. ${moodContext} Poderia me ajudar com uma oração personalizada para o meu momento?`,
      origin: "ore",
    });
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.safeArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Header com Atalhos */}
        <View style={[styles.header, isTablet && styles.tabletHeader]}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.greeting}>Ore</Text>
            <Text style={styles.subtitle}>Você e Deus: em sintonia para o bem.</Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerAction}
              onPress={() =>
                navigation.navigate("AllPrayers", { initialCategory: "FAVORITES" })
              }
              activeOpacity={0.7}
            >
              <Heart size={20} color={theme.colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerAction}
              onPress={() => navigation.navigate("AllPrayers", {})}
              activeOpacity={0.7}
            >
              <BookOpen size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Conteúdo Adaptativo: Duas colunas em Tablet, Coluna Única em Smartphone */}
        {isTablet ? (
          <View style={styles.tabletRow}>
            <View style={styles.tabletLeftColumn}>
              <MoodSelector style={styles.tabletFirstCard} />
              <WelcomingHero style={styles.tabletCard} />
              <AIChatCard onPress={handleAIChatPress} style={styles.tabletCard} />
            </View>
            <View style={styles.tabletRightColumn}>
              <TrendingPrayers
                defaultExpanded={true}
                style={styles.tabletTrendingContainer}
              />
            </View>
          </View>
        ) : (
          <>
            {/* Fluxo de Acolhimento Smartphone: Identificação -> Sugestão -> Assistência */}
            <MoodSelector />
            <WelcomingHero />
            <AIChatCard onPress={handleAIChatPress} />
            <TrendingPrayers />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
