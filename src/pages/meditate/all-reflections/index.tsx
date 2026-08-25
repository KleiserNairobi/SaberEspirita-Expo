import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  ActivityIndicator,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  BookHeart,
  BookOpen,
  Heart,
  SlidersHorizontal,
  Sparkles,
  Tag,
  User,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppTheme } from "@/hooks/useAppTheme";
import { FilterBottomSheet } from "@/pages/pray/components/FilterBottomSheet";
import { SearchBar } from "@/pages/pray/components/SearchBar";
import { MeditateStackParamList } from "@/routers/types";
import { reflectionApiService } from "@/services/api/reflectionApiService";
import { useAuthStore } from "@/stores/authStore";
import { useReflectionFavoritesStore } from "@/stores/reflectionFavoritesStore";
import { ContentFilterType } from "@/types/prayer";

import { ReflectionCard } from "../components/ReflectionCard";
import { REFLECTION_KEYS, useReflections } from "../hooks/useReflections";
import { createStyles } from "./styles";

// Opções de filtro específicas para reflexões
const REFLECTION_FILTER_OPTIONS = [
  { id: "ALL" as ContentFilterType, label: "Todos", icon: BookOpen },
  { id: "FAVORITES" as ContentFilterType, label: "Apenas Favoritos", icon: Heart },
  { id: "BY_AUTHOR" as ContentFilterType, label: "Por Autor", icon: User },
  { id: "BY_SOURCE" as ContentFilterType, label: "Por Fonte", icon: Sparkles },
  { id: "BY_TOPIC" as ContentFilterType, label: "Por Tópico", icon: Tag },
] as const;

