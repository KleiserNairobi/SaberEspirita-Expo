import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, Home, HelpCircle, Tag } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";

import { useAppTheme } from "@/hooks/useAppTheme";
import { FixStackParamList } from "@/routers/types";
import { truthOrFalseQuestions } from "@/data/truthOrFalseQuestions";
import { ResultFeedback } from "@/components/ResultFeedback";
import { DifficultyBadge } from "@/components/DifficultyBadge";
// TODO: Imports comentados temporariamente (funcionalidade "Salvar para Revisar")
// import { BookmarkPlus, BookmarkCheck } from "lucide-react-native";
// import { Alert } from "react-native";
// import { TruthOrFalseService } from "@/services/firebase/truthOrFalseService";
import { createStyles } from "./styles";

type NavigationProp = NativeStackNavigationProp<FixStackParamList>;
type RoutePropType = RouteProp<FixStackParamList, "TruthOrFalseResult">;

export function TruthOrFalseResultScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();

  const { userAnswer, isCorrect, questionId, origin } = route.params;
  const question = truthOrFalseQuestions.find((q) => q.id === questionId);

  // ...

  function handleGoBack() {
    // Sempre usa goBack() para manter a navegação natural da pilha
    // Exceto quando vem do histórico, que já usa goBack()
    navigation.goBack();
  }

  function handleGoHome() {
    navigation.navigate("TruthOrFalseHome");
  }

  if (!question) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <StatusBar style={theme.isDark ? "light" : "dark"} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Pergunta não encontrada</Text>
          <TouchableOpacity style={styles.errorButton} onPress={handleGoHome}>
            <Text style={styles.errorButtonText}>Voltar ao Início</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color={theme.colors.muted} />
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Resultado</Text>
            <Text style={styles.headerSubtitle}>
              {isCorrect ? "Parabéns! Você acertou!" : "Ops! Você errou."}
            </Text>
          </View>

          {/* TODO: Botão "Salvar para Revisar" comentado temporariamente */}
          {/* Aguardando implementação da tela "Biblioteca" */}
          {/* <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveToLibrary}
            activeOpacity={0.7}
            disabled={isSaved || isSaving}
          >
            {isSaved ? (
              <BookmarkCheck size={20} color={theme.colors.muted} />
            ) : (
              <BookmarkPlus size={20} color={theme.colors.muted} />
            )}
          </TouchableOpacity> */}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Pergunta Card - Estilo FAQ */}
        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <View style={styles.iconContainer}>
              <HelpCircle size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.questionTextContainer}>
              <Text style={styles.question}>{question.question}</Text>
            </View>
          </View>

          {/* <View style={styles.metadata}> */}
          {/* Tópico - Estilo Medite */}
          {/* <View style={styles.metadataItem}>
              <Tag size={16} color={theme.colors.muted} />
              <Text style={styles.metadataText} numberOfLines={1}>
                {question.topic}
              </Text>
            </View> */}

          {/* Dificuldade - Badge com Estrelas */}
          {/* <DifficultyBadge level={question.difficulty} /> */}
          {/* </View> */}
        </View>

        {/* Feedback */}
        <ResultFeedback
          isCorrect={isCorrect}
          userAnswer={userAnswer}
          correctAnswer={question.correct}
        />

        {/* Explicação */}
        <View style={styles.explanationCard}>
          <Text style={styles.explanationTitle}>Explicação</Text>
          <Text style={styles.explanationText}>{question.explanation}</Text>
          {question.reference && (
            <View style={styles.referenceContainer}>
              <Text style={styles.referenceLabel}>Referência:</Text>
              <Text style={styles.referenceText}>{question.reference}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
