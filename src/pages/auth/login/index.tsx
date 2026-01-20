import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Mail, Lock, Eye, EyeOff, Key, UserPlus } from "lucide-react-native";
import { useAuthStore } from "@/stores/authStore";
import { useAppTheme } from "@/hooks/useAppTheme";
import type { AuthStackParamList } from "@/routers/types";
import { Button } from "@/components/Button";
import { TermsAndPrivacy } from "@/components/TermsAndPrivacy";
import { createStyles } from "./styles";

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, "Login">;

export function LoginScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const { signIn, loading, error, clearError } = useAuthStore();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  function validateEmail(email: string): boolean {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!email) {
      setEmailError("Por favor, informe o seu e-mail.");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Por favor, informe um e-mail válido.");
      return false;
    }
    setEmailError("");
    return true;
  }

  function validatePassword(password: string): boolean {
    if (!password) {
      setPasswordError("Por favor, informe uma senha.");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("A senha deve ter no mínimo 6 caracteres.");
      return false;
    }
    setPasswordError("");
    return true;
  }

  async function handleLogin() {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    try {
      clearError();
      await signIn(email.trim().toLowerCase(), password);
    } catch (err) {
      console.error("Login error:", err);
    }
  }

  function handleRegister() {
    navigation.navigate("Register");
  }

  function handleRecoverPassword() {
    // TODO: Implementar recuperação de senha
    console.log("Recuperar senha para:", email);
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header com Logo */}
          <View style={styles.header}>
            <Text style={styles.logoText}>Saber Espírita</Text>
            <Text style={styles.premiumText}>Premium Edition</Text>
          </View>

          {/* Título de Boas-Vindas */}
          <Text style={styles.welcomeTitle}>Seja bem-vindo.</Text>

          {/* Subtítulo */}
          <Text style={styles.subtitle}>
            Informe seus dados para continuar sua jornada de conhecimento e luz.
          </Text>

          {/* Input de E-mail */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>E-mail</Text>
            <View style={styles.inputContainer}>
              <Mail size={20} color={theme.colors.primary} />
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor="#B0B0B0"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError("");
                }}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                editable={!loading}
              />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          </View>

          {/* Input de Senha */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Senha</Text>
            <View style={styles.inputContainer}>
              <Lock size={20} color={theme.colors.primary} />
              <TextInput
                style={styles.input}
                placeholder="sua senha segura"
                placeholderTextColor="#B0B0B0"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError("");
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                disabled={loading}
                style={styles.eyeButton}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#B0B0B0" />
                ) : (
                  <Eye size={20} color="#B0B0B0" />
                )}
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>

          {/* Botão Principal */}
          <View style={styles.buttonContainer}>
            <Button
              title="Entrar"
              onPress={handleLogin}
              variant="primary"
              disabled={loading}
              loading={loading}
              fullWidth
            />
          </View>

          {/* Botões Secundários */}
          <View style={styles.secondaryButtonsContainer}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleRecoverPassword}
              disabled={loading}
            >
              <Key size={18} color={theme.colors.primary} />
              <Text style={styles.secondaryButtonText}>Recuperar senha</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleRegister}
              disabled={loading}
            >
              <UserPlus size={18} color={theme.colors.primary} />
              <Text style={styles.secondaryButtonText}>Criar minha conta</Text>
            </TouchableOpacity>
          </View>

          {/* Termos e Privacidade */}
          <TermsAndPrivacy />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
