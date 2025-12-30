import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, Filter } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { FixStackParamList } from "@/routers/types";
import { TruthOrFalseService } from "@/services/firebase/truthOrFalseService";
import { truthOrFalseQuestions } from "@/data/truthOrFalseQuestions";
import { HistoryCard } from "@/components/HistoryCard";
import { IUserTruthOrFalseResponse } from "@/types/userTruthOrFalseResponse";

type NavigationProp = NativeStackNavigationProp<FixStackParamList>;

export function TruthOrFalseHistoryScreen() {
  const { theme } = useAppTheme();
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
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          Você ainda não respondeu nenhuma pergunta.
        </Text>
        <TouchableOpacity
          style={[styles.emptyButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate("TruthOrFalseHome")}
        >
          <Text style={styles.emptyButtonText}>Começar Agora</Text>
        </TouchableOpacity>
      </View>
    );
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.colors.card }]}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Histórico</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {history.length} {history.length === 1 ? "resposta" : "respostas"}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: theme.colors.card }]}
          onPress={() => {
            // TODO: Implementar filtros
            console.log("Filtros");
          }}
        >
          <Filter size={24} color={theme.colors.text} />
        </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
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
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
