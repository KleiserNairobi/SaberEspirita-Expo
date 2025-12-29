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
    messageList: {
      flexGrow: 1,
      paddingVertical: 16,
    },
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: 16,
    },
    emptyTitle: {
      ...theme.text("xl", "semibold"),
      color: theme.colors.text,
      marginBottom: 8,
    },
    emptyText: {
      ...theme.text("md", "regular"),
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
    },
    loadingContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
    },
    loadingText: {
      ...theme.text("sm", "regular"),
      color: theme.colors.textSecondary,
      marginLeft: 8,
    },
    typingAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 8,
    },
    typingBubble: {
      maxWidth: "85%",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    errorContainer: {
      backgroundColor: `${theme.colors.error}20`,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors.error,
    },
    errorText: {
      ...theme.text("sm", "regular"),
      color: theme.colors.error,
      textAlign: "center",
    },
  });
