import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, Play, Sparkles } from "lucide-react-native";
import { ActivityIndicator } from "react-native";
import { PrayStackParamList } from "@/routers/types";
import { useAppTheme } from "@/hooks/useAppTheme";
import { AmbientEnvironmentCard } from "@/pages/pray/components/AmbientEnvironmentCard";
import { usePrayer } from "@/pages/pray/hooks/usePrayer";

type NavigationProp = NativeStackNavigationProp<PrayStackParamList, "PrayerPrep">;
type RouteParam = RouteProp<PrayStackParamList, "PrayerPrep">;

export function PrayerPrepScreen() {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteParam>();
  const { id } = route.params;
  const { data: prayer, isLoading } = usePrayer(id);

  function handleStartPrayer() {
    navigation.replace("Prayer", { id });
  }

  if (isLoading || !prayer) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
        edges={["top"]}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View
      style={[
        styles.safeArea,
        { backgroundColor: theme.colors.background, paddingTop: insets.top },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerRow}>
          {/* Botão Voltar */}
          <View style={styles.headerSide}>
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: theme.colors.accent }]}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Ícone Central com Anéis */}
          <View style={styles.iconRingsContainer}>
            <View
              style={[styles.ringOuter, { borderColor: theme.colors.primary + "15" }]}
            />
            <View
              style={[styles.ringMiddle, { borderColor: theme.colors.primary + "25" }]}
            />
            <View
              style={[styles.ringInner, { borderColor: theme.colors.primary + "40" }]}
            />
            <View
              style={[
                styles.iconLargeContainer,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Sparkles size={40} color={theme.colors.background} />
            </View>
          </View>

          {/* Espaço para Equilíbrio */}
          <View style={styles.headerSide} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.messageContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{prayer.title}</Text>
          <Text style={[styles.preTitle, { color: theme.colors.primary }]}>
            Que a luz do amparo envolva o seu caminho
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Busque o silêncio interior e respire fundo, deixando as preocupações de lado
            agora. Sinta a presença dos bons espíritos ao seu redor e, se desejar, escolha
            uma melodia para elevar sua vibração. Prepare o coração para este diálogo de
            amor.
          </Text>
        </View>

        <View style={styles.ambientContainer}>
          <AmbientEnvironmentCard variant="selector" />
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            borderTopColor: theme.colors.border,
            backgroundColor: theme.colors.background,
            paddingBottom: Math.max(insets.bottom, 24),
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleStartPrayer}
          activeOpacity={0.8}
        >
          <Play
            size={20}
            color={theme.colors.background}
            fill={theme.colors.background}
          />
          <Text style={[styles.startButtonText, { color: theme.colors.background }]}>
            Iniciar Prece
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerSide: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconRingsContainer: {
    width: 104,
    height: 104,
    alignItems: "center",
    justifyContent: "center",
  },
  ringInner: {
    position: "absolute",
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
  },
  ringMiddle: {
    position: "absolute",
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
  },
  ringOuter: {
    position: "absolute",
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 1,
  },
  iconLargeContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  messageContainer: {
    marginTop: 10,
    marginBottom: 40,
    alignItems: "center",
  },
  preTitle: {
    fontFamily: "Oswald_400Regular",
    fontSize: 18,
    marginBottom: 24,
  },
  title: {
    fontFamily: "BarlowCondensed_400Regular",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: "BarlowCondensed_400Regular",
    fontSize: 18,
    textAlign: "justify",
    lineHeight: 24,
  },
  ambientContainer: {
    marginTop: 0,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderTopWidth: 1,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 16,
    gap: 12,
  },
  startButtonText: {
    fontFamily: "BarlowCondensed_600SemiBold",
    fontSize: 20,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
