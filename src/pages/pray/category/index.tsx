import React, { useState, useMemo, useRef } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PrayStackParamList } from "@/routers/types";
import {
  ArrowLeft,
  Heart,
  Sunrise,
  Moon,
  HeartPulse,
  Users,
  HandHeart,
  BookOpen,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  Flame,
  User,
} from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { usePrayerFavoritesStore } from "@/stores/prayerFavoritesStore";
import {
  PRAYER_MOMENTS,
  PrayerMoment,
  PrayerFilterType,
  ContentFilterType,
} from "@/types/prayer";
import { SearchBar } from "@/pages/pray/components/SearchBar";
import { FilterBottomSheet } from "@/pages/pray/components/FilterBottomSheet";
import { usePrayersByCategory } from "@/pages/pray/hooks/usePrayersByCategory";
import { usePrayersByIds } from "@/pages/pray/hooks/usePrayersByIds";
import { PrayerCard } from "@/pages/pray/components/PrayerCard";
import { createStyles } from "@/pages/pray/category/styles";

// Mapeamento de ícones para cada momento
const MOMENT_ICONS = {
  "AO-ACORDAR": Sunrise,
  "AO-DORMIR": Moon,
  DIARIO: BookOpen,
  "POR-ANIMO": HeartPulse,
  "POR-ALGUEM": Users,
  "POR-CURA": Heart,
  "POR-GRATIDAO": Sparkles,
  "POR-PAZ": HandHeart,
  REUNIOES: Flame,
} as const;

// Mapeamento de subtítulos para cada momento
const MOMENT_SUBTITLES = {
  "AO-ACORDAR": "Orações para começar o dia",
  "AO-DORMIR": "Orações para encerrar o dia",
  DIARIO: "Orações para o dia a dia",
  "POR-ANIMO": "Orações para momentos difíceis",
  "POR-ALGUEM": "Orações por outras pessoas",
  "POR-CURA": "Orações pela cura",
  "POR-GRATIDAO": "Orações de agradecimento",
  "POR-PAZ": "Orações pela paz",
  REUNIOES: "Orações propícias para atividades espíritas",
} as const;

export function PrayCategoryScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<PrayStackParamList>>();
  const route = useRoute<RouteProp<PrayStackParamList, "PrayCategory">>();
  const { id } = route.params;

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<PrayerFilterType>("ALL");
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const { isFavorite, toggleFavorite, favorites } = usePrayerFavoritesStore();
  const isFavoritesPage = id === "FAVORITES";

  const categoryQuery = usePrayersByCategory(isFavoritesPage ? "" : id);
  const favoritesQuery = usePrayersByIds(isFavoritesPage ? favorites : []);

  const prayers = isFavoritesPage ? favoritesQuery.data : categoryQuery.data;
  const isLoading = isFavoritesPage ? favoritesQuery.isLoading : categoryQuery.isLoading;

  // Filtrar orações com base no filtro e busca
  const filteredPrayers = useMemo(() => {
    if (!prayers) return [];

    let result = prayers;

    // Aplicar filtro
    switch (filterType) {
      case "FAVORITES":
        result = result.filter((p) => isFavorite(p.id));
        break;
      case "BY_AUTHOR":
        // Filtrar apenas orações com autor E ordenar alfabeticamente por autor
        result = result
          .filter((p) => p.author)
          .sort((a, b) => {
            const authorA = a.author?.toLowerCase() || "";
            const authorB = b.author?.toLowerCase() || "";
            return authorA.localeCompare(authorB);
          });
        break;
      case "BY_SOURCE":
        // Filtrar apenas orações com fonte E ordenar alfabeticamente por fonte
        result = result
          .filter((p) => p.source)
          .sort((a, b) => {
            const sourceA = a.source?.toLowerCase() || "";
            const sourceB = b.source?.toLowerCase() || "";
            return sourceA.localeCompare(sourceB);
          });
        break;
      case "ALL":
      default:
        // Sem filtro, apenas ordenação alfabética pelo título
        result = result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    // Aplicar busca
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

    return result;
  }, [prayers, filterType, searchQuery, isFavorite]);

  function handlePrayerPress(prayerId: string) {
    navigation.navigate("Prayer", { id: prayerId });
  }

  // Obter dados da categoria
  const categoryTitle = isFavoritesPage
    ? "Favoritas"
    : PRAYER_MOMENTS[id as keyof typeof PRAYER_MOMENTS]?.label || "Orações";

  const categorySubtitle = isFavoritesPage
    ? "Acesso rápido às suas orações preferidas"
    : MOMENT_SUBTITLES[id as PrayerMoment] || "";

  const IconComponent = isFavoritesPage
    ? Heart
    : MOMENT_ICONS[id as PrayerMoment] || BookOpen;

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
        {/* Lista de Orações - Header e Toolbar agora rolam junto */}
        <FlatList
          data={filteredPrayers}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <>
              {/* Header: Layout de 3 Colunas (Voltar | Ícone | Espaço) */}
              <View style={styles.header}>
                {/* Linha 1: Botão Voltar | Ícone | Espaço */}
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
                      <IconComponent size={40} color={theme.colors.background} />
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
                  <Text style={styles.title}>{categoryTitle}</Text>
                  {categorySubtitle && (
                    <Text style={styles.subtitle}>{categorySubtitle}</Text>
                  )}
                </View>
              </View>

              {/* Toolbar: Apenas SearchBar */}
              <View style={styles.toolbar}>
                <SearchBar
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Buscar uma oração..."
                />
              </View>
            </>
          }
          renderItem={({ item }) => (
            <PrayerCard prayer={item} onPress={() => handlePrayerPress(item.id)} />
          )}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery
                  ? "Nenhuma oração encontrada"
                  : isFavoritesPage
                    ? "Você ainda não tem orações favoritas.\nExplore as categorias e toque no coração para salvar suas orações preferidas aqui."
                    : "Nenhuma oração disponível nesta categoria"}
              </Text>
            </View>
          }
        />

        {/* BottomSheet de Filtros */}
        <FilterBottomSheet
          ref={bottomSheetRef}
          filterType={filterType}
          title={isFavoritesPage ? "Filtrar Favoritos" : "Filtrar Orações"}
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
                ]
              : undefined
          }
          onFilterChange={(filter) => {
            if (
              filter === "ALL" ||
              filter === "FAVORITES" ||
              filter === "BY_AUTHOR" ||
              filter === "BY_SOURCE"
            ) {
              setFilterType(filter);
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}
