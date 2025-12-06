import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Index() {
  const { user, loading, initialized } = useAuth();

  console.log("PASSANDO PELO INDEX");

  console.log(
    "User in Index:",
    user,
    "Loading:",
    loading,
    "Initialized:",
    initialized
  );

  // Mostra um loading screen enquanto o auth está sendo inicializado
  if (loading || !initialized) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Redireciona baseado no estado de autenticação
  return (
    <Redirect
      href={user ? "/(private)/(tabs)/Study/Tela1" : "/(public)/Login"}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
