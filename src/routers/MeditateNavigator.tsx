import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { MeditateStackParamList } from "./types";
import MeditateHomeScreen from "@/pages/meditate";
import ReflectionScreen from "@/pages/meditate/reflection";

const Stack = createNativeStackNavigator<MeditateStackParamList>();

export function MeditateNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MeditateHome" component={MeditateHomeScreen} />
      <Stack.Screen name="Reflection" component={ReflectionScreen} />
    </Stack.Navigator>
  );
}
