import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { FixStackParamList } from "@/routers/types";
import { TruthOrFalseService } from "@/services/firebase/truthOrFalseService";
import { truthOrFalseQuestions } from "@/data/truthOrFalseQuestions";
import { HistoryCard } from "@/components/HistoryCard";
import { IUserTruthOrFalseResponse } from "@/types/userTruthOrFalseResponse";
import { createStyles } from "./styles";

type NavigationProp = NativeStackNavigationProp<FixStackParamList>;

export function TruthOrFalseHistoryScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<IUserTruthOrFalseResponse[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      setLoading(true);
      const data = await TruthOrFalseService.getHistory(50);
      setHistory(data);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleCardPress(response: IUserTruthOrFalseResponse) {
    navigation.navigate("TruthOrFalseResult", {
      userAnswer: response.userAnswer,
      isCorrect: response.isCorrect,
      questionId: response.questionId,
      origin: "history",
    });
  }

  function renderItem({ item }: { item: IUserTruthOrFalseResponse }) {
    const question = truthOrFalseQuestions.find((q) => q.id === item.questionId);

    if (!question) return null;

    return (
      <HistoryCard
        response={item}
        questionText={question.question}
        questionTopic={question.topic}
        questionDifficulty={question.difficulty}
        onPress={() => handleCardPress(item)}
      />
    );
  }

  function renderEmpty() {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Você ainda não respondeu nenhuma pergunta.</Text>
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => navigation.navigate("TruthOrFalseHome")}
          activeOpacity={0.8}
        >
          <Text style={styles.emptyButtonText}>Começar Agora</Text>
        </TouchableOpacity>
      </View>
    );
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
          <Text style={styles.title}>Histórico</Text>
          <Text style={styles.subtitle}>
            {history.length} {history.length === 1 ? "resposta" : "respostas"}
          </Text>
        </View>
      </View>

      {/* Lista */}
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
