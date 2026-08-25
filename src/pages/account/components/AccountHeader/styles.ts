import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    header: {
      alignItems: "center",
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    avatarSection: {
      alignItems: "center",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.xs,
    },
    avatarWrapper: {
      position: "relative",
      width: 80,
      height: 80,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    avatarText: {
      ...theme.text("xxxl", "bold", theme.colors.onPrimary),
    },
    avatarImage: {
      width: "100%",
      height: "100%",
    },
    editBadge: {
      position: "absolute",
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.primary,
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: theme.colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
    levelBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: theme.radius.sm,
      alignSelf: "center",
    },
  });
