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
      padding: theme.spacing.md,
      backgroundColor: `${theme.colors.reflection}15`,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.reflection,
      borderRadius: theme.radius.sm,
      marginBottom: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    anchorHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    anchorHeaderText: {
      flex: 1,
    },
    anchorTitle: {
      ...theme.text("sm", "semibold", theme.colors.reflection),
      marginBottom: 2,
    },
    anchorQuestionText: {
      ...theme.text("sm", "regular"),
      marginBottom: 8,
      opacity: 0.9,
    },
    anchorMetaRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      gap: theme.spacing.md,
    },
    focusBadge: {
      alignSelf: "flex-start",
      // marginTop: 6,
    },
    focusText: {
      ...theme.text("xs", "medium", theme.colors.reflection),
    },
    commentCountPill: {
      alignSelf: "flex-start",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: `${theme.colors.reflection}25`,
    },
    commentCountText: {
      ...theme.text("xs", "medium", theme.colors.reflection),
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
      backgroundColor: `${theme.colors.primary}12`,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: `${theme.colors.primary}30`,
    },
    forumInput: {
      width: "100%",
      minHeight: 40,
      maxHeight: 140,
      borderRadius: 0,
      paddingHorizontal: 0,
      paddingVertical: theme.spacing.sm,
      color: theme.colors.text,
      backgroundColor: "transparent",
      borderWidth: 0,
      borderColor: "transparent",
      textAlignVertical: "top",
      position: "relative",
      zIndex: 2,
      // elevation: 2,
    },
    composerFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: theme.spacing.sm,
      gap: theme.spacing.sm,
    },
    composerFooterLeft: {
      alignItems: "flex-start",
      width: 72,
    },
    composerFooterCenter: {
      flex: 1,
      alignItems: "center",
    },
    composerFooterRight: {
      alignItems: "flex-end",
    },

    composerActions: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: theme.spacing.md,
    },
    sendButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.full,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    sendButtonDisabled: {
      backgroundColor: theme.colors.muted,
    },
    sendButtonText: {
      ...theme.text("xs", "semibold", theme.colors.onPrimary),
      flexShrink: 0,
    },
    counter: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
      fontVariant: ["tabular-nums"],
    },
    anonymousRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    anonymousLabel: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
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
    stickyHeader: {
      backgroundColor: theme.colors.background,
      // paddingTop: theme.spacing.sm,
      // paddingBottom: theme.spacing.md,
      width: "100%",
    },
    searchContainer: {
      width: "100%",
    },
  });
