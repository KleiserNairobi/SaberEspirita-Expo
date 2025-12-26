import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      marginHorizontal: 20,
      marginBottom: 10,
      borderRadius: 16,
      overflow: "hidden",
      // Sombra premium (iOS)
      // shadowColor: "#000",
      // shadowOffset: { width: 0, height: 4 },
      // shadowOpacity: 0.15,
      // shadowRadius: 12,
      // Elevação (Android)
      // elevation: 8,
    },
    imageBackground: {
      width: "100%",
      aspectRatio: 16 / 9, // Proporção 16:9
    },
    backgroundImage: {
      borderRadius: 16,
    },
    gradient: {
      flex: 1,
      padding: 20,
      justifyContent: "flex-end",
      borderRadius: 16,
    },
    shareButton: {
      position: "absolute",
      top: 16,
      right: 16,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.3)",
    },
    quote: {
      ...theme.text("xl", "regular"),
      fontFamily: "Baskervville_400Regular_Italic",
      color: "#fff",
      textAlign: "left",
      marginBottom: 14,
    },
    author: {
      ...theme.text("sm", "regular"),
      fontFamily: "Allura_400Regular",
      fontSize: 20,
      color: "#fff",
      textAlign: "left",
    },
  });
