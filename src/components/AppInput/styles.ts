import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.6)", // Cor do label no estilo MUI
    marginBottom: -10, // Move o label para dentro da área do campo
    marginLeft: 14, // Alinha com o padding do campo
    paddingTop: 8, // Espaço no topo
  },
  labelFocused: {
    color: "#1976D2", // Cor do label quando focado (azul primário)
  },
  labelError: {
    color: "#D32F2F", // Red color for error
  },
  requiredIndicator: {
    color: "#D32F2F",
    fontWeight: "bold",
  },
  fieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.42)", // Borda inferior mais visível como no MUI Filled
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5, // Apenas cantos superiores arredondados como no MUI
    backgroundColor: "rgba(0, 0, 0, 0.06)", // Fundo cinza claro do estilo Filled
    paddingHorizontal: 10, // Padding maior como no MUI
    paddingTop: 8, // Reduzido porque o label está dentro
    paddingBottom: 8,
  },
  fieldContainerFocused: {
    borderBottomColor: "#1976D2", // Blue color when focused
    borderBottomWidth: 2, // Borda inferior mais espessa quando focado (estilo MUI)
    backgroundColor: "rgba(25, 118, 210, 0.04)", // Fundo levemente azul quando focado
  },
  fieldContainerError: {
    borderBottomColor: "#D32F2F",
    borderBottomWidth: 2,
    backgroundColor: "rgba(211, 47, 47, 0.04)", // Fundo levemente vermelho quando erro
  },
  input: {
    flex: 1,
    height: 24, // Altura do texto apenas
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.87)", // Cor do texto mais escura
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginVertical: 4, // Espaço vertical para centralizar
  },
  errorText: {
    fontSize: 12,
    color: "#D32F2F",
    marginTop: 4,
    marginLeft: 12, // Alinhar com o padding do campo
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
