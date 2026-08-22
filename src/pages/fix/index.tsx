import React, { useCallback, useMemo } from "react";

import { FlatList, Text, View } from "react-native";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  QUIZ_KEYS,
  useCategories,
  useQuizHistory,
  useUserDetailedStats,
  useUserQuizProgress,
} from "@/hooks/queries/useQuiz";
import { useAppTheme } from "@/hooks/useAppTheme";
import { FixStackParamList } from "@/routers/types";
import { useAuthStore } from "@/stores/authStore";

import { CategoryCard } from "./components/CategoryCard";
import { DailyChallengeBanner } from "./components/DailyChallengeBanner";
import { ProgressSummary } from "./components/ProgressSummary";
import { TruthOrFalseBanner } from "./components/TruthOrFalseBanner";
import { CATEGORY_IMAGES } from "./constants/categoryImages";
import { createStyles } from "./styles";

type FixHomeNavigationProp = NativeStackNavigationProp<FixStackParamList, "FixHome">;

export default function FixHomeScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<FixHomeNavigationProp>();
  const user = useAuthStore((s) => s.user);
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  // Try to get tab height, fallback to 0 if not in tab nav (though it is)
  let tabBarHeight = 0;
  try {
    tabBarHeight = useBottomTabBarHeight();
  } catch (e) {
    tabBarHeight = 60; // Fallback
  }

  // Combine padding
  const paddingBottom = tabBarHeight + insets.bottom + theme.spacing.lg;

  const { data: categories, refetch: refetchCategories } = useCategories();
  const { data: userProgress, refetch: refetchUserProgress } = useUserQuizProgress(
    user?.uid || ""
  );
  const { data: quizHistory, refetch: refetchQuizHistory } = useQuizHistory();
  const { data: detailedStats, refetch: refetchStats } = useUserDetailedStats(
    user?.uid || ""
  );

  // Recarregar dados ao alternar de aba / ganhar foco
  useFocusEffect(
    useCallback(() => {
      void refetchCategories();
      if (user?.uid) {
        void refetchUserProgress();
        void refetchQuizHistory();
        void refetchStats();
        void queryClient.invalidateQueries({ queryKey: ["userScore", user.uid] });
      }
    }, [
      refetchCategories,
      refetchUserProgress,
      refetchQuizHistory,
      refetchStats,
      queryClient,
      user?.uid,
    ])
  );

  // Calcular progresso por categoria com suporte a múltiplas fontes
  const categoriesWithProgress = useMemo(() => {
    if (!categories) return [];

    return categories.map((category) => {
      const catKeyNormalized = category.name
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      let completedSubcategories: string[] = [];

      // 1. Tentar mapa do userProgress
      if (userProgress && typeof userProgress === "object") {
        completedSubcategories =
          userProgress[category.id] ||
          userProgress[category.name] ||
          userProgress[catKeyNormalized] ||
          userProgress[category.id.toLowerCase()] ||
          userProgress[category.name.toLowerCase()] ||
          [];
      }

      // 2. Se o userProgress não retornou itens, tentar cruzar com o quizHistory
      if (
        completedSubcategories.length === 0 &&
        Array.isArray(quizHistory) &&
        quizHistory.length > 0
      ) {
        const historyCompleted = quizHistory
          .filter((h) => {
            const hCatId = h.categoryId?.toString().toLowerCase();
            const hTitle = h.title?.toString().toLowerCase();
            const cId = category.id?.toString().toLowerCase();
            const cName = category.name?.toString().toLowerCase();
            return (
              h.completed &&
              (hCatId === cId || hTitle === cName || hTitle?.includes(cName || ""))
            );
          })
          .map((h) => h.subcategoryId)
          .filter(Boolean);

        completedSubcategories = Array.from(new Set(historyCompleted));
      }

      const totalSubcategories = category.subcategoryCount || 0;
      let progress = 0;

      if (totalSubcategories > 0) {
        progress = Math.round(
          (completedSubcategories.length / totalSubcategories) * 100
        );
      } else if (completedSubcategories.length > 0) {
        progress = 100;
      }

      // 3. Se ainda for 0, checar se detailedStats possui percentual direto para esta categoria
      if (progress === 0 && detailedStats?.categoriesProgress) {
        const statMatch = detailedStats.categoriesProgress.find(
          (cp) =>
            cp.categoryId === category.id ||
            cp.categoryName?.toLowerCase() === category.name?.toLowerCase()
        );
        if (statMatch && typeof statMatch.completionPercentage === "number") {
          progress = Math.round(statMatch.completionPercentage);
        }
      }

      return {
        ...category,
        progress: Math.min(100, Math.max(0, progress)),
      };
    });
  }, [categories, userProgress, quizHistory, detailedStats]);

  function handleCategoryPress(categoryId: string, categoryName: string) {
    navigation.navigate("Subcategories", {
      categoryId,
      categoryName,
    });
  }

  function renderHeader() {
    return (
      <View>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Fixe</Text>
          <Text style={styles.subtitle}>Explore e teste seus conhecimentos</Text>
        </View>

        {/* Desafio Diário Banner */}
        <View style={{ marginBottom: theme.spacing.md }}>
          <DailyChallengeBanner />
        </View>

        {/* Banner Verdade ou Mentira */}
        <View style={{ marginBottom: theme.spacing.lg }}>
          <TruthOrFalseBanner />
        </View>

        {/* Meu Progresso Section */}
        <ProgressSummary />

        {/* Título da Seção */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorias</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={categoriesWithProgress}
        numColumns={2}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: paddingBottom },
        ]}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CategoryCard
            key={item.id}
            name={item.name}
            questionCount={item.questionCount}
            progress={(item as any).progress || 0}
            icon={item.icon as any}
            imageSource={
              CATEGORY_IMAGES[
                item.name
                  .toUpperCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
              ]
            }
            onPress={() => handleCategoryPress(item.id, item.name)}
          />
        )}
        // ListFooterComponent={<View style={{ height: paddingBottom }} />}
      />
    </SafeAreaView>
  );
}
