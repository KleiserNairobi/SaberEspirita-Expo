import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Flame, Trophy, Target, TrendingUp } from "lucide-react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { StatCard } from "../StatCard";
import { ITruthOrFalseStats } from "@/types/truthOrFalseStats";
import { createStyles } from "./styles";

interface StatsSectionProps {
  stats: ITruthOrFalseStats;
}

export function StatsSection({ stats }: StatsSectionProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const accuracyPercentage =
    stats.totalResponses > 0
      ? Math.round((stats.correctAnswers / stats.totalResponses) * 100)
      : 0;

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
