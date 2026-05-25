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
    composerContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      // gap: theme.spacing.sm,
      width: "100%",
    },
    contentWrapper: {
      overflow: "hidden",
    },
    composerTitle: {
      ...theme.text("md", "medium"),
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    inputContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 100,
      justifyContent: "space-between",
    },
    forumInput: {
      ...theme.text("sm", "regular"),
      color: theme.colors.text,
      minHeight: 40,
      textAlignVertical: "top",
      padding: 0,
      margin: 0,
    },
    counter: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
      textAlign: "right",
      marginTop: theme.spacing.xs,
      fontVariant: ["tabular-nums"],
    },
    anonymousCard: {
      backgroundColor: `${theme.colors.primary}15`,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: theme.spacing.sm,
    },
    anonymousCardLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      flex: 1,
    },
    anonymousIconBg: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: "center",
      justifyContent: "center",
    },
    anonymousTextColumn: {
      flex: 1,
    },
    anonymousTitle: {
      ...theme.text("sm", "medium"),
      color: theme.colors.text,
    },
    anonymousDescription: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
      marginTop: 2,
    },
    sendButton: {
      backgroundColor: theme.colors.primary,
      height: 48,
      borderRadius: theme.radius.md,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: theme.spacing.sm,
      marginTop: theme.spacing.xs,
    },
    sendButtonDisabled: {
      backgroundColor: theme.colors.muted,
    },
    sendButtonText: {
      ...theme.text("sm", "bold", theme.colors.onPrimary),
      letterSpacing: 0.5,
    },
    listContent: {
      paddingBottom: 140,
    },
    commentCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.md,
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
      backgroundColor: `${theme.colors.primary}15`,
    },
    avatarText: {
      ...theme.text("md", "semibold", theme.colors.primary),
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
    reactionCountBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: `${theme.colors.border}60`,
      paddingHorizontal: 6,
      paddingVertical: 4,
      borderRadius: theme.radius.sm,
    },
    reactionCountText: {
      ...theme.text("sm", "medium", theme.colors.textSecondary),
    },
    reactButton: {
      ...theme.text("sm", "semibold", theme.colors.primary),
    },
    reactionActionButton: {
      backgroundColor: `${theme.colors.primary}25`,
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
    reactionSheetHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.lg,
    },
    closeButton: {
      padding: theme.spacing.xs,
      backgroundColor: `${theme.colors.border}40`,
      borderRadius: theme.radius.full,
      alignItems: "center",
      justifyContent: "center",
    },
    reactionSheetContent: {
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.xl,
    },
    reactionSheetTitle: {
      ...theme.text("xl", "bold"),
      color: theme.colors.text,
    },
    reactionOptions: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      rowGap: theme.spacing.md,
    },
    reactionOption: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      width: "48%",
    },
    reactionOptionSelected: {
      backgroundColor: `${theme.colors.primary}10`,
      borderColor: theme.colors.primary,
    },
    reactionOptionText: {
      ...theme.text("sm", "semibold"),
      color: theme.colors.textSecondary,
    },
    reactionOptionTextSelected: {
      color: theme.colors.primary,
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
