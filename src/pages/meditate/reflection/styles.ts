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
    scrollContent: {
      paddingBottom: 120,
    },
    coverImageContainer: {
      position: "relative",
      width: "100%",
      height: 250,
    },
    coverImage: {
      width: "100%",
      height: "100%",
      backgroundColor: theme.colors.muted,
    },
    imageGradient: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 120,
    },
    overlayContent: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: 20,
      paddingBottom: 24,
    },
    overlayTitle: {
      ...theme.text("xxl", "bold"),
      color: "#FFFFFF",
      marginBottom: 8,
      lineHeight: 32,
      textShadowColor: "rgba(0, 0, 0, 0.75)",
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    overlaySubtitle: {
      ...theme.text("md", "regular"),
      color: "rgba(255, 255, 255, 0.9)",
      lineHeight: 22,
      textShadowColor: "rgba(0, 0, 0, 0.75)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    content: {
      padding: 20,
    },
    metadata: {
      gap: 6,
      // marginBottom: 16,
    },
    metadataRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    metadataItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      flex: 1,
    },
    metadataText: {
      ...theme.text("sm", "regular"),
      color: theme.colors.muted,
    },
    actionsContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      paddingVertical: 30,
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: "center",
      justifyContent: "center",
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: 10,
    },
    bodyText: {
      ...theme.text("md", "regular"),
      color: theme.colors.text,
      lineHeight: 28,
      textAlign: "justify",
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 24,
    },
    tag: {
      backgroundColor: theme.isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: theme.radius.full,
    },
    tagText: {
      ...theme.text("xs", "medium"),
      color: theme.colors.primary,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    errorText: {
      ...theme.text("md", "regular"),
      color: theme.colors.muted,
      textAlign: "center",
    },
  });
