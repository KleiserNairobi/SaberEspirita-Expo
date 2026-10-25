import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    bottomSheetBackground: {
      backgroundColor: theme.colors.card,
      borderTopLeftRadius: theme.radius.xl,
      borderTopRightRadius: theme.radius.xl,
    },
    handleIndicator: {
      backgroundColor: theme.colors.border,
      width: 44,
      height: 4,
      borderRadius: theme.radius.full,
      alignSelf: "center",
      marginTop: theme.spacing.xs,
    },
    container: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.xl,
    },

    // Header
    headerRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: theme.spacing.lg,
    },
    headerTextContainer: {
      flex: 1,
      paddingRight: theme.spacing.md,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    title: {
      ...theme.text("xl", "bold", theme.colors.text),
    },

    subtitle: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
      marginTop: 2,
    },
    closeButton: {
      width: 36,
      height: 36,
      borderRadius: theme.radius.full,
      backgroundColor: `${theme.colors.textSecondary}15`,
      justifyContent: "center",
      alignItems: "center",
    },

    // Seção genérica
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.sm,
    },
    sectionLabel: {
      ...theme.text("xs", "semibold", theme.colors.textSecondary),
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },

    // Badge do tamanho ativo
    sizeBadge: {
      paddingHorizontal: theme.spacing.sm + 2,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
      backgroundColor: `${theme.colors.primary}15`,
    },
    sizeBadgeText: {
      ...theme.text("xs", "semibold", theme.colors.primary),
    },

    // Slider Card
    sliderCard: {
      backgroundColor: `${theme.colors.primary}08`,
      borderWidth: 1,
      borderColor: `${theme.colors.border}`,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    sliderLabelA: {
      ...theme.text("sm", "regular", theme.colors.text),
      minWidth: 24,
      textAlign: "center",
    },
    sliderLabelBigA: {
      ...theme.text("xl", "bold", theme.colors.text),
      minWidth: 28,
      textAlign: "center",
    },
    sliderTrackContainer: {
      flex: 1,
      marginHorizontal: theme.spacing.md,
      height: 36,
      justifyContent: "center",
    },
    sliderBaseLine: {
      position: "absolute",
      left: 12,
      right: 12,
      height: 4,
      backgroundColor: theme.colors.border,
      borderRadius: 2,
    },
    sliderActiveLine: {
      position: "absolute",
      left: 12,
      height: 4,
      backgroundColor: theme.colors.primary,
      borderRadius: 2,
    },
    stepsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    stepTouchTarget: {
      width: 32,
      height: 32,
      justifyContent: "center",
      alignItems: "center",
    },
    stepDot: {
      width: 10,
      height: 10,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.border,
    },
    stepDotActive: {
      backgroundColor: theme.colors.primary,
    },
    stepHalo: {
      width: 22,
      height: 22,
      borderRadius: theme.radius.full,
      borderWidth: 2,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.card,
      justifyContent: "center",
      alignItems: "center",
    },
    stepInnerDot: {
      width: 10,
      height: 10,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primary,
    },

    // Espaçamento de Linha Segmentado
    segmentContainer: {
      flexDirection: "row",
      backgroundColor: `${theme.colors.primary}08`,
      borderRadius: theme.radius.sm,
      padding: theme.spacing.xs,
      gap: theme.spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    segmentButton: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.xs,
      alignItems: "center",
      justifyContent: "center",
    },
    segmentButtonActive: {
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: `${theme.colors.primary}30`,
    },
    segmentTitle: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
    },
    segmentTitleActive: {
      ...theme.text("sm", "semibold", theme.colors.text),
    },
    segmentSubtitle: {
      ...theme.text("xs", "regular", theme.colors.muted),
      marginTop: 2,
    },
    segmentSubtitleActive: {
      ...theme.text("xs", "semibold", theme.colors.primary),
      marginTop: 2,
    },

    // Tema de Leitura
    themeCardsRow: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },
    themeCard: {
      flex: 1,
      borderRadius: theme.radius.md,
      paddingVertical: theme.spacing.md,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1.5,
    },
    themeCardLight: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
    },
    themeCardDark: {
      backgroundColor: "#1C201A",
      borderColor: "#2C332C",
    },
    themeCardSelected: {
      borderColor: theme.colors.primary,
    },
    themeIconCircle: {
      width: 38,
      height: 38,
      borderRadius: theme.radius.full,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.xs,
    },
    themeIconCircleLight: {
      backgroundColor: `${theme.colors.primary}12`,
    },
    themeIconCircleDark: {
      backgroundColor: "rgba(255, 255, 255, 0.12)",
    },
    themeIconTextLight: {
      ...theme.text("sm", "bold", theme.colors.text),
    },
    themeIconTextDark: {
      ...theme.text("sm", "bold", "#FFFFFF"),
    },
    themeTitleLight: {
      ...theme.text("sm", "bold", theme.colors.text),
    },
    themeTitleDark: {
      ...theme.text("sm", "bold", "#F0F6E8"),
    },
    themeSubtitleLight: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
      marginTop: 2,
    },
    themeSubtitleDark: {
      ...theme.text("xs", "regular", "#9CA3AF"),
      marginTop: 2,
    },

    // Ações do Rodapé
    actionsContainer: {
      marginTop: theme.spacing.md,
      gap: theme.spacing.sm,
    },
  });
