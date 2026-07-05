import { ITheme } from "@/configs/theme/types";
import { StyleSheet } from "react-native";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    contentSheetScroll: {
      paddingBottom: 60,
    },
    descriptionSection: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      ...theme.text("lg", "semibold"),
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    descriptionText: {
      ...theme.text("md", "regular", theme.colors.textSecondary),
      textAlign: "justify",
      lineHeight: 24,
    },
    metadataRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      flexWrap: "wrap",
      gap: 6,
      marginBottom: theme.spacing.md,
    },
    metadataItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    metadataText: {
      ...theme.text("xs", "regular", theme.colors.muted),
      fontSize: 11,
    },
    metadataSeparator: {
      ...theme.text("xs", "regular", theme.colors.muted),
      fontSize: 11,
    },
    playerContainer: {
      marginTop: theme.spacing.md,
      width: "100%",
    },
    progressContainer: {
      width: "100%",
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    progressBarBackground: {
      height: 6,
      backgroundColor: theme.colors.border,
      borderRadius: 3,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: 3,
    },
    timeRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
    },
    timeText: {
      ...theme.text("xs", "medium"),
      color: theme.colors.textSecondary,
    },
    controlsContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      paddingHorizontal: 20,
      marginTop: theme.spacing.sm,
    },
    playButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 5,
    },
    secondaryControl: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: `${theme.colors.primary}15`,
      justifyContent: "center",
      alignItems: "center",
    },
  });
