import React, { useState, useRef } from "react";
import { View, SectionList, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ArrowLeft,
  BookA,
  LayoutGrid,
  Heart,
  BookOpen,
  BookHeart,
  Sparkles,
  Scale,
  Atom,
  Brain,
} from "lucide-react-native";

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
  const { data: allTerms } = useGlossaryTerms();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<GlossaryFilterType>("ALL");
  const favoriteIds = useGlossaryFavoritesStore((s) => s.favorites);

  const filteredTerms = useFilteredGlossaryTerms(searchQuery, filterType, favoriteIds);

  const categoryCounts = React.useMemo(() => {
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

  const CATEGORIES = [
    { type: "ALL", label: "Todos", icon: LayoutGrid, count: categoryCounts.ALL },
    { type: "FAVORITES", label: "Favoritos", icon: Heart, count: categoryCounts.FAVORITES },
    { type: "Doutrina Básica", label: "Doutrina Básica", icon: BookOpen, count: categoryCounts["Doutrina Básica"] },
    { type: "Evangelho", label: "Evangelho", icon: BookHeart, count: categoryCounts["Evangelho"] },
    { type: "Mediunidade", label: "Mediunidade", icon: Sparkles, count: categoryCounts["Mediunidade"] },
    { type: "Moral e Ética", label: "Moral e Ética", icon: Scale, count: categoryCounts["Moral e Ética"] },
    { type: "Ciência Espírita", label: "Ciência Espírita", icon: Atom, count: categoryCounts["Ciência Espírita"] },
    { type: "Filosofia Espírita", label: "Filosofia Espírita", icon: Brain, count: categoryCounts["Filosofia Espírita"] },
  ] as const;

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
        <SectionList
          sections={[{ data: filteredTerms }]}
          renderItem={renderTerm}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={true}
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
                      onPress={() => setFilterType(cat.type as GlossaryFilterType)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.categoryIconContainer}>
                        <cat.icon size={20} color={theme.colors.primary} />
                      </View>
                      <Text style={styles.categoryLabel}>{cat.label}</Text>
                      <Text style={styles.categoryCount}>
                        {cat.count} {cat.count === 1 ? "termo" : "termos"}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </>
          }
          renderSectionHeader={() => (
            /* Search BarSticky HeaderWrapper */
            <View style={styles.stickyHeader}>
              <View style={styles.searchContainer}>
                <SearchBar
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Buscar termo..."
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
