import React, { useMemo, useState } from "react";

import {
  ActivityIndicator,
  ScrollView,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { differenceInDays } from "date-fns";
import { StatusBar } from "expo-status-bar";
import {
  ArrowLeft,
  BookOpen,
  Flame,
  HandHeart,
  Heart,
  HeartPulse,
  LayoutGrid,
  Moon,
  Sparkles,
  Sunrise,
  Users,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppTheme } from "@/hooks/useAppTheme";
import { PrayerCard } from "@/pages/pray/components/PrayerCard";
import { SearchBar } from "@/pages/pray/components/SearchBar";
import { useAllPrayersWithCategories } from "@/pages/pray/hooks/useAllPrayersWithCategories";
import { PrayStackParamList } from "@/routers/types";
import { useAmbientPlayerStore } from "@/stores/ambientPlayerStore";
import { usePrayerFavoritesStore } from "@/stores/prayerFavoritesStore";
import { PRAYER_MOMENTS, PrayerMoment } from "@/types/prayer";

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
  const { setPlaying, setCurrentTrack } = useAmbientPlayerStore();

  const [searchQuery, setSearchQuery] = useState("");
  const initialCategory = route.params?.initialCategory || "ALL";
  const [filterType, setFilterType] = useState<string>(initialCategory);

  // Desliga o áudio imediatamente se este catálogo receber foco na tela (kill-switch auditivo)
  useFocusEffect(
    React.useCallback(() => {
      setPlaying(false);
      setCurrentTrack(null);
    }, [setPlaying, setCurrentTrack])
  );

  const categoryCounts = useMemo(() => {
    const validFavoritesCount = allPrayers
      ? allPrayers.filter((p) => isFavorite(p.id)).length
      : favorites.length;

    const counts: Record<string, number> = {
      ALL: allPrayers?.length || 0,
      FAVORITES: validFavoritesCount,
    };
    if (allPrayers) {
      allPrayers.forEach((prayer) => {
        const cats = Array.isArray(prayer.categories) ? prayer.categories : [];
        cats.forEach((cat) => {
          if (counts[cat] === undefined) {
            counts[cat] = 0;
          }
          counts[cat]++;
        });
      });
    }
    return counts;
  }, [allPrayers, favorites, isFavorite]);

  const categoryHasNew = useMemo(() => {
    const hasNew: Record<string, boolean> = {
      ALL: false,
    };
    if (allPrayers) {
      allPrayers.forEach((prayer) => {
        const isNew =
          prayer.createdAt && differenceInDays(new Date(), prayer.createdAt) <= 15;
        if (isNew) {
          hasNew.ALL = true;
          const cats = Array.isArray(prayer.categories) ? prayer.categories : [];
          cats.forEach((cat) => {
            hasNew[cat] = true;
          });
        }
      });
    }
    return hasNew;
  }, [allPrayers]);

  const CATEGORIES = useMemo(() => {
    const baseCats = [
      {
        type: "ALL",
        label: "Todas",
        icon: LayoutGrid,
        count: categoryCounts.ALL,
        hasNew: categoryHasNew.ALL,
      },
      {
        type: "FAVORITES",
        label: "Favoritas",
        icon: Heart,
        count: categoryCounts.FAVORITES,
        hasNew: false,
      },
    ];

    const momentCats = Object.entries(PRAYER_MOMENTS).map(([key, { label }]) => ({
      type: key,
      label,
      icon: MOMENT_ICONS[key as PrayerMoment] || BookOpen,
      count: categoryCounts[key] || 0,
      hasNew: categoryHasNew[key] || false,
    }));

    return [...baseCats, ...momentCats];
  }, [categoryCounts, categoryHasNew]);

  const filteredPrayers = useMemo(() => {
    if (!allPrayers) return [];

    let result = allPrayers;

    if (filterType === "FAVORITES") {
      result = result.filter((p) => isFavorite(p.id));
    } else if (filterType !== "ALL") {
      result = result.filter((p) => {
        const cats = Array.isArray(p.categories) ? p.categories : [];
        return cats.includes(filterType);
      });
    }

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
        (prayer) =>
          normalize(prayer.title).includes(q) ||
          normalize(prayer.content).includes(q) ||
          normalize(prayer.author).includes(q) ||
          normalize(prayer.source).includes(q)
      );
    }

    return result.sort((a, b) => a.title.localeCompare(b.title));
  }, [allPrayers, filterType, searchQuery, isFavorite]);

  function handlePrayerPress(prayerId: string) {
    navigation.navigate("PrayerPrep", { id: prayerId });
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
        <SectionList
          sections={isLoading ? [] : [{ data: filteredPrayers }]}
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
                      onPress={() => setFilterType(cat.type)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.categoryIconContainer}>
                        <cat.icon size={20} color={theme.colors.primary} />
                        {cat.hasNew && <View style={styles.badge} />}
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
      </View>
    </SafeAreaView>
  );
}
