import { useAppTheme } from "@/hooks/useAppTheme";
import { CheckCircle2, XCircle } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
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

  // const textStyle = [
  //   styles.text,
  //   checked && styles.textChecked,
  //   checked && isCorrect && styles.textSuccess,
  //   checked && !isCorrect && styles.textError,
  // ];

  return (
    <TouchableOpacity
      style={containerStyle}
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.7}
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
