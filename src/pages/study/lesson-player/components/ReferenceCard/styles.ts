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
      marginTop: 6,
    },
    pill: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: `${theme.colors.warning}30`, // Tom ameno, mantendo harmonia moncromática mas com bom peso visual
      borderWidth: 1,
      borderColor: `${theme.colors.warning}50`, // Borda suave na mesma família de cor
    },
    pillText: {
      ...theme.text("sm", "medium", theme.colors.textSecondary),
      fontSize: fontSize - 2,
    },
  });
