import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: 150,
    },
    // Estilos Tablet
    tabletHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    tabletTitle: {
      ...theme.text("xxxl", "bold"),
    },
    tabletSubtitle: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
      marginTop: 2,
    },
    versionBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: theme.radius.full,
      backgroundColor: `${theme.colors.primary}15`,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    versionDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.success,
    },
    versionBadgeText: {
      ...theme.text("xs", "medium", theme.colors.textSecondary),
    },
    tabletMainRow: {
      flexDirection: "row",
      gap: theme.spacing.xl,
      alignItems: "flex-start",
    },
    tabletLeftColumn: {
      flex: 32,
    },
    tabletRightColumn: {
      flex: 68,
    },
    profileCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      alignItems: "center",
      marginBottom: theme.spacing.lg,
      marginTop: 29, // Nivelado com o topo do card PREFERÊNCIAS
    },
    profileBioText: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
      textAlign: "center",
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
      lineHeight: 18,
    },
    editProfileButton: {
      width: "100%",
      paddingVertical: 12,
      borderRadius: theme.radius.md,
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: "center",
      justifyContent: "center",
    },
    editProfileButtonText: {
      ...theme.text("sm", "semibold", theme.colors.text),
    },
    tabletVersionContainer: {
      alignItems: "center",
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
  });
