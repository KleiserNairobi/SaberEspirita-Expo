import React from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PrayStackParamList } from "@/routers/types";
import {
  Heart,
  Sunrise,
  Moon,
  HeartPulse,
  Users,
  HandHeart,
  BookOpen,
  Sparkles,
  ChevronRight,
} from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuthStore } from "@/stores/authStore";
import { usePrayerFavoritesStore } from "@/stores/prayerFavoritesStore";
import { PRAYER_MOMENTS } from "@/types/prayer";
import { useFeaturedPrayers } from "@/pages/pray/hooks/useFeaturedPrayers";
import { AmbientPlayer } from "@/pages/pray/components/AmbientPlayer";
import { createStyles } from "@/pages/pray/styles";
import { useQueryClient } from "@tanstack/react-query";
import { getPrayersByCategory } from "@/services/firebase/prayerService";

// Mapeamento de ícones para cada momento
const MOMENT_ICONS = {
  "AO-ACORDAR": Sunrise,
  "AO-DORMIR": Moon,
  DIARIO: BookOpen,
  "POR-ANIMO": HeartPulse,
  "POR-ALGUEM": Users,
  "POR-CURA": Heart,
  "POR-GRATIDAO": Sparkles,
  "POR-PAZ": HandHeart,
} as const;

export default function PrayScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<PrayStackParamList>>();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: featuredPrayers, isLoading: featuredLoading } = useFeaturedPrayers();

  const { isFavorite, toggleFavorite } = usePrayerFavoritesStore();

  function handleMomentPress(categoryId: string) {
    navigation.navigate("PrayCategory", { id: categoryId });
  }

  function prefetchCategory(categoryId: string) {
    queryClient.prefetchQuery({
      queryKey: ["prayers", "category", categoryId],
      queryFn: () => getPrayersByCategory(categoryId),
      staleTime: 1000 * 60 * 60, // 1 hora
    });
  }

  function handlePrayerPress(prayerId: string) {
    navigation.navigate("Prayer", { id: prayerId });
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.safeArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Ore</Text>
          <Text style={styles.subtitle}>Conecte-se com o divino</Text>
        </View>

        {/* Seção: Momentos */}
        <Text style={styles.sectionTitle}>Para o Momento</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.momentsScroll}
          contentContainerStyle={styles.momentsContent}
        >
          {Object.entries(PRAYER_MOMENTS).map(([key, { label }]) => {
            const IconComponent = MOMENT_ICONS[key as keyof typeof MOMENT_ICONS];
            return (
              <TouchableOpacity
                key={key}
                style={styles.momentCard}
                onPress={() => handleMomentPress(key)}
                onPressIn={() => prefetchCategory(key)}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <IconComponent size={20} color={theme.colors.primary} />
                </View>
                <Text style={styles.momentLabel}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Seção: Ambiente de Sintonia */}
        <Text style={styles.sectionTitle}>Ambiente de Sintonia</Text>
        <View style={styles.ambientContainer}>
          <AmbientPlayer />
        </View>

        {/* Seção: Orações em Destaque */}
        <Text style={styles.sectionTitle}>Em Destaque</Text>

        {featuredLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : featuredPrayers && featuredPrayers.length > 0 ? (
          <View style={styles.featuredList}>
            {featuredPrayers.map((prayer) => {
              const isFav = isFavorite(prayer.id);

              // Construir texto de metadados (author e/ou source)
              function getMetadataText() {
                if (prayer.author && prayer.source) {
                  return `${prayer.author} • ${prayer.source}`;
                }
                if (prayer.author) {
                  return prayer.author;
                }
                if (prayer.source) {
                  return prayer.source;
                }
                return null;
              }

              const metadataText = getMetadataText();

              return (
                <TouchableOpacity
                  key={prayer.id}
                  style={styles.prayerCard}
                  onPress={() => handlePrayerPress(prayer.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.prayerInfo}>
                    <Text style={styles.prayerTitle}>{prayer.title}</Text>
                    {metadataText && (
                      <View style={styles.metadataRow}>
                        <Heart
                          size={14}
                          color={theme.colors.primary}
                          fill={isFav ? theme.colors.primary : "transparent"}
                          style={styles.favoriteIconInline}
                        />
                        <Text style={styles.prayerAuthor}>{metadataText}</Text>
                      </View>
                    )}
                  </View>
                  <ChevronRight size={20} color={theme.colors.muted} />
                </TouchableOpacity>
              );
            })}
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
