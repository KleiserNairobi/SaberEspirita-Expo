import React, { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  Book,
  BookMarked,
  BookOpen,
  Heart,
  Library,
  Scale,
  Star,
} from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { SearchBar } from "@/pages/pray/components/SearchBar";
import { ICourse, IUserCourseProgress } from "@/types/course";

import { VerticalCourseCard } from "../VerticalCourseCard";
import { createStyles } from "./styles";

export const THEME_CATEGORIES = [
  { id: "INIC", label: "Iniciação", icon: BookOpen },
  { id: "LE", label: "Livro dos Espíritos", icon: Book },
  { id: "ESE", label: "Evangelho", icon: Heart },
  { id: "LM", label: "Mediunidade", icon: BookMarked },
  { id: "AG", label: "Gênese", icon: Star },
  { id: "CI", label: "Céu e Inferno", icon: Scale },
  { id: "COMP", label: "Complementares", icon: Library },
] as const;

interface ExploreByThemeProps {
  courses: ICourse[];
  progressMap?: Record<string, IUserCourseProgress>;
  featuredCourseIds?: Set<string>;
  onCoursePress: (course: ICourse, hasProgress: boolean) => void;
  onSeeAllPress?: () => void;
}

export const ExploreByTheme = React.memo(function ExploreByTheme({
  courses,
  progressMap = {},
  featuredCourseIds,
  onCoursePress,
  onSeeAllPress,
}: ExploreByThemeProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const [selectedCategory, setSelectedCategory] = useState<string>("INIC");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredCourses = useMemo(() => {
    let list = courses || [];

    // Se estiver buscando, varre todo o acervo para máxima encontrabilidade
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      return list.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.author?.toLowerCase().includes(q)
      );
    }

    // Filtro por Categoria Doutrinária ativa
    return list.filter((course) => {
      const cat = (
        course.categoryId ||
        (course as any).category?.id ||
        (course as any).category_id ||
        ""
      ).toUpperCase();
      return cat === selectedCategory.toUpperCase();
    });
  }, [courses, selectedCategory, searchQuery]);

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Explore por tema</Text>
        {onSeeAllPress && (
          <TouchableOpacity
            onPress={onSeeAllPress}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.seeAllText}>Ver todos</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Barra de Pesquisa */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar série..."
        />
      </View>

      {/* Pílulas de Filtro (Categorias) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillScrollView}
      >
        {THEME_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const IconComponent = cat.icon;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.pill, isActive && styles.pillActive]}
              onPress={() => setSelectedCategory(cat.id)}
              activeOpacity={0.7}
            >
              <IconComponent
                size={14}
                color={isActive ? theme.colors.onPrimary : theme.colors.textSecondary}
              />
              <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Grid de 2 Colunas com Cards Verticais */}
      {filteredCourses.length > 0 ? (
        <View style={styles.gridContainer}>
          {filteredCourses.map((course) => {
            const courseId = course.id;
            const progress =
              progressMap[courseId] ||
              progressMap[courseId?.toLowerCase()] ||
              progressMap[courseId?.toUpperCase()];
            const hasProgress =
              (progress?.completedLessons && progress.completedLessons.length > 0) ||
              Boolean(progress?.completedAt) ||
              ((progress as any)?.progressPercentage !== undefined &&
                (progress as any).progressPercentage > 0);
            return (
              <View key={course.id} style={styles.gridItem}>
                <VerticalCourseCard
                  course={course}
                  progress={progress}
                  onPress={() => onCoursePress(course, !!hasProgress)}
                />
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <BookOpen size={36} color={theme.colors.muted} />
          <Text style={styles.emptyText}>
            {searchQuery.trim()
              ? "Nenhum curso encontrado para este termo de busca."
              : "Nenhum curso encontrado nesta categoria no momento."}
          </Text>
        </View>
      )}
    </View>
  );
});
