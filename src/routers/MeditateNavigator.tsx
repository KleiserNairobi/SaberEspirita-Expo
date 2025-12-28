import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { MeditateStackParamList } from "./types";
import MeditateScreen from "@/pages/meditate";
import AllReflectionsScreen from "@/pages/meditate/all-reflections";
import ReflectionScreen from "@/pages/meditate/reflection";

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
    </Stack.Navigator>
  );
}
