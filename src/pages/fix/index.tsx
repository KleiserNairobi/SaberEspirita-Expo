import { useCategories, useUserQuizProgress } from "@/hooks/queries/useQuiz";
import { useAppTheme } from "@/hooks/useAppTheme";
import { FixStackParamList } from "@/routers/types";
import { useAuthStore } from "@/stores/authStore";
import { ICategory } from "@/types/quiz";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useMemo } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoryCard } from "./components/CategoryCard";
import { DailyChallengeBanner } from "./components/DailyChallengeBanner";
import { ProgressSummary } from "./components/ProgressSummary";
import { TruthOrFalseBanner } from "./components/TruthOrFalseBanner";
import { CATEGORY_IMAGES } from "./constants/categoryImages";
import { createStyles } from "./styles";

type ICategoryWithProgress = ICategory & { progress: number };
type FixHomeNavigationProp = NativeStackNavigationProp<FixStackParamList, "FixHome">;

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FixHomeScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<FixHomeNavigationProp>();
  const user = useAuthStore((s) => s.user);
  const insets = useSafeAreaInsets();

  // Try to get tab height, fallback to 0 if not in tab nav (though it is)
  let tabBarHeight = 0;
  try {
    tabBarHeight = useBottomTabBarHeight();
  } catch (e) {
    tabBarHeight = 60; // Fallback
  }

  // Combine padding
  const paddingBottom = tabBarHeight + insets.bottom + theme.spacing.lg;

  const { data: categories, isLoading } = useCategories();
  const { data: userProgress } = useUserQuizProgress(user?.uid || "");

  // Calcular estatísticas gerais
  const totalCompletedStats = useMemo(() => {
    if (!userProgress) return { totalCompleted: 0 };

    // userProgress é um objeto { [categoryId]: [subcategoryId, ...] }
    // Precisamos contar o total de subcategorias completadas em todas as categorias
    let count = 0;
    Object.values(userProgress).forEach((subs: any) => {
      if (Array.isArray(subs)) {
        count += subs.length;
      }
    });
    return { totalCompleted: count };
  }, [userProgress]);

  // Calcular progresso por categoria
  const categoriesWithProgress = useMemo(() => {
    if (!categories || !userProgress) return categories;

    return categories.map((category) => {
      const completedSubcategories = userProgress[category.id] || [];
      const totalSubcategories = category.subcategoryCount || 0;
      const progress =
        totalSubcategories > 0
          ? Math.round((completedSubcategories.length / totalSubcategories) * 100)
          : 0;

      return {
        ...category,
        progress,
      };
    });
  }, [categories, userProgress]);

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
        <ProgressSummary totalCorrect={totalCompletedStats.totalCompleted} />

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
