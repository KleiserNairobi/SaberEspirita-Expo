import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
    },
    headerTitle: {
      ...theme.text("xxl", "bold"),
      marginLeft: theme.spacing.sm,
      color: theme.colors.text,
    },
    subHeader: {
      alignItems: "center",
      paddingBottom: theme.spacing.md,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xl,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      ...theme.text("md", "regular", theme.colors.textSecondary),
      marginTop: theme.spacing.sm,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: theme.spacing.xl,
    },
    emptyTitle: {
      ...theme.text("xl", "bold", theme.colors.text),
      marginBottom: theme.spacing.sm,
      textAlign: "center",
    },
    emptyMessage: {
      ...theme.text("md", "regular", theme.colors.textSecondary),
      textAlign: "center",
      lineHeight: 22,
    },
    // Styles for podium and list will be in their respective component files or here if shared
    // Podium Styles
    podiumContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "flex-end", // Align bars at the bottom? No, we want names at bottom.
      // Actually if items are different heights, aligning flex-end makes them share a baseline.
      // But 1st place is TALLER. So simple flex-end on container works if the Item is height-auto.
      marginBottom: theme.spacing.lg,
      marginTop: theme.spacing.xl, // More space for heads
      paddingHorizontal: theme.spacing.md,
      gap: 16, // Space between columns
    },
    podiumItem: {
      alignItems: "center",
      justifyContent: "flex-end",
      width: 90,
    },
    podiumFirst: {
      // 1st place styling override if needed (e.g. zIndex)
      zIndex: 10,
    },
    avatarContainer: {
      marginBottom: theme.spacing.sm, // Gap between avatar and bar
      alignItems: "center",
      justifyContent: "center",
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
    },
    avatarFirst: {
      // Dimensions now uniform, no override needed
    },
    avatarSecond: {},
    avatarThird: {},

    // The Bars
    podiumBar: {
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      borderTopLeftRadius: theme.radius.md,
      borderTopRightRadius: theme.radius.md,
      borderBottomLeftRadius: theme.radius.sm,
      borderBottomRightRadius: theme.radius.sm,
      // Removed paddingTop since avatar no longer overlaps
    },
    podiumBarFirst: {
      height: 140,
      backgroundColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 10,
    },
    podiumBarSecond: {
      height: 100,
      backgroundColor: theme.colors.primary + "40", // Light tint
    },
    podiumBarThird: {
      height: 80,
      backgroundColor: theme.colors.primary + "20", // Very light tint
    },

    // Texts
    podiumScore: {
      ...theme.text("lg", "bold"),
      color: theme.colors.primary, // Darker text on light bars
    },
    podiumScoreFirst: {
      ...theme.text("xl", "bold"),
      color: "#FFFFFF", // White text on solid primary
    },
    podiumRankText: {
      ...theme.text("lg", "bold", theme.colors.text),
      marginTop: 8,
    },
    podiumName: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
      textAlign: "center",
    },
    // Removed old podiumRank pill styles
    podiumRank: { display: "none" },
    podiumRankFirst: { display: "none" },
    podiumRankTextFirst: { display: "none" },
    // List Item Styles
    listItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12, // Reduced height
      paddingHorizontal: theme.spacing.md,
      marginHorizontal: theme.spacing.md, // Keep horizontal margin
      marginBottom: 8, // Smaller gap
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    currentUserItem: {
      backgroundColor: theme.colors.primary + "10", // 10% opacity primary bg
      borderColor: theme.colors.primary,
    },
    rankContainer: {
      width: 32,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.sm,
    },
    rankText: {
      ...theme.text("md", "medium", theme.colors.textSecondary),
    },
    listAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: theme.spacing.md,
      backgroundColor: theme.colors.border, // Fallback/Loading
    },
    listContent: {
      flex: 1,
    },
    listName: {
      ...theme.text("md", "medium"), // Reduced weight
    },
    listLevel: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
    },
    listScore: {
      ...theme.text("md", "semibold", theme.colors.primary),
    },
    // Filter Styles
    filterContainer: {
      flexDirection: "row",
      backgroundColor: theme.colors.card,
      padding: 4,
      borderRadius: theme.radius.full, // Pill shape
      marginHorizontal: theme.spacing.lg, // Reduced from xl
      marginVertical: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    filterButton: {
      flex: 1,
      paddingVertical: 8,
      alignItems: "center",
      borderRadius: theme.radius.full,
    },
    activeFilter: {
      backgroundColor: theme.colors.primary,
    },
    filterText: {
      ...theme.text("sm", "medium", theme.colors.textSecondary),
    },
    activeFilterText: {
      color: "#FFFFFF",
      fontWeight: "bold",
    },
  });
