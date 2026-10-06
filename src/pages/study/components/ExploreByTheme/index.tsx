import React, { useMemo, useState } from "react";

import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import {
  Book,
  BookMarked,
  BookOpen,
  Heart,
  Library,
  Scale,
  Sparkles,
  Star,
} from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { SearchBar } from "@/pages/pray/components/SearchBar";
import { useAuthStore } from "@/stores/authStore";
import { ICourse, IUserCourseProgress } from "@/types/course";
import { getCourseActiveLesson } from "@/utils/lessonProgressStorage";

import { VerticalCourseCard } from "../VerticalCourseCard";
import { createStyles } from "./styles";

export const THEME_CATEGORIES = [
  { id: "ALL", label: "Todos", icon: Sparkles },
  { id: "INIC", label: "Iniciação", icon: BookOpen },
  { id: "LE", label: "Livro dos Espíritos", icon: Book },
  { id: "ESE", label: "Evangelho", icon: Heart },
  { id: "AG", label: "Gênese", icon: Star },
  { id: "LM", label: "Mediunidade", icon: BookMarked },
  { id: "CI", label: "Céu e Inferno", icon: Scale },
  { id: "COMP", label: "Complementares", icon: Library },
] as const;

export const COMPLEMENTARY_SUBTAGS = [
  { id: "ALL", label: "Todos os Autores" },
  { id: "ANDRE_LUIZ", label: "André Luiz", query: "andré luiz" },
  { id: "EMMANUEL", label: "Emmanuel", query: "emmanuel" },
  { id: "JOANNA", label: "Joanna de Ângelis", query: "joanna" },
] as const;

