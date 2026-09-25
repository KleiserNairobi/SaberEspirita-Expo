import React from "react";
import { View, Text } from "react-native";
import { Target } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface PremiumSlideHeaderProps {
  source?: string;
  chapter?: string;
  slideType?: string;
  learningGoal?: string;
  fontSize?: number;
}

export const PremiumSlideHeader = React.memo(function PremiumSlideHeader({
  source,
  chapter,
  slideType,
  learningGoal,
  fontSize = 16,
}: PremiumSlideHeaderProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme, fontSize);

  const workLabel = [source, chapter].filter(Boolean).join(" • ");

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {!!workLabel && (
          <View style={styles.workContextBadge}>
            <Text style={styles.workContextText} numberOfLines={1}>
              {workLabel}
            </Text>
          </View>
        )}
        {!!slideType && (
          <View style={styles.slideTypeBadge}>
            <Text style={styles.slideTypeText} numberOfLines={1}>
              {slideType}
            </Text>
          </View>
        )}
      </View>

      {!!learningGoal && (
        <View style={styles.learningGoalCard}>
          <Target size={14} color={theme.colors.primary} />
          <Text style={styles.learningGoalText}>
            <Text style={styles.learningGoalLabel}>Meta: </Text>
            {learningGoal}
          </Text>
        </View>
      )}
    </View>
  );
});
