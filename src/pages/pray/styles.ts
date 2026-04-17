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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    headerTextContainer: {
      flex: 1,
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    headerAction: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${theme.colors.primary}10`,
      alignItems: "center",
      justifyContent: "center",
    },
    greeting: {
      ...theme.text("xxxl", "semibold"),
      lineHeight: 36,
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
    ambientContainer: {
      marginHorizontal: 20,
      marginBottom: 10,
    },
    featuredList: {
      marginHorizontal: 20,
      gap: 10,
    },
    favoriteButton: {
      padding: 8,
    },
    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 40,
    },
    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 40,
      paddingHorizontal: 20,
    },
    emptyText: {
      ...theme.text("md", "regular", theme.colors.textSecondary),
      textAlign: "center",
    },
    newBadgeIndicator: {
      position: "absolute",
      top: -2,
      right: -2,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.colors.success,
      borderWidth: 2,
      borderColor: theme.colors.card,
      zIndex: 10,
    },
  });
