import { useRef, useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react-native";
import { updateProfile } from "firebase/auth";

import { useAuthStore } from "@/stores/authStore";
import { useAppTheme } from "@/hooks/useAppTheme";
import type { AuthStackParamList } from "@/routers/types";
import { Button } from "@/components/Button";
import { TermsAndPrivacy } from "@/components/TermsAndPrivacy";
import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";
import { createStyles } from "./styles";

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Register"
>;

export function RegisterScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const { signUp, loading, clearError } = useAuthStore();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [focusedField, setFocusedField] = useState<
    "fullName" | "email" | "password" | "confirmPassword" | null
  >(null);

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [bottomSheetConfig, setBottomSheetConfig] =
    useState<BottomSheetMessageConfig | null>(null);

  function validate(): boolean {
    let valid = true;
    const newErrors = { fullName: "", email: "", password: "", confirmPassword: "" };

    if (!fullName.trim() || fullName.trim().length < 3) {
      newErrors.fullName = "Por favor, informe seu nome (mínimo 3 caracteres).";
      valid = false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = "Por favor, informe um e-mail válido.";
      valid = false;
    }

    if (!password || password.length < 6) {
      newErrors.password = "A senha deve ter no mínimo 6 caracteres.";
      valid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  async function handleRegister() {
    if (!validate()) return;

    try {
      clearError();
      const userCredential = await signUp(email.trim(), password);

      if (userCredential?.user) {
        await updateProfile(userCredential.user, {
          displayName: fullName.trim(),
        });
        // Recarregar user para garantir atualização
        await userCredential.user.reload();
      }

      // Sucesso - auth guard vai redirecionar
    } catch (err: any) {
      console.error("Register error:", err);
      let errorMessage =
        "Ocorreu um erro ao tentar criar sua conta.\nTente novamente mais tarde.";
      let errorTitle = "Erro no Cadastro";

      if (err.code === "auth/email-already-in-use") {
        errorTitle = "E-mail Já Cadastrado";
        errorMessage =
          "Este e-mail já está em uso por outra conta.\nFaça login ou recupere sua senha.";
      } else if (err.code === "auth/invalid-email") {
        errorTitle = "E-mail Inválido";
        errorMessage = "O e-mail informado não é válido.";
      }

      setBottomSheetConfig({
        type: "error",
        title: errorTitle,
        message: errorMessage,
        primaryButton: {
          label: "Ok",
          onPress: () => {},
        },
      });
      setTimeout(() => {
        bottomSheetModalRef.current?.present();
      }, 100);
    }
  }

  function handleLogin() {
    navigation.navigate("Login");
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logoText}>Saber Espírita</Text>
          {/* <Text style={styles.premiumText}>Premium Edition</Text> */}
        </View>

        {/* Titles */}
        <Text style={styles.welcomeTitle}>Crie sua conta.</Text>
        <Text style={styles.subtitle}>
          Informe seus dados para começar sua jornada de conhecimento e luz.
        </Text>

        {/* Nome Input */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Apelido ou Nome</Text>
          <View
            style={[
              styles.inputContainer,
              focusedField === "fullName" && styles.inputContainerFocused,
              !!errors.fullName && styles.inputContainerError,
            ]}
          >
            <User
              size={20}
              color={
                focusedField === "fullName"
                  ? theme.colors.primary
                  : theme.colors.textSecondary
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Seu nome completo"
              placeholderTextColor={theme.colors.textSecondary}
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                setErrors((prev) => ({ ...prev, fullName: "" }));
              }}
              onFocus={() => setFocusedField("fullName")}
              onBlur={() => setFocusedField(null)}
              autoCapitalize="words"
              autoCorrect={false}
              editable={!loading}
            />
          </View>
          {errors.fullName ? (
            <Text style={styles.errorText}>{errors.fullName}</Text>
          ) : null}
        </View>

        {/* Email Input */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>E-mail</Text>
          <View
            style={[
              styles.inputContainer,
              focusedField === "email" && styles.inputContainerFocused,
              !!errors.email && styles.inputContainerError,
            ]}
          >
            <Mail
              size={20}
              color={
                focusedField === "email"
                  ? theme.colors.primary
                  : theme.colors.textSecondary
              }
            />
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor={theme.colors.textSecondary}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              editable={!loading}
            />
          </View>
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        </View>

        {/* Senha Input */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Senha</Text>
          <View
            style={[
              styles.inputContainer,
              focusedField === "password" && styles.inputContainerFocused,
              !!errors.password && styles.inputContainerError,
            ]}
          >
            <Lock
              size={20}
              color={
                focusedField === "password"
                  ? theme.colors.primary
                  : theme.colors.textSecondary
              }
            />
            <TextInput
              style={styles.input}
              placeholder="sua senha segura"
              placeholderTextColor={theme.colors.textSecondary}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              disabled={loading}
              style={styles.eyeButton}
            >
              {showPassword ? (
                <EyeOff size={20} color={theme.colors.textSecondary} />
              ) : (
                <Eye size={20} color={theme.colors.textSecondary} />
              )}
            </TouchableOpacity>
          </View>
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}
        </View>

        {/* Confirmar Senha Input */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Confirmar Senha</Text>
          <View
            style={[
              styles.inputContainer,
              focusedField === "confirmPassword" && styles.inputContainerFocused,
              !!errors.confirmPassword && styles.inputContainerError,
            ]}
          >
            <Lock
              size={20}
              color={
                focusedField === "confirmPassword"
                  ? theme.colors.primary
                  : theme.colors.textSecondary
              }
            />
            <TextInput
              style={styles.input}
              placeholder="confirme sua senha"
              placeholderTextColor={theme.colors.textSecondary}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
              onFocus={() => setFocusedField("confirmPassword")}
              onBlur={() => setFocusedField(null)}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
              style={styles.eyeButton}
            >
              {showConfirmPassword ? (
                <EyeOff size={20} color={theme.colors.textSecondary} />
              ) : (
                <Eye size={20} color={theme.colors.textSecondary} />
              )}
            </TouchableOpacity>
          </View>
          {errors.confirmPassword ? (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          ) : null}
        </View>

        {/* Botão Registrar */}
        <View style={styles.buttonContainer}>
          <Button
            title="Criar Conta"
            onPress={handleRegister}
            variant="primary"
            disabled={loading}
            loading={loading}
            fullWidth
          />
        </View>

        {/* Link para Login */}
        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={handleLogin} disabled={loading}>
            <Text style={styles.footerText}>
              Já tem uma conta? <Text style={styles.linkText}>Faça login.</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Termos */}
        <TermsAndPrivacy />
      </ScrollView>

      <BottomSheetMessage
        ref={bottomSheetModalRef}
        config={bottomSheetConfig}
        onDismiss={() => setBottomSheetConfig(null)}
      />
    </View>
  );
}
