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
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: 150,
    },
    header: {
      marginTop: theme.spacing.xxl,
      marginBottom: theme.spacing.md,
    },
    title: {
      ...theme.text("xxxl", "semibold"),
      marginBottom: theme.spacing.sm,
      textAlign: "center",
      color: theme.colors.text,
    },
    subtitle: {
      ...theme.text("lg", "regular", theme.colors.textSecondary),
      textAlign: "center",
      marginBottom: theme.spacing.sm,
    },
    metadata: {
      gap: theme.spacing.sm,
      alignItems: "flex-start",
      alignSelf: "stretch", // Ocupa toda a largura interna e garante que o item da extrema esquerda encoste no limite interno do box do texto
      marginBottom: theme.spacing.md,
    },
    content: {
      // padding removed since scrollContent handles horizontal padding
    },
    metadataItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
    },
    metadataText: {
      ...theme.text("sm", "regular"),
      color: theme.colors.muted,
      flexShrink: 1, // Permite que a fonte longa de um livro caia para a próxima linha sem furar o tamanho da tela
      marginTop: -2, // Compensação fina para alinhar com o topo do ícone
    },
    actionsContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      paddingVertical: 30,
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: "center",
      justifyContent: "center",
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: 10,
    },
    bodyText: {
      ...theme.text("md", "regular"),
      color: theme.colors.text,
      lineHeight: 28,
      textAlign: "justify",
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 24,
    },
    tag: {
      backgroundColor: theme.isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: theme.radius.full,
    },
    tagText: {
      ...theme.text("xs", "medium"),
      color: theme.colors.primary,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    errorText: {
      ...theme.text("md", "regular"),
      color: theme.colors.muted,
      textAlign: "center",
    },
  });
