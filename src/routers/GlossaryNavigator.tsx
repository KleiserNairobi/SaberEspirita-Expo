import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { GlossaryStackParamList } from "./types";
import { AllTermsScreen } from "@/pages/glossary/all-terms";
import { TermDetailScreen } from "@/pages/glossary/term-detail";

const Stack = createNativeStackNavigator<GlossaryStackParamList>();

export function GlossaryNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AllTerms" component={AllTermsScreen} />
      <Stack.Screen name="TermDetail" component={TermDetailScreen} />
    </Stack.Navigator>
  );
}
