import React from "react";
import { View, Text } from "react-native";
import { Flame, Trophy, Calendar, TrendingUp } from "lucide-react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { StatCard } from "@/components/StatCard";
import { IDailyChallengeStats } from "@/types/quiz";
import { createStyles } from "./styles";

interface DailyChallengeStatsProps {
  stats: IDailyChallengeStats;
}

export function DailyChallengeStats({ stats }: DailyChallengeStatsProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suas Estatísticas</Text>

      <View style={styles.grid}>
        <View style={styles.row}>
          <View style={styles.card}>
            <StatCard
              icon={Flame}
              label="Sequência Atual"
              value={`${stats.currentStreak} ${stats.currentStreak === 1 ? "dia" : "dias"}`}
              variant="primary"
            />
          </View>
          <View style={styles.card}>
            <StatCard
              icon={Trophy}
              label="Maior Sequência"
              value={`${stats.longestStreak} ${stats.longestStreak === 1 ? "dia" : "dias"}`}
              variant="secondary"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.card}>
            <StatCard
              icon={Calendar}
              label="Total de Desafios"
              value={stats.totalChallenges}
              variant="secondary"
            />
          </View>
          <View style={styles.card}>
            <StatCard
              icon={TrendingUp}
              label="Melhor Resultado"
              value={`${stats.bestAccuracy}%`}
              variant="primary"
            />
          </View>
        </View>
      </View>
    </View>
  );
}
