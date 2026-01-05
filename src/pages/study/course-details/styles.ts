import { StyleSheet, Dimensions } from "react-native";
import { ITheme } from "@/configs/theme/types";

const { width } = Dimensions.get("window");
// Altura da imagem do hero
const HERO_HEIGHT = 320;
// Altura do footer fixo
const FOOTER_HEIGHT = 100;

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: FOOTER_HEIGHT + 20, // Espaço para o footer fixo
    },

    // HERO SECTION
    heroContainer: {
      width: "100%",
      height: HERO_HEIGHT,
      position: "relative",
    },
    heroImage: {
      width: "100%",
      height: "100%",
    },
    backButton: {
      position: "absolute",
      top: 48,
      left: 16,
      zIndex: 10,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "center",
      alignItems: "center",
    },
    heroOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: 24,
      paddingBottom: 32,
      // O gradiente deve ser gerado pelo LinearGradient no componente
    },
    courseTitle: {
      ...theme.text("xxl", "semibold"), // Reduzido de 'bold' para 'semibold'
      color: "#FFFFFF",
      marginBottom: 8,
      textShadowColor: "rgba(0, 0, 0, 0.5)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    authorContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    authorText: {
      ...theme.text("sm", "medium"),
      color: "rgba(255, 255, 255, 0.9)",
    },

    // PROGRESS SECTION
    progressSection: {
      paddingHorizontal: 20,
      marginTop: 24,
      marginBottom: 24,
    },
    progressHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    progressLabel: {
      ...theme.text("xs", "medium"),
      textTransform: "uppercase",
      color: theme.colors.textSecondary,
      letterSpacing: 0.5,
    },
    progressValue: {
      ...theme.text("xs", "bold"),
      color: theme.colors.text,
    },
    progressBarBg: {
      width: "100%",
      height: 8,
      backgroundColor: theme.colors.border,
      borderRadius: 4,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: 4,
    },

    // STATS GRID
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: 16,
      gap: 12,
      marginBottom: 32,
    },
    statCard: {
      // 50% menos o gap
      width: (width - 32 - 12) / 2,
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 12,
    },
    iconCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(126, 217, 87, 0.1)", // Primary com opacidade
      justifyContent: "center",
      alignItems: "center",
    },
    statInfo: {
      flex: 1,
    },
    statValue: {
      ...theme.text("lg", "semibold"), // Reduzido de 'bold' para 'semibold'
      color: theme.colors.text,
      marginBottom: 2,
    },
    statLabel: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
    },

    // DESCRIPTION SECTION
    sectionContainer: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    sectionTitle: {
      ...theme.text("lg", "semibold"),
      color: theme.colors.text,
      marginBottom: 12,
    },
    descriptionText: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
      lineHeight: 24,
    },

    // INSTRUCTOR MINI CARD
    instructorCard: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 24,
      paddingTop: 24,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      gap: 16,
    },
    instructorAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.border,
    },
    instructorInfo: {
      flex: 1,
    },
    instructorName: {
      ...theme.text("sm", "bold"),
      color: theme.colors.text,
    },
    instructorRole: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
    },

    // FIXED FOOTER
    footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 24, // Padding inferior seguro
      backgroundColor: theme.colors.background, // Fundo sólido para cobrir o conteúdo rolando
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      gap: 12,
      // Sombra sutil para elevação
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 10,
    },
    primaryButton: {
      width: "100%",
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.md,
      justifyContent: "center",
      alignItems: "center",
    },
    primaryButtonText: {
      ...theme.text("md", "bold"), // Padronizado
      color: "#FFFFFF",
      letterSpacing: 0.5,
    },
    secondaryButton: {
      width: "100%",
      paddingVertical: theme.spacing.md,
      backgroundColor: `${theme.colors.primary}20`,
      borderRadius: theme.radius.md,
      justifyContent: "center",
      alignItems: "center",
    },
    secondaryButtonText: {
      ...theme.text("md", "medium"),
      color: theme.colors.primary,
    },
  });
