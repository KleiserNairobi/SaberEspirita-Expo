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
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    avatarText: {
      ...theme.text("xxxl", "bold", theme.colors.onPrimary),
    },
    editBadge: {
      position: "absolute",
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.text,
      width: 26,
      height: 26,
      borderRadius: 13,
      borderWidth: 2,
      borderColor: theme.colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
    nameRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
  });

