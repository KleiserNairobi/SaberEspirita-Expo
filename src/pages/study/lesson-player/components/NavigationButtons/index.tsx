import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ArrowLeft, ArrowRight } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  isFirstSlide: boolean;
  isLastSlide: boolean;
  onFinish?: () => void;
  finishLabel?: string;
}

export function NavigationButtons({
  onPrevious,
  onNext,
  isFirstSlide,
  isLastSlide,
  onFinish,
  finishLabel = "FINALIZAR AULA",
}: NavigationButtonsProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* Botão Anterior */}
      <TouchableOpacity
        style={[styles.buttonPrevious, isFirstSlide && styles.buttonDisabled]}
        onPress={onPrevious}
        disabled={isFirstSlide}
        activeOpacity={0.7}
      >
        <ArrowLeft
          size={18}
          color={isFirstSlide ? theme.colors.textSecondary : theme.colors.text}
        />
        <Text
          style={[styles.buttonPreviousText, isFirstSlide && styles.buttonDisabledText]}
        >
          Anterior
        </Text>
      </TouchableOpacity>

      {/* Botão Próximo ou Finalizar */}
      {isLastSlide && onFinish ? (
        <TouchableOpacity
          style={styles.buttonFinish}
          onPress={onFinish}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonFinishText}>{finishLabel}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.buttonNext} onPress={onNext} activeOpacity={0.7}>
          <Text style={styles.buttonNextText}>Próximo</Text>
          <ArrowRight size={18} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}
