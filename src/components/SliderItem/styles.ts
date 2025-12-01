import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    width: width,
    alignItems: "center",
    justifyContent: "center",
    //gap: 30,
  },
  background: {
    position: "absolute",
    width: 280,
    height: 400,
    borderRadius: 10,
    padding: 20,
    justifyContent: "space-between",
  },
  icon: {
    padding: 6,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  title: {
    color: "white",
    fontSize: 24,
    fontFamily: "Oswald_400Regular",
  },
  description: {
    color: "white",
    fontSize: 18,
    fontFamily: "Oswald_300Light",
  },
});
