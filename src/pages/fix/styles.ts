import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export function createStyles(theme: ITheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      paddingBottom: theme.spacing.xl,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    title: {
      ...theme.text("xxxl", "semibold"),
    },
    subtitle: {
      ...theme.text("md", "regular", theme.colors.textSecondary),
    },
    section: {
      paddingHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.lg,
    },
    sectionTitle: {
      ...theme.text("xxl", "regular"),
      marginBottom: 10,
    },
    categoryGrid: {
      paddingHorizontal: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
  });
}
