import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme, fontSize: number = 16) =>
  StyleSheet.create({
    container: {
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
      padding: theme.spacing.md,
      backgroundColor: `${theme.colors.warning}15`,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.warning,
      borderRadius: theme.radius.sm,
    },
    section: {
      // Container para cada bloco (referências ou glossário)
    },
    divider: {
      height: 1,
      backgroundColor: `${theme.colors.warning}30`,
      marginVertical: theme.spacing.sm,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.sm,
    },
    headerTitle: {
      ...theme.text("sm", "semibold", theme.colors.warning),
    },
    referenceText: {
      ...theme.text("sm", "regular"),
      lineHeight: 18,
      marginBottom: 4,
    },
    pillsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
    },
    pill: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      backgroundColor: `${theme.colors.warning}20`,
    },
    pillText: {
      ...theme.text("xs", "medium", theme.colors.warning),
      fontSize: fontSize - 2,
    },
  });
