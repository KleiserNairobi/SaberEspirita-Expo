import React, { useState, useMemo, useRef } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MeditateStackParamList } from "@/routers/types";
import {
  ArrowLeft,
  BookHeart,
  SlidersHorizontal,
  BookOpen,
  Heart,
  User,
  Sparkles,
  Tag,
} from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { SearchBar } from "@/pages/pray/components/SearchBar";
import { FilterBottomSheet } from "@/pages/pray/components/FilterBottomSheet";
import { ReflectionCard } from "../components/ReflectionCard";
import { useReflections } from "../hooks/useReflections";
import { ContentFilterType } from "@/types/prayer";
import { createStyles } from "./styles";
import { useQueryClient } from "@tanstack/react-query";
import { getReflectionById } from "@/services/firebase/reflectionService";

// Opções de filtro específicas para reflexões (inclui "Por Tópico")
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

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<ContentFilterType>("ALL");
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const { data: reflections, isLoading } = useReflections();

  // Filtrar reflexões com base no filtro e busca
  const filteredReflections = useMemo(() => {
    if (!reflections) return [];

    let result = reflections;

    // Aplicar filtro
    switch (filterType) {
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
          const topicA = a.topic;
          const topicB = b.topic;
          return topicA.localeCompare(topicB);
        });
        break;
      case "ALL":
      default:
        break;
    }

    // Aplicar busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (reflection) =>
          reflection.title.toLowerCase().includes(query) ||
          reflection.subtitle?.toLowerCase().includes(query) ||
          reflection.author?.toLowerCase().includes(query) ||
          reflection.source?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [reflections, filterType, searchQuery]);

  function handleReflectionPress(reflectionId: string) {
    navigation.navigate("Reflection", { id: reflectionId });
  }

  function prefetchReflection(id: string) {
    queryClient.prefetchQuery({
      queryKey: ["reflection", id],
      queryFn: () => getReflectionById(id),
      staleTime: 1000 * 60 * 60, // 1 hora
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
        {/* Lista de Reflexões - Header e Toolbar agora rolam junto */}
        <FlatList
          data={filteredReflections}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <>
              {/* Header */}
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
                      <BookHeart size={40} color={theme.colors.background} />
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
                  <Text style={styles.title}>Textos para Reflexão</Text>
                  <Text style={styles.subtitle}>
                    Aprofunde seu conhecimento espiritual
                  </Text>
                </View>
              </View>

              {/* Barra de Busca */}
              <View style={styles.toolbar}>
                <SearchBar
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Buscar reflexão..."
                />
              </View>
            </>
          }
          renderItem={({ item }) => (
            <ReflectionCard
              reflection={item}
              onPress={() => handleReflectionPress(item.id)}
              onPressIn={() => prefetchReflection(item.id)}
            />
          )}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery
                  ? "Nenhuma reflexão encontrada"
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
          title="Filtrar Reflexões"
          filterOptions={REFLECTION_FILTER_OPTIONS}
        />
      </View>
    </SafeAreaView>
  );
}
