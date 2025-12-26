import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Compass } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

export function AskGuideCard() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();

  function handlePress() {
    navigation.navigate("EmotionalChat" as never);
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {/* Ícone */}
        <View style={styles.iconContainer}>
          <Compass size={24} color={theme.colors.primary} strokeWidth={2} />
        </View>

        {/* Texto + Botão */}
        <View style={styles.textColumn}>
          <Text style={styles.title}>Pergunte ao Guia</Text>
          <Text style={styles.description}>
            Converse com nosso assistente espiritual baseado nos ensinamentos de Kardec.
          </Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handlePress}
            activeOpacity={0.7}
          >
            <Text style={styles.actionText}>CONVERSAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
