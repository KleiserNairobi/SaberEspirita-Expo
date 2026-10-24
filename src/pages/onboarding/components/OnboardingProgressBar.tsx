import React from "react";

import { StyleSheet, View } from "react-native";

import { ITheme } from "@/configs/theme/types";
import { useAppTheme } from "@/hooks/useAppTheme";

interface OnboardingProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const OnboardingProgressBar: React.FC<OnboardingProgressBarProps> = ({
  currentStep,
  totalSteps,
}) => {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      {steps.map((step) => {
        const isCompleted = step <= currentStep;
        return (
          <View
            key={step}
            style={[
              styles.segment,
              isCompleted ? styles.activeSegment : styles.inactiveSegment,
            ]}
          />
        );
      })}
    </View>
  );
};

const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      marginVertical: theme.spacing.sm,
    },
    segment: {
      flex: 1,
      height: 4,
      borderRadius: theme.radius.full,
    },
    activeSegment: {
      backgroundColor: theme.colors.primary,
    },
    inactiveSegment: {
      backgroundColor: `${theme.colors.border}60`,
    },
  });
