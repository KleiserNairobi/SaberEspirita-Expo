import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.md,
      paddingBottom: theme.spacing.lg,
    },
    loadingContainer: {
      paddingVertical: theme.spacing.xl,
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.sm,
    },
    loadingText: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
    },
    section: {
      gap: 0,
      marginBottom: 10,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 0,
    },
    sectionIcon: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: "center",
      justifyContent: "center",
    },
    sectionTitle: {
      ...theme.text("md", "semibold"),
      color: theme.colors.text,
    },
    sectionCount: {
      ...theme.text("xs", "semibold", theme.colors.primary),
      backgroundColor: `${theme.colors.primary}18`,
      paddingHorizontal: 6,
      paddingVertical: 1,
      borderRadius: theme.radius.xs,
    },
    itemsList: {
      paddingLeft: 38,
      gap: 0,
      marginTop: 0,
    },
    listItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 2,
      gap: 6,
    },
    itemText: {
      ...theme.text("md", "regular", theme.colors.textSecondary),
      flex: 1,
      lineHeight: 20,
      marginRight: 6,
    },
    itemRightAction: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    premiumTag: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      backgroundColor: `${theme.colors.warning}18`,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    premiumTagText: {
      ...theme.text("xs", "bold", theme.colors.warning),
      fontSize: 10,
    },
    emptyContainer: {
      paddingVertical: theme.spacing.xl,
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.xs,
    },
    emptyIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: `${theme.colors.primary}12`,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.xs,
    },
    emptyTitle: {
      ...theme.text("md", "semibold"),
      color: theme.colors.text,
      textAlign: "center",
    },
    emptySubtitle: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
      textAlign: "center",
      maxWidth: 280,
    },
  });
