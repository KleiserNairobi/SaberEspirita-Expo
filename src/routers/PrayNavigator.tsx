import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { PrayStackParamList } from "./types";
import PrayHomeScreen from "@/pages/pray";
import { PrayCategoryScreen } from "@/pages/pray/category";
import { PrayerScreen } from "@/pages/pray/prayer";

const Stack = createNativeStackNavigator<PrayStackParamList>();

export function PrayNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="PrayHome" component={PrayHomeScreen} />
      <Stack.Screen name="PrayCategory" component={PrayCategoryScreen} />
      <Stack.Screen name="Prayer" component={PrayerScreen} />
    </Stack.Navigator>
  );
}
