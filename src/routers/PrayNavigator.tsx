import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { PrayStackParamList } from "./types";
import PrayHomeScreen from "@/pages/pray";
import { AllPrayersScreen } from "@/pages/pray/all-prayers";
import { PrayerPrepScreen } from "@/pages/pray/prayer-prep";
import { PrayerScreen } from "@/pages/pray/prayer";
import { EmotionalChatScreen } from "@/pages/chat/emotional";

const Stack = createNativeStackNavigator<PrayStackParamList>();

export function PrayNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="PrayHome" component={PrayHomeScreen} />
      <Stack.Screen name="AllPrayers" component={AllPrayersScreen} />
      <Stack.Screen name="PrayerPrep" component={PrayerPrepScreen} />
      <Stack.Screen name="Prayer" component={PrayerScreen} />
      <Stack.Screen name="EmotionalChat" component={EmotionalChatScreen} />
    </Stack.Navigator>
  );
}
