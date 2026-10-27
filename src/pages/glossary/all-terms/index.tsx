import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import {
  ArrowLeft,
  Atom,
  BookHeart,
  BookOpen,
  Brain,
  Heart,
  Scale,
  Sparkles,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppTheme } from "@/hooks/useAppTheme";
import { SearchBar } from "@/pages/pray/components/SearchBar";
import { GlossaryStackParamList } from "@/routers/types";
import { statsApiService } from "@/services/api/statsApiService";
import { useGlossaryFavoritesStore } from "@/stores/glossaryFavoritesStore";
import { IGlossaryTerm } from "@/types/glossary";
import { GlossaryFilterType } from "@/types/glossaryFilter";

import { GlossaryCard } from "../components/GlossaryCard";
import { useFilteredGlossaryTerms, useGlossaryTerms } from "../hooks/useGlossaryTerms";
import { createStyles } from "./styles";

type NavigationProp = NativeStackNavigationProp<GlossaryStackParamList, "AllTerms">;

export function AllTermsScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NavigationProp>();

  const { data: allTerms, isLoading } = useGlossaryTerms();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  // Categoria padrão: Doutrina Básica (item "Todos" removido)
  const [filterType, setFilterType] = useState<GlossaryFilterType>("Doutrina Básica");
  const favoriteIds = useGlossaryFavoritesStore((s) => s.favorites);

  // Debounce da busca
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 200);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Busca geral irrestrita quando houver debouncedQuery; ou filtra por categoria selecionada
  const filteredTerms = useFilteredGlossaryTerms(debouncedQuery, filterType, favoriteIds);

  // Contagem linear ultrarrápida das categorias (sem cálculos de data)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      FAVORITES: favoriteIds.length,
      "Doutrina Básica": 0,
      Mediunidade: 0,
      "Moral e Ética": 0,
      "Ciência Espírita": 0,
      Evangelho: 0,
      "Filosofia Espírita": 0,
    };

    if (allTerms && allTerms.length > 0) {
      for (let i = 0; i < allTerms.length; i++) {
        const cat = allTerms[i].category;
        if (counts[cat] !== undefined) {
          counts[cat]++;
        }
      }
    }

    return counts;
  }, [allTerms, favoriteIds.length]);

  // Nova ordem dos cards: favoritos, doutrina básica, evangelho, mediunidade, moral e ética, ciência espírita, filosofia espírita (sem "Todos")
  const CATEGORIES = useMemo(
    () => [
      {
        type: "FAVORITES",
        label: "Favoritos",
        icon: Heart,
        count: categoryCounts.FAVORITES,
      },
      {
        type: "Doutrina Básica",
        label: "Doutrina Básica",
        icon: BookOpen,
        count: categoryCounts["Doutrina Básica"],
      },
      {
        type: "Evangelho",
        label: "Evangelho",
        icon: BookHeart,
        count: categoryCounts["Evangelho"],
      },
      {
        type: "Mediunidade",
        label: "Mediunidade",
        icon: Sparkles,
        count: categoryCounts["Mediunidade"],
      },
      {
        type: "Moral e Ética",
        label: "Moral e Ética",
        icon: Scale,
        count: categoryCounts["Moral e Ética"],
      },
      {
        type: "Ciência Espírita",
        label: "Ciência Espírita",
        icon: Atom,
        count: categoryCounts["Ciência Espírita"],
      },
      {
        type: "Filosofia Espírita",
        label: "Filosofia Espírita",
        icon: Brain,
        count: categoryCounts["Filosofia Espírita"],
      },
    ],
    [categoryCounts]
  );

  const handleTermPress = useCallback(
    (term: IGlossaryTerm) => {
      statsApiService.logEvent({
        eventName: "glossary_view",
        category: "glossary",
        label: term.term,
        metadata: { origin: "menu" },
      });
      navigation.navigate("TermDetail", { id: term.id });
    },
    [navigation]
  );

  const renderTerm = useCallback(
    ({ item }: { item: IGlossaryTerm }) => (
      <View style={{ paddingHorizontal: theme.spacing.lg }}>
        <GlossaryCard term={item} onPress={handleTermPress} />
      </View>
    ),
    [theme.spacing.lg, handleTermPress]
  );

  const renderLoading = useCallback(
    () => (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    ),
    [styles.loadingContainer, theme.colors.primary]
  );

  const renderEmpty = useCallback(() => {
    if (isLoading) return renderLoading();
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {searchQuery
            ? "Nenhum termo encontrado na busca geral"
            : "Nenhum termo disponível nesta categoria"}
        </Text>
      </View>
    );
  }, [isLoading, renderLoading, searchQuery, styles.emptyContainer, styles.emptyText]);

  const keyExtractor = useCallback((item: IGlossaryTerm) => item.id, []);

  const isSearching = Boolean(debouncedQuery.trim());

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />

      <View style={styles.container}>
        <FlatList
          data={isLoading ? [] : filteredTerms}
          renderItem={renderTerm}
          keyExtractor={keyExtractor}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={5}
          updateCellsBatchingPeriod={30}
          removeClippedSubviews={true}
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

              {/* Carrossel de Categorias (Ordem: Favoritos -> Doutrina Básica -> ...) */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesScroll}
                contentContainerStyle={styles.categoriesContent}
              >
                {CATEGORIES.map((cat) => {
                  const isSelected = !isSearching && filterType === cat.type;
                  const cardBg = isSelected
                    ? theme.colors.primary + "10"
                    : theme.colors.card;
                  const cardBorder = isSelected
                    ? theme.colors.primary
                    : theme.colors.border;

                  return (
                    <TouchableOpacity
                      key={cat.type}
                      style={[
                        styles.categoryCard,
                        { backgroundColor: cardBg, borderColor: cardBorder },
                      ]}
                      onPress={() => {
                        setSearchQuery("");
                        setDebouncedQuery("");
                        setFilterType(cat.type as GlossaryFilterType);
                      }}
                      activeOpacity={0.7}
                      disabled={isLoading}
                    >
                      <View style={styles.categoryIconContainer}>
                        <cat.icon size={20} color={theme.colors.primary} />
                      </View>
                      <Text style={styles.categoryLabel}>{cat.label}</Text>
                      <Text style={styles.categoryCount}>
                        {isLoading ? "--" : cat.count}{" "}
                        {cat.count === 1 ? "termo" : "termos"}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Barra de Busca (Geral em todo o acervo) */}
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
      </View>
    </SafeAreaView>
  );
}
