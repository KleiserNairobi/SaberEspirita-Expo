import React, { useState, useMemo, useRef } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MeditateStackParamList } from "@/routers/types";
import { ArrowLeft, BookHeart, SlidersHorizontal } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { SearchBar } from "@/pages/pray/components/SearchBar";
import { FilterBottomSheet } from "@/pages/pray/components/FilterBottomSheet";
import { ReflectionCard } from "../components/ReflectionCard";
import { useReflections } from "../hooks/useReflections";
import { PrayerFilterType } from "@/types/prayer";
import { createStyles } from "./styles";

export default function AllReflectionsScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<MeditateStackParamList>>();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<PrayerFilterType>("ALL");
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
                    filterType !== "ALL" ? theme.colors.background : theme.colors.primary
                  }
                />
                {filterType !== "ALL" && <View style={styles.filterDot} />}
              </TouchableOpacity>
            </View>
          </View>

          {/* Título e Subtítulo */}
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Textos para Reflexão</Text>
            <Text style={styles.subtitle}>Aprofunde seu conhecimento espiritual</Text>
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

        {/* Lista de Reflexões */}
        <FlatList
          data={filteredReflections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ReflectionCard
              reflection={item}
              onPress={() => handleReflectionPress(item.id)}
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
        />
      </View>
    </SafeAreaView>
  );
}
