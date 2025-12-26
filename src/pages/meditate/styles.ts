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
  });
