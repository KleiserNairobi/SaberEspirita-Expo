import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      marginHorizontal: 20,
      marginBottom: 20,
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 16,
    },
    content: {
      gap: 8,
    },
    activeContent: {
      gap: 12,
      marginTop: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingTop: 16,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: "center",
      justifyContent: "center",
    },
    suggestionLabel: {
      ...theme.text("md", "medium", theme.colors.text),
    },
    suggestionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 2,
    },
    allPrayersLink: {
      ...theme.text("sm", "medium", theme.colors.primary),
      paddingLeft: 8,
    },
    greeting: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
    },
    description: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
      lineHeight: 20,
    },
    scrollTip: {
      ...theme.text("xs", "medium", theme.colors.primary),
      marginBottom: 8,
      textAlign: "left",
      // opacity: 0.8,
    },
    prayerList: {
      backgroundColor: "transparent",
      // marginTop: 4,
    },
    prayerItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    prayerItemLast: {
      borderBottomWidth: 0,
    },
    prayerInfo: {
      flex: 1,
      gap: 2,
    },
    prayerTitle: {
      ...theme.text("md", "regular"),
      color: theme.colors.text,
    },
    prayerCategory: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
    },
    actionText: {
      ...theme.text("xs", "semibold", theme.colors.primary),
    },
    aiLink: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    aiLinkText: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
      textDecorationLine: "underline",
    },
  });
