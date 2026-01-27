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
      backgroundColor: theme.colors.accent,
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
      ...theme.text("md", "medium"),
      color: theme.colors.text,
      marginBottom: 2,
    },
    lessonMeta: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
      flex: 1,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 2,
    },
    lessonStatus: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
      marginTop: 4,
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

    // ✅ NOVO: PENDING EXERCISE BADGE
    pendingBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 6,
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: `${theme.colors.warning}20`, // Warning 20% opacity
      borderRadius: 4,
      alignSelf: "flex-start",
    },
    pendingBadgeText: {
      ...theme.text("xs", "semibold", theme.colors.warning),
    },

    // ✅ NOVO: Container do botão de certificado
    certificateButtonContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.background,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },

    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    // ✅ NOVO: Estilos da Lista de Exercícios
    lessonWrapper: {
      marginBottom: theme.spacing.sm,
    },
    exercisesListContainer: {
      marginLeft: theme.spacing.lg, // Indentado em relação ao card da aula
      borderLeftWidth: 2,
      borderLeftColor: theme.colors.border,
      paddingLeft: theme.spacing.md,
      marginTop: -8, // Aproximar do card de cima (conector visual)
      paddingTop: 8,
      paddingBottom: 8,
    },
    exerciseCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      paddingRight: 16,
      borderBottomWidth: 1,
      borderBottomColor: `${theme.colors.border}50`, // Mais sutil
    },
    exerciseLeftContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
    },
    connectorLine: {
      // Pode ser usado para linha vertical se necessário,
      // mas o borderLeft no container já faz esse papel
      width: 0,
      height: 0,
    },
    exerciseIconContainer: {
      width: 24,
      height: 24,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 12,
      backgroundColor: theme.colors.background, // Fundo para cobrir linha se necessário
      borderWidth: 2,
      borderColor: theme.colors.textSecondary,
    },
    exerciseIconCompleted: {
      borderColor: theme.colors.success,
      backgroundColor: `${theme.colors.success}10`,
    },
    exerciseDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.textSecondary,
    },
    exerciseTextContainer: {
      flex: 1,
    },
    exerciseTitle: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
    },
    exerciseTitleCompleted: {
      color: theme.colors.text,
      textDecorationLine: "none",
    },
  });
