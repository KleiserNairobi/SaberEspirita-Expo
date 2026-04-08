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
  BookOpen,
  ChevronRight,
  Flame,
  HandHeart,
  Heart,
  HeartPulse,
  Moon,
  Sparkles,
  Sunrise,
  Users,
} from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { AmbientEnvironmentCard } from "@/pages/pray/components/AmbientEnvironmentCard";
import { MoodSelector } from "@/pages/pray/components/MoodSelector";
import { WelcomingHero } from "@/pages/pray/components/WelcomingHero";
import { useFeaturedPrayers } from "@/pages/pray/hooks/useFeaturedPrayers";
import { usePrayerMomentsCounts } from "@/pages/pray/hooks/usePrayerMomentsCounts";
import { createStyles } from "@/pages/pray/styles";
import { PrayerCard } from "@/pages/pray/components/PrayerCard";
import { AssistantCard } from "@/components/AssistantCard";
import { getPrayersByCategory } from "@/services/firebase/prayerService";
import { useAuth } from "@/stores/authStore";
import { usePrayerFavoritesStore } from "@/stores/prayerFavoritesStore";
import { PRAYER_MOMENTS } from "@/types/prayer";
import { useQueryClient } from "@tanstack/react-query";

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
  REUNIOES: Flame,
} as const;

export default function PrayScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<PrayStackParamList>>();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: featuredPrayers, isLoading: featuredLoading } = useFeaturedPrayers();
  const { data: momentsCounts } = usePrayerMomentsCounts();

  const { isFavorite, toggleFavorite, syncWithFirebase } = usePrayerFavoritesStore();

  React.useEffect(() => {
    if (user?.uid) {
      syncWithFirebase(user.uid);
    }
  }, [user?.uid, syncWithFirebase]);
  
  // Atualiza o cache ao entrar na tela para garantir que dados novos (destaques e contagem) apareçam
  useFocusEffect(
    React.useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ["prayers", "featured"] });
      queryClient.invalidateQueries({ queryKey: ["prayerMomentsCounts"] });
    }, [queryClient])
  );

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
          <Text style={styles.subtitle}>Seu companheiro de caminhada espiritual</Text>
        </View>

        {/* Novo Fluxo de Acolhimento */}
        <MoodSelector />
        <WelcomingHero />

        {/* Seção: Ambiente de Sintonia (Refatorado para Imersão) */}
        <Text style={styles.sectionTitle}>Ambiente de Sintonia</Text>
        <View style={styles.ambientContainer}>
          <AmbientEnvironmentCard />
        </View>

        {/* Seção: Favoritos */}
        <View style={{ marginHorizontal: 20, marginTop: 10 }}>
          <AssistantCard
            title="Minhas Orações"
            description="Suas preces favoritas em um só lugar"
            buttonText="Ver todas"
            icon={Heart}
            onPress={() => navigation.navigate("PrayCategory", { id: "FAVORITES" })}
          />
        </View>

        {/* Seção: Explorar por Momento (Reduzida para acesso direto secundário) */}
        <Text style={styles.sectionTitle}>Todos os Momentos</Text>
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
                style={[styles.momentCard, { width: 90, height: 90 }]} // Menores para dar foco ao Acolhimento
                onPress={() => handleMomentPress(key)}
                onPressIn={() => prefetchCategory(key)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, { width: 32, height: 32 }]}>
                  <IconComponent size={16} color={theme.colors.primary} />
                </View>
                <Text style={[styles.momentLabel, { fontSize: 12 }]}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

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
