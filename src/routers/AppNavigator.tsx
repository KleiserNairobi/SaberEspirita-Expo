import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AppStackParamList } from "./types";
import { TabNavigator } from "./TabNavigator";
import { FAQScreen } from "@/pages/account/faq";
import { PrivacyScreen } from "@/pages/account/privacy";
import { TermsScreen } from "@/pages/account/terms";
import { EmotionalChatScreen } from "@/pages/chat/emotional";
import { ScientificChatScreen } from "@/pages/chat/scientific";
import { GlossaryNavigator } from "./GlossaryNavigator";
import { CoursesCatalogScreen } from "@/pages/study/courses-catalog";
import { CourseDetailsScreen } from "@/pages/study/course-details";

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
      <Stack.Screen name="ScientificChat" component={ScientificChatScreen} />
      <Stack.Screen name="Glossary" component={GlossaryNavigator} />
      <Stack.Screen name="CoursesCatalog" component={CoursesCatalogScreen} />
      <Stack.Screen name="CourseDetails" component={CourseDetailsScreen} />
    </Stack.Navigator>
  );
}
