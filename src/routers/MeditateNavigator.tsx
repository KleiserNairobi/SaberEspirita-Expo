import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import MeditateScreen from "@/pages/meditate";
import AllMeditationsScreen from "@/pages/meditate/all-meditations";
import AllReflectionsScreen from "@/pages/meditate/all-reflections";
import ReflectionScreen from "@/pages/meditate/reflection";
import { Text, View } from "react-native";
import { MeditateStackParamList } from "./types";

// Placeholder que faremos na proxima etapa
const MeditationPlayerPlaceholder = () => (
  <View>
    <Text>Player Guiado em Construção...</Text>
  </View>
);

const Stack = createNativeStackNavigator<MeditateStackParamList>();

export function MeditateNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MeditateHome" component={MeditateScreen} />
      <Stack.Screen name="AllReflections" component={AllReflectionsScreen} />
      <Stack.Screen name="Reflection" component={ReflectionScreen} />
      <Stack.Screen name="AllMeditations" component={AllMeditationsScreen} />
      <Stack.Screen name="MeditationPlayer" component={MeditationPlayerPlaceholder} />
    </Stack.Navigator>
  );
}
