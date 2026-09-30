import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ArrowLeft, Clock, Plus, Trash2 } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface ChatHeaderProps {
  title: string;
  subtitle: string;
  onClear?: () => void;
  onOpenHistory?: () => void;
}

export function ChatHeader({
  title,
  subtitle,
  onClear,
  onOpenHistory,
}: ChatHeaderProps) {
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
        <ArrowLeft size={20} color={theme.colors.primary} />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.actionsContainer}>
        {onOpenHistory && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onOpenHistory}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Clock size={18} color={theme.colors.primary} />
            </View>
          </TouchableOpacity>
        )}

        {onClear && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onClear}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Plus size={18} color={theme.colors.primary} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

