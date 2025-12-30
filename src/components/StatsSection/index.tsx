import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Flame, Trophy, Target, TrendingUp } from "lucide-react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { StatCard } from "../StatCard";
import { ITruthOrFalseStats } from "@/types/truthOrFalseStats";

interface StatsSectionProps {
  stats: ITruthOrFalseStats;
}

export function StatsSection({ stats }: StatsSectionProps) {
  const { theme } = useAppTheme();

  const accuracyPercentage =
    stats.totalResponses > 0
      ? Math.round((stats.correctAnswers / stats.totalResponses) * 100)
      : 0;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Suas Estatísticas</Text>

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
              icon={Target}
              label="Total de Respostas"
              value={stats.totalResponses}
              variant="secondary"
            />
          </View>
          <View style={styles.card}>
            <StatCard
              icon={TrendingUp}
              label="Taxa de Acerto"
              value={`${accuracyPercentage}%`}
              variant="primary"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  grid: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  card: {
    flex: 1,
  },
});
