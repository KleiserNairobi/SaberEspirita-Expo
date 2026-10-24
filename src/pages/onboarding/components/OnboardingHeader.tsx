import React from "react";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ArrowLeft } from "lucide-react-native";

import { ITheme } from "@/configs/theme/types";
import { useAppTheme } from "@/hooks/useAppTheme";

interface OnboardingHeaderProps {
  onBack?: () => void;
  onSkip?: () => void;
  canGoBack?: boolean;
  canSkip?: boolean;
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  onBack,
  onSkip,
  canGoBack = false,
  canSkip = true,
}) => {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {canGoBack && onBack ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={22} color={theme.colors.text} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.rightContainer}>
        {canSkip && onSkip ? (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={onSkip}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.skipText}>Pular</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      height: 44,
      paddingHorizontal: theme.spacing.md,
    },
    leftContainer: {
      width: 44,
      alignItems: "flex-start",
      justifyContent: "center",
    },
    rightContainer: {
      alignItems: "flex-end",
      justifyContent: "center",
    },
    backButton: {
      padding: theme.spacing.xs,
    },
    skipButton: {
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
    },
    skipText: {
      ...theme.text("sm", "medium", theme.colors.textSecondary),
    },
  });
