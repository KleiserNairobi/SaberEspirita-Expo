import { router } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";

export default function Tela3() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Perfil - Tela 3</Text>
      <Button title="Voltar para Tela 2" onPress={() => router.back()} />
    </View>
  );
}
