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
      flexGrow: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.xs,
      paddingBottom: 150,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.sm,
    },
    headerSide: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    iconRingsContainer: {
      width: 104,
      height: 104,
      alignItems: "center",
      justifyContent: "center",
    },
    ringInner: {
      position: "absolute",
      width: 88,
      height: 88,
      borderRadius: 44,
      borderWidth: 4,
      borderColor: theme.colors.primary + "40",
    },
    ringMiddle: {
      position: "absolute",
      width: 96,
      height: 96,
      borderRadius: 48,
      borderWidth: 2,
      borderColor: theme.colors.primary + "25",
    },
    ringOuter: {
      position: "absolute",
      width: 104,
      height: 104,
      borderRadius: 52,
      borderWidth: 1,
      borderColor: theme.colors.primary + "15",
    },
    iconLargeContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTextContainer: {
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    title: {
      ...theme.text("xxxl", "semibold"),
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      ...theme.text("md", "regular", theme.colors.textSecondary),
      textAlign: "center",
    },
    emailText: {
      ...theme.text("md", "semibold", theme.colors.primary),
      textAlign: "center",
      marginTop: 4,
    },
    formGroup: {
      marginBottom: theme.spacing.sm,
    },
    label: {
      ...theme.text("sm", "medium"),
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      height: 48,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.card,
      paddingHorizontal: theme.spacing.md,
    },
    input: {
      flex: 1,
      ...theme.text("md", "regular"),
      color: theme.colors.text,
      paddingVertical: 0,
    },
    inputIcon: {
      marginRight: theme.spacing.xs,
    },
    eyeIconButton: {
      padding: theme.spacing.xs,
    },
    otpContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.xs,
      position: "relative",
    },
    hiddenInput: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.01,
      color: "transparent",
      fontSize: 1,
      zIndex: 10,
    },
    clearCodeButton: {
      alignSelf: "center",
      marginTop: -theme.spacing.xs,
      marginBottom: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
    },
    clearCodeText: {
      ...theme.text("xs", "medium"),
      color: theme.colors.error,
    },
    otpBox: {
      width: 48,
      height: 56,
      borderRadius: theme.radius.md,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.card,
      justifyContent: "center",
      alignItems: "center",
    },
    otpBoxFilled: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + "08",
    },
    otpBoxFocused: {
      borderColor: theme.colors.primary,
      borderWidth: 2,
    },
    otpDigit: {
      ...theme.text("xl", "bold"),
      color: theme.colors.text,
    },
    actionButton: {
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    resendContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: theme.spacing.xs,
      paddingVertical: theme.spacing.sm,
    },
    resendText: {
      ...theme.text("sm", "medium"),
      color: theme.colors.primary,
    },
    resendTextDisabled: {
      color: theme.colors.muted,
    },
    spamHintContainer: {
      marginTop: theme.spacing.xl,
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: theme.spacing.sm,
    },
    hintRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: theme.spacing.xs,
    },
    hintIcon: {
      marginTop: 2,
    },
    hintText: {
      flex: 1,
      ...theme.text("xs", "regular", theme.colors.textSecondary),
      lineHeight: 18,
    },
  });
