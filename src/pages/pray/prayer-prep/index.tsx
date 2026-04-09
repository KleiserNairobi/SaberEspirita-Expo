import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, Play } from "lucide-react-native";
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
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={["top"]}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.safeArea, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.colors.accent }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.messageContainer}>
          <Text style={[styles.preTitle, { color: theme.colors.primary }]}>
            Preparando seu coração
          </Text>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {prayer.title}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Busque um lugar calmo e feche os olhos por um momento. Se desejar, escolha um som ambiente para conduzir a sua prece.
          </Text>
        </View>

        <View style={styles.ambientContainer}>
          <AmbientEnvironmentCard variant="selector" />
        </View>
      </ScrollView>

      <View style={[
        styles.footer, 
        { 
          borderTopColor: theme.colors.border, 
          backgroundColor: theme.colors.background,
          paddingBottom: Math.max(insets.bottom, 24)
        }
      ]}>
        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleStartPrayer}
          activeOpacity={0.8}
        >
          <Play size={20} color={theme.colors.background} fill={theme.colors.background} />
          <Text style={[styles.startButtonText, { color: theme.colors.background }]}>
            Entrar em Oração
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
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  messageContainer: {
    marginTop: 40,
    marginBottom: 40,
    alignItems: "center",
  },
  preTitle: {
    fontFamily: "BarlowCondensed_600SemiBold",
    fontSize: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontFamily: "Oswald_700Bold",
    fontSize: 32,
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: "BarlowCondensed_400Regular",
    fontSize: 18,
    textAlign: "center",
    lineHeight: 26,
    paddingHorizontal: 10,
  },
  ambientContainer: {
    marginTop: 20,
  },
  footer: {
    padding: 24,
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
  },
});
