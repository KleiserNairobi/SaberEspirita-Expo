import React, { useState } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";
import { ArrowLeft } from "lucide-react-native";
import { LeaderboardFilter } from "./components/LeaderboardFilter";
import { LeaderboardPodium } from "./components/Podium";
import { RankingList } from "./components/RankingList";
import { TimeFilter, TimeFilterEnum } from "@/types/leaderboard";
import { useLeaderboard } from "@/hooks/queries/useLeaderboard";
import { useAuthStore } from "@/stores/authStore";

export function LeaderboardScreen() {
  const navigation = useNavigation();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>(TimeFilterEnum.WEEK);

  const { isGuest } = useAuthStore();

  if (isGuest) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ArrowLeft size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Placar</Text>
        </View>
        <View
          style={[
            styles.content,
            { justifyContent: "center", alignItems: "center", padding: 20 },
          ]}
        >
          <Text
            style={[
              theme.text("lg", "semibold"),
              { textAlign: "center", marginBottom: 10 },
            ]}
          >
            Recurso exclusivo para membros
          </Text>
          <Text
            style={[
              theme.text("md", "regular", theme.colors.textSecondary),
              { textAlign: "center", marginBottom: 20 },
            ]}
          >
            Crie uma conta para participar do ranking junto com outros estudantes.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.primary,
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 8,
            }}
            onPress={() => {
              // @ts-ignore
              navigation.navigate("Tabs", { screen: "AccountTab" });
            }}
          >
            <Text style={{ ...theme.text("md", "medium"), color: "#FFFFFF" }}>
              Criar minha conta
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { data: players = [], isLoading } = useLeaderboard(selectedFilter);

  const topThree = players.slice(0, 3);
  const others = players.slice(3);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={theme.colors.primary} />
        </TouchableOpacity>
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
