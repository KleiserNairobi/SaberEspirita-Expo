import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    container: {
      flex: 1,
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: theme.spacing.md,
      gap: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.accent,
    },
    headerText: {
      flex: 1,
    },
    title: {
      ...theme.text("xxl", "semibold"),
      marginBottom: 2,
    },
    subtitle: {
      ...theme.text("sm", "regular"),
      color: theme.colors.textSecondary,
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: `${theme.colors.primary}15`,
    },
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.spacing.lg,
    },
    list: {
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.xl,
    },
    emptyList: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.xl,
    },
    emptyText: {
      textAlign: "center",
      ...theme.text("md", "regular", theme.colors.textSecondary),
    },
    retryButton: {
      marginTop: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    retryText: {
      ...theme.text("md", "semibold", theme.colors.primary),
    },
    row: {
      flexDirection: "row",
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      gap: theme.spacing.md,
      alignItems: "center",
    },
    rowRead: {
      borderColor: `${theme.colors.primary}40`,
      backgroundColor: `${theme.colors.primary}08`,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.primary,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.full,
      alignItems: "center",
      justifyContent: "center",
    },
    contentWrap: {
      flex: 1,
      gap: 2,
    },
    rowTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.spacing.md,
    },
    rowTitle: {
      flex: 1,
      ...theme.text("md", "semibold"),
    },
    rowWhen: {
      ...theme.text("xs", "medium", theme.colors.textSecondary),
    },
    rowSubtitle: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
      lineHeight: 18,
    },
    boldText: {
      fontWeight: "600",
      color: theme.colors.text,
    },
    loadMore: {
      paddingVertical: theme.spacing.md,
      alignItems: "center",
    },
    loadMoreText: {
      ...theme.text("sm", "semibold", theme.colors.primary),
    },
  });
