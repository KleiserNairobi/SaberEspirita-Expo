import React from "react";
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuthStore } from "@/stores/authStore";
import { DailyThoughtCard } from "@/components/DailyThoughtCard";
import { AssistantCard } from "@/components/AssistantCard";
import { Compass } from "lucide-react-native";
import { ReflectionCard } from "./components/ReflectionCard";
import { useFeaturedReflections } from "./hooks/useFeaturedReflections";
import { MeditateStackParamList } from "@/routers/types";
import { createStyles } from "./styles";
import { useQueryClient } from "@tanstack/react-query";
import { getReflectionById } from "@/services/firebase/reflectionService";

export default function MeditateScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const { user } = useAuthStore();
  const navigation = useNavigation<NativeStackNavigationProp<MeditateStackParamList>>();

  const { data: featuredReflections, isLoading: reflectionsLoading } =
    useFeaturedReflections();
  const queryClient = useQueryClient();

  function prefetchReflection(id: string) {
    queryClient.prefetchQuery({
      queryKey: ["reflection", id],
      queryFn: () => getReflectionById(id),
      staleTime: 1000 * 60 * 60, // 1 hora
    });
  }

  function handleReflectionPress(reflectionId: string) {
    navigation.navigate("Reflection", { id: reflectionId });
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

        {/* Seção: Textos para Reflexão */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleInHeader}>Textos para Reflexão</Text>
          <TouchableOpacity onPress={() => navigation.navigate("AllReflections")}>
            <Text style={styles.viewAllButton}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {reflectionsLoading ? (
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
            <Text style={styles.emptyText}>Nenhuma reflexão em destaque no momento</Text>
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
