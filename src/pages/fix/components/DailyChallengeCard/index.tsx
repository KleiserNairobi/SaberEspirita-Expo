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

  // Cores dinâmicas baseadas no tema e estado
  const containerBg = theme.colors.primary + "10"; // 10% opacity
  const containerBorder = theme.colors.primary;
  const iconBg = isCompleted ? theme.colors.primary + "20" : theme.colors.primary;

  // Ícone principal agora é o Troféu para manter contexto de gamificação, ou Flame se preferir.
  // No layout de referência, o ícone muda quando completado? O código de referência usa BookOpen vs Calendar.
  // Vamos usar Trophy sempre ou CheckCircle?
  // O usuário pede "estilo do card Desafio de Hoje".

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
        // Estado Concluído: Botão Grande (Estilo Image 0)
        <View style={[styles.completedButton, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.completedButtonText}>Concluído</Text>
          <CheckCircle size={16} color="#FFFFFF" style={styles.buttonIcon} />
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
