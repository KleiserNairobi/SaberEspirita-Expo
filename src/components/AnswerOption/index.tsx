import React from "react";

import { Text, TouchableOpacity, View } from "react-native";

import { CheckCircle2, XCircle } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";

import { createStyles } from "./styles";

interface AnswerOptionProps {
  text: string;
  checked: boolean;
  isCorrect: boolean;
  disabled: boolean;
  onPress: () => void;
}

export function AnswerOption({
  text,
  checked,
  isCorrect,
  disabled,
  onPress,
}: AnswerOptionProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const containerStyle = [
    styles.container,
    checked && isCorrect && styles.containerSuccess,
    checked && !isCorrect && styles.containerError,
  ];

  // Controle manual
  // Não usa o prop disabled nativo do TouchableOpacity
  // Evite o lock do HyperOS
  function handlePress() {
    if (disabled) return;
    onPress();
  }

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={handlePress}
      activeOpacity={disabled ? 1 : 0.7} // sem feedback visual se desabilitado
    >
      <View style={styles.content}>
        <Text style={styles.text}>{text}</Text>
        <View style={styles.iconContainer}>
          {checked &&
            (isCorrect ? (
              <CheckCircle2 size={20} color={theme.colors.success} />
            ) : (
              <XCircle size={20} color={theme.colors.error} />
            ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}
