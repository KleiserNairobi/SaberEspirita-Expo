import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
    },
    scrollContent: {
      padding: theme.spacing.lg,
      paddingBottom: 150, // Tab bar height + safe area inset
      gap: theme.spacing.lg,
    },
    // Header
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTop: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.accent, // Verde claro
      alignItems: "center",
      justifyContent: "center",
    },
    headerTextContainer: {
      flex: 1,
    },
    headerTitle: {
      ...theme.text("xxl", "semibold"),
    },
    headerSubtitle: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
      marginTop: 2,
    },
    saveButton: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.accent, // Verde claro
      alignItems: "center",
      justifyContent: "center",
    },
    // Metadados - Estilo Medite
    // Metadados - Estilo Medite
    metadata: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    metadataItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      flex: 1,
    },
    metadataText: {
      ...theme.text("sm", "regular"),
      color: theme.colors.muted,
      flexShrink: 1,
    },
    // Pergunta Card - Estilo FAQ
    questionCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: "hidden",
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    questionHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: theme.spacing.md,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.accent,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    questionTextContainer: {
      flex: 1,
    },
    question: {
      ...theme.text("lg", "regular"),
      lineHeight: 24,
    },
    // Explicação
    explanationCard: {
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: theme.spacing.md,
    },
    explanationTitle: {
      ...theme.text("lg", "semibold"),
    },
    explanationText: {
      ...theme.text("md", "regular", theme.colors.textSecondary),
      lineHeight: 24,
    },
    referenceContainer: {
      marginTop: theme.spacing.sm,
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    referenceLabel: {
      ...theme.text("sm", "semibold", theme.colors.textSecondary),
      marginBottom: 4,
    },
    referenceText: {
      ...theme.text("md", "semibold", theme.colors.primary),
    },
    // Error State
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: theme.spacing.lg,
      padding: theme.spacing.lg,
    },
    errorText: {
      ...theme.text("lg", "semibold"),
      textAlign: "center",
    },
    errorButton: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.md,
    },
    errorButtonText: {
      ...theme.text("md", "semibold", theme.colors.onPrimary),
    },
  });
