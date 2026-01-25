import React, { useState } from "react";
import { View, ScrollView, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";
import { ArrowLeft } from "lucide-react-native";
import { IconButton } from "@/components/IconButton";
import { LeaderboardFilter } from "./components/LeaderboardFilter";
import { LeaderboardPodium } from "./components/Podium";
import { RankingList } from "./components/RankingList";
import { TimeFilter, TimeFilterEnum } from "@/types/leaderboard";
import { useLeaderboard } from "@/hooks/queries/useLeaderboard";

export function LeaderboardScreen() {
  const navigation = useNavigation();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>(TimeFilterEnum.WEEK);

  const { data: players = [], isLoading } = useLeaderboard(selectedFilter);

  const topThree = players.slice(0, 3);
  const others = players.slice(3);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon={ArrowLeft}
          onPress={() => navigation.goBack()}
          size={24}
          color={theme.colors.text}
        />
        <Text style={styles.headerTitle}>Placar</Text>
      </View>

      {/* Filter */}
      <LeaderboardFilter
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />

      {/* Content */}
      <View style={styles.content}>
        {isLoading && players.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Carregando ranking...</Text>
          </View>
        ) : players.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Nenhum registro ainda</Text>
            <Text style={styles.emptyMessage}>
              {selectedFilter === TimeFilterEnum.WEEK
                ? "Seja o primeiro a responder um quiz esta semana!"
                : selectedFilter === TimeFilterEnum.MONTH
                  ? "Seja o primeiro a responder um quiz este mês!"
                  : "Ainda não há registros no ranking geral."}
            </Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Top 3 Podium */}
            <LeaderboardPodium players={topThree} />

            {/* List for the rest */}
            {others.map((player) => (
              <RankingList key={player.userId} player={player} />
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
