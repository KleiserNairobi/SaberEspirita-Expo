import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrayStackParamList } from "@/routers/types";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Heart,
} from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { MoodSelector } from "@/pages/pray/components/MoodSelector";
import { WelcomingHero } from "@/pages/pray/components/WelcomingHero";
import { AIChatCard } from "@/pages/pray/components/AIChatCard";
import { useFeaturedPrayers } from "@/pages/pray/hooks/useFeaturedPrayers";
import { createStyles } from "@/pages/pray/styles";
import { PrayerCard } from "@/pages/pray/components/PrayerCard";
import { useAuth } from "@/stores/authStore";
import { useMoodStore } from "@/stores/moodStore";
import { usePrayerFavoritesStore } from "@/stores/prayerFavoritesStore";
import { useQueryClient } from "@tanstack/react-query";

// Removed MOMENT_ICONS mapping

export default function PrayScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<PrayStackParamList>>();
  const { user } = useAuth();
  const { currentMood } = useMoodStore();
  const queryClient = useQueryClient();

  const { data: featuredPrayers, isLoading: featuredLoading } = useFeaturedPrayers();

  const { syncWithFirebase } = usePrayerFavoritesStore();

  React.useEffect(() => {
    if (user?.uid) {
      syncWithFirebase(user.uid);
    }
  }, [user?.uid, syncWithFirebase]);
  
  // Atualiza o cache ao entrar na tela para garantir que dados novos (destaques) apareçam
  useFocusEffect(
    React.useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ["prayers", "featured"] });
    }, [queryClient])
  );

  function handlePrayerPress(prayerId: string) {
    navigation.navigate("PrayerPrep", { id: prayerId });
  }

  function handleAIChatPress() {
    const moodContext = currentMood
      ? `Estou me sentindo ${currentMood.toLowerCase()}.`
      : "";
    navigation.navigate("EmotionalChat", {
      initialMessage: `Olá. ${moodContext} Poderia me ajudar com uma oração personalizada para o meu momento?`,
    } as any);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.safeArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header com Atalho de Favoritos */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.greeting}>Ore</Text>
            <Text style={styles.subtitle}>Seu companheiro de caminhada espiritual</Text>
          </View>

          <TouchableOpacity
            style={styles.headerAction}
            onPress={() => navigation.navigate("AllPrayers", { initialCategory: "FAVORITES" })}
            activeOpacity={0.7}
          >
            <Heart size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Fluxo de Acolhimento: Identificação -> Sugestão -> Assistência */}
        <MoodSelector />
        <WelcomingHero />
        <AIChatCard onPress={handleAIChatPress} />







        {/* Seção: Orações em Destaque */}
        <Text style={styles.sectionTitle}>Em Destaque</Text>

        {featuredLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : featuredPrayers && featuredPrayers.length > 0 ? (
          <View style={styles.featuredList}>
            {[...featuredPrayers]
              .sort((a, b) => a.title.localeCompare(b.title))
              .map((prayer) => (
                <PrayerCard
                  key={prayer.id}
                  prayer={prayer}
                  onPress={() => handlePrayerPress(prayer.id)}
                />
              ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma oração em destaque no momento</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
