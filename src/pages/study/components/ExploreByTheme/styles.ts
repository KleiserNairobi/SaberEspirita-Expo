import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    },
    sectionTitle: {
      ...theme.text("xl", "regular"),
    },
    seeAllText: {
      ...theme.text("xs", "semibold", theme.colors.primary),
    },
    searchContainer: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    },
    pillScrollView: {
      paddingHorizontal: theme.spacing.lg,
      gap: theme.spacing.sm,
      paddingBottom: theme.spacing.xs,
    },
    pill: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs + 2,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: `${theme.colors.primary}20`,
    },
    pillActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    pillText: {
      ...theme.text("xs", "medium", theme.colors.textSecondary),
    },
    pillTextActive: {
      ...theme.text("xs", "semibold", theme.colors.onPrimary),
    },
    subPillScrollView: {
      paddingHorizontal: theme.spacing.lg,
      gap: theme.spacing.xs,
      marginTop: theme.spacing.sm,
      paddingBottom: theme.spacing.xs / 2,
    },
    subPill: {
      paddingHorizontal: theme.spacing.sm + 2,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
      backgroundColor: `${theme.colors.primary}10`,
      borderWidth: 1,
      borderColor: `${theme.colors.primary}25`,
    },
    subPillActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    subPillText: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
    },
    subPillTextActive: {
      ...theme.text("xs", "semibold", theme.colors.onPrimary),
    },
    tracksWrapper: {
      marginTop: theme.spacing.md,
      gap: theme.spacing.lg,
    },
    trackSection: {},
    trackHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    },
    trackTitleBlock: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    trackTitle: {
      ...theme.text("sm", "semibold"),
      marginBottom: theme.spacing.xs / 2,
    },
    trackSubtitle: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
    },
    trackCountText: {
      ...theme.text("xs", "medium", theme.colors.textSecondary),
    },
    carouselTrackContent: {
      paddingHorizontal: theme.spacing.lg,
      gap: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 2,
    },
    carouselItemWrapper: {
      width: 168,
    },
    filteredContainer: {
      marginTop: theme.spacing.md,
    },
    emptyContainer: {
      padding: theme.spacing.xl,
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.sm,
    },
    emptyText: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
      textAlign: "center",
    },
  });
