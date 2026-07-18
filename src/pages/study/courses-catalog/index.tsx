import React, { useCallback, useRef, useState } from "react";

import {
  ActivityIndicator,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { AlertCircle, ArrowLeft, BookOpen, SlidersHorizontal } from "lucide-react-native";
import { BarChart2, BarChart3, BarChart4, GraduationCap } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAllCoursesProgress } from "@/hooks/queries/useAllCoursesProgress";
import { useCourses } from "@/hooks/queries/useCourses";
import { useAppTheme } from "@/hooks/useAppTheme";
import { FilterBottomSheet } from "@/pages/pray/components/FilterBottomSheet";
import { SearchBar } from "@/pages/pray/components/SearchBar";
import { ICourse, IUserCourseProgress } from "@/types/course";
import { ContentFilterType } from "@/types/prayer";

import { CourseCard } from "./components/CourseCard";
import { createStyles } from "./styles";

// Opções de filtro para séries com ícones
const SERIES_FILTER_OPTIONS = [
  { id: "ALL" as ContentFilterType, label: "Todos", icon: BookOpen },
  { id: "INICIANTE" as ContentFilterType, label: "Iniciante", icon: BarChart2 },
  { id: "INTERMEDIARIO" as ContentFilterType, label: "Intermediário", icon: BarChart3 },
  { id: "AVANCADO" as ContentFilterType, label: "Avançado", icon: BarChart4 },
] as const;

// Componente individual para exibir cada série espiritual com seu progresso mapeado
const CatalogCourseItem = React.memo(
  ({
    course,
    progressData,
    onPress,
    theme,
    styles,
  }: {
    course: ICourse;
    progressData: IUserCourseProgress | undefined;
    onPress: (course: ICourse, hasProgress: boolean) => void;
    theme: any;
    styles: any;
  }) => {
    // Calcular progresso real localmente para garantir consistência com a tela de detalhes
    const completedCount = progressData?.completedLessons?.length || 0;
    const totalLessons = course.lessonCount || 0;

    const progressPercent =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    // Verifica se o curso tem progresso (foi iniciado)
    const hasProgress = !!progressData;

    return (
      <View style={{ paddingHorizontal: theme.spacing.lg }}>
        <CourseCard
          course={course}
          progress={progressPercent}
          onPress={() => onPress(course, hasProgress)}
        />
      </View>
    );
  }
);

