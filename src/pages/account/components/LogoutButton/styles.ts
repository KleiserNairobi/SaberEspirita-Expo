import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
    logoutIcon: {
      marginRight: theme.spacing.sm,
    },
  });
