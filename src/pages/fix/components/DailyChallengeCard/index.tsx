import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Flame, Trophy, ArrowRight, CheckCircle } from "lucide-react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { FixStackParamList } from "@/routers/types";
import { createStyles } from "./styles";
import { useAuthStore } from "@/stores/authStore";
import {
  useDailyChallengeStatus,
  useUserStreak,
} from "@/hooks/queries/useDailyChallenge";

export function DailyChallengeCard() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<FixStackParamList>>();
  const user = useAuthStore((s) => s.user);

  const { data: isCompleted } = useDailyChallengeStatus(user?.uid);
  const { data: streak } = useUserStreak(user?.uid);

  function handleStartDaily() {
    if (isCompleted) return;

    navigation.navigate("Quiz", {
      categoryId: "DAILY",
      subcategoryId: "DAILY_CHALLENGE",
      categoryName: "Desafio Diário",
      subcategoryName: "Perguntas Aleatórias",
      mode: "daily",
    });
  }

  const containerBg = theme.colors.primary + "10";
  const containerBorder = theme.colors.primary;
  const iconBg = isCompleted ? theme.colors.primary + "20" : theme.colors.primary;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: containerBg,
          borderColor: containerBorder,
        },
      ]}
      onPress={handleStartDaily}
      activeOpacity={0.9}
      disabled={isCompleted}
    >
      {/* Header Row: Icon + Texts */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
          <Trophy size={24} color={isCompleted ? theme.colors.primary : "#FFFFFF"} />
        </View>

        <View style={styles.headerText}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Desafio Diário</Text>
          <Text style={styles.subtitle}>
            {isCompleted ? "Parabéns! Desafio Concluído" : "5 perguntas rápidas"}
          </Text>
        </View>
      </View>

      {/* Body Row: Streak Badge (substituting Tags) */}
      <View style={styles.body}>
        <View style={styles.metadataItem}>
          <Flame size={16} color={theme.colors.primary} fill={theme.colors.primary} />
          <Text style={[styles.metadataText, { color: theme.colors.primary }]}>
            Sequência: {streak || 0} dias
          </Text>
        </View>
      </View>

      {/* Footer Row: Action */}
      {isCompleted ? (
        // Estado Concluído: Link de Texto (Sutil)
        <View style={styles.footer}>
          <Text style={[styles.textLink, { color: theme.colors.success }]}>
            Concluído
          </Text>
          <CheckCircle size={20} color={theme.colors.success} />
        </View>
      ) : (
        // Estado Pendente: Link de Texto (Estilo Image 1 - Reference)
        <View style={styles.footer}>
          <Text style={[styles.textLink, { color: theme.colors.primary }]}>
            Iniciar Agora
          </Text>
          <ArrowRight size={20} color={theme.colors.primary} />
        </View>
      )}
    </TouchableOpacity>
  );
}
