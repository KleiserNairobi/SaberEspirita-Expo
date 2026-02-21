import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import MeditateScreen from "@/pages/meditate";
import AllMeditationsScreen from "@/pages/meditate/all-meditations";
import AllReflectionsScreen from "@/pages/meditate/all-reflections";
import ReflectionScreen from "@/pages/meditate/reflection";
import MeditationPlayerScreen from "@/pages/meditate/meditation-player";
import { MeditateStackParamList } from "./types";

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
      <Stack.Screen name="MeditationPlayer" component={MeditationPlayerScreen} />
    </Stack.Navigator>
  );
}
