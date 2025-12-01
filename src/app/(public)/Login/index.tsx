import { useAuth } from "@/contexts/AuthContext";
import { Link, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    login(); // Simula login
    router.replace("/(private)/(tabs)/Study");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>

      <TouchableOpacity
        onPress={handleLogin}
        style={{ padding: 15, backgroundColor: "#007AFF", borderRadius: 8 }}
      >
        <Text style={{ color: "white" }}>Fazer Login</Text>
      </TouchableOpacity>

      <Link href="/(public)/Register" asChild>
        <TouchableOpacity style={{ marginTop: 15, padding: 15 }}>
          <Text style={{ color: "#007AFF" }}>Criar Conta</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
