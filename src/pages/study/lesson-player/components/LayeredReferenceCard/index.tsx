import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BookOpen, Library } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { IGlossaryTerm } from "@/types/glossary";
import { IPremiumSlideReferences } from "@/types/course";
import { createStyles } from "./styles";

interface LayeredReferenceCardProps {
  references?: (IPremiumSlideReferences & { kardeciana?: string }) | null;
  glossary?: IGlossaryTerm[];
  fontSize?: number;
  onGlossaryTermPress?: (termId: string) => void;
}

export const LayeredReferenceCard = React.memo(function LayeredReferenceCard({
  references,
  glossary = [],
  fontSize = 16,
  onGlossaryTermPress,
}: LayeredReferenceCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme, fontSize);

  const obraPrincipal = references?.obraPrincipal;
  const codificacao = references?.codificacao || references?.kardeciana;
  const complementar = references?.complementar;
  const biblica = references?.biblica;

  const hasReferences = !!(obraPrincipal || codificacao || complementar || biblica);
  const hasGlossary = !!glossary && glossary.length > 0;

  if (!hasReferences && !hasGlossary) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Badge Flutuante no Topo */}
      <View style={styles.header}>
        {hasReferences ? (
          <BookOpen size={14} color={theme.colors.warning} />
        ) : (
          <Library size={14} color={theme.colors.warning} />
        )}
        <Text style={styles.headerTitle}>
          {hasReferences ? "Referências" : "Glossário"}
        </Text>
      </View>

      {hasReferences && (
        <View style={styles.section}>
          {!!obraPrincipal && (
            <Text style={[styles.referenceText, { fontSize, lineHeight: fontSize * 1.5 }]}>
              <Text style={{ fontFamily: theme.typography.weights.semibold }}>
                Obra Base:{" "}
              </Text>
              {obraPrincipal}
            </Text>
          )}

          {!!codificacao && (
            <Text style={[styles.referenceText, { fontSize, lineHeight: fontSize * 1.5 }]}>
              <Text style={{ fontFamily: theme.typography.weights.semibold }}>
                Codificação:{" "}
              </Text>
              {codificacao}
            </Text>
          )}

          {!!complementar && (
            <Text style={[styles.referenceText, { fontSize, lineHeight: fontSize * 1.5 }]}>
              <Text style={{ fontFamily: theme.typography.weights.semibold }}>
                Complementar:{" "}
              </Text>
              {complementar}
            </Text>
          )}

          {!!biblica && (
            <Text style={[styles.referenceText, { fontSize, lineHeight: fontSize * 1.5 }]}>
              <Text style={{ fontFamily: theme.typography.weights.semibold }}>
                Bíblica:{" "}
              </Text>
              {biblica}
            </Text>
          )}
        </View>
      )}

      {hasReferences && hasGlossary && <View style={styles.divider} />}

      {hasGlossary && (
        <View style={styles.section}>
          {hasReferences && (
            <View style={styles.subHeader}>
              <Library size={14} color={theme.colors.warning} />
              <Text style={styles.subHeaderTitle}>Glossário</Text>
            </View>
          )}
          <View style={styles.pillsContainer}>
            {glossary.map((term, index) => (
              <TouchableOpacity
                key={`${term.id}_${index}`}
                style={styles.pill}
                onPress={() => onGlossaryTermPress?.(term.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.pillText}>{term.term}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
});
