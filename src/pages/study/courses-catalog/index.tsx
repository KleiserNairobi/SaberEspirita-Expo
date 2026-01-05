import React, { useState, useRef } from "react";
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import {
  BookOpen,
  ArrowLeft,
  AlertCircle,
  SlidersHorizontal,
  GraduationCap,
  BarChart2,
  BarChart3,
  BarChart4,
  PlayCircle,
  CheckCircle,
} from "lucide-react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useCourses } from "@/hooks/queries/useCourses";
import { ICourse } from "@/types/course";
import { ContentFilterType } from "@/types/prayer";
import { SearchBar } from "@/pages/pray/components/SearchBar";
import { FilterBottomSheet } from "@/pages/pray/components/FilterBottomSheet";

import { CourseCard } from "./components/CourseCard";
import { createStyles } from "./styles";

// Opções de filtro para cursos com ícones
const COURSE_FILTER_OPTIONS = [
  { id: "ALL" as ContentFilterType, label: "Todos", icon: BookOpen },
  { id: "INICIANTE" as ContentFilterType, label: "Iniciante", icon: BarChart2 },
  { id: "INTERMEDIARIO" as ContentFilterType, label: "Intermediário", icon: BarChart3 },
  { id: "AVANCADO" as ContentFilterType, label: "Avançado", icon: BarChart4 },
  // { id: "EM_ANDAMENTO" as ContentFilterType, label: "Em Andamento", icon: PlayCircle }, // Desabilitado temporariamente
  // { id: "CONCLUIDOS" as ContentFilterType, label: "Concluídos", icon: CheckCircle }, // Desabilitado temporariamente
] as const;

export function CoursesCatalogScreen({ navigation }: any) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<ContentFilterType>("ALL");

  // React Query Fetch
  const { data: courses = [], isLoading, error } = useCourses();

  // Filtrar cursos baseado na busca e filtro
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

  function handleCoursePress(course: ICourse) {
    navigation.navigate("CourseDetails", { courseId: course.id });
  }

  function renderCourse({ item }: { item: ICourse }) {
    // TODO: Buscar progresso real do usuário
    const progress = 0;

    return (
      <View style={{ paddingHorizontal: theme.spacing.lg }}>
        <CourseCard
          course={item}
          progress={progress}
          onPress={() => handleCoursePress(item)}
        />
      </View>
    );
  }

  function renderEmpty() {
    return (
      <View style={styles.emptyContainer}>
        <BookOpen size={64} color={theme.colors.muted} />
        <Text style={styles.emptyText}>
          {searchQuery || filterType !== "ALL"
            ? "Nenhum curso encontrado"
            : "Não há cursos disponíveis no momento"}
        </Text>
      </View>
    );
  }

  function renderError() {
    return (
      <View style={styles.errorContainer}>
        <AlertCircle size={64} color={theme.colors.error} />
        <Text style={styles.errorText}>Erro ao carregar cursos</Text>
        <Text style={styles.errorSubtext}>
          Não foi possível buscar os cursos. Verifique sua conexão e tente novamente.
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
            <Text style={styles.loadingText}>Carregando cursos...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />

      <View style={styles.container}>
        {/* Lista de cursos - Header e SearchBar agora rolam junto */}
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
                  <Text style={styles.title}>Cursos Espíritas</Text>
                  <Text style={styles.subtitle}>Aprenda sobre Espiritismo</Text>
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
                  placeholder="Buscar curso..."
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
          title="Filtrar Cursos"
          filterOptions={COURSE_FILTER_OPTIONS}
        />
      </View>
    </SafeAreaView>
  );
}
