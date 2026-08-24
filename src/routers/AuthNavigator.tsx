import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { AuthStackParamList } from "./types";
import { LoginScreen } from "@/pages/auth/login";
import { RegisterScreen } from "@/pages/auth/register";
import { VerifyEmailScreen } from "@/pages/auth/verify-email";
import { ForgotPasswordScreen } from "@/pages/auth/forgot-password";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <BottomSheetModalProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      </Stack.Navigator>
    </BottomSheetModalProvider>
  );
}
