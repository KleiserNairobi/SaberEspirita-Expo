import { useAuth } from "@/contexts/AuthContext";
import { Redirect, Stack } from "expo-router";

export default function PrivateLayout() {
  const { user, initialized } = useAuth();

  if (!initialized) {
    return null;
  }

  if (!user) {
    return <Redirect href="/(public)/Login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
