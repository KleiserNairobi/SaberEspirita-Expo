import { LucideIcon } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface AssistantCardProps {
  title: string;
  description: string;
  buttonText: string;
  onPress: () => void;
  icon: LucideIcon;
}

export function AssistantCard({
  title,
  description,
  buttonText,
  onPress,
  icon: Icon,
}: AssistantCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {/* Ícone */}
        <View style={styles.iconContainer}>
          <Icon size={20} color={theme.colors.primary} strokeWidth={2} />
        </View>

        {/* Texto + Botão */}
        <View style={styles.textColumn}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={onPress}
            activeOpacity={0.7}
          >
            <Text style={styles.actionText}>{buttonText.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
