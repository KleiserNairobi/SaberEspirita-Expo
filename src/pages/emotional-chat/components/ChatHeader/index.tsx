import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ArrowLeft, Trash2 } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface ChatHeaderProps {
  title: string;
  subtitle: string;
  onClear?: () => void;
}

export function ChatHeader({ title, subtitle, onClear }: ChatHeaderProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <ArrowLeft size={24} color={theme.colors.text} />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {onClear && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={onClear}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Trash2 size={18} color={theme.colors.primary} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}
