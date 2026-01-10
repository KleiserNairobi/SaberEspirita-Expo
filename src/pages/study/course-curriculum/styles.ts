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
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
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
      backgroundColor: theme.colors.border, // ✅ Usar token
      borderRadius: theme.radius.xs, // ✅ Usar token
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
      padding: theme.spacing.md, // ✅ Usar token
      marginBottom: theme.spacing.sm, // ✅ Usar token
      borderRadius: theme.radius.md, // ✅ Usar token
      borderWidth: 1,
      borderColor: "transparent",
      backgroundColor: theme.colors.card,
    },

    // VARIANTES DE CARD
    cardCompleted: {
      backgroundColor: `${theme.colors.success}15`, // ✅ Success 15% opacidade
      borderColor: `${theme.colors.success}30`, // ✅ Success 30% opacidade
    },
    cardInProgress: {
      backgroundColor: `${theme.colors.primary}15`, // ✅ Primary 15% opacidade
      borderColor: `${theme.colors.primary}30`, // ✅ Primary 30% opacidade
      flexDirection: "column",
      alignItems: "stretch",
    },
    cardLocked: {
      backgroundColor: `${theme.colors.card}80`, // Card com 50% opacidade
      borderColor: theme.colors.border,
      // Removido opacity global para manter texto legível
    },
    cardAvailable: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
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
      backgroundColor: `${theme.colors.primary}20`, // ✅ Primary 20% opacidade
      marginRight: 8,
    },
    quizText: {
      ...theme.text("xs", "bold", theme.colors.primary), // ✅ Usar primary
      textTransform: "uppercase",
    },

    // COMING SOON BADGE
    comingSoonBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: `${theme.colors.primary}20`, // ✅ Primary 20% opacidade
      marginRight: 8,
    },
    comingSoonText: {
      ...theme.text("xs", "bold", theme.colors.primary), // ✅ Usar primary
      textTransform: "uppercase",
    },

    // INTERNAL PROGRESS BAR (Para aulas em andamento)
    internalProgressBarBg: {
      width: "100%",
      height: 4,
      backgroundColor: theme.colors.border, // ✅ Usar token
      borderRadius: theme.radius.xs, // ✅ Usar token
      marginTop: 8,
    },
    internalProgressBarFill: {
      height: "100%",
      backgroundColor: theme.colors.primary, // ✅ Usar primary
      borderRadius: theme.radius.xs, // ✅ Usar token
    },

    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });
