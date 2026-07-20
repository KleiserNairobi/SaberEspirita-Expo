import React, { useMemo, useState, useRef } from "react";
import { Image } from "expo-image";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { AppStackParamList } from "@/routers/types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ArrowLeft,
  Clock,
  ListMusic,
  Mic,
  SlidersHorizontal,
  Timer,
  User,
} from "lucide-react-native";

import { PODCAST_KEYS, usePodcasts } from "@/hooks/queries/usePodcasts";
import { useAppTheme } from "@/hooks/useAppTheme";
import { FilterBottomSheet } from "@/pages/pray/components/FilterBottomSheet";
import { SearchBar } from "@/pages/pray/components/SearchBar";
import { getPodcastById } from "@/services/firebase/podcastService";
import { usePodcastPlayerStore } from "@/stores/podcastPlayerStore";
import { ContentFilterType } from "@/types/prayer";
import { useQueryClient } from "@tanstack/react-query";
import { PodcastCard } from "../components/PodcastCard";
import { createStyles } from "./styles";

const PODCAST_FILTER_OPTIONS = [
  { id: "ALL" as ContentFilterType, label: "Todos", icon: ListMusic },
  { id: "BY_AUTHOR" as ContentFilterType, label: "Por Autor", icon: User },
  { id: "MINUTES_SHORT" as ContentFilterType, label: "Curtos (Até 10 min)", icon: Timer },
  { id: "MINUTES_LONG" as ContentFilterType, label: "Longos (+10 min)", icon: Clock },
] as const;

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export default function AllPodcastsScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NavigationProp>();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<ContentFilterType>("ALL");
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const { data: podcasts, isLoading } = usePodcasts();
  const setCurrentPodcast = usePodcastPlayerStore((s) => s.setCurrentPodcast);

  // Filtrar podcasts por texto e seleção do sheet
  const filteredPodcasts = useMemo(() => {
    if (!podcasts) return [];

    let result = [...podcasts];

    // Aplicar Filtro do Bottom Sheet
    switch (filterType) {
      case "BY_AUTHOR":
        result = result
          .filter((p) => p.author)
          .sort((a, b) => {
            const authorA = a.author?.toLowerCase() || "";
            const authorB = b.author?.toLowerCase() || "";
            return authorA.localeCompare(authorB);
          });
        break;
      case "MINUTES_SHORT":
        result = result.filter((p) => p.durationMinutes <= 10);
        break;
      case "MINUTES_LONG":
        result = result.filter((p) => p.durationMinutes > 10);
        break;
      case "ALL":
      default:
        break;
    }

    // Busca Textual
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (pod) =>
          pod.title.toLowerCase().includes(query) ||
          pod.author?.toLowerCase().includes(query)
      );
    }
    return result;
  }, [podcasts, searchQuery, filterType]);

  function handlePodcastPress(podId: string) {
    // Alimenta a store com o objeto completo para evitar fetch do Firestore no player
    const found = podcasts?.find((p) => p.id === podId);
    if (found) setCurrentPodcast(found);
    navigation.navigate("PodcastPlayer", { id: podId });
  }

  function prefetchPodcast(id: string, imageUrl?: string) {
    queryClient.prefetchQuery({
      queryKey: PODCAST_KEYS.detail(id),
      queryFn: () => getPodcastById(id),
      staleTime: 1000 * 60 * 60 * 24, // 24 horas
    });
    if (imageUrl) Image.prefetch(imageUrl);
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
        <FlatList
          data={filteredPodcasts}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <>
              {/* Header Base */}
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

                  {/* Ícone Central */}
                  <View style={styles.iconRingsContainer}>
                    <View style={styles.ringOuter} />
                    <View style={styles.ringMiddle} />
                    <View style={styles.ringInner} />
                    <View style={styles.iconLargeContainer}>
                      <Mic size={40} color={theme.colors.background} />
                    </View>
                  </View>

                  {/* Botão de Filtro à direita */}
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

                <View style={styles.headerTextContainer}>
                  <Text style={styles.title}>Podcasts</Text>
                  <Text style={styles.subtitle}>
                    Doutrina Espírita em áudio
                  </Text>
                </View>
              </View>

              {/* Barra de Busca */}
              <View style={styles.toolbar}>
                <SearchBar
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Buscar episódio ou autor..."
                />
              </View>
            </>
          }
          renderItem={({ item }) => (
            <View onTouchStart={() => prefetchPodcast(item.id, item.imageUrl)}>
              <PodcastCard
                podcast={item}
                onPress={() => handlePodcastPress(item.id)}
              />
            </View>
          )}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery || filterType !== "ALL"
                  ? "Nenhum podcast encontrado para os filtros atuais"
                  : "Nenhum episódio disponível no momento"}
              </Text>
            </View>
          }
        />

        {/* BottomSheet de Filtros */}
        <FilterBottomSheet
          ref={bottomSheetRef}
          filterType={filterType}
          onFilterChange={setFilterType}
          title="Filtrar Podcasts"
          filterOptions={PODCAST_FILTER_OPTIONS}
        />
      </View>
    </SafeAreaView>
  );
}
