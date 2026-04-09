import React, { useState, useMemo } from "react";
import { View, SectionList, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ArrowLeft,
  LayoutGrid,
  Heart,
  Sunrise,
  Moon,
  BookOpen,
  HeartPulse,
  Users,
  HandHeart,
  Sparkles,
  Flame,
} from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { PrayStackParamList } from "@/routers/types";
import { usePrayerFavoritesStore } from "@/stores/prayerFavoritesStore";
import { PRAYER_MOMENTS, PrayerMoment } from "@/types/prayer";

import { SearchBar } from "@/pages/pray/components/SearchBar";
import { PrayerCard } from "@/pages/pray/components/PrayerCard";
import { useAllPrayersWithCategories } from "@/pages/pray/hooks/useAllPrayersWithCategories";
import { createStyles } from "./styles";

type NavigationProp = NativeStackNavigationProp<PrayStackParamList, "AllPrayers">;

const MOMENT_ICONS = {
  "AO-ACORDAR": Sunrise,
  "AO-DORMIR": Moon,
  DIARIO: BookOpen,
  "POR-ANIMO": HeartPulse,
  "POR-ALGUEM": Users,
  "POR-CURA": HandHeart,
  "POR-GRATIDAO": Sparkles,
  "POR-PAZ": Heart,
  REUNIOES: Flame,
} as const;

export function AllPrayersScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<PrayStackParamList, "AllPrayers">>();

  const { data: allPrayers, isLoading } = useAllPrayersWithCategories();
  const { isFavorite, favorites } = usePrayerFavoritesStore();

  const [searchQuery, setSearchQuery] = useState("");
  const initialCategory = route.params?.initialCategory || "ALL";
  const [filterType, setFilterType] = useState<string>(initialCategory);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: allPrayers?.length || 0,
      FAVORITES: favorites.length,
    };
    if (allPrayers) {
      allPrayers.forEach((prayer) => {
        prayer.categories.forEach((cat) => {
          if (counts[cat] === undefined) {
            counts[cat] = 0;
          }
          counts[cat]++;
        });
      });
    }
    return counts;
  }, [allPrayers, favorites]);

  const CATEGORIES = useMemo(() => {
    const baseCats = [
      { type: "ALL", label: "Todas", icon: LayoutGrid, count: categoryCounts.ALL },
      { type: "FAVORITES", label: "Favoritas", icon: Heart, count: categoryCounts.FAVORITES },
    ];
    
    const momentCats = Object.entries(PRAYER_MOMENTS).map(([key, { label }]) => ({
      type: key,
      label,
      icon: MOMENT_ICONS[key as PrayerMoment] || BookOpen,
      count: categoryCounts[key] || 0,
    }));

    return [...baseCats, ...momentCats];
  }, [categoryCounts]);

  const filteredPrayers = useMemo(() => {
    if (!allPrayers) return [];

    let result = allPrayers;

    if (filterType === "FAVORITES") {
      result = result.filter((p) => isFavorite(p.id));
    } else if (filterType !== "ALL") {
      result = result.filter((p) => p.categories.includes(filterType));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (prayer) =>
          prayer.title.toLowerCase().includes(query) ||
          prayer.content.toLowerCase().includes(query) ||
          prayer.author?.toLowerCase().includes(query) ||
          prayer.source?.toLowerCase().includes(query)
      );
    }

    return result.sort((a, b) => a.title.localeCompare(b.title));
  }, [allPrayers, filterType, searchQuery, isFavorite]);

  function handlePrayerPress(prayerId: string) {
    navigation.navigate("PrayerPrep", { id: prayerId });
  }

  function renderEmpty() {
    if (isLoading) return null;
    return (
      <View style={[styles.emptyContainer, { paddingHorizontal: theme.spacing.lg }]}>
        <Text style={styles.emptyText}>
          {searchQuery
            ? "Nenhuma oração encontrada"
            : filterType === "FAVORITES"
              ? "Você ainda não tem orações favoritas."
              : "Nenhuma oração disponível nesta categoria"}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />

      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <SectionList
            sections={[{ data: filteredPrayers }]}
            keyExtractor={(item) => item.id}
            stickySectionHeadersEnabled={true}
            ListHeaderComponent={
              <>
                <View style={styles.header}>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                  >
                    <ArrowLeft size={20} color={theme.colors.primary} />
                  </TouchableOpacity>

                  <View style={styles.headerTextContainer}>
                    <Text style={styles.title}>Preces</Text>
                    <Text style={styles.subtitle}>Orações para todos os momentos</Text>
                  </View>
                </View>

                {/* Carrossel de Categorias */}
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
                        onPress={() => setFilterType(cat.type)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.categoryIconContainer}>
                          <cat.icon size={20} color={theme.colors.primary} />
                        </View>
                        <Text style={styles.categoryLabel}>{cat.label}</Text>
                        <Text style={styles.categoryCount}>
                          {cat.count} {cat.count === 1 ? "oração" : "orações"}
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
                    placeholder="Buscar oração..."
                  />
                </View>
              </View>
            )}
            renderItem={({ item }) => (
              <View style={styles.itemWrapper}>
                <PrayerCard prayer={item} onPress={() => handlePrayerPress(item.id)} />
              </View>
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmpty}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
