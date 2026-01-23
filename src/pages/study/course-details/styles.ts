import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    // HEADER
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.accent,
      marginRight: theme.spacing.md,
    },
    headerTitle: {
      ...theme.text("lg", "bold"),
      color: theme.colors.text,
      flex: 1,
    },

    // SCROLL CONTENT
    scrollContent: {
      padding: theme.spacing.md,
      paddingBottom: 120, // Espaço para footer fixo
    },

    // PROGRESS (SEM CARD)
    progressCard: {
      marginBottom: theme.spacing.md,
    },
    progressHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    progressLabel: {
      ...theme.text("xs", "semibold", theme.colors.textSecondary),
      letterSpacing: 0.5,
    },
    progressValue: {
      ...theme.text("lg", "bold", theme.colors.primary),
    },
    progressBarBg: {
      width: "100%",
      height: 8,
      backgroundColor: theme.colors.border,
      borderRadius: theme.radius.xs,
      overflow: "hidden",
      marginBottom: theme.spacing.xs,
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.xs,
    },
    progressFooter: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
    },

    // STATS LIST (2 COLUNAS)
    statsList: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
      marginTop: theme.spacing.md,
    },
    statItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      width: "48%", // 2 colunas
    },
    statText: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
      flex: 1,
    },
    iconCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: "center",
      justifyContent: "center",
    },

    // STATS GRID
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    statCard: {
      flex: 1,
      minWidth: "30%", // 3 colunas em telas maiores
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.lg, // Mais arredondado
      padding: theme.spacing.lg, // Mais padding
      alignItems: "center",
      gap: theme.spacing.xs,
      // Removida borda marcada
      // Adicionada sombra sutil
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    certificateCard: {
      backgroundColor: `${theme.colors.warning}08`, // Mais sutil (8% opacidade)
      // Sem borda
    },
    statValue: {
      ...theme.text("xl", "bold"), // Maior
      color: theme.colors.text,
    },
    statLabel: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
    },

    // SECTION
    section: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    sectionTitle: {
      ...theme.text("lg", "semibold"),
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    descriptionText: {
      ...theme.text("md", "regular", theme.colors.textSecondary),
      lineHeight: 24,
    },

    // REQUIREMENTS CARD
    requirementsCard: {
      backgroundColor: `${theme.colors.warning}08`,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: `${theme.colors.warning}30`,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      marginTop: theme.spacing.md,
    },
    requirementsHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    requirementsTitle: {
      ...theme.text("md", "regular"),
    },
    requirementsList: {
      gap: theme.spacing.xs,
    },
    requirementItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
      marginLeft: theme.spacing.md,
    },
    requirementBullet: {
      ...theme.text("md", "bold", theme.colors.warning),
    },
    requirementText: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
      flex: 1,
    },

    // FOOTER
    footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    footerButtons: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    flexButton: {
      flex: 1,
    },
    primaryButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.md,
      paddingVertical: theme.spacing.md,
      alignItems: "center",
      justifyContent: "center",
    },
    primaryButtonText: {
      ...theme.text("md", "bold"),
      color: theme.colors.background,
    },
    secondaryButton: {
      backgroundColor: "transparent",
      borderRadius: theme.radius.md,
      paddingVertical: theme.spacing.md,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    secondaryButtonText: {
      ...theme.text("md", "bold", theme.colors.primary),
    },
  });
