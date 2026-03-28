import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 10,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs + 4,
      marginBottom: theme.spacing.sm,
    },
    content: {
      flex: 1,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    },
    title: {
      ...theme.text("md", "medium"),
      color: theme.colors.text,
      flex: 1,
      marginRight: 8,
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 2,
      paddingHorizontal: 8,
      borderRadius: theme.radius.sm,
      backgroundColor: `${theme.colors.success}20`,
    },
    statusText: {
      ...theme.text("xs", "semibold"),
      color: theme.colors.success,
      textTransform: "capitalize",
    },
    metadataRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
    },
    favoriteIconInline: {
      marginRight: 6,
    },
    metadataText: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
      flex: 1,
    },
    newBadgeDot: {
      position: "absolute",
      top: -2,
      right: -2,
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: theme.colors.success,
      borderWidth: 2,
      borderColor: theme.colors.card,
      zIndex: 10,
    },
  });
