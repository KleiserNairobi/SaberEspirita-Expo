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
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    sectionTitle: {
      ...theme.text("md", "bold"),
      color: theme.colors.text,
    },
    seeAllText: {
      ...theme.text("xs", "semibold"),
      color: theme.colors.primary,
    },
    searchContainer: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    pillScrollView: {
      paddingHorizontal: theme.spacing.md,
      gap: 8,
      paddingBottom: 4,
    },
    pill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 7,
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
      ...theme.text("xs", "medium"),
      color: theme.colors.textSecondary,
    },
    pillTextActive: {
      color: theme.colors.onPrimary,
      fontWeight: "bold",
    },
    subPillScrollView: {
      paddingHorizontal: theme.spacing.md,
      gap: 6,
      marginTop: 8,
      paddingBottom: 2,
    },
    subPill: {
      paddingHorizontal: 10,
      paddingVertical: 5,
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
      ...theme.text("xs", "regular"),
      color: theme.colors.textSecondary,
      fontSize: 11,
    },
    subPillTextActive: {
      color: theme.colors.onPrimary,
      fontWeight: "bold",
    },
    tracksWrapper: {
      marginTop: theme.spacing.md,
      gap: 24,
    },
    trackSection: {
      // Container da trilha
    },
    trackHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      paddingHorizontal: theme.spacing.md,
      marginBottom: 10,
    },
    trackTitleBlock: {
      flex: 1,
      marginRight: 8,
    },
    trackTitle: {
      ...theme.text("sm", "semibold"),
      color: theme.colors.text,
      fontSize: 15,
      marginBottom: 2,
    },
    trackSubtitle: {
      ...theme.text("xs", "regular"),
      color: theme.colors.textSecondary,
      fontSize: 11,
    },
    trackCountText: {
      ...theme.text("xs", "medium"),
      color: theme.colors.textSecondary,
      fontSize: 11,
    },
    carouselTrackContent: {
      paddingHorizontal: theme.spacing.md,
      gap: 12,
      paddingVertical: 2,
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
      gap: 12,
    },
    emptyText: {
      ...theme.text("sm", "regular"),
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
  });
