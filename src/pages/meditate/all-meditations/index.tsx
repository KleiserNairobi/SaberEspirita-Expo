import React, { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MeditateStackParamList } from "@/routers/types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, Headphones } from "lucide-react-native";

import { useMeditations } from "@/hooks/queries/useMeditations";
import { useAppTheme } from "@/hooks/useAppTheme";
import { SearchBar } from "@/pages/pray/components/SearchBar";
import { getMeditationById } from "@/services/firebase/meditationService";
import { useQueryClient } from "@tanstack/react-query";
import { MeditationCard } from "../components/MeditationCard";
import { createStyles } from "./styles"; // Reaproveita os estilos da lista de reflexos

export default function AllMeditationsScreen() {
  const { theme } = useAppTheme();
  // Reaproveitando o exato mesmo estilo de layout da lista de reflexões
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<MeditateStackParamList>>();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");

  const { data: meditations, isLoading } = useMeditations();

  // Filtrar meditações por texto
  const filteredMeditations = useMemo(() => {
    if (!meditations) return [];

    let result = meditations;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (med) =>
          med.title.toLowerCase().includes(query) ||
          med.author?.toLowerCase().includes(query)
      );
    }
    return result;
  }, [meditations, searchQuery]);

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

                  {/* Compensar layout à direita */}
                  <View style={styles.headerSide} />
                </View>

                <View style={styles.headerTextContainer}>
                  <Text style={styles.title}>Meditações Guiadas</Text>
                  <Text style={styles.subtitle}>Encontre paz através dos sons</Text>
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
                {searchQuery
                  ? "Nenhuma meditação guiada encontrada"
                  : "Nenhuma meditação disponível no momento"}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}
