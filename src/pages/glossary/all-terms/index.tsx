import React, { useState, useRef } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, BookA, SlidersHorizontal } from "lucide-react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { useAppTheme } from "@/hooks/useAppTheme";
import { GlossaryStackParamList } from "@/routers/types";
import { IGlossaryTerm } from "@/types/glossary";
import { GlossaryFilterType } from "@/types/glossaryFilter";
import { useFilteredGlossaryTerms } from "../hooks/useGlossaryTerms";
import { useGlossaryFavoritesStore } from "@/stores/glossaryFavoritesStore";

import { SearchBar } from "@/pages/pray/components/SearchBar";
import { GlossaryCard } from "../components/GlossaryCard";
import { GlossaryFilterBottomSheet } from "../components/GlossaryFilterBottomSheet";
import { createStyles } from "./styles";

type NavigationProp = NativeStackNavigationProp<GlossaryStackParamList, "AllTerms">;

export function AllTermsScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NavigationProp>();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<GlossaryFilterType>("ALL");
  const favoriteIds = useGlossaryFavoritesStore((s) => s.favorites);

  const filteredTerms = useFilteredGlossaryTerms(searchQuery, filterType, favoriteIds);

  function handleTermPress(term: IGlossaryTerm) {
    navigation.navigate("TermDetail", { id: term.id });
  }

  function renderTerm({ item }: { item: IGlossaryTerm }) {
    return <GlossaryCard term={item} onPress={() => handleTermPress(item)} />;
  }

  function renderEmpty() {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {searchQuery ? "Nenhum termo encontrado" : "Nenhum termo disponível"}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />

      <View style={styles.container}>
        {/* Lista de termos - Header e SearchBar agora rolam junto */}
        <FlatList
          data={filteredTerms}
          renderItem={renderTerm}
          keyExtractor={(item) => item.id}
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
                      <BookA size={40} color={theme.colors.background} />
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
                  <Text style={styles.title}>Glossário Espírita</Text>
                  <Text style={styles.subtitle}>Dicionário de termos</Text>
                </View>
              </View>

              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <SearchBar
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Buscar termo..."
                />
              </View>
            </>
          }
          contentContainerStyle={styles.list}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
        />

        {/* BottomSheet de Filtros */}
        <GlossaryFilterBottomSheet
          ref={bottomSheetRef}
          filterType={filterType}
          onFilterChange={setFilterType}
        />
      </View>
    </SafeAreaView>
  );
}
