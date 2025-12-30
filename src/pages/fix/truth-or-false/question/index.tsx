import React, { useState, useEffect } from "react";
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
import { ArrowLeft, Check, X } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { FixStackParamList } from "@/routers/types";
import { TruthOrFalseService } from "@/services/firebase/truthOrFalseService";
import { truthOrFalseQuestions } from "@/data/truthOrFalseQuestions";
import { getDayOfYear, getTodayString } from "@/utils/truthOrFalseUtils";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { TopicTag } from "@/components/TopicTag";
import { AnswerButton } from "@/components/AnswerButton";

type NavigationProp = NativeStackNavigationProp<FixStackParamList>;

export function TruthOrFalseQuestionScreen() {
  const { theme } = useAppTheme();
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [answering, setAnswering] = useState(false);

  const todayQuestion =
    truthOrFalseQuestions[getDayOfYear() % truthOrFalseQuestions.length];

  useEffect(() => {
    checkIfAnswered();
  }, []);

  async function checkIfAnswered() {
    try {
      const answered = await TruthOrFalseService.hasRespondedToday();
      setHasAnswered(answered);

      if (answered) {
        // Se já respondeu, vai direto para o resultado
        const response = await TruthOrFalseService.getTodayResponse();
        if (response) {
          navigation.replace("TruthOrFalseResult", {
            userAnswer: response.userAnswer,
            isCorrect: response.isCorrect,
            questionId: response.questionId,
          });
        }
      }
    } catch (error) {
      console.error("Erro ao verificar resposta:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAnswer(userAnswer: boolean) {
    if (answering || hasAnswered) return;

    try {
      setAnswering(true);
      const isCorrect = userAnswer === todayQuestion.correct;
      const responseId = `${getTodayString()}_${todayQuestion.id}`;

      await TruthOrFalseService.saveResponse({
        id: responseId,
        userId: "", // será preenchido pelo service
        questionId: todayQuestion.id,
        userAnswer,
        isCorrect,
        timeSpent: 0, // pode implementar timer depois
        respondedAt: new Date(),
        savedToLibrary: false,
      });

      navigation.navigate("TruthOrFalseResult", {
        userAnswer,
        isCorrect,
        questionId: todayQuestion.id,
      });
    } catch (error) {
      console.error("Erro ao salvar resposta:", error);
    } finally {
      setAnswering(false);
    }
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
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Desafio de Hoje
          </Text>
        </View>

        {/* Badges */}
        <View style={styles.badges}>
          <TopicTag topic={todayQuestion.topic} />
          <DifficultyBadge level={todayQuestion.difficulty} />
        </View>

        {/* Pergunta */}
        <View style={[styles.questionCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.question, { color: theme.colors.text }]}>
            {todayQuestion.question}
          </Text>
        </View>

        {/* Botões de Resposta */}
        <View style={styles.answersContainer}>
          <AnswerButton
            type="truth"
            icon={Check}
            label="VERDADE"
            onPress={() => handleAnswer(true)}
            disabled={answering}
          />
          <AnswerButton
            type="false"
            icon={X}
            label="MENTIRA"
            onPress={() => handleAnswer(false)}
            disabled={answering}
          />
        </View>

        {answering && (
          <View style={styles.answeringContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={[styles.answeringText, { color: theme.colors.textSecondary }]}>
              Salvando resposta...
            </Text>
          </View>
        )}
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
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  questionCard: {
    padding: 24,
    borderRadius: 16,
    minHeight: 200,
    justifyContent: "center",
  },
  question: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: "center",
  },
  answersContainer: {
    gap: 16,
  },
  answeringContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
  },
  answeringText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
