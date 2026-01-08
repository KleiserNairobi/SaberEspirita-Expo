import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export function createStyles(theme: ITheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.xl * 2,
    },
    // Custom Header
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
    headerTitle: {
      ...theme.text("lg", "bold"),
      color: theme.colors.text,
    },
    backButton: {
      padding: 4,
    },
    // Header Stats
    statsHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: theme.spacing.xl,
      marginTop: theme.spacing.md,
    },
    statsLeft: {
      flex: 1,
      paddingRight: theme.spacing.md,
    },
    statsRight: {
      alignItems: "center",
      justifyContent: "center",
      minWidth: 80,
    },
    subcategoryTitle: {
      ...theme.text("md", "semibold"),
      color: theme.colors.textSecondary,
      marginBottom: 2,
    },
    categoryTitle: {
      ...theme.text("sm", "regular"),
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    questionCount: {
      ...theme.text("sm", "regular"),
      color: theme.colors.textSecondary,
      opacity: 0.8,
    },
    percentageData: {
      ...theme.text("xl", "bold"),
      color: theme.colors.warning, // Using accented color equivalent
      lineHeight: 30,
    },
    percentageLabel: {
      ...theme.text("xs", "regular"),
      color: theme.colors.textSecondary,
      marginTop: -4,
      marginBottom: 4,
    },
    starsRow: {
      flexDirection: "row",
      gap: 2,
    },
    // Question Card
    questionCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.md,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: "hidden", // For the side border
      flexDirection: "row",
    },
    statusStrip: {
      width: 5,
      height: "100%",
    },
    cardContent: {
      flex: 1,
      padding: theme.spacing.md,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    questionIndex: {
      ...theme.text("sm", "bold"),
      color: theme.colors.text,
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: theme.radius.sm,
      gap: 4,
    },
    statusText: {
      ...theme.text("xs", "semibold"),
      color: theme.colors.text,
      textTransform: "lowercase",
    },
    questionText: {
      ...theme.text("sm", "regular"),
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    answerBlock: {
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.sm,
    },
    label: {
      ...theme.text("sm", "semibold"),
      color: theme.colors.text,
    },
    answerText: {
      ...theme.text("sm", "regular"),
      color: theme.colors.textSecondary,
    },
    explanationBlock: {
      marginTop: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    explanationTitle: {
      ...theme.text("sm", "medium"),
      color: theme.colors.text,
      marginBottom: 4,
    },
    explanationText: {
      ...theme.text("xs", "regular"),
      color: theme.colors.textSecondary,
      lineHeight: 18,
    },
    footer: {
      padding: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
  });
}
