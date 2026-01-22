import React from "react";
import { FlatList, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Carousel } from "@/components/Carousel";
import { Biblioteca } from "@/data/Biblioteca";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuthStore } from "@/stores/authStore";
import { AppStackParamList } from "@/routers/types";

import { useFeaturedCourses } from "@/hooks/queries/useCourses";

import { createStyles } from "./styles";

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export function StudyScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const user = useAuthStore((state) => state.user);
  const navigation = useNavigation<NavigationProp>();

  // Fetching de cursos populares via React Query
  const { data: featuredCourses = [], isLoading: loadingFeatured } = useFeaturedCourses();

  function handleCoursePress(courseId: string) {
    navigation.navigate("CourseDetails", { courseId });
  }

  function handleLibraryItemPress(itemId: string) {
    switch (itemId) {
      case "1": // Cursos Espíritas
        navigation.navigate("CoursesCatalog");
        break;
      case "2": // Glossário Espírita
        navigation.navigate("Glossary");
        break;
      case "4": // Verdade ou Mentira
        // @ts-ignore - navegação composta entre stacks
        navigation.navigate("FixTab", { screen: "TruthOrFalseHome" });
        break;
      case "5": // Converse com o Guia
        navigation.navigate("EmotionalChat");
        break;
      case "6": // Pergunte ao Sr. Allan
        navigation.navigate("ScientificChat", {});
        break;
      default:
        console.log(`Item ${itemId} clicado - navegação pendente`);
    }
  }

  function renderHeader() {
    return (
      <View>
        {/* Header com saudação */}
        <View style={styles.headerContainer}>
          <Text style={styles.greetingText}>Olá, {user?.displayName || "Usuário"}!</Text>
          <Text style={styles.subtitleText}>
            Vamos começar sua jornada de conhecimento?
          </Text>
        </View>

        {/* Seção Populares - Mostra apenas se tiver cursos carregados */}
        {featuredCourses.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Populares</Text>
              <TouchableOpacity onPress={() => navigation.navigate("CoursesCatalog")}>
                <Text style={styles.seeAllText}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            <Carousel data={featuredCourses} onCoursePress={handleCoursePress} />
          </>
        )}

        {/* Seção Biblioteca */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore a Biblioteca</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={Biblioteca}
        numColumns={3}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.contentContainer}
        columnWrapperStyle={styles.libraryColumnWrapper}
        renderItem={({ item }) => {
          const IconComponent = item.icon;
          return (
            <TouchableOpacity
              style={styles.libraryItem}
              onPress={() => handleLibraryItemPress(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <IconComponent size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.libraryItemText}>{item.title}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}
