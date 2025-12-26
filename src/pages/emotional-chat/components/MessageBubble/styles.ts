import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      marginVertical: 8,
      marginHorizontal: 16,
      alignItems: "flex-start",
    },
    userContainer: {
      flexDirection: "row-reverse",
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 8,
    },
    avatarText: {
      fontSize: 18,
    },
    bubble: {
      maxWidth: "75%",
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 18,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 1,
    },
    userBubble: {
      borderTopRightRadius: 4,
    },
    assistantBubble: {
      borderTopLeftRadius: 4,
    },
    userText: {
      ...theme.text("md", "regular"),
      color: theme.colors.text,
      lineHeight: 20,
    },
    assistantText: {
      ...theme.text("md", "regular"),
      color: theme.colors.text,
      lineHeight: 20,
    },
    timestamp: {
      ...theme.text("xs", "regular"),
      color: theme.colors.muted,
      marginTop: 4,
      textAlign: "right",
    },
  });
