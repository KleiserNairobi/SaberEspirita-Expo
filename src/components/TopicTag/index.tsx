import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Tag } from "lucide-react-native";
import { useAppTheme } from "@/hooks/useAppTheme";

interface TopicTagProps {
  topic: string;
}

export function TopicTag({ topic }: TopicTagProps) {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <Tag size={14} color={theme.colors.primary} />
      <Text style={[styles.text, { color: theme.colors.text }]}>{topic}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  text: {
    fontSize: 13,
    fontWeight: "500",
  },
});
