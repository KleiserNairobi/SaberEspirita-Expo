import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Crown, Calendar, TrendingUp, LucideIcon } from "lucide-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FixStackParamList } from "@/routers/types";
import { useCurrentUserScore } from "@/hooks/queries/useLeaderboard";
import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface ProgressSummaryProps {
  totalCorrect: number;
}

interface StatsCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  iconColor: string;
  iconBg: string;
}

function StatsCard({ icon: Icon, value, label, iconColor, iconBg }: StatsCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
        <Icon size={20} color={iconColor} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export function ProgressSummary({ totalCorrect }: ProgressSummaryProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<FixStackParamList>>();
  const { data: userScore } = useCurrentUserScore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meu Progresso</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Leaderboard")}>
          <Text style={styles.viewAllButton}>Ver Placar Completo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardsContainer}>
        <StatsCard
          icon={Crown}
          value={userScore?.totalAllTime || 0}
          label="Geral"
          iconColor={theme.colors.primary}
          iconBg={theme.colors.primary + "15"}
        />
        <StatsCard
          icon={Calendar}
          value={userScore?.totalThisMonth || 0}
          label="Mês"
          iconColor={theme.colors.primary}
          iconBg={theme.colors.primary + "15"}
        />
        <StatsCard
          icon={TrendingUp}
          value={userScore?.totalThisWeek || 0}
          label="Semana"
          iconColor={theme.colors.primary}
          iconBg={theme.colors.primary + "15"}
        />
      </View>
    </View>
  );
}
