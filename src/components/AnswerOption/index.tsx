import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
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

  return (
    <TouchableOpacity
      style={containerStyle}
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={[styles.text, checked && styles.textChecked]}>{text}</Text>
        {checked && (
          <View style={styles.iconContainer}>
            {isCorrect ? (
              <CheckCircle2 size={20} color={theme.colors.success} />
            ) : (
              <XCircle size={20} color={theme.colors.error} />
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
