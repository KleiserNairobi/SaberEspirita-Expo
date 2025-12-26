import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme, bottomInset: number = 0) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      padding: 10,
      paddingBottom: Math.max(10, bottomInset + 10),
      backgroundColor: theme.colors.background,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    input: {
      flex: 1,
      ...theme.text("md", "regular"),
      color: theme.colors.text,
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.md,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 12,
      maxHeight: 100,
      marginRight: 12,
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
  });
