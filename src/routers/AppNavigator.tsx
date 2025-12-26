import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AppStackParamList } from "./types";
import { TabNavigator } from "./TabNavigator";
import { FAQScreen } from "@/pages/account/faq";
import { PrivacyScreen } from "@/pages/account/privacy";
import { TermsScreen } from "@/pages/account/terms";
import EmotionalChatScreen from "@/pages/emotional-chat";

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="FAQ" component={FAQScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="EmotionalChat" component={EmotionalChatScreen} />
    </Stack.Navigator>
  );
}
