import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.lg,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.accent,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.md,
    },
    headerTextContainer: {
      flex: 1,
    },
    title: {
      ...theme.text("lg", "semibold"),
      color: theme.colors.text,
    },
    subtitle: {
      ...theme.text("sm", "regular"),
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    headerTitle: {
      ...theme.text("xl", "bold"),
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    headerSubtitle: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
      marginTop: 2,
    },
    anchorCard: {
      backgroundColor: theme.colors.primary + "10",
      borderRadius: theme.radius.lg,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      marginBottom: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    anchorHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    anchorIconContainer: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
    },
    anchorHeaderText: {
      flex: 1,
    },
    anchorTitle: {
      ...theme.text("md", "medium"),
      color: theme.colors.text,
      marginBottom: 1,
    },
    anchorSubtitle: {
      ...theme.text("sm", "medium"),
      color: theme.colors.textSecondary,
    },
    anchorQuestionText: {
      ...theme.text("sm", "regular"),
      color: theme.colors.text,
    },
    anchorMetaRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.spacing.sm,
    },
    anchorMetaItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    anchorMetaText: {
      ...theme.text("sm", "regular"),
      color: theme.colors.muted,
    },
    commentCountPill: {
      alignSelf: "flex-start",
      backgroundColor: theme.colors.accent,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 6,
      borderRadius: theme.radius.full,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    commentCountText: {
      ...theme.text("sm", "semibold"),
      color: theme.colors.textSecondary,
    },
    anchorFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    anchorCtaText: {
      ...theme.text("md", "bold"),
      color: theme.colors.primary,
    },
    inputCard: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.radius.lg,
      padding: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: theme.spacing.md,
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 12,
    },
    forumInput: {
      flex: 1,
      minHeight: 40,
      maxHeight: 140,
      borderRadius: theme.radius.md,
      paddingHorizontal: 16,
      paddingVertical: 12,
      color: theme.colors.text,
      backgroundColor: theme.colors.card,
      textAlignVertical: "center",
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    sendButtonDisabled: {
      backgroundColor: theme.colors.muted,
    },
    inputFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: theme.spacing.sm,
    },
    counter: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
    },
    anonymousToggle: {
      ...theme.text("sm", "semibold", theme.colors.primary),
    },
    listContent: {
      paddingBottom: 140,
    },
    commentCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: theme.spacing.md,
    },
    commentHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: theme.spacing.sm,
    },
    commentHeaderLeft: {
      flexDirection: "row",
      gap: theme.spacing.md,
      alignItems: "center",
      flex: 1,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
    },
    avatarText: {
      ...theme.text("md", "bold", theme.colors.onPrimary),
    },
    name: {
      ...theme.text("md", "medium"),
      color: theme.colors.text,
    },
    meta: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
    },
    levelTag: {
      marginTop: 2,
      ...theme.text("sm", "medium", theme.colors.textSecondary),
    },
    commentMenuButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    content: {
      ...theme.text("sm", "regular"),
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    reactionsRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.spacing.md,
    },
    reactionsCounts: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      flexWrap: "wrap",
      flex: 1,
    },
    reactionCount: {
      ...theme.text("sm", "medium", theme.colors.textSecondary),
    },
    reactButton: {
      ...theme.text("sm", "semibold", theme.colors.primary),
    },
    reactionActionButton: {
      backgroundColor: `${theme.colors.primary}20`,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radius.sm,
      alignItems: "center",
      justifyContent: "center",
    },
    reactionActionText: {
      ...theme.text("sm", "semibold"),
      color: theme.colors.primary,
    },
    loadMore: {
      paddingVertical: theme.spacing.md,
      alignItems: "center",
    },
    loadMoreText: {
      ...theme.text("sm", "semibold", theme.colors.primary),
    },
    bottomSheetBackground: {
      backgroundColor: theme.colors.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    },
    handleIndicator: {
      backgroundColor: theme.colors.border,
      width: 40,
      height: 4,
    },
    reactionSheetContent: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.lg,
    },
    reactionSheetTitle: {
      ...theme.text("lg", "bold"),
      color: theme.colors.text,
    },
    reactionOptions: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.md,
      marginTop: theme.spacing.lg,
    },
    reactionOption: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radius.full,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    reactionOptionSelected: {
      borderColor: theme.colors.primary,
    },
    reactionOptionText: {
      ...theme.text("sm", "semibold"),
      color: theme.colors.text,
    },
  });
