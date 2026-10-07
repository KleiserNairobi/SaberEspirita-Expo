import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    },
    titleTouchable: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    sectionTitle: {
      ...theme.text("xl", "regular"),
    },
    counterText: {
      ...theme.text("xs", "medium", theme.colors.textSecondary),
    },
    listContent: {
      paddingHorizontal: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    card: {
      width: 285,
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: "hidden",
      flexDirection: "row",
      minHeight: 88,
    },
    imagePlaceholder: {
      width: 86,
      backgroundColor: `${theme.colors.primary}10`,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },
    courseImage: {
      ...StyleSheet.absoluteFillObject,
      width: undefined,
      height: undefined,
    },
    infoContainer: {
      flex: 1,
      padding: theme.spacing.sm,
      paddingLeft: theme.spacing.md,
      justifyContent: "center",
    },
    cardTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.xs / 2,
    },
    kicker: {
      ...theme.text("xs", "semibold", theme.colors.primary),
      letterSpacing: 0.5,
    },
    percentText: {
      ...theme.text("xs", "semibold", theme.colors.textSecondary),
    },
    courseTitle: {
      ...theme.text("sm", "semibold"),
      marginBottom: theme.spacing.xs / 2,
    },
    lessonTitle: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
      marginBottom: theme.spacing.xs,
    },
    progressBarBackground: {
      height: 3,
      backgroundColor: `${theme.colors.primary}18`,
      borderRadius: theme.radius.xs,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.xs,
    },
  });
