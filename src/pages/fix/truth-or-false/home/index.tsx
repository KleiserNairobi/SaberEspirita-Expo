import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, History } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { FixStackParamList } from "@/routers/types";
import { TruthOrFalseService } from "@/services/firebase/truthOrFalseService";
import { truthOrFalseQuestions } from "@/data/truthOrFalseQuestions";
import { getDayOfYear } from "@/utils/truthOrFalseUtils";
import { StatsSection } from "@/components/StatsSection";
import { DailyChallengeCard } from "@/components/DailyChallengeCard";
import { getDefaultStats } from "@/types/truthOrFalseStats";

type NavigationProp = NativeStackNavigationProp<FixStackParamList>;

export function TruthOrFalseHomeScreen() {
  const { theme } = useAppTheme();
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [stats, setStats] = useState(getDefaultStats());

  const todayQuestion =
    truthOrFalseQuestions[getDayOfYear() % truthOrFalseQuestions.length];

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [answered, userStats] = await Promise.all([
        TruthOrFalseService.hasRespondedToday(),
        TruthOrFalseService.getStats(),
      ]);
      setHasAnswered(answered);
      setStats(userStats);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleDailyChallengePress() {
    navigation.navigate("TruthOrFalseQuestion");
  }

  function handleHistoryPress() {
    navigation.navigate("TruthOrFalseHistory");
  }

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: theme.colors.card }]}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Verdade ou Mentira
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Teste seus conhecimentos espíritas
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.historyButton, { backgroundColor: theme.colors.card }]}
            onPress={handleHistoryPress}
          >
            <History size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Desafio Diário */}
        <View style={styles.section}>
          <DailyChallengeCard
            topic={todayQuestion.topic}
            difficulty={todayQuestion.difficulty}
            hasAnswered={hasAnswered}
            onPress={handleDailyChallengePress}
          />
        </View>

        {/* Estatísticas */}
        <View style={styles.section}>
          <StatsSection stats={stats} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 20,
    gap: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  historyButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    gap: 16,
  },
});
