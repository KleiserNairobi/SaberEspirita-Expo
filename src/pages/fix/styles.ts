import { ITheme } from "@/configs/theme/types";
import { StyleSheet } from "react-native";

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
      paddingBottom: theme.spacing.lg,
    },
    title: {
      ...theme.text("xxxl", "semibold"),
    },
    subtitle: {
      ...theme.text("md", "regular", theme.colors.textSecondary),
    },
    section: {
      paddingHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.xs,
    },
    sectionTitle: {
      ...theme.text("xxl", "regular"),
      marginBottom: 10,
    },
    columnWrapper: {
      paddingHorizontal: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
  });
}
