import { router } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";

export default function Tela2() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Meditar - Tela 2</Text>
      <Button
        title="Ir para Tela 3"
        onPress={() => router.push("/Meditate/Tela3")}
      />
      <Button title="Voltar para Tela 1" onPress={() => router.back()} />
    </View>
  );
}