export function CoursesCatalogScreen({ navigation }: any) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<ContentFilterType>("ALL");

  // React Query Fetch
  const { data: courses = [], isLoading, error } = useCourses();
  const { data: allProgress = {} } = useAllCoursesProgress();

  // Invalida o cache de progresso total ao focar na tela
  // (Muito mais eficiente pois é apenas 1 request Firestore na rede, compartilhado com a Home)
  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ["allCoursesProgress"] });
    }, [queryClient])
  );

  // Filtrar séries baseadas na busca e filtro
  const filteredCourses = React.useMemo(() => {
    let result = courses;

    // Aplicar filtro de busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.author.toLowerCase().includes(query)
      );
    }

    // Aplicar filtro de tipo
    switch (filterType) {
      case "INICIANTE":
        result = result.filter((c) => c.difficultyLevel === "Iniciante");
        break;
      case "INTERMEDIARIO":
        result = result.filter((c) => c.difficultyLevel === "Intermediário");
        break;
      case "AVANCADO":
        result = result.filter((c) => c.difficultyLevel === "Avançado");
        break;
      case "ALL":
      default:
        // Não aplica filtro adicional
        break;
    }

    return result;
  }, [courses, searchQuery, filterType]);

  function handleCoursePress(course: ICourse, hasProgress: boolean) {
    // Se o curso tem progresso (foi iniciado), vai direto para o currículo
    // Caso contrário, vai para os detalhes
    if (hasProgress) {
      navigation.navigate("CourseCurriculum", { courseId: course.id });
    } else {
      navigation.navigate("CourseDetails", { courseId: course.id });
    }
  }

  function renderCourse({ item }: { item: ICourse }) {
    const progressData = allProgress[item.id];
    return (
      <CatalogCourseItem
        course={item}
        progressData={progressData}
        onPress={handleCoursePress}
        theme={theme}
        styles={styles}
      />
    );
  }

  function renderEmpty() {
    return (
      <View style={styles.emptyContainer}>
        <BookOpen size={64} color={theme.colors.muted} />
        <Text style={styles.emptyText}>
          {searchQuery || filterType !== "ALL"
            ? "Nenhuma série espiritual encontrada"
            : "Não há trilhas de estudo disponíveis no momento"}
        </Text>
      </View>
    );
  }

  function renderError() {
    return (
      <View style={styles.errorContainer}>
        <AlertCircle size={64} color={theme.colors.error} />
        <Text style={styles.errorText}>Erro ao carregar séries</Text>
        <Text style={styles.errorSubtext}>
          Não foi possível buscar as séries espirituais. Verifique sua conexão e tente
          novamente.
        </Text>
        <TouchableOpacity style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <StatusBar style={theme.isDark ? "light" : "dark"} />
        <View style={styles.container}>{renderError()}</View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <StatusBar style={theme.isDark ? "light" : "dark"} />
        <View style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Carregando séries...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar
        style={theme.isDark ? "light" : "dark"}
        translucent={true}
        backgroundColor="transparent"
      />

      <View style={styles.container}>
        {/* Lista de séries - Header e SearchBar agora rolam junto */}
        <SectionList
          sections={[{ data: filteredCourses }]}
          renderItem={renderCourse}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={true}
          ListHeaderComponent={
            <>
              {/* Header: Layout de 3 Colunas (Voltar | Ícone | Filtro) */}
              <View style={styles.header}>
                {/* Linha 1: Botão Voltar | Ícone | Botão Filtro */}
                <View style={styles.headerRow}>
                  {/* Coluna Esquerda: Botão Voltar */}
                  <View style={styles.headerSide}>
                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={() => navigation.goBack()}
                      activeOpacity={0.7}
                    >
                      <ArrowLeft size={20} color={theme.colors.primary} />
                    </TouchableOpacity>
                  </View>

                  {/* Coluna Central: Ícone com Anéis */}
                  <View style={styles.iconRingsContainer}>
                    <View style={styles.ringOuter} />
                    <View style={styles.ringMiddle} />
                    <View style={styles.ringInner} />
                    <View style={styles.iconLargeContainer}>
                      <GraduationCap size={40} color={theme.colors.background} />
                    </View>
                  </View>

                  {/* Coluna Direita: Botão de Filtro */}
                  <View style={styles.headerSide}>
                    <TouchableOpacity
                      style={[
                        styles.filterButton,
                        filterType !== "ALL" && styles.filterButtonActive,
                      ]}
                      onPress={() => bottomSheetRef.current?.present()}
                      activeOpacity={0.7}
                    >
                      <SlidersHorizontal
                        size={20}
                        color={
                          filterType !== "ALL"
                            ? theme.colors.background
                            : theme.colors.primary
                        }
                      />
                      {filterType !== "ALL" && <View style={styles.filterDot} />}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Linha 2: Título e Subtítulo */}
                <View style={styles.headerTextContainer}>
                  <Text style={styles.title}>Séries Espirituais</Text>
                  <Text style={styles.subtitle}>
                    Sua jornada de conhecimento espírita
                  </Text>
                </View>
              </View>
            </>
          }
          renderSectionHeader={() => (
            /* SearchBar Sticky Header Wrapper */
            <View style={styles.stickyHeader}>
              <View style={styles.searchContainer}>
                <SearchBar
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Buscar série..."
                />
              </View>
            </View>
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
        />

        {/* BottomSheet de Filtros */}
        <FilterBottomSheet
          ref={bottomSheetRef}
          filterType={filterType}
          onFilterChange={setFilterType}
          title="Filtrar Séries"
          filterOptions={SERIES_FILTER_OPTIONS}
        />
      </View>
    </SafeAreaView>
  );
}
