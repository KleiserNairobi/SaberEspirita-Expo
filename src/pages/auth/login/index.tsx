import { useRef, useState } from "react";
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
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Mail, Lock, Eye, EyeOff, Key, UserPlus } from "lucide-react-native";
import { useAuthStore } from "@/stores/authStore";
import { useAppTheme } from "@/hooks/useAppTheme";
import type { AuthStackParamList } from "@/routers/types";
import { Button } from "@/components/Button";
import { TermsAndPrivacy } from "@/components/TermsAndPrivacy";
import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";
import { createStyles } from "./styles";

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, "Login">;

export function LoginScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const { signIn, loading, error, clearError } = useAuthStore();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(null);
  const [bottomSheetConfig, setBottomSheetConfig] =
    useState<BottomSheetMessageConfig | null>(null);

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
    } catch (err: any) {
      console.error("Login error:", err);

      if (
        err.code === "auth/invalid-credential" ||
        err.message?.includes("auth/invalid-credential")
      ) {
        setBottomSheetConfig({
          type: "error",
          title: "Credenciais Inválidas",
          message:
            "O e-mail ou a senha informados estão incorretos.\n Por favor, verifique e tente novamente.",
          primaryButton: {
            label: "Tentar Novamente",
            onPress: () => {},
          },
        });
      } else {
        setBottomSheetConfig({
          type: "error",
          title: "Erro no Login",
          message: "Ocorreu um erro ao tentar entrar.\n Tente novamente mais tarde.",
          primaryButton: {
            label: "Ok",
            onPress: () => {},
          },
        });
      }
      // Pequeno delay para garantir que o estado atualizou antes de abrir
      setTimeout(() => {
        bottomSheetModalRef.current?.present();
      }, 100);
    }
  }

  function handleRegister() {
    navigation.navigate("Register");
  }

  async function handleRecoverPassword() {
    // Validar email antes de enviar
    const isEmailValid = validateEmail(email);

    if (!isEmailValid) {
      return;
    }

    try {
      clearError();
      await useAuthStore.getState().sendPasswordResetEmail(email.trim().toLowerCase());

      // Exibir mensagem de sucesso
      setBottomSheetConfig({
        type: "success",
        title: "Redefinição de Senha",
        message: "Verifique seu e-mail para redefinir sua senha com o link que enviamos.",
        primaryButton: {
          label: "OK",
          onPress: () => {},
        },
      });

      // Pequeno delay para garantir que o estado atualizou antes de abrir
      setTimeout(() => {
        bottomSheetModalRef.current?.present();
      }, 100);
    } catch (err: any) {
      console.error("Erro ao recuperar senha:", err);

      // Exibir mensagem de erro
      setBottomSheetConfig({
        type: "error",
        title: "Houve um problema",
        message:
          err.message ||
          "Não foi possível enviar o e-mail de recuperação. Tente novamente.",
        primaryButton: {
          label: "OK",
          onPress: () => {},
        },
      });

      // Pequeno delay para garantir que o estado atualizou antes de abrir
      setTimeout(() => {
        bottomSheetModalRef.current?.present();
      }, 100);
    }
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
            <View
              style={[
                styles.inputContainer,
                focusedField === "email" && styles.inputContainerFocused,
                !!emailError && styles.inputContainerError,
              ]}
            >
              <Mail
                size={20}
                color={
                  focusedField === "email" ? theme.colors.primary : theme.colors.icon
                }
              />
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor={theme.colors.textSecondary}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError("");
                }}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
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
            <View
              style={[
                styles.inputContainer,
                focusedField === "password" && styles.inputContainerFocused,
                !!passwordError && styles.inputContainerError,
              ]}
            >
              <Lock
                size={20}
                color={
                  focusedField === "password" ? theme.colors.primary : theme.colors.icon
                }
              />
              <TextInput
                style={styles.input}
                placeholder="sua senha segura"
                placeholderTextColor={theme.colors.textSecondary}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError("");
                }}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
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
                  <EyeOff size={20} color={theme.colors.primary} />
                ) : (
                  <Eye size={20} color={theme.colors.icon} />
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

      <BottomSheetMessage ref={bottomSheetModalRef} config={bottomSheetConfig} />
    </View>
  );
}
