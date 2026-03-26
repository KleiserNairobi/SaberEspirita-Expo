import React from "react";
import { View } from "react-native";
import { AnswerOption } from "@/components/AnswerOption";
import { IQuestion } from "@/types/quiz";
import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface QuestionCardProps {
  question: IQuestion;
  selectedIndex: number | null;
  onSelectAnswer: (index: number) => void;
  showFeedback: boolean; // Mostrar cores após confirmar
}

export function QuestionCard({
  question,
  selectedIndex,
  onSelectAnswer,
  showFeedback,
}: QuestionCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {question.alternatives.map((alternative, index) => {
        const isCorrect = question.correct === index;
        const isSelected = selectedIndex === index;

        return (
          <AnswerOption
            key={index}
            text={alternative}
            // Marcamos a opção como "checked" se for a selecionada pelo usuário
            // OU se o usuário já respondeu e esta for a opção correta (feedback de gabarito)
            checked={showFeedback && (isSelected || (isCorrect && selectedIndex !== null))}
            isCorrect={isCorrect}
            disabled={selectedIndex !== null}
            onPress={() => onSelectAnswer(index)}
          />
        );
      })}
    </View>
  );
}
