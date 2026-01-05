import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    // HEADER (Barra de navegação)
    navHeader: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: theme.colors.background, // Pode ser transparente com blur se quiser
      zIndex: 10,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.05)",
      marginRight: 16,
    },
    navTitle: {
      ...theme.text("lg", "bold"),
      color: theme.colors.text,
    },

    listContent: {
      paddingHorizontal: 16,
      paddingBottom: 40,
    },

    // SUMMARY CARD (Topo)
    summaryCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    summaryTitle: {
      ...theme.text("lg", "semibold"),
      color: theme.colors.text,
      marginBottom: 12,
    },
    summaryProgressRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    summaryLabel: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
    },
    summaryPercent: {
      ...theme.text("sm", "semibold", theme.colors.text),
    },
    summaryBarBg: {
      width: "100%",
      height: 8,
      backgroundColor: "rgba(255,255,255,0.1)", // Ou theme.colors.border
      borderRadius: 4,
      overflow: "hidden",
      marginBottom: 4,
    },
    summaryBarFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: 4,
    },
    summaryFooter: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
      marginTop: 4,
    },

    // LESSON CARD (Base)
    lessonCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      marginBottom: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "transparent", // Sobrescrito pelos estados
      backgroundColor: theme.colors.card, // Sobrescrito
    },

    // VARIANTES DE CARD
    cardCompleted: {
      backgroundColor: "rgba(16, 185, 129, 0.1)", // Success 10%
      borderColor: "rgba(16, 185, 129, 0.3)", // Success 30%
    },
    cardInProgress: {
      backgroundColor: "rgba(245, 158, 11, 0.1)", // Warning 10%
      borderColor: "rgba(245, 158, 11, 0.3)", // Warning 30%
      flexDirection: "column", // Muda layout para caber a barra interna
      alignItems: "stretch", // Esticar conteúdo
    },
    cardLocked: {
      backgroundColor: theme.colors.card,
      borderColor: "rgba(255,255,255,0.05)",
      opacity: 0.6,
    },
    cardAvailable: {
      backgroundColor: theme.colors.card,
      borderColor: "rgba(255,255,255,0.1)",
    },

    // CONTEÚDO DO CARD
    cardHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },
    cardLeftContent: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      gap: 16,
    },

    // ÍCONES / NÚMEROS
    iconContainer: {
      width: 32,
      height: 32,
      justifyContent: "center",
      alignItems: "center",
    },
    numberCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    numberText: {
      ...theme.text("sm", "semibold", "#FFF"),
    },
    lockedIconDetails: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "rgba(255,255,255,0.05)",
      justifyContent: "center",
      alignItems: "center",
    },

    // TEXTOS DO CARD
    textContainer: {
      flex: 1,
    },
    lessonTitle: {
      ...theme.text("md", "semibold"),
      color: theme.colors.text,
      marginBottom: 2,
    },
    lessonMeta: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
    },

    // QUIZ BADGE
    quizBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: "rgba(126, 217, 87, 0.2)", // Primary 20%
      marginRight: 8,
    },
    quizText: {
      ...theme.text("xs", "bold", theme.colors.primary),
      textTransform: "uppercase",
    },

    // BARRA DE PROGRESSO INTERNA (Card In Progress)
    internalProgressBarBg: {
      width: "100%",
      height: 4,
      backgroundColor: "rgba(245, 158, 11, 0.2)", // Warning 20%
      borderRadius: 2,
      marginTop: 12,
      overflow: "hidden",
    },
    internalProgressBarFill: {
      height: "100%",
      backgroundColor: theme.colors.warning, // Warning
      borderRadius: 2,
    },

    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });
