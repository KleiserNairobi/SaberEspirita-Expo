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
    // Footer: Metadados (2 Colunas)
    footer: {
      flexDirection: "row",
      alignItems: "flex-end", // Alinha a badge com a parte de baixo do texto se necessário, ou center
      justifyContent: "space-between",
      marginTop: 2,
    },
    footerLeft: {
      flex: 1,
      gap: 4, // Espaçamento vertical entre Tópico e Data
      marginRight: theme.spacing.md,
    },
    footerRight: {
      flexShrink: 0,
    },
    metadataItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    metadataText: {
      ...theme.text("xs", "regular"), // Reduzido para xs para caber melhor
      color: theme.colors.muted,
    },
  });
