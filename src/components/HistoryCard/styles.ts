import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: theme.spacing.md,
    },
    // Top Section: Ícone + Pergunta
    topSection: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: theme.spacing.md,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    contentContainer: {
      flex: 1,
    },
    question: {
      ...theme.text("md", "regular"),
      lineHeight: 20,
    },
    // Footer: Badges (Tópico + Dificuldade)
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
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
  });
