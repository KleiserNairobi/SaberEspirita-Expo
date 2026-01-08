import React, { useState } from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft } from "lucide-react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useSubcategories } from "@/hooks/queries/useQuiz";
import { SearchBar } from "@/components/SearchBar";
import { SubcategoryCard } from "./components/SubcategoryCard";
import { createStyles } from "./styles";
import { FixStackParamList } from "@/routers/types";
import { IconButton } from "@/components/IconButton";

type SubcategoriesRouteProp = RouteProp<FixStackParamList, "Subcategories">;
type SubcategoriesNavigationProp = NativeStackNavigationProp<
  FixStackParamList,
  "Subcategories"
>;

export function SubcategoriesScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const route = useRoute<SubcategoriesRouteProp>();
  const navigation = useNavigation<SubcategoriesNavigationProp>();

  const { categoryId, categoryName } = route.params;
  const [searchQuery, setSearchQuery] = useState("");

  const { data: subcategories, isLoading } = useSubcategories(categoryId);

  // Filtrar subcategorias por busca
  const filteredSubcategories = subcategories?.filter((sub) =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleSubcategoryPress(subcategoryId: string, subcategoryName: string) {
    navigation.navigate("Quiz", {
      subcategoryId,
      categoryName,
      subcategoryName,
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon={ArrowLeft}
          onPress={() => navigation.goBack()}
          size={24}
          color={theme.colors.text}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{categoryName}</Text>
          <Text style={styles.headerSubtitle}>Escolha uma subcategoria para começar</Text>
        </View>
      </View>

      {/* SearchBar */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar subcategoria..."
        />
      </View>

      {/* Lista de Subcategorias */}
      <FlatList
        data={filteredSubcategories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubcategoryCard
            title={item.name}
            subtitle={item.description || ""}
            questionCount={item.questionCount}
            completed={item.completed || false}
            onPress={() => handleSubcategoryPress(item.id, item.name)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
