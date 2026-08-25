import { ITheme } from "@/configs/theme/types";
import { StyleSheet } from "react-native";

export function createStyles(theme: ITheme) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: 24,
      paddingTop: 8,
      gap: 24,
    },
    title: {
      ...theme.text("xl", "semibold"),
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: 6,
    },
    description: {
      ...theme.text("md", "regular", theme.colors.textSecondary),
      textAlign: "center",
      marginBottom: 16,
    },
    inputContainer: {
      gap: 8,
    },
    label: {
      ...theme.text("sm", "semibold", theme.colors.textSecondary),
      marginLeft: 4,
    },
    input: {
      height: 48,
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.text("md", "regular", theme.colors.text),
    },
    inputError: {
      borderColor: theme.colors.error,
    },
    errorText: {
      ...theme.text("xs", "regular", theme.colors.error),
      marginLeft: 4,
      marginTop: -4,
    },
    avatarSection: {
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 8,
    },
    avatarWrapper: {
      position: "relative",
      width: 90,
      height: 90,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarContainer: {
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: theme.colors.accent,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    avatarImage: {
      width: "100%",
      height: "100%",
    },
    avatarInitials: {
      ...theme.text("xxl", "bold"),
      color: theme.colors.primary,
    },
    cameraBadge: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: theme.colors.primary,
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: theme.colors.card,
    },
    photoOptionsRow: {
      flexDirection: "row",
      gap: 12,
      marginTop: 10,
    },
    photoOptionButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: theme.radius.sm,
      backgroundColor: `${theme.colors.primary}15`,
    },
    photoOptionText: {
      ...theme.text("xs", "medium"),
      color: theme.colors.primary,
    },
    removePhotoText: {
      ...theme.text("xs", "medium"),
      color: theme.colors.error,
      marginTop: 6,
    },
    actions: {
      gap: 12,
      marginTop: 8,
    },
  });
}
