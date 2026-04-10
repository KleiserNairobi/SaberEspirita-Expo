import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    sectionContainer: {
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: "hidden",
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
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
    titleContainer: {
      flex: 1,
    },
    title: {
      ...theme.text("md", "medium", theme.colors.text),
    },
    subtitle: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
    },
    activeContent: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingTop: 12,
    },
    filterContainer: {
      flexDirection: "row",
      justifyContent: "flex-start",
      marginBottom: 12,
      paddingHorizontal: 16,
      gap: 8,
    },
    filterButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: `${theme.colors.primary}10`,
    },
    activeFilterButton: {
      backgroundColor: theme.colors.primary,
    },
    filterText: {
      ...theme.text("xs", "medium", theme.colors.textSecondary),
    },
    activeFilterText: {
      color: "#FFFFFF",
    },
    prayerList: {
      paddingBottom: 8,
    },
    prayerItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    prayerItemLast: {
      borderBottomWidth: 0,
    },
    rankWrapper: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    rankText: {
      ...theme.text("xs", "bold", theme.colors.primary),
    },
    prayerInfo: {
      flex: 1,
      gap: 1,
    },
    prayerTitle: {
      ...theme.text("sm", "regular", theme.colors.text),
    },
    prayerAuthor: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
    },
    loadingContainer: {
      padding: 30,
      alignItems: "center",
    },
    emptyContainer: {
      padding: 20,
      alignItems: "center",
    },
    emptyText: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
    },
    countContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: `${theme.colors.muted}10`,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginRight: 8,
      gap: 4,
    },
    countText: {
      ...theme.text("xs", "medium", theme.colors.textSecondary),
    },
  });
