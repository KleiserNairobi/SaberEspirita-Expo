import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: 150,
    },
    header: {
      marginTop: 20,
      marginBottom: 20,
      marginHorizontal: 20,
    },
    greeting: {
      ...theme.text("xxxl", "semibold"),
    },
    subtitle: {
      ...theme.text("md", "regular", theme.colors.textSecondary),
    },
    sectionTitle: {
      ...theme.text("xxl", "regular"),
      marginBottom: 10,
      marginHorizontal: 20,
      marginTop: 20,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginHorizontal: 20,
      marginTop: 20,
      marginBottom: 10,
    },
    viewAllButton: {
      ...theme.text("md", "medium"),
      color: theme.colors.primary,
    },
    sectionTitleInHeader: {
      ...theme.text("xxl", "regular"),
    },
    loadingContainer: {
      padding: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    reflectionsContainer: {
      paddingHorizontal: 20,
    },
    emptyContainer: {
      padding: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyText: {
      ...theme.text("md", "regular"),
      color: theme.colors.muted,
      textAlign: "center",
    },
    // Novas Tabs
    segmentContainer: {
      flexDirection: "row",
      backgroundColor: theme.colors.card,
      marginHorizontal: 20,
      borderRadius: theme.radius.lg,
      padding: 4,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    segmentButton: {
      flex: 1,
      paddingVertical: 10,
      alignItems: "center",
      borderRadius: theme.radius.md,
    },
    segmentButtonActive: {
      backgroundColor: theme.colors.background,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    segmentText: {
      ...theme.text("sm", "medium"),
      color: theme.colors.textSecondary,
    },
    segmentTextActive: {
      color: theme.colors.primary,
      fontFamily: "Oswald_600SemiBold",
    },
  });
