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
    headerTopRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.spacing.md,
    },
    headerTextBlock: {
      flex: 1,
    },
    notificationButton: {
      position: "relative",
      width: 40,
      height: 40,
      borderRadius: theme.radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: `${theme.colors.primary}15`,
    },
    notificationIconWrap: {
      position: "relative",
      width: 22,
      height: 22,
      alignItems: "center",
      justifyContent: "center",
    },
    notificationDot: {
      position: "absolute",
      top: -2,
      right: -2,
      width: 12,
      height: 12,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.success,
      borderWidth: 2,
      borderColor: theme.colors.background,
    },
    greetingText: {
      ...theme.text("xxl", "medium"),
    },
    subtitleText: {
      ...theme.text("md", "regular", theme.colors.textSecondary),
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: theme.spacing.md,
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
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
      justifyContent: "space-between",
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
      borderRadius: theme.radius.full,
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: "center",
      justifyContent: "center",
    },
    libraryItemText: {
      ...theme.text("md", "medium"),
      textAlign: "left",
      color: theme.colors.text,
    },
    contentContainer: {
      paddingBottom: theme.spacing.xxl * 3,
    },
    rightGroup: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.xs / 2,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.radius.sm,
      backgroundColor: `${theme.colors.success}20`,
    },
    statusText: {
      ...theme.text("xs", "semibold", theme.colors.success),
      textTransform: "capitalize",
    },
  });
