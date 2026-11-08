import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
      marginHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.xs,
      marginBottom: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: `${theme.colors.warning}15`,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: `${theme.colors.warning}30`,
    },
    text: {
      ...theme.text("xs", "medium", theme.colors.warning),
      flex: 1,
    },
  });
