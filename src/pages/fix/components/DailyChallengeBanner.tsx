import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FixStackParamList } from "@/routers/types";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Trophy, ChevronRight } from "lucide-react-native";

export function DailyChallengeBanner() {
  const { theme } = useAppTheme();
  const navigation = useNavigation<NativeStackNavigationProp<FixStackParamList>>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("DailyQuizHome")}
      activeOpacity={0.7}
      style={{
        marginHorizontal: theme.spacing.lg,
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.md,
        padding: theme.spacing.lg,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: theme.colors.border,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.md,
          flex: 1,
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: theme.radius.full,
            backgroundColor: theme.colors.primary + "15",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Trophy size={20} color={theme.colors.primary} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ ...theme.text("md", "medium"), color: theme.colors.text }}>
            Desafio Diário
          </Text>
          <Text
            style={{ ...theme.text("sm", "regular"), color: theme.colors.textSecondary }}
          >
            5 perguntas rápidas todo dia
          </Text>
        </View>
      </View>

      <ChevronRight size={20} color={theme.colors.muted} />
    </TouchableOpacity>
  );
}
