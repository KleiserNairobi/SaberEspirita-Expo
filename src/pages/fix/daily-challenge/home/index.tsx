import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";
import {
  useDailyChallengeStats,
  useDailyChallengeStatus,
} from "@/hooks/queries/useDailyChallenge";
import { useAppTheme } from "@/hooks/useAppTheme";
import { DailyChallengeCard } from "@/pages/fix/components/DailyChallengeCard";
import { FixStackParamList } from "@/routers/types";
import { useAuthStore } from "@/stores/authStore";
import { DailyChallengeStats } from "../components/DailyChallengeStats";
import { createStyles } from "./styles";

type NavigationProp = NativeStackNavigationProp<FixStackParamList>;

export function DailyQuizHomeScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore((s) => s.user);

  const messageSheetRef = React.useRef<BottomSheetModal>(null);
  const [messageConfig, setMessageConfig] =
    React.useState<BottomSheetMessageConfig | null>(null);

  const { data: stats, isLoading, refetch } = useDailyChallengeStats(user?.uid);
  const { data: isCompleted } = useDailyChallengeStatus(user?.uid);

  function handleStartQuiz() {
    if (isCompleted) {
      setMessageConfig({
        type: "info",
        title: "Desafio Concluído",
        message:
          "Você já respondeu o desafio de hoje!\n Volte amanhã para um novo desafio.",
        primaryButton: {
          label: "Entendido",
          onPress: () => messageSheetRef.current?.dismiss(),
        },
      });
      setTimeout(() => messageSheetRef.current?.present(), 100);
      return;
    }
    navigation.navigate("DailyQuiz");
  }

  // Recarregar os dados sempre que a tela ganhar foco
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (isLoading && !stats) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate("FixHome")}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color={theme.colors.muted} />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.title}>Desafio Diário</Text>
              <Text style={styles.subtitle}>Teste seus conhecimentos todo dia</Text>
            </View>
          </View>

          {/* Card do Desafio */}
          <View style={styles.section}>
            <DailyChallengeCard onPress={handleStartQuiz} />
          </View>

          {/* Estatísticas */}
          {stats && (
            <View style={styles.section}>
              <DailyChallengeStats stats={stats} />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      <BottomSheetMessage ref={messageSheetRef} config={messageConfig} />
    </>
  );
}
