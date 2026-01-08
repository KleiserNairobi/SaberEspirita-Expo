import React from "react";
import { View, Text, ScrollView, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useCategories } from "@/hooks/queries/useQuiz";
import { CategoryCard } from "./components/CategoryCard";
import { createStyles } from "./styles";
import { FixStackParamList } from "@/routers/types";

type FixHomeNavigationProp = NativeStackNavigationProp<FixStackParamList, "FixHome">;

export default function FixHomeScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<FixHomeNavigationProp>();

  const { data: categories, isLoading } = useCategories();

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
          <Text style={styles.title}>Fixe seu Conhecimento</Text>
          <Text style={styles.subtitle}>Teste o que você aprendeu hoje.</Text>
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
        data={categories}
        numColumns={3}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.contentContainer}
        columnWrapperStyle={styles.categoryGrid}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CategoryCard
            key={item.id}
            name={item.name}
            questionCount={item.questionCount}
            progress={0} // TODO: Calcular progresso real do usuário
            icon={item.icon as any}
            gradientColors={item.gradientColors}
            onPress={() => handleCategoryPress(item.id, item.name)}
          />
        )}
      />
    </SafeAreaView>
  );
}
