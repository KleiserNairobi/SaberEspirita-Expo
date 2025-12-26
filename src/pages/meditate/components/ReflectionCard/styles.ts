import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.lg,
      marginBottom: 16,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    image: {
      width: "100%",
      height: 160,
      backgroundColor: theme.colors.muted,
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
    },
    textContainer: {
      flex: 1,
      marginRight: 12,
    },
    title: {
      ...theme.text("lg", "semibold"),
      color: theme.colors.text,
      marginBottom: 6,
    },
    subtitle: {
      ...theme.text("sm", "regular"),
      color: theme.colors.muted,
      marginBottom: 12,
      lineHeight: 20,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    readingTime: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    readingTimeText: {
      ...theme.text("xs", "regular"),
      color: theme.colors.muted,
    },
  });
