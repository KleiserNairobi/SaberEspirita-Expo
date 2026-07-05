import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    mainContentContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      marginTop: -32,
    },
    cardScroll: {
      flex: 1,
    },
    cardScrollContent: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.lg,
      paddingBottom: 150,
    },
  });
