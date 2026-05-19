import React from "react";

import { Text, TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Calendar, Clock, Star, TrendingUp } from "lucide-react-native";

import { StatCard } from "@/components/StatCard";
import { useAppTheme } from "@/hooks/useAppTheme";
import type { FixStackParamList } from "@/routers/types";
import type { IUserDetailedStats } from "@/types/quiz";

import { createStyles } from "./styles";

/**
 * Propriedades do componente de visão geral de estatísticas
 */
interface OverviewStatsProps {
  stats: IUserDetailedStats;
}

/**
 * Componente que exibe um resumo das estatísticas do usuário em um grid 2x2
 */
export function OverviewStats({ stats }: OverviewStatsProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<FixStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Visão geral</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Leaderboard")}>
          <Text style={styles.viewAllButton}>Ver ranking</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        <View style={styles.row}>
          <View style={styles.card}>
            <StatCard
              icon={Clock}
              label="Total de questões"
              value={stats.totalQuestions.toLocaleString("pt-BR")}
              variant="secondary"
            />
          </View>
          <View style={styles.card}>
            <StatCard
              icon={TrendingUp}
              label="Taxa de acerto"
              value={`${stats.accuracyRate}%`}
              variant="primary"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.card}>
            <StatCard
              icon={Calendar}
              label="Dias ativos"
              value={stats.activeDays}
              variant="secondary"
            />
          </View>
          <View style={styles.card}>
            <StatCard
              icon={Star}
              label="Melhor pontuação"
              value={`${stats.bestScore}%`}
              variant="primary"
            />
          </View>
        </View>
      </View>
    </View>
  );
}
