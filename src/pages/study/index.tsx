import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Carousel } from "@/components/Carousel";
import { Biblioteca } from "@/data/Biblioteca";
import { useAppTheme } from "@/hooks/useAppTheme";
import { AppStackParamList } from "@/routers/types";
import { useAuthStore } from "@/stores/authStore";

import { AssistantCard } from "@/components/AssistantCard";
import { ResumeCard } from "@/components/ResumeCard";
import { useAllCoursesProgress } from "@/hooks/queries/useAllCoursesProgress";
import { useFeaturedCourses } from "@/hooks/queries/useCourses";
import { useLastAccessedCourse } from "@/hooks/queries/useLastAccessedCourse";
import { Feather } from "lucide-react-native";

import { createStyles } from "./styles";

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export function StudyScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const user = useAuthStore((state) => state.user);
  const navigation = useNavigation<NavigationProp>();

  // Fetching de cursos populares via React Query
  const { data: featuredCourses = [], isLoading: loadingFeatured } = useFeaturedCourses();

  // Fetching de todos os progressos para o Carrossel Inteligente
  const { data: allProgress = {} } = useAllCoursesProgress();

  // Fetching do último curso acessado
  const { data: lastAccessed } = useLastAccessedCourse();

  function handleResumePress() {
    if (lastAccessed) {
      navigation.navigate("CourseCurriculum", { courseId: lastAccessed.course.id });
    }
  }

  function handleCoursePress(courseId: string) {
    const progress = allProgress[courseId];
    if (progress) {
      navigation.navigate("CourseCurriculum", { courseId });
    } else {
      navigation.navigate("CourseDetails", { courseId });
    }
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

        {/* Card de Continuar (Resume) */}
        {lastAccessed && (
          <ResumeCard
            course={lastAccessed.course}
            progress={lastAccessed.progress}
            nextLesson={lastAccessed.nextLesson}
            onPress={handleResumePress}
          />
        )}

        {/* Seção Populares - Mostra apenas se tiver cursos carregados */}
        {featuredCourses.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Populares</Text>
              <TouchableOpacity onPress={() => navigation.navigate("CoursesCatalog")}>
                <Text style={styles.seeAllText}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            <Carousel
              data={featuredCourses}
              onCoursePress={handleCoursePress}
              progressMap={allProgress}
            />
          </>
        )}

        {/* Seção Biblioteca */}
        <View style={{ marginTop: featuredCourses.length > 0 ? 24 : 20 }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore a Biblioteca</Text>
          </View>
        </View>
      </View>
    );
  }

  function renderFooter() {
    return (
      <View style={{ marginHorizontal: 20, marginBottom: 20, marginTop: 10 }}>
        <AssistantCard
          title="Pergunte ao Sr. Allan"
          description="Tire suas dúvidas científicas e filosóficas com base nas obras básicas."
          buttonText="Perguntar"
          icon={Feather}
          onPress={() => navigation.navigate("ScientificChat", {})}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={Biblioteca}
        numColumns={1}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.contentContainer}
        renderItem={({ item }) => {
          const IconComponent = item.icon;
          return (
            <TouchableOpacity
              style={styles.libraryItem}
              onPress={() => handleLibraryItemPress(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.libraryContentGroup}>
                <View style={styles.iconContainer}>
                  <IconComponent size={20} color={theme.colors.primary} />
                </View>
                <Text style={styles.libraryItemText}>
                  {item.title.replace("\n", " ")}
                </Text>
              </View>

              <ChevronRight size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}
