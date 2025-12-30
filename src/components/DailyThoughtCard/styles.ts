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
      paddingVertical: 10,
      paddingHorizontal: 20,
      justifyContent: "flex-end",
      borderRadius: 16,
    },
    shareButton: {
      position: "absolute",
      top: 16,
      right: 16,
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.3)",
    },
    quote: {
      fontFamily: "Baskervville_400Regular_Italic",
      fontSize: 18,
      color: "#fff",
      textAlign: "left",
      marginBottom: 10,
    },
    author: {
      fontFamily: "Allura_400Regular",
      fontSize: 20,
      color: "#fff",
      textAlign: "left",
    },
  });
