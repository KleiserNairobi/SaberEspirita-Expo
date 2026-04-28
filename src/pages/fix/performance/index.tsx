import React from "react";

import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, BarChart2, ChevronRight } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useUserDetailedStats } from "@/hooks/queries/useQuiz";
import { useAppTheme } from "@/hooks/useAppTheme";
import type { FixStackParamList } from "@/routers/types";
import { useAuthStore } from "@/stores/authStore";

import { CategoryProgressList } from "./components/CategoryProgressList";
import { OverviewStats } from "./components/OverviewStats";
import { createStyles } from "./styles";

/**
 * Tela de desempenho detalhado do usuário.
 * Exibe estatísticas gerais e progresso por categoria.
 */
export function PerformanceScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<FixStackParamList>>();
  const user = useAuthStore((s) => s.user);

  // Busca estatísticas detalhadas via TanStack Query
  const { data: stats, isLoading } = useUserDetailedStats(user?.uid || "");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={theme.colors.muted} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>Meu Desempenho</Text>
          <Text style={styles.subtitle}>Seu progresso nos quizzes</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading && !stats ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Processando estatísticas...</Text>
          </View>
        ) : (
          <>
            {/* Visão Geral */}
            {stats && (
              <View style={styles.section}>
                <OverviewStats stats={stats} />
              </View>
            )}

            {/* Por Categoria */}
            {stats && stats.categoriesProgress.length > 0 && (
              <View style={styles.section}>
                <CategoryProgressList categories={stats.categoriesProgress} />
              </View>
            )}

            {/* Ver Ranking Button */}
            <TouchableOpacity
              style={styles.rankingButton}
              onPress={() => navigation.navigate("Leaderboard")}
              activeOpacity={0.7}
            >
              <View style={styles.rankingInfo}>
                <View style={styles.rankingIconContainer}>
                  <BarChart2 size={20} color={theme.colors.primary} />
                </View>
                <View>
                  <Text style={styles.rankingTitle}>Ver ranking</Text>
                  <Text style={styles.rankingSubtitle}>Compare com outros usuários</Text>
                </View>
              </View>
              <ChevronRight size={20} color={theme.colors.muted} />
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