export default function AllReflectionsScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<MeditateStackParamList>>();
  const queryClient = useQueryClient();
  const route = useRoute<RouteProp<MeditateStackParamList, "AllReflections">>();
  const { id } = route.params || {};
  const { user } = useAuthStore();

  const isFavorite = useReflectionFavoritesStore((state) => state.isFavorite);
  const syncWithFirebase = useReflectionFavoritesStore((state) => state.syncWithFirebase);
  const isFavoritesPage = id === "FAVORITES";

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<ContentFilterType>("ALL");
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const reflectionsQuery = useReflections();

  const reflections = reflectionsQuery.data;
  const isLoading = reflectionsQuery.isLoading;

  useEffect(() => {
    if (user?.uid) {
      syncWithFirebase(user.uid);
    }
  }, [user?.uid, syncWithFirebase]);

  // Filtrar reflexões com base no filtro e busca
  const filteredReflections = useMemo(() => {
    if (!reflections) return [];

    let result = [...reflections];

    // Se for a página de favoritos, filtra apenas os favoritados localmente
    if (isFavoritesPage) {
      result = result.filter((r) => isFavorite(r.id));
    }

    // Aplicar filtro
    switch (filterType) {
      case "FAVORITES":
        result = result.filter((r) => isFavorite(r.id));
        break;
      case "BY_AUTHOR":
        result = result
          .filter((r) => r.author)
          .sort((a, b) => {
            const authorA = a.author?.toLowerCase() || "";
            const authorB = b.author?.toLowerCase() || "";
            return authorA.localeCompare(authorB);
          });
        break;
      case "BY_SOURCE":
        result = result
          .filter((r) => r.source)
          .sort((a, b) => {
            const sourceA = a.source?.toLowerCase() || "";
            const sourceB = b.source?.toLowerCase() || "";
            return sourceA.localeCompare(sourceB);
          });
        break;
      case "BY_TOPIC":
        result = result.sort((a, b) => {
          const topicA = a.topic || "";
          const topicB = b.topic || "";
          return topicA.localeCompare(topicB);
        });
        break;
      case "ALL":
      default:
        result = result.sort((a, b) => {
          return a.title.localeCompare(b.title);
        });
        break;
    }

    // Aplicar busca padronizada
    if (searchQuery.trim()) {
      const q = searchQuery
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

      const normalize = (text?: string) =>
        text
          ? text
              .replace(/\s*\n\s*/g, " ")
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
          : "";

      result = result.filter(
        (reflection) =>
          normalize(reflection.title).includes(q) ||
          normalize(reflection.subtitle).includes(q) ||
          normalize(reflection.content).includes(q) ||
          normalize(reflection.author).includes(q) ||
          normalize(reflection.source).includes(q) ||
          normalize(reflection.topic).includes(q)
      );
    }

    return result;
  }, [reflections, filterType, searchQuery, isFavorite, isFavoritesPage]);

  function handleReflectionPress(reflectionId: string) {
    navigation.navigate("Reflection", { id: reflectionId });
  }

  function prefetchReflection(reflectionId: string) {
    queryClient.prefetchQuery({
      queryKey: REFLECTION_KEYS.detail(reflectionId),
      queryFn: () => reflectionApiService.getReflectionById(reflectionId),
      staleTime: 1000 * 60 * 60 * 24, // 24 horas
    });
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <SectionList
          sections={[{ data: filteredReflections }]}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={true}
          ListHeaderComponent={
            /* Header */
            <View style={styles.header}>
              <View style={styles.headerRow}>
                {/* Botão Voltar */}
                <View style={styles.headerSide}>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                  >
                    <ArrowLeft size={20} color={theme.colors.primary} />
                  </TouchableOpacity>
                </View>

                {/* Ícone Central com Anéis */}
                <View style={styles.iconRingsContainer}>
                  <View style={styles.ringOuter} />
                  <View style={styles.ringMiddle} />
                  <View style={styles.ringInner} />
                  <View style={styles.iconLargeContainer}>
                    {isFavoritesPage ? (
                      <Heart size={40} color={theme.colors.background} />
                    ) : (
                      <BookHeart size={40} color={theme.colors.background} />
                    )}
                  </View>
                </View>

                {/* Botão de Filtro */}
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

              {/* Título e Subtítulo */}
              <View style={styles.headerTextContainer}>
                <Text style={styles.title}>
                  {isFavoritesPage ? "Minhas Reflexões" : "Textos para Reflexão"}
                </Text>
                <Text style={styles.subtitle}>
                  {isFavoritesPage
                    ? "Suas reflexões favoritas em um só lugar"
                    : "Aprofunde seu conhecimento espiritual"}
                </Text>
              </View>
            </View>
          }
          renderSectionHeader={() => (
            <View style={styles.stickyHeader}>
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Buscar reflexão..."
              />
            </View>
          )}
          renderItem={({ item }) => (
            <View style={{ paddingHorizontal: theme.spacing.lg }}>
              <ReflectionCard
                reflection={item}
                onPress={() => handleReflectionPress(item.id)}
                onPressIn={() => prefetchReflection(item.id)}
              />
            </View>
          )}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View
              style={[styles.emptyContainer, { paddingHorizontal: theme.spacing.lg }]}
            >
              <Text style={styles.emptyText}>
                {searchQuery
                  ? "Nenhuma reflexão encontrada"
                  : isFavoritesPage
                    ? "Você ainda não tem reflexões favoritas.\nToque no coração para salvar suas reflexões preferidas."
                    : "Nenhuma reflexão disponível no momento"}
              </Text>
            </View>
          }
        />

        {/* BottomSheet de Filtros */}
        <FilterBottomSheet
          ref={bottomSheetRef}
          filterType={filterType}
          onFilterChange={setFilterType}
          title={isFavoritesPage ? "Filtrar Favoritos" : "Filtrar Reflexões"}
          filterOptions={
            isFavoritesPage
              ? [
                  {
                    id: "ALL" as ContentFilterType,
                    label: "Todos os Favoritos",
                    icon: Heart,
                  },
                  {
                    id: "BY_AUTHOR" as ContentFilterType,
                    label: "Por Autor",
                    icon: User,
                  },
                  {
                    id: "BY_SOURCE" as ContentFilterType,
                    label: "Por Fonte",
                    icon: Sparkles,
                  },
                  { id: "BY_TOPIC" as ContentFilterType, label: "Por Tópico", icon: Tag },
                ]
              : REFLECTION_FILTER_OPTIONS
          }
        />
      </View>
    </SafeAreaView>
  );
}
