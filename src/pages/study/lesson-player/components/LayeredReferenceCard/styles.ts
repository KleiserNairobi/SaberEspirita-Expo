import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme, fontSize: number = 16) =>
  StyleSheet.create({
    container: {
      position: "relative",
      marginHorizontal: theme.spacing.md,
      marginTop: theme.spacing.md + 6,
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md + 6,
      paddingBottom: theme.spacing.md,
      backgroundColor: `${theme.colors.warning}12`,
      borderWidth: 1,
      borderColor: `${theme.colors.warning}40`,
      borderRadius: theme.radius.sm,
    },
    section: {
      marginTop: 2,
    },
    divider: {
      height: 1,
      backgroundColor: `${theme.colors.warning}30`,
      marginVertical: theme.spacing.md,
    },
    header: {
      position: "absolute",
      top: -12,
      left: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: `${theme.colors.warning}50`,
    },
    headerTitle: {
      ...theme.text("xs", "semibold", theme.colors.warning),
      fontSize: 12,
    },
    subHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: theme.spacing.xs,
    },
    subHeaderTitle: {
      ...theme.text("xs", "semibold", theme.colors.warning),
      fontSize: 12,
    },
    referenceText: {
      ...theme.text("sm", "regular"),
      lineHeight: fontSize * 1.5,
      marginBottom: 6,
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
      backgroundColor: `${theme.colors.warning}30`,
      borderWidth: 1,
      borderColor: `${theme.colors.warning}50`,
    },
    pillText: {
      ...theme.text("sm", "medium", theme.colors.textSecondary),
      fontSize: fontSize - 2,
    },
  });
