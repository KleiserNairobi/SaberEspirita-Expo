import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AssistantCard } from "@/components/AssistantCard";
import { DailyThoughtCard } from "@/components/DailyThoughtCard";
import { useFeaturedMeditations } from "@/hooks/queries/useMeditations";
import { useAppTheme } from "@/hooks/useAppTheme";
import { MeditateStackParamList } from "@/routers/types";
import { getMeditationById } from "@/services/firebase/meditationService";
import { getReflectionById } from "@/services/firebase/reflectionService";
import { useAuthStore } from "@/stores/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { Compass } from "lucide-react-native";
import { MeditationCard } from "./components/MeditationCard";
import { ReflectionCard } from "./components/ReflectionCard";
import { useFeaturedReflections } from "./hooks/useFeaturedReflections";
import { createStyles } from "./styles";

type TabType = "REFLECTIONS" | "MEDITATIONS";

export default function MeditateScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const { user } = useAuthStore();
  const navigation = useNavigation<NativeStackNavigationProp<MeditateStackParamList>>();

  const [activeTab, setActiveTab] = React.useState<TabType>("REFLECTIONS");

  const { data: featuredReflections, isLoading: reflectionsLoading } =
    useFeaturedReflections();

  const { data: featuredMeditations, isLoading: meditationsLoading } =
    useFeaturedMeditations();

  const queryClient = useQueryClient();

  function prefetchReflection(id: string) {
    queryClient.prefetchQuery({
      queryKey: ["reflection", id],
      queryFn: () => getReflectionById(id),
      staleTime: 1000 * 60 * 60, // 1 hora
    });
  }

  function prefetchMeditation(id: string) {
    queryClient.prefetchQuery({
      queryKey: ["meditations", "detail", id],
      queryFn: () => getMeditationById(id),
      staleTime: 1000 * 60 * 60,
    });
  }

  function handleReflectionPress(reflectionId: string) {
    navigation.navigate("Reflection", { id: reflectionId });
  }

  function handleMeditationPress(meditationId: string) {
    navigation.navigate("MeditationPlayer", { id: meditationId });
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
          <Text style={styles.greeting}>Medite</Text>
          <Text style={styles.subtitle}>Encontre paz e orientação interior</Text>
        </View>

        {/* Seção: Pensamento do Dia */}
        <Text style={styles.sectionTitle}>Pensamento do Dia</Text>
        <DailyThoughtCard />

        {/* Tabs de Seleção */}
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              activeTab === "REFLECTIONS" && styles.segmentButtonActive,
            ]}
            onPress={() => setActiveTab("REFLECTIONS")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === "REFLECTIONS" && styles.segmentTextActive,
              ]}
            >
              Leitura Diária
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              activeTab === "MEDITATIONS" && styles.segmentButtonActive,
            ]}
            onPress={() => setActiveTab("MEDITATIONS")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === "MEDITATIONS" && styles.segmentTextActive,
              ]}
            >
              Meditações
            </Text>
          </TouchableOpacity>
        </View>

        {/* Seção Dinâmica (Reflexões ou Meditações) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleInHeader}>
            {activeTab === "REFLECTIONS" ? "Textos para Reflexão" : "Meditação Guiada"}
          </Text>
          <TouchableOpacity
            onPress={() =>
              activeTab === "REFLECTIONS"
                ? navigation.navigate("AllReflections")
                : navigation.navigate("AllMeditations")
            }
          >
            <Text style={styles.viewAllButton}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {activeTab === "REFLECTIONS" ? (
          reflectionsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : featuredReflections && featuredReflections.length > 0 ? (
            <View style={styles.reflectionsContainer}>
              {featuredReflections.slice(0, 3).map((reflection) => (
                <ReflectionCard
                  key={reflection.id}
                  reflection={reflection}
                  onPress={() => handleReflectionPress(reflection.id)}
                  onPressIn={() => prefetchReflection(reflection.id)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma reflexão disponível</Text>
            </View>
          )
        ) : meditationsLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : featuredMeditations && featuredMeditations.length > 0 ? (
          <View style={styles.reflectionsContainer}>
            {featuredMeditations.slice(0, 3).map((meditation) => (
              <View
                key={meditation.id}
                onTouchStart={() => prefetchMeditation(meditation.id)}
              >
                <MeditationCard
                  meditation={meditation}
                  onPress={() => handleMeditationPress(meditation.id)}
                />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Em breve novas meditações</Text>
          </View>
        )}

        {/* Seção: Pergunte ao Guia */}
        <Text style={styles.sectionTitle}>Assistente Espiritual</Text>
        <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
          <AssistantCard
            title="Converse com o Guia"
            description="Converse com nosso assistente espiritual baseado nos ensinamentos de Kardec."
            buttonText="Conversar"
            icon={Compass}
            onPress={() => navigation.navigate("EmotionalChat" as never)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
