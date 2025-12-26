import { Stack } from "expo-router";

export default function PublicLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login/index" />
      <Stack.Screen name="Register/index" />
    </Stack>
  );
}
