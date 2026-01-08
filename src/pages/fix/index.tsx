import React, { useMemo } from "react";
import { View, Text, ScrollView, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useCategories, useUserQuizProgress } from "@/hooks/queries/useQuiz";
import { useAuthStore } from "@/stores/authStore";
import { CategoryCard } from "./components/CategoryCard";
import { createStyles } from "./styles";
import { FixStackParamList } from "@/routers/types";
import { ICategory } from "@/types/quiz";

type ICategoryWithProgress = ICategory & { progress: number };
type FixHomeNavigationProp = NativeStackNavigationProp<FixStackParamList, "FixHome">;

export default function FixHomeScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<FixHomeNavigationProp>();
  const user = useAuthStore((s) => s.user);

  const { data: categories, isLoading } = useCategories();
  const { data: userProgress } = useUserQuizProgress(user?.uid || "");

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

        {/* TODO: Desafio Diário Card */}
        {/* <DailyChallengeCard /> */}

        {/* TODO: Meu Progresso Section */}
        {/* <ProgressSection /> */}

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
        contentContainerStyle={styles.contentContainer}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CategoryCard
            key={item.id}
            name={item.name}
            questionCount={item.questionCount}
            progress={item.progress || 0}
            icon={item.icon as any}
            gradientColors={item.gradientColors}
            onPress={() => handleCategoryPress(item.id, item.name)}
          />
        )}
      />
    </SafeAreaView>
  );
}
