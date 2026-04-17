import React, { useState, useEffect, useMemo } from "react";
import { View, SectionList, Text, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ArrowLeft,
  LayoutGrid,
  Heart,
  BookOpen,
  BookHeart,
  Sparkles,
  Scale,
  Atom,
  Brain,
} from "lucide-react-native";
import { differenceInDays } from "date-fns";

import { useAppTheme } from "@/hooks/useAppTheme";
import { GlossaryStackParamList } from "@/routers/types";
import { IGlossaryTerm } from "@/types/glossary";
import { GlossaryFilterType } from "@/types/glossaryFilter";
import { useFilteredGlossaryTerms, useGlossaryTerms } from "../hooks/useGlossaryTerms";
import { useGlossaryFavoritesStore } from "@/stores/glossaryFavoritesStore";
import { useAuth } from "@/stores/authStore";
import { logGlossaryView } from "@/services/firebase/glossaryService";

import { SearchBar } from "@/pages/pray/components/SearchBar";
import { GlossaryCard } from "../components/GlossaryCard";
import { createStyles } from "./styles";

type NavigationProp = NativeStackNavigationProp<GlossaryStackParamList, "AllTerms">;

export function AllTermsScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NavigationProp>();

  const { user } = useAuth();
  const { data: allTerms, isLoading } = useGlossaryTerms();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filterType, setFilterType] = useState<GlossaryFilterType>("ALL");
  const favoriteIds = useGlossaryFavoritesStore((s) => s.favorites);

  // Debounce da busca para otimizar performance com muitos itens
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const filteredTerms = useFilteredGlossaryTerms(debouncedQuery, filterType, favoriteIds);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: allTerms?.length || 0,
      FAVORITES: favoriteIds.length,
      "Doutrina Básica": 0,
      "Mediunidade": 0,
      "Moral e Ética": 0,
      "Ciência Espírita": 0,
      "Evangelho": 0,
      "Filosofia Espírita": 0,
    };
    if (allTerms) {
      allTerms.forEach((term) => {
        if (counts[term.category] !== undefined) {
          counts[term.category]++;
        }
      });
    }
    return counts;
  }, [allTerms, favoriteIds]);

  // Lógica para detectar se uma categoria contém termos novos (menos de 15 dias)
  const categoryHasNew = useMemo(() => {
    const hasNew: Record<string, boolean> = {
      ALL: false,
    };
    if (allTerms) {
      allTerms.forEach((term) => {
        const isNew = term.createdAt && differenceInDays(new Date(), term.createdAt) <= 15;
        if (isNew) {
          hasNew.ALL = true;
          hasNew[term.category] = true;
        }
      });
    }
    return hasNew;
  }, [allTerms]);

  const CATEGORIES = useMemo(() => [
    { type: "ALL", label: "Todos", icon: LayoutGrid, count: categoryCounts.ALL, hasNew: categoryHasNew.ALL },
    { type: "FAVORITES", label: "Favoritos", icon: Heart, count: categoryCounts.FAVORITES, hasNew: false },
    { type: "Doutrina Básica", label: "Doutrina Básica", icon: BookOpen, count: categoryCounts["Doutrina Básica"], hasNew: categoryHasNew["Doutrina Básica"] },
    { type: "Evangelho", label: "Evangelho", icon: BookHeart, count: categoryCounts["Evangelho"], hasNew: categoryHasNew["Evangelho"] },
    { type: "Mediunidade", label: "Mediunidade", icon: Sparkles, count: categoryCounts["Mediunidade"], hasNew: categoryHasNew["Mediunidade"] },
    { type: "Moral e Ética", label: "Moral e Ética", icon: Scale, count: categoryCounts["Moral e Ética"], hasNew: categoryHasNew["Moral e Ética"] },
    { type: "Ciência Espírita", label: "Ciência Espírita", icon: Atom, count: categoryCounts["Ciência Espírita"], hasNew: categoryHasNew["Ciência Espírita"] },
    { type: "Filosofia Espírita", label: "Filosofia Espírita", icon: Brain, count: categoryCounts["Filosofia Espírita"], hasNew: categoryHasNew["Filosofia Espírita"] },
  ], [categoryCounts, categoryHasNew]);

  function handleTermPress(term: IGlossaryTerm) {
    const userId = user?.uid || "guest";
    logGlossaryView(term.id, userId);
    navigation.navigate("TermDetail", { id: term.id });
  }

  function renderTerm({ item }: { item: IGlossaryTerm }) {
    return (
      <View style={{ paddingHorizontal: theme.spacing.lg }}>
        <GlossaryCard term={item} onPress={() => handleTermPress(item)} />
      </View>
    );
  }

  function renderLoading() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  function renderEmpty() {
    if (isLoading) return renderLoading();
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
        <SectionList
          sections={isLoading ? [] : [{ data: filteredTerms }]}
          renderItem={renderTerm}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={true}
          initialNumToRender={10}
          windowSize={5}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={30}
          ListHeaderComponent={
            <>
              {/* Header: Layout Compacto (Voltar | Textos) */}
              <View style={styles.header}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.7}
                >
                  <ArrowLeft size={20} color={theme.colors.primary} />
                </TouchableOpacity>

                <View style={styles.headerTextContainer}>
                  <Text style={styles.title}>Glossário Espírita</Text>
                  <Text style={styles.subtitle}>Dicionário de termos</Text>
                </View>
              </View>

              {/* Linha 3: Carrossel de Categorias */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesScroll}
                contentContainerStyle={styles.categoriesContent}
              >
                {CATEGORIES.map((cat) => {
                  const isSelected = filterType === cat.type;
                  const cardBg = isSelected ? theme.colors.primary + "10" : theme.colors.card;
                  const cardBorder = isSelected ? theme.colors.primary : theme.colors.border;

                  return (
                    <TouchableOpacity
                      key={cat.type}
                      style={[
                        styles.categoryCard,
                        { backgroundColor: cardBg, borderColor: cardBorder },
                      ]}
                      onPress={() => !isLoading && setFilterType(cat.type as GlossaryFilterType)}
                      activeOpacity={0.7}
                      disabled={isLoading}
                    >
                      <View style={styles.categoryIconContainer}>
                        <cat.icon size={20} color={theme.colors.primary} />
                        {cat.hasNew && <View style={styles.badge} />}
                      </View>
                      <Text style={styles.categoryLabel}>{cat.label}</Text>
                      <Text style={styles.categoryCount}>
                        {isLoading ? "--" : cat.count} {cat.count === 1 ? "termo" : "termos"}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </>
          }
          renderSectionHeader={() => (
            <View style={styles.stickyHeader}>
              <View style={styles.searchContainer}>
                <SearchBar
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Buscar termo..."
                  editable={!isLoading}
                />
              </View>
            </View>
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
