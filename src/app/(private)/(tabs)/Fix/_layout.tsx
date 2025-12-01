import { Stack } from "expo-router";

export default function FixLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tela1/index" />
      <Stack.Screen name="Tela2/index" />
      <Stack.Screen name="Tela3/index" />
    </Stack>
  );
}
