import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  collumn: {
    flexDirection: "column",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  centerAll: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default styles;
