import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppTheme } from "@/hooks/useAppTheme";

export default function FixPlaceholderScreen() {
  const { theme } = useAppTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Fixe</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Módulo em desenvolvimento
        </Text>
        <Text style={[styles.description, { color: theme.colors.muted }]}>
          Em breve você poderá acessar quizzes e exercícios para fixar seu conhecimento.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 32,
    fontFamily: "Oswald_700Bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "Oswald_400Regular",
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    fontFamily: "BarlowCondensed_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
});
