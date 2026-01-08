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
      {question.alternatives.map((alternative, index) => (
        <AnswerOption
          key={index}
          text={alternative}
          checked={showFeedback && selectedIndex === index}
          isCorrect={question.correct === index}
          disabled={selectedIndex !== null}
          onPress={() => onSelectAnswer(index)}
        />
      ))}
    </View>
  );
}
