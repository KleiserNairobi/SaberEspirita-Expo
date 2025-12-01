import { router } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";

export default function Tela1() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Fix - Tela 1</Text>
      <Button
        title="Ir para Tela 2"
        onPress={() => router.push("/Fix/Tela2")}
      />
    </View>
  );
}
