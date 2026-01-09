import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export function createStyles(theme: ITheme) {
  return StyleSheet.create({
    container: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      gap: theme.spacing.md,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    headerText: {
      flex: 1,
    },
    title: {
      ...theme.text("lg", "semibold"),
      marginBottom: 2,
    },
    subtitle: {
      ...theme.text("sm", "medium"),
      color: theme.colors.textSecondary,
    },
    // Body / Metadata section
    body: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    metadataItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    metadataText: {
      ...theme.text("sm", "regular"),
      color: theme.colors.muted,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    // Styles for the Text Link mode (Pending)
    textLink: {
      ...theme.text("md", "bold"),
    },
    // Styles for the Button mode (Completed)
    completedButton: {
      borderRadius: theme.radius.full,
      paddingVertical: 12,
      paddingHorizontal: theme.spacing.xl,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      alignSelf: "stretch",
      width: "100%",
    },
    completedButtonText: {
      ...theme.text("md", "bold"),
      color: "#FFFFFF",
      textTransform: "uppercase",
    },
    buttonIcon: {
      marginLeft: 8,
    },
  });
}
