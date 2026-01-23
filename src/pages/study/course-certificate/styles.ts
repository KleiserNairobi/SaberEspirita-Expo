import { StyleSheet, Platform } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.md,
    },
    errorText: {
      ...theme.text("md", "regular"),
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: theme.spacing.md,
    },
    scrollContent: {
      flexGrow: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.md,
      alignItems: "center",
      paddingBottom: 40,
    },
    header: {
      marginBottom: theme.spacing.lg,
      alignItems: "center",
      marginTop: theme.spacing.md,
    },
    headerTitle: {
      ...theme.text("xxl", "bold"),
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: 4,
    },
    headerSubtitle: {
      ...theme.text("md", "regular"),
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    certificateContainer: {
      backgroundColor: "#FDFBF7", // Um leve tom de papel creme/off-white
      width: "100%",
      aspectRatio: 1.41, // A4 Landscape ratio approximation
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      position: "relative",
    },
    // Borda Externa Dourada/Premium
    certificateBorder: {
      flex: 1,
      margin: 10,
      borderWidth: 5,
      borderColor: theme.colors.primary, // Ou um tom dourado se tiver
      padding: 4,
    },
    // Borda Interna Fina
    certificateInnerBorder: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 30,
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#FDFBF7",
    },
    certHeader: {
      alignItems: "center",
      marginTop: 10,
    },
    certIcon: {
      marginBottom: 10,
      opacity: 0.8,
    },
    certTitle: {
      fontFamily: Platform.OS === "ios" ? "Georgia" : "serif", // Fonte Serifada Clássica
      fontSize: 28,
      color: theme.colors.primary,
      letterSpacing: 2,
      fontWeight: "bold",
      textTransform: "uppercase",
      marginBottom: 4,
    },
    certSubtitle: {
      ...theme.text("sm", "regular"),
      color: "#666",
      letterSpacing: 3,
      textTransform: "uppercase",
    },
    certBody: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10,
    },
    certTextIntro: {
      fontFamily: Platform.OS === "ios" ? "Georgia-Italic" : "serif",
      fontSize: 16,
      color: "#444",
      textAlign: "center",
      marginBottom: 10,
      fontStyle: "italic",
    },
    studentName: {
      fontFamily: "Allura_400Regular", // Mantendo a script para o nome
      fontSize: 36, // Maior destaque
      color: "#222",
      textAlign: "center",
      marginVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#DDD",
      paddingBottom: 5,
      minWidth: "80%",
    },
    certTextConcluded: {
      fontFamily: Platform.OS === "ios" ? "Georgia-Italic" : "serif",
      fontSize: 16,
      color: "#444",
      textAlign: "center",
      marginTop: 10,
      marginBottom: 5,
      fontStyle: "italic",
    },
    courseTitle: {
      fontFamily: "Oswald_700Bold",
      fontSize: 22,
      color: theme.colors.primary,
      textAlign: "center",
      marginBottom: 25,
      textTransform: "uppercase",
      paddingHorizontal: 10,
    },
    metadataContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
      marginTop: 10,
      borderTopWidth: 1,
      borderTopColor: "rgba(0,0,0,0.05)",
      paddingTop: 15,
    },
    metadataItem: {
      alignItems: "center",
    },
    metadataLabel: {
      fontSize: 10,
      color: "#888",
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 2,
    },
    metadataValue: {
      fontSize: 14,
      color: "#333",
      fontWeight: "600",
    },
    certFooter: {
      width: "100%",
      alignItems: "center",
      marginTop: 20,
    },
    dateText: {
      fontSize: 14,
      color: "#666",
      marginBottom: 20,
      fontStyle: "italic",
    },
    signatureContainer: {
      alignItems: "center",
      marginTop: 10,
    },
    signatureLine: {
      width: 150,
      height: 1,
      backgroundColor: "#333",
      marginBottom: 8,
    },
    signatureText: {
      fontFamily: "Allura_400Regular",
      fontSize: 24,
      color: "#333",
    },
    signatureLabel: {
      fontSize: 10,
      textTransform: "uppercase",
      color: "#888",
      marginTop: 2,
    },
    certHash: {
      position: "absolute",
      bottom: 4,
      right: 6,
      fontSize: 8,
      color: "#CCC",
    },
    // Ações
    actionsContainer: {
      width: "100%",
      marginTop: theme.spacing.xl,
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
    },
    shareButton: {
      backgroundColor: theme.colors.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      gap: theme.spacing.sm,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    shareButtonText: {
      ...theme.text("lg", "semibold"),
      color: "#FFF",
    },
    homeButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      gap: theme.spacing.sm,
    },
    homeButtonText: {
      ...theme.text("lg", "medium"),
      color: theme.colors.text,
    },
  });
