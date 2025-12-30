import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export function createStyles(theme: ITheme) {
  return StyleSheet.create({
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
      width: 40,
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
      width: 88,
      height: 88,
      borderRadius: 44,
      borderWidth: 4,
      borderColor: theme.colors.primary + "40", // 40% opacidade
    },
    // Anel médio - transição do degradê
    ringMiddle: {
      position: "absolute",
      width: 96,
      height: 96,
      borderRadius: 48,
      borderWidth: 2,
      borderColor: theme.colors.primary + "25", // 25% opacidade
    },
    // Anel externo - mais sutil
    ringOuter: {
      position: "absolute",
      width: 104,
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
      ...theme.text("md", "regular"),
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    searchContainer: {
      paddingBottom: theme.spacing.md,
    },
    list: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
      gap: theme.spacing.sm,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: theme.spacing.xl * 2,
    },
    emptyText: {
      ...theme.text("md", "regular"),
      color: theme.colors.textSecondary,
    },
  });
}
