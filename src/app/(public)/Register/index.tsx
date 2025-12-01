import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Register() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Cadastro</Text>

      <Link href="/(public)/Login" asChild>
        <TouchableOpacity style={{ padding: 15 }}>
          <Text style={{ color: "#007AFF" }}>Voltar para Login</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
