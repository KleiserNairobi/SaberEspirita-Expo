import { ITheme } from "@/configs/theme/types";
import { StyleSheet } from "react-native";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.md,
      marginBottom: 12,
      padding: 20, // Igualado ao AssistantCard (antes era v:14, h:16)
      borderWidth: 1,
      borderColor: theme.colors.border,
      // Removida as propriedades de sombra para ficar liso como AssistantCard
    },
    premiumBorder: {
      borderColor: theme.colors.accent,
      borderWidth: 1.5,
    },
    iconContainer: {
      width: 40, // Igualado ao AssistantCard (antes era 44)
      height: 40,
      borderRadius: 20,
      backgroundColor: `${theme.colors.primary}15`, // Fundo Primary translúcido como AssistantCard
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16, // Igualado ao AssistantCard
      // Removida borda para igualar design visual
    },
    content: {
      flex: 1,
      justifyContent: "center",
    },
    title: {
      ...theme.text("md", "medium"),
      color: theme.colors.text,
      marginBottom: 4,
    },
    description: {
      ...theme.text("sm", "regular"),
      color: theme.colors.textSecondary,
      marginBottom: 6,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    metaText: {
      ...theme.text("xs", "regular"),
      color: theme.colors.primary,
      fontFamily: "Oswald_400Regular",
      // textTransform: "uppercase",
    },
    actionContainer: {
      marginLeft: 10,
      justifyContent: "center",
      alignItems: "center",
      width: 40, // Igualado ao AssistantCard / iconContainer
      height: 40,
      borderRadius: 20,
      backgroundColor: `${theme.colors.primary}15`, // Secundário translúcido seguindo o padrão
    },
  });
