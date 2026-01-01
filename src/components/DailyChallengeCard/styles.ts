import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      gap: theme.spacing.md,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    headerText: {
      flex: 1,
    },
    title: {
      ...theme.text("lg", "bold"),
      marginBottom: 2,
    },
    subtitle: {
      ...theme.text("sm", "medium"),
      color: theme.colors.textSecondary,
    },
    // Metadados - Estilo Medite
    metadata: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },
    metadataItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    metadataText: {
      ...theme.text("sm", "regular"),
      color: theme.colors.muted,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 4,
    },
    buttonText: {
      ...theme.text("md", "bold"),
    },
    buttonContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
  });
