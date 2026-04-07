import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BookOpen, Library } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";
import { IGlossaryTerm } from "@/types/glossary";

interface ReferenceCardProps {
  references?: {
    kardeciana?: string;
    biblica?: string;
  };
  glossary?: IGlossaryTerm[];
  fontSize?: number;
  onGlossaryTermPress?: (termId: string) => void;
}

export function ReferenceCard({
  references,
  glossary,
  fontSize = 16,
  onGlossaryTermPress,
}: ReferenceCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme, fontSize);

  const hasReferences = !!references && (!!references.kardeciana || !!references.biblica);
  const hasGlossary = !!glossary && glossary.length > 0;

  if (!hasReferences && !hasGlossary) {
    return null;
  }

  return (
    <View style={styles.container}>
      {hasReferences && (
        <View style={styles.section}>
          <View style={styles.header}>
            <BookOpen size={20} color={theme.colors.warning} />
            <Text style={styles.headerTitle}>Referências</Text>
          </View>
          {references.kardeciana && (
            <Text style={[styles.referenceText, { fontSize, lineHeight: fontSize * 1.5 }]}>
              <Text style={{ fontFamily: theme.typography.weights.semibold }}>
                Kardeciana:{" "}
              </Text>
              {references.kardeciana}
            </Text>
          )}
          {references.biblica && (
            <Text style={[styles.referenceText, { fontSize, lineHeight: fontSize * 1.5 }]}>
              <Text style={{ fontFamily: theme.typography.weights.semibold }}>
                Bíblica:{" "}
              </Text>
              {references.biblica}
            </Text>
          )}
        </View>
      )}

      {hasReferences && hasGlossary && <View style={styles.divider} />}

      {hasGlossary && (
        <View style={styles.section}>
          <View style={styles.header}>
            <Library size={18} color={theme.colors.warning} />
            <Text style={styles.headerTitle}>Glossário</Text>
          </View>
          <View style={styles.pillsContainer}>
            {glossary.map((term) => (
              <TouchableOpacity
                key={term.id}
                style={styles.pill}
                onPress={() => onGlossaryTermPress?.(term.id)}
              >
                <Text style={styles.pillText}>{term.term}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
