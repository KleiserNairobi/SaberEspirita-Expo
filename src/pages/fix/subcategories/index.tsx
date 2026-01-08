import { useRef, useState } from "react";
import { View, SectionList, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, BookOpen, SlidersHorizontal } from "lucide-react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { useAppTheme } from "@/hooks/useAppTheme";
import { FixStackParamList } from "@/routers/types";
import { useQueryClient } from "@tanstack/react-query";
import {
  useSubcategories,
  useUserQuizProgress,
  QUIZ_KEYS,
} from "@/hooks/queries/useQuiz";
import {
  removeUserCompletedSubcategory,
  removeUserHistory,
} from "@/services/firebase/quizService";
import { useAuthStore } from "@/stores/authStore";
import { useQuizFilterStore } from "@/stores/quizFilterStore";
import { SearchBar } from "@/pages/pray/components/SearchBar";
import { SubcategoryCard } from "./components/SubcategoryCard";
import { QuizRetakeBottomSheet } from "./components/QuizRetakeBottomSheet";
import {
  SubcategoryFilterBottomSheet,
  SubcategoryFilterType,
} from "./components/SubcategoryFilterBottomSheet";
import { createStyles } from "./styles";

type SubcategoriesRouteProp = RouteProp<FixStackParamList, "Subcategories">;
type SubcategoriesNavigationProp = NativeStackNavigationProp<
  FixStackParamList,
  "Subcategories"
>;

export function SubcategoriesScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const route = useRoute<SubcategoriesRouteProp>();
  const navigation = useNavigation<SubcategoriesNavigationProp>();
  const filterBottomSheetRef = useRef<BottomSheetModal>(null);
  const retakeBottomSheetRef = useRef<BottomSheetModal>(null);

  const queryClient = useQueryClient();

  const { categoryId, categoryName } = route.params;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState<{
    id: string;
    name: string;
    desc: string;
  } | null>(null);

  // Usar store global para persistir filtro
  const filterType = useQuizFilterStore((state) => state.getFilter(categoryId));
  const setGlobalFilter = useQuizFilterStore((state) => state.setFilter);

  const { user } = useAuthStore();
  const { data: subcategories, isLoading } = useSubcategories(categoryId);
  const { data: userProgress } = useUserQuizProgress(user?.uid || "");

  // Wrapper para setFilter manter a assinatura
  const setFilterType = (type: SubcategoryFilterType) => {
    setGlobalFilter(categoryId, type);
  };

  function isSubcategoryCompleted(subcategoryId: string) {
    if (!userProgress?.[categoryId]) return false;
    return userProgress[categoryId].includes(subcategoryId);
  }

  // Filtrar subcategorias por busca e status
  const filteredSubcategories =
    subcategories?.filter((sub) => {
      const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
      const isCompleted = isSubcategoryCompleted(sub.id);

      let matchesFilter = true;
      if (filterType === "COMPLETED") matchesFilter = isCompleted;
      if (filterType === "NOT_COMPLETED") matchesFilter = !isCompleted;

      return matchesSearch && matchesFilter;
    }) || [];

  async function handleRetake() {
    if (!selectedQuiz) return;
    const { id: subId, name: subName, desc } = selectedQuiz;

    if (user?.uid) {
      // 1. Remover da lista de completados
      await removeUserCompletedSubcategory(user.uid, categoryId, subId);

      // 2. Remover do histórico e recalcular score
      const userName = user.displayName || user.email?.split("@")[0] || "Usuário";
      await removeUserHistory(user.uid, userName, subId);

      // 3. Atualizar cache local para refletir a mudança imediatamente (remover checkmark)
      await queryClient.invalidateQueries({
        queryKey: QUIZ_KEYS.userProgress(user.uid),
      });

      // 4. Navegar
      navigation.navigate("Quiz", {
        subcategoryId: subId,
        categoryId,
        categoryName,
        subcategoryName: subName,
        subtitle: desc,
      });
      setSelectedQuiz(null);
    }
  }

  function handleSubcategoryPress(
    subcategoryId: string,
    subcategoryName: string,
    subtitle: string
  ) {
    const isCompleted = isSubcategoryCompleted(subcategoryId);

    if (isCompleted) {
      console.log("Quiz completado, abrindo BottomSheet...");
      setSelectedQuiz({ id: subcategoryId, name: subcategoryName, desc: subtitle });

      setTimeout(() => {
        console.log("Chamando present() no ref:", !!retakeBottomSheetRef.current);
        retakeBottomSheetRef.current?.present();
      }, 100);
    } else {
      navigation.navigate("Quiz", {
        subcategoryId,
        categoryId,
        categoryName,
        subcategoryName,
        subtitle,
      });
    }
  }

  function renderSubcategory({ item }: { item: any }) {
    return (
      <View style={{ paddingHorizontal: theme.spacing.lg }}>
        <SubcategoryCard
          title={item.name}
          subtitle={item.description || ""}
          questionCount={item.questionCount}
          completed={isSubcategoryCompleted(item.id)}
          onPress={() =>
            handleSubcategoryPress(item.id, item.name, item.description || "")
          }
        />
      </View>
    );
  }

  function renderEmpty() {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {searchQuery
            ? "Nenhuma subcategoria encontrada"
            : "Nenhuma subcategoria disponível"}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />

      <View style={styles.container}>
        {/* Lista de subcategorias - Header e SearchBar agora rolam junto */}
        <SectionList
          sections={[{ data: filteredSubcategories }]}
          renderItem={renderSubcategory}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={true}
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
                      <BookOpen size={40} color={theme.colors.background} />
                    </View>
                  </View>

                  {/* Coluna Direita: Botão de Filtro */}
                  <View style={styles.headerSide}>
                    <TouchableOpacity
                      style={[
                        styles.filterButton,
                        filterType !== "ALL" && styles.filterButtonActive,
                      ]}
                      onPress={() => filterBottomSheetRef.current?.present()}
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
                  <Text style={styles.title}>{categoryName}</Text>
                  <Text style={styles.subtitle}>
                    Escolha uma subcategoria para começar
                  </Text>
                </View>
              </View>
            </>
          }
          renderSectionHeader={() => (
            /* SearchBar Sticky Header */
            <View style={styles.stickyHeader}>
              <View style={styles.searchContainer}>
                <SearchBar
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Buscar subcategoria..."
                />
              </View>
            </View>
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
        />

        {/* BottomSheet de Filtros */}
        <SubcategoryFilterBottomSheet
          ref={filterBottomSheetRef}
          filterType={filterType}
          onFilterChange={setFilterType}
        />

        {/* BottomSheet de Refazer Quiz */}
        <QuizRetakeBottomSheet ref={retakeBottomSheetRef} onConfirm={handleRetake} />
      </View>
    </SafeAreaView>
  );
}
