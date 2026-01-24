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
      marginBottom: theme.spacing.xl,
    },
    greetingText: {
      ...theme.text("xxxl", "semibold"),
    },
    subtitleText: {
      ...theme.text("md", "regular", theme.colors.textSecondary),
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: theme.spacing.xl,
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    sectionTitle: {
      ...theme.text("xxl", "regular"),
    },
    seeAllText: {
      ...theme.text("md", "medium", theme.colors.primary),
    },
    libraryColumnWrapper: {
      marginHorizontal: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    libraryItem: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between", // Espaço entre conteúdo e seta

      backgroundColor: theme.colors.card,
      marginHorizontal: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,

      marginBottom: theme.spacing.sm,
      padding: theme.spacing.md,
      gap: theme.spacing.md,
    },
    libraryContentGroup: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: "center",
      justifyContent: "center",
    },
    libraryItemText: {
      ...theme.text("md", "medium"), // Fonte maior para lista
      textAlign: "left",
      color: theme.colors.text,
    },
    contentContainer: {
      paddingBottom: 200,
    },
  });
