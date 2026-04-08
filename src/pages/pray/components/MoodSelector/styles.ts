import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      marginTop: 10,
      marginBottom: 20,
    },
    title: {
      ...theme.text("lg", "semibold"),
      marginHorizontal: 20,
      marginBottom: 12,
      color: theme.colors.text,
    },
    scrollContent: {
      paddingHorizontal: 20,
      gap: 12,
    },
    moodChip: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.card,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 8,
    },
    moodChipSelected: {
      backgroundColor: `${theme.colors.primary}15`,
      borderColor: theme.colors.primary,
    },
    emoji: {
      fontSize: 20,
    },
    label: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
    },
    labelSelected: {
      color: theme.colors.primary,
      fontFamily: theme.typography.weights.semibold,
    },
  });
