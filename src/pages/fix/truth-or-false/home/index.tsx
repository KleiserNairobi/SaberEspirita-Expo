import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
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
import { createStyles } from "./styles";

type NavigationProp = NativeStackNavigationProp<FixStackParamList>;

export function TruthOrFalseHomeScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [stats, setStats] = useState(getDefaultStats());

  const todayQuestion =
    truthOrFalseQuestions[getDayOfYear() % truthOrFalseQuestions.length];

  // Usando useFocusEffect para recarregar os dados sempre que a tela ganhar foco
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

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
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color={theme.colors.muted} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>Verdade ou Mentira</Text>
            <Text style={styles.subtitle}>Teste seus conhecimentos espíritas</Text>
          </View>
          <TouchableOpacity
            style={styles.historyButton}
            onPress={handleHistoryPress}
            activeOpacity={0.7}
          >
            <History size={20} color={theme.colors.muted} />
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
