import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { EmotionalChatScreen } from "@/pages/chat/emotional";
import { MeditateScreen } from "@/pages/meditate";
import { AllMeditationsScreen } from "@/pages/meditate/all-meditations";
import { AllReflectionsScreen } from "@/pages/meditate/all-reflections";
import { DailyWisdomScreen } from "@/pages/meditate/daily-wisdom";
import { MeditationPlayerScreen } from "@/pages/meditate/meditation-player";
import { ReflectionScreen } from "@/pages/meditate/reflection";

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
      <Stack.Screen name="DailyWisdom" component={DailyWisdomScreen} />
      <Stack.Screen name="AllReflections" component={AllReflectionsScreen} />
      <Stack.Screen name="Reflection" component={ReflectionScreen} />
      <Stack.Screen name="AllMeditations" component={AllMeditationsScreen} />
      <Stack.Screen name="MeditationPlayer" component={MeditationPlayerScreen} />
      <Stack.Screen name="EmotionalChat" component={EmotionalChatScreen} />
    </Stack.Navigator>
  );
}
