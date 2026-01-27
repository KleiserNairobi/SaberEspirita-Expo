import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: `${theme.colors.primary}15`,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      // borderWidth: 1, // REMOVIDO para igualar ao estilo da imagem 2
      // borderColor: theme.colors.border, // REMOVIDO
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.xs,
    },
    label: {
      ...theme.text("xs", "bold"),
      color: theme.colors.primary,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    contentRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: theme.spacing.xs,
    },
    textContainer: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    courseTitle: {
      ...theme.text("md", "medium"),
      color: theme.colors.text,
      marginBottom: 2,
    },
    lessonTitle: {
      ...theme.text("sm", "regular"),
      color: theme.colors.textSecondary,
    },
    playButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    progressBarBackground: {
      height: 4,
      backgroundColor: theme.colors.border,
      borderRadius: 2,
      marginTop: theme.spacing.md,
      width: "100%",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: 2,
    },
  });
