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
import { Heart, BookOpen } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { MoodSelector } from "@/pages/pray/components/MoodSelector";
import { WelcomingHero } from "@/pages/pray/components/WelcomingHero";
import { AIChatCard } from "@/pages/pray/components/AIChatCard";
import { TrendingPrayers } from "@/pages/pray/components/TrendingPrayers";
import { createStyles } from "@/pages/pray/styles";
import { PrayerCard } from "@/pages/pray/components/PrayerCard";
import { useAuth } from "@/stores/authStore";
import { useMoodStore } from "@/stores/moodStore";
import { useAmbientPlayerStore } from "@/stores/ambientPlayerStore";
import { usePrayerFavoritesStore } from "@/stores/prayerFavoritesStore";
import { useQueryClient } from "@tanstack/react-query";

// Removed MOMENT_ICONS mapping

export default function PrayScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<PrayStackParamList>>();
  const { user } = useAuth();
  const { currentMood, clearMood } = useMoodStore();
  const queryClient = useQueryClient();

  const { setPlaying, setCurrentTrack } = useAmbientPlayerStore();
  const { syncWithFirebase } = usePrayerFavoritesStore();

  React.useEffect(() => {
    if (user?.uid) {
      syncWithFirebase(user.uid);
    }
  }, [user?.uid, syncWithFirebase]);

  // Atualiza o cache, reseta o humor e desliga áudio da Oração passada ao retornar
  useFocusEffect(
    React.useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ["prayers"] });
      clearMood();
      setPlaying(false);
      setCurrentTrack(null);
    }, [queryClient, clearMood, setPlaying, setCurrentTrack])
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
        {/* Header com Atalhos */}
        <View style={styles.header}>
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

        {/* Fluxo de Acolhimento: Identificação -> Sugestão -> Assistência */}
        <MoodSelector />
        <WelcomingHero />
        <AIChatCard onPress={handleAIChatPress} />

        <TrendingPrayers />
      </ScrollView>
    </SafeAreaView>
  );
}
