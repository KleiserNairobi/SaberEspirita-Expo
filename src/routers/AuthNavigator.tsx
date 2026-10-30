import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { AuthStackParamList } from "./types";
import { LoginScreen } from "@/pages/auth/login";
import { RegisterScreen } from "@/pages/auth/register";
import { VerifyEmailScreen } from "@/pages/auth/verify-email";
import { ForgotPasswordScreen } from "@/pages/auth/forgot-password";
import { useAuthStore } from "@/stores/authStore";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  const pendingVerificationEmail = useAuthStore(
    (state) => state.pendingVerificationEmail
  );

  return (
    <BottomSheetModalProvider>
      <Stack.Navigator
        initialRouteName={pendingVerificationEmail ? "VerifyEmail" : "Login"}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          name="VerifyEmail"
          component={VerifyEmailScreen}
          initialParams={
            pendingVerificationEmail ? { email: pendingVerificationEmail } : undefined
          }
        />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      </Stack.Navigator>
    </BottomSheetModalProvider>
  );
}
