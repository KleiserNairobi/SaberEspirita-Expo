import React from "react";
import { ScrollView, Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuthStore } from "@/stores/authStore";
import { DailyMessageCard } from "@/components/DailyMessageCard";
import { AskGuideCard } from "@/components/AskGuideCard";
import { ReflectionCard } from "./components/ReflectionCard";
import { useFeaturedReflections } from "./hooks/useFeaturedReflections";
import { MeditateStackParamList } from "@/routers/types";
import { createStyles } from "./styles";

export default function MeditateScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const { user } = useAuthStore();
  const navigation = useNavigation<NativeStackNavigationProp<MeditateStackParamList>>();

  const { data: featuredReflections, isLoading: reflectionsLoading } =
    useFeaturedReflections();

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

        {/* Seção: Mensagem do Dia */}
        <Text style={styles.sectionTitle}>Mensagem do Dia</Text>
        <DailyMessageCard />

        {/* Seção: Pergunte ao Guia */}
        <Text style={styles.sectionTitle}>Pergunte ao Guia</Text>
        <AskGuideCard />

        {/* Seção: Textos para Reflexão */}
        <Text style={styles.sectionTitle}>Textos para Reflexão</Text>

        {reflectionsLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : featuredReflections && featuredReflections.length > 0 ? (
          <View style={styles.reflectionsContainer}>
            {featuredReflections.map((reflection) => (
              <ReflectionCard
                key={reflection.id}
                reflection={reflection}
                onPress={() => handleReflectionPress(reflection.id)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma reflexão em destaque no momento</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
