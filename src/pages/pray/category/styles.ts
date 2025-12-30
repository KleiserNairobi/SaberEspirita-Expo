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
    // Header: Layout de 3 Colunas (Voltar | Ícone | Espaço)
    header: {
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.lg,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.md,
    },
    headerSide: {
      width: 40, // Largura fixa para simetria
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    filterButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.accent,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    filterButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    filterDot: {
      position: "absolute",
      top: -2,
      right: -2,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.colors.error,
      borderWidth: 2,
      borderColor: theme.colors.background,
    },
    iconRingsContainer: {
      width: 104,
      height: 104,
      alignItems: "center",
      justifyContent: "center",
    },
    // Anel interno - LARGO para efeito de vibração
    ringInner: {
      position: "absolute",
      width: 88, // 80 (ícone) + 2*4 (borda) = sem espaço branco
      height: 88,
      borderRadius: 44,
      borderWidth: 4, // Mais largo
      borderColor: theme.colors.primary + "40", // 40% opacidade
    },
    // Anel médio - transição do degradê
    ringMiddle: {
      position: "absolute",
      width: 96, // Mais próximo do anel interno
      height: 96,
      borderRadius: 48,
      borderWidth: 2,
      borderColor: theme.colors.primary + "25", // 25% opacidade
    },
    // Anel externo - mais sutil
    ringOuter: {
      position: "absolute",
      width: 104, // Mais próximo do anel médio
      height: 104,
      borderRadius: 52,
      borderWidth: 1,
      borderColor: theme.colors.primary + "15", // 15% opacidade
    },
    iconLargeContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTextContainer: {
      alignItems: "center",
    },
    title: {
      ...theme.text("xxxl", "semibold"),
      textAlign: "center",
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      ...theme.text("md", "regular", theme.colors.textSecondary),
      textAlign: "center",
    },
    // Toolbar: Apenas SearchBar
    toolbar: {
      paddingBottom: theme.spacing.md,
    },
    // Lista de Orações
    list: {
      flex: 1,
    },
    listContent: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: 150,
    },
    // Card de Oração (SEM ícone)
    prayerCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 10,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs + 4,
      marginBottom: theme.spacing.sm,
    },
    prayerContent: {
      flex: 1,
    },
    prayerTitle: {
      ...theme.text("lg", "semibold"),
    },
    prayerMetadata: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
      flex: 1,
    },
    metadataRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
    },
    favoriteIconInline: {
      marginRight: 6,
    },
    favoriteButton: {
      padding: 8,
    },
    // Estados
    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 40,
    },
    emptyText: {
      ...theme.text("md", "regular", theme.colors.textSecondary),
      textAlign: "center",
    },
  });
