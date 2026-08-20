import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Timestamp } from "firebase/firestore";
import { ArrowLeft, Check, HelpCircle, X } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AnswerButton } from "@/components/AnswerButton";
import { truthOrFalseQuestions } from "@/data/truthOrFalseQuestions";
import { useSaveTruthOrFalseResponse } from "@/hooks/queries/useTruthOrFalse";
import { useAppTheme } from "@/hooks/useAppTheme";
import { FixStackParamList } from "@/routers/types";
import { truthOrFalseApiService } from "@/services/api/truthOrFalseApiService";
import { getDayOfYear, getTodayString } from "@/utils/truthOrFalseUtils";

import { createStyles } from "./styles";

type NavigationProp = NativeStackNavigationProp<FixStackParamList>;

export function TruthOrFalseQuestionScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [hasAnswered, setHasAnswered] = useState(false);

  const { mutateAsync: saveResponse, isPending: answering } =
    useSaveTruthOrFalseResponse();

  const todayQuestion =
    truthOrFalseQuestions[getDayOfYear() % truthOrFalseQuestions.length];

  useEffect(() => {
    checkIfAnswered();
  }, []);

  async function checkIfAnswered() {
    try {
      const homeData = await truthOrFalseApiService.getHomeData();
      setHasAnswered(homeData.hasAnswered);

      if (homeData.hasAnswered && homeData.todayResponse) {
        // Se já respondeu, vai direto para o resultado
        navigation.replace("TruthOrFalseResult", {
          userAnswer: homeData.todayResponse.userAnswer,
          isCorrect: homeData.todayResponse.isCorrect,
          questionId: homeData.todayResponse.questionId,
          origin: "home",
        });
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
      const isCorrect = userAnswer === todayQuestion.correct;
      const responseId = `${getTodayString()}_${todayQuestion.id}`;

      await saveResponse({
        id: responseId,
        userId: "", // será preenchido pelo service
        questionId: todayQuestion.id,
        userAnswer,
        isCorrect,
        timeSpent: 0, // pode implementar timer depois
        respondedAt: Timestamp.now(),
        savedToLibrary: false,
      });

      navigation.navigate("TruthOrFalseResult", {
        userAnswer,
        isCorrect,
        questionId: todayQuestion.id,
        origin: "home",
      });
    } catch (error) {
      console.error("Erro ao salvar resposta:", error);
    }
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
          <Text style={styles.title}>Desafio de Hoje</Text>
        </View>

        {/* Question Card - FAQ Style */}
        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <View style={styles.iconContainer}>
              <HelpCircle size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.questionTextContainer}>
              <Text style={styles.question}>{todayQuestion.question}</Text>
            </View>
          </View>

          {/* <View style={styles.metadata}> */}
          {/* Tópico */}
          {/* <View style={styles.metadataItem}>
              <Tag size={16} color={theme.colors.muted} />
              <Text style={styles.metadataText} numberOfLines={1}>
                {todayQuestion.topic}
              </Text>
            </View> */}

          {/* Dificuldade */}
          {/* <DifficultyBadge level={todayQuestion.difficulty} /> */}
          {/* </View> */}
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
            <Text style={styles.answeringText}>Salvando resposta...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