// Ordem e metadados das trilhas curriculares quando a visualização "Todos" está ativa
const TRACK_SECTIONS = [
  {
    id: "INIC",
    title: "Iniciação Espírita",
    subtitle: "Primeiros passos para compreender a Doutrina",
    categoryIds: ["INIC", "INICIACAO"],
  },
  {
    id: "LE",
    title: "O Livro dos Espíritos",
    subtitle: "Filosofia fundamental e as 4 partes da Codificação",
    categoryIds: ["LE"],
  },
  {
    id: "ESE",
    title: "O Evangelho Segundo o Espiritismo",
    subtitle: "Moral cristã e aplicação prática na vida diária",
    categoryIds: ["ESE"],
  },
  {
    id: "AG",
    title: "A Gênese",
    subtitle: "Ciência, os milagres e as predições segundo o Espiritismo",
    categoryIds: ["AG"],
  },
  {
    id: "LM_CI",
    title: "Mediunidade & Imortalidade",
    subtitle: "O Livro dos Médiuns e O Céu e o Inferno",
    categoryIds: ["LM", "CI"],
  },
  {
    id: "COMP",
    title: "Obras Complementares",
    subtitle: "Séries psicografadas por Chico Xavier e outros médiuns",
    categoryIds: ["COMP"],
  },
];

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
  onCoursePress,
  onSeeAllPress,
}: ExploreByThemeProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const { user } = useAuthStore();

  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedSubtag, setSelectedSubtag] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const courseMatchesCategory = (course: ICourse, targetCatId: string): boolean => {
    const cat = (
      course.categoryId ||
      (course as any).category?.id ||
      (course as any).category_id ||
      ""
    ).toUpperCase();

    // Se for Complementares, também agrupa cursos com autores subsidiários (ex: André Luiz)
    if (targetCatId === "COMP") {
      const author = (course.author || "").toLowerCase();
      return (
        cat === "COMP" ||
        author.includes("andré luiz") ||
        author.includes("emmanuel") ||
        author.includes("chico xavier") ||
        author.includes("joanna")
      );
    }

    return cat === targetCatId.toUpperCase();
  };

  // Filtragem para quando o usuário busca ou seleciona uma categoria específica
  const filteredCourses = useMemo(() => {
    let list = courses || [];

    // Busca textual livre
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      return list.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.author?.toLowerCase().includes(q)
      );
    }

    if (selectedCategory === "ALL") {
      return list;
    }

    // Filtrar pela categoria selecionada
    list = list.filter((c) => courseMatchesCategory(c, selectedCategory));

    // Se for Complementares e houver subtag selecionada
    if (selectedCategory === "COMP" && selectedSubtag !== "ALL") {
      const targetSub = COMPLEMENTARY_SUBTAGS.find((s) => s.id === selectedSubtag);
      if (targetSub && "query" in targetSub) {
        list = list.filter(
          (c) =>
            (c.author || "").toLowerCase().includes(targetSub.query) ||
            (c.title || "").toLowerCase().includes(targetSub.query) ||
            (c.description || "").toLowerCase().includes(targetSub.query)
        );
      }
    }

    return list;
  }, [courses, selectedCategory, selectedSubtag, searchQuery]);

  const renderHorizontalCourseItem = (course: ICourse) => {
    const courseId = course.id;
    const progress =
      progressMap[courseId] ||
      progressMap[courseId?.toLowerCase()] ||
      progressMap[courseId?.toUpperCase()];
    const activeLocal = getCourseActiveLesson(user?.uid, course.id);
    const hasProgress =
      Boolean(activeLocal) ||
      Boolean(progress?.startedAt) ||
      Boolean((progress as any)?.enrolledAt) ||
      Boolean(progress?.completedAt) ||
      Boolean(progress?.lastAccessedAt) ||
      (Array.isArray(progress?.completedLessons) && progress.completedLessons.length > 0) ||
      ((progress as any)?.progressPercentage !== undefined &&
        (progress as any).progressPercentage > 0);

    return (
      <View key={course.id} style={styles.carouselItemWrapper}>
        <VerticalCourseCard
          course={course}
          progress={progress}
          width={168}
          onPress={() => onCoursePress(course, Boolean(hasProgress))}
        />
      </View>
    );
  };

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
            <Text style={styles.seeAllText}>Ver catálogo</Text>
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
              onPress={() => {
                setSelectedCategory(cat.id);
                setSelectedSubtag("ALL");
              }}
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

      {/* Subcategorias quando "Complementares" está ativo */}
      {selectedCategory === "COMP" && searchQuery.trim().length === 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subPillScrollView}
        >
          {COMPLEMENTARY_SUBTAGS.map((sub) => {
            const isActive = selectedSubtag === sub.id;
            return (
              <TouchableOpacity
                key={sub.id}
                style={[styles.subPill, isActive && styles.subPillActive]}
                onPress={() => setSelectedSubtag(sub.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.subPillText, isActive && styles.subPillTextActive]}>
                  {sub.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* VISÃO 1: BUSCA OU FILTRO ESPECÍFICO */}
      {(searchQuery.trim().length > 0 || selectedCategory !== "ALL") && (
        <View style={styles.filteredContainer}>
          {filteredCourses.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselTrackContent}
            >
              {filteredCourses.map((c) => renderHorizontalCourseItem(c))}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <BookOpen size={36} color={theme.colors.muted} />
              <Text style={styles.emptyText}>
                {searchQuery.trim()
                  ? "Nenhum curso encontrado para este termo de busca."
                  : "Nenhum curso cadastrado nesta seção no momento."}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* VISÃO 2: "TODOS" -> TRILHAS EM CARROSSÉIS HORIZONTAIS */}
      {selectedCategory === "ALL" && searchQuery.trim().length === 0 && (
        <View style={styles.tracksWrapper}>
          {TRACK_SECTIONS.map((track) => {
            const trackCourses = courses.filter((c) =>
              track.categoryIds.some((catId) => courseMatchesCategory(c, catId))
            );

            if (trackCourses.length === 0) return null;

            return (
              <View key={track.id} style={styles.trackSection}>
                <View style={styles.trackHeader}>
                  <View style={styles.trackTitleBlock}>
                    <Text style={styles.trackTitle}>{track.title}</Text>
                    <Text style={styles.trackSubtitle}>{track.subtitle}</Text>
                  </View>
                  <Text style={styles.trackCountText}>
                    {trackCourses.length} {trackCourses.length === 1 ? "série" : "séries"}
                  </Text>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.carouselTrackContent}
                >
                  {trackCourses.map((c) => renderHorizontalCourseItem(c))}
                </ScrollView>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
});
