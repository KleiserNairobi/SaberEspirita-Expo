import React from "react";
import { View, Text } from "react-native";
import { BookOpen } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface ReferenceCardProps {
  references: {
    kardeciana?: string;
    biblica?: string;
  };
  fontSize?: number;
}

export function ReferenceCard({ references, fontSize = 16 }: ReferenceCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  if (!references || (!references.kardeciana && !references.biblica)) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BookOpen size={20} color={theme.colors.warning} />
        <Text style={styles.headerTitle}>Referências</Text>
      </View>
      {references.kardeciana && (
        <Text style={[styles.referenceText, { fontSize, lineHeight: fontSize * 1.5 }]}>
          Kardeciana: {references.kardeciana}
        </Text>
      )}
      {references.biblica && (
        <Text style={[styles.referenceText, { fontSize, lineHeight: fontSize * 1.5 }]}>
          Bíblica: {references.biblica}
        </Text>
      )}
    </View>
  );
}
