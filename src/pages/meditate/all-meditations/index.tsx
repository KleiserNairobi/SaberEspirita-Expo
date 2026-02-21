import React, { useMemo, useState, useRef } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { MeditateStackParamList } from "@/routers/types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ArrowLeft,
  Headphones,
  SlidersHorizontal,
  ListMusic,
  User,
  Clock,
  Timer,
} from "lucide-react-native";

import { useMeditations } from "@/hooks/queries/useMeditations";
import { useAppTheme } from "@/hooks/useAppTheme";
import { SearchBar } from "@/pages/pray/components/SearchBar";
import { getMeditationById } from "@/services/firebase/meditationService";
import { useQueryClient } from "@tanstack/react-query";
import { MeditationCard } from "../components/MeditationCard";
import { FilterBottomSheet } from "@/pages/pray/components/FilterBottomSheet";
import { ContentFilterType } from "@/types/prayer";
import { createStyles } from "./styles"; // Reaproveita os estilos da lista de reflexos

const MEDITATION_FILTER_OPTIONS = [
  { id: "ALL" as ContentFilterType, label: "Todas", icon: ListMusic },
  { id: "BY_AUTHOR" as ContentFilterType, label: "Por Autor", icon: User },
  { id: "MINUTES_SHORT" as ContentFilterType, label: "Curtas (Até 5 min)", icon: Timer },
  { id: "MINUTES_LONG" as ContentFilterType, label: "Longas (+5 min)", icon: Clock },
] as const;

export default function AllMeditationsScreen() {
  const { theme } = useAppTheme();
  // Reaproveitando o exato mesmo estilo de layout da lista de reflexões
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<MeditateStackParamList>>();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<ContentFilterType>("ALL");
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const { data: meditations, isLoading } = useMeditations();

  // Filtrar meditações por texto e seleção do sheet
  const filteredMeditations = useMemo(() => {
    if (!meditations) return [];

    let result = [...meditations];

    // Aplicar Filtro do Bottom Sheet
    switch (filterType) {
      case "BY_AUTHOR":
        result = result
          .filter((m) => m.author)
          .sort((a, b) => {
            const authorA = a.author?.toLowerCase() || "";
            const authorB = b.author?.toLowerCase() || "";
            return authorA.localeCompare(authorB);
          });
        break;
      case "MINUTES_SHORT":
        result = result.filter((m) => m.durationMinutes <= 5);
        break;
      case "MINUTES_LONG":
        result = result.filter((m) => m.durationMinutes > 5);
        break;
      case "ALL":
      default:
        break;
    }

    // Busca Textual
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (med) =>
          med.title.toLowerCase().includes(query) ||
          med.author?.toLowerCase().includes(query)
      );
    }
    return result;
  }, [meditations, searchQuery, filterType]);

  function handleMeditationPress(medId: string) {
    navigation.navigate("MeditationPlayer", { id: medId });
  }

  function prefetchMeditation(id: string) {
    queryClient.prefetchQuery({
      queryKey: ["meditations", "detail", id],
      queryFn: () => getMeditationById(id),
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
        <FlatList
          data={filteredMeditations}
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
                      <Headphones size={40} color={theme.colors.background} />
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
                  <Text style={styles.title}>Meditações Guiadas</Text>
                  <Text style={styles.subtitle}>
                    Silencie a mente e eleve o pensamento
                  </Text>
                </View>
              </View>

              {/* Barra de Busca */}
              <View style={styles.toolbar}>
                <SearchBar
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Buscar meditação ou autor..."
                />
              </View>
            </>
          }
          renderItem={({ item }) => (
            <View onTouchStart={() => prefetchMeditation(item.id)}>
              <MeditationCard
                meditation={item}
                onPress={() => handleMeditationPress(item.id)}
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
                  ? "Nenhuma meditação guiada encontrada para os filtros atuais"
                  : "Nenhuma meditação disponível no momento"}
              </Text>
            </View>
          }
        />

        {/* BottomSheet de Filtros */}
        <FilterBottomSheet
          ref={bottomSheetRef}
          filterType={filterType}
          onFilterChange={setFilterType}
          title="Filtrar Meditações"
          filterOptions={MEDITATION_FILTER_OPTIONS}
        />
      </View>
    </SafeAreaView>
  );
}
