import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export function createStyles(theme: ITheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: 40,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 100,
      gap: theme.spacing.md,
    },
    loadingText: {
      ...theme.text("md", "regular", theme.colors.muted),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      marginHorizontal: theme.spacing.lg,
      gap: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      marginBottom: theme.spacing.xl,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    headerText: {
      flex: 1,
    },
    title: {
      ...theme.text("xxl", "semibold"),
      color: theme.colors.text,
      marginBottom: 2,
    },
    subtitle: {
      ...theme.text("sm", "regular"),
      color: theme.colors.textSecondary,
    },
    section: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xxl,
    },
    rankingButton: {
      marginHorizontal: theme.spacing.lg,
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.md,
      padding: theme.spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    rankingInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      flex: 1,
    },
    rankingIconContainer: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primary + "15",
      alignItems: "center",
      justifyContent: "center",
    },
    rankingTitle: {
      ...theme.text("md", "medium"),
      color: theme.colors.text,
    },
    rankingSubtitle: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
    },
  });
}
