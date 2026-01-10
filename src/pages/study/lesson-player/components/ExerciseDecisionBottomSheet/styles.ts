import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    bottomSheetBackground: {
      backgroundColor: theme.colors.card,
    },
    handleIndicator: {
      backgroundColor: theme.colors.border,
    },
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
      alignItems: "center",
    },
    iconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.md,
    },
    title: {
      ...theme.text("xl", "bold"),
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.sm,
    },
    description: {
      ...theme.text("md", "regular"),
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: theme.spacing.lg,
      paddingHorizontal: theme.spacing.md,
    },
    warningCard: {
      width: "100%",
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor: `${theme.colors.warning}10`,
      borderWidth: 1,
      borderColor: `${theme.colors.warning}30`,
      borderRadius: 12,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.xl,
      gap: theme.spacing.sm,
    },
    warningTextContainer: {
      flex: 1,
      gap: theme.spacing.xs,
    },
    warningTitle: {
      ...theme.text("sm", "semibold"),
      color: theme.colors.warning,
    },
    warningText: {
      ...theme.text("sm", "regular"),
      color: theme.colors.text,
    },
    buttonContainer: {
      width: "100%",
      gap: theme.spacing.md,
    },
  });
