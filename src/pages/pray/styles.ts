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
    momentsScroll: {
      marginBottom: 30,
    },
    momentsContent: {
      paddingHorizontal: 20,
      gap: 10,
    },
    momentCard: {
      width: 110,
      height: 110,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      padding: 12,
      gap: 8,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    momentLabel: {
      fontFamily: theme.typography.weights.regular,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.text,
      textAlign: "center",
    },
    ambientContainer: {
      marginHorizontal: 20,
      marginBottom: 10,
    },
    featuredList: {
      marginHorizontal: 20,
      gap: 10,
    },
    prayerCard: {
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 10,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs + 4,
    },
    prayerInfo: {
      flex: 1,
    },
    prayerTitle: {
      ...theme.text("lg", "semibold"),
    },
    prayerAuthor: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
      flex: 1,
    },
    metadataRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
    },
    favoriteIconInline: {
      marginRight: 6,
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
  });
