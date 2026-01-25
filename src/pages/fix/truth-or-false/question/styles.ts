import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    scrollContent: {
      padding: theme.spacing.lg,
      gap: theme.spacing.xl,
      paddingBottom: 40,
    },
    // Header
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.accent, // Verde claro
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      ...theme.text("xl", "semibold"),
      color: theme.colors.text,
      flex: 1,
    },
    // Question Card - FAQ Style
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
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    questionTextContainer: {
      flex: 1,
    },
    question: {
      fontFamily: theme.typography.weights.regular,
      fontSize: 17,
      color: theme.colors.text,
      lineHeight: 22,
    },
    // Metadata
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
    // Answers
    answersContainer: {
      gap: theme.spacing.md,
    },
    answeringContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
    },
    answeringText: {
      ...theme.text("sm", "medium"),
      color: theme.colors.textSecondary,
    },
  });
