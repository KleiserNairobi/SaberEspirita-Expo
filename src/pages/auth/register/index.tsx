import { useRef, useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react-native";
import { FontAwesome } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { useAuthStore } from "@/stores/authStore";
import { useAppTheme } from "@/hooks/useAppTheme";
import { db } from "@/configs/firebase/firebase";
import type { AuthStackParamList } from "@/routers/types";
import { Button } from "@/components/Button";
import { TermsAndPrivacy } from "@/components/TermsAndPrivacy";
import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";
import { createStyles } from "./styles";
import { userService } from "@/services/firebase/userService";

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Register"
>;

export function RegisterScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const { signUp, loading, clearError, signInWithGoogle, signInWithApple } = useAuthStore();
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

    const emailLikeRegex = /(@|\.com|\.br|\.net|\.org|gmail|hotmail|outlook|yahoo)/i;

    if (!fullName.trim() || fullName.trim().length < 3) {
      newErrors.fullName = "Por favor, informe seu nome (mínimo 3 caracteres).";
      valid = false;
    } else if (emailLikeRegex.test(fullName.trim())) {
      newErrors.fullName = "Por favor, não utilize um e-mail como nome/apelido.";
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

  async function handleGoogleLogin() {
    try {
      clearError();
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      const token = userInfo.data?.idToken;

      if (token) {
        await signInWithGoogle(token);

        // Garantir que o usuário e seu score existam no Firestore
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          await userService.ensureUserSync(currentUser);
        }
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        return;
      }

      console.error("Erro no Google Signin:", error);

      setBottomSheetConfig({
        type: "error",
        title: "Erro no Google Login",
        message:
          "Não foi possível entrar ou registrar com sua conta Google neste momento.\n Tente novamente mais tarde.",
        primaryButton: { label: "Entendido", onPress: () => {} },
      });
      setTimeout(() => {
        bottomSheetModalRef.current?.present();
      }, 100);
    }
  }

  async function handleAppleLogin() {
    try {
      clearError();
      await signInWithApple();

      // Garantir que o usuário e seu score existam no Firestore
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        await userService.ensureUserSync(currentUser);
      }
    } catch (error: any) {
      if (error?.code !== "ERR_REQUEST_CANCELED") {
        setBottomSheetConfig({
          type: "error",
          title: "Erro no Login com Apple",
          message:
            "Ocorreu um problema ao tentar conectar ou registrar com sua conta Apple.\n Tente novamente mais tarde.",
          primaryButton: { label: "Entendido", onPress: () => {} },
        });
        setTimeout(() => {
          bottomSheetModalRef.current?.present();
        }, 100);
      }
    }
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

        // Enviar email de verificação
        await useAuthStore.getState().sendVerificationEmail(userCredential.user);

        // Deslogar para impedir acesso imediato
        await useAuthStore.getState().signOut();

        // Exibir mensagem de sucesso
        setBottomSheetConfig({
          type: "success",
          title: "Conta Criada!",
          message: `Enviamos um e-mail de verificação para\n ${email}.\n\nPor favor, verifique sua caixa de entrada (e spam) e clique no link para ativar sua conta.`,
          primaryButton: {
            label: "Ir para Login",
            onPress: () => {
              navigation.navigate("Login");
            },
          },
        });

        setTimeout(() => {
          bottomSheetModalRef.current?.present();
        }, 100);
      }
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
        </View>

        {/* Titles */}
        <Text style={styles.welcomeTitle}>Crie sua conta</Text>
        <Text style={styles.subtitle}>
          Informe seus dados para começar sua jornada de conhecimento e luz.
        </Text>

        {/* Social Login Buttons */}
        <View style={{ gap: theme.spacing.md, marginBottom: theme.spacing.lg }}>
          <TouchableOpacity
            style={[styles.socialButton, styles.googleButton]}
            onPress={handleGoogleLogin}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Svg width="20" height="20" viewBox="0 0 48 48">
              <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"/>
              <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </Svg>
            <Text style={styles.googleButtonText}>Criar com Google</Text>
          </TouchableOpacity>

          {Platform.OS === "ios" && (
            <TouchableOpacity
              style={[styles.socialButton, styles.appleButton]}
              onPress={handleAppleLogin}
              disabled={loading}
              activeOpacity={0.7}
            >
              <FontAwesome name="apple" size={20} color="#FFFFFF" style={{ marginTop: -2 }} />
              <Text style={styles.appleButtonText}>Criar com Apple</Text>
            </TouchableOpacity>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: theme.spacing.lg,
          }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: theme.colors.border }} />
          <Text
            style={{
              ...theme.text("sm", "regular"),
              color: theme.colors.textSecondary,
              marginHorizontal: theme.spacing.md,
            }}
          >
            ou crie com e-mail
          </Text>
          <View style={{ flex: 1, height: 1, backgroundColor: theme.colors.border }} />
        </View>

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
                focusedField === "fullName" ? theme.colors.primary : theme.colors.icon
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
              color={focusedField === "email" ? theme.colors.primary : theme.colors.icon}
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
                <EyeOff size={20} color={theme.colors.primary} />
              ) : (
                <Eye size={20} color={theme.colors.icon} />
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
                  : theme.colors.icon
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
                <EyeOff size={20} color={theme.colors.primary} />
              ) : (
                <Eye size={20} color={theme.colors.icon} />
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
