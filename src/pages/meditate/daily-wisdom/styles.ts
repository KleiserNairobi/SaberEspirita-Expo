import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    animatedContainer: {
      flex: 1,
    },
    // Botões de ação flutuantes no topo direito da capa
    headerActionsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs + 2,
    },
    headerActionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    headerActionButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    headerActionAaText: {
      ...theme.text("sm", "bold", "#FFFFFF"),
    },
    // Conteúdo da folha de leitura
    contentSheetScroll: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md + 4,
      paddingBottom: 120, // Respiro confortável para o botão fixo no rodapé
    },
    // Metadados com simbologia de ícones (cada item em sua linha)
    metadataList: {
      gap: theme.spacing.sm,
      alignItems: "flex-start",
      alignSelf: "stretch",
      marginBottom: theme.spacing.md,
      paddingHorizontal: 2,
    },
    metadataItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
    },
    metadataText: {
      ...theme.text("sm", "regular"),
      color: theme.colors.muted,
      flexShrink: 1,
      marginTop: -2,
    },
    openingQuoteContainer: {
      backgroundColor: `${theme.colors.primary}08`,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm + 2,
      borderRadius: theme.radius.xs,
      marginBottom: theme.spacing.md,
    },
    openingQuoteText: {
      ...theme.literaryText(16, theme.colors.text, 24),
    },
    bodyContainer: {
      paddingTop: theme.spacing.xs,
      paddingBottom: theme.spacing.md,
    },
    bodyText: {
      ...theme.readingText("md", "regular"),
      color: theme.colors.text,
      textAlign: "left",
    },
    // Rodapé Fixo com Botão de Conclusão de Leitura
    fixedFooter: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.background,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
    },
    finishButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.sm,
      paddingVertical: theme.spacing.md,
      alignItems: "center",
      justifyContent: "center",
    },
    finishButtonText: {
      ...theme.text("md", "semibold", theme.colors.onPrimary),
      textTransform: "uppercase",
    },
    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: theme.spacing.xl,
    },
    loadingText: {
      ...theme.text("sm", "medium", theme.colors.textSecondary),
      marginTop: theme.spacing.md,
    },
  });
