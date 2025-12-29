import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    headerContainer: {
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    greetingText: {
      ...theme.text("xxxl", "semibold"),
    },
    subtitleText: {
      ...theme.text("md", "regular", theme.colors.textSecondary),
    },
    sectionHeader: {
      marginTop: theme.spacing.xl,
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    sectionTitle: {
      ...theme.text("xxl", "regular"),
    },
    libraryColumnWrapper: {
      marginHorizontal: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    libraryItem: {
      flex: 1,
      height: 110,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.sm,
      padding: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    libraryItemText: {
      ...theme.text("sm", "regular"),
      textAlign: "center",
    },
    contentContainer: {
      paddingBottom: 200,
    },
  });
