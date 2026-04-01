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
import { FontAwesome } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { useEffect } from "react";

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

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, "Login">;

export function LoginScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const {
    signIn,
    loading,
    error,
    clearError,
    loginAsGuest,
    signInWithGoogle,
    signInWithApple,
  } = useAuthStore();
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

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    });
  }, []);

  async function handleGoogleLogin() {
    try {
      clearError();
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      const token = userInfo.data?.idToken;
      const name = userInfo.data?.user?.name;

      if (token) {
        await signInWithGoogle(token, name);

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
          "Não foi possível entrar com sua conta Google neste momento.\n Tente novamente mais tarde.",
        primaryButton: {
          label: "Entendido",
          onPress: () => {},
        },
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
            "Ocorreu um problema ao tentar conectar com sua conta Apple.\n Tente novamente mais tarde.",
          primaryButton: { label: "Entendido", onPress: () => {} },
        });
        setTimeout(() => {
          bottomSheetModalRef.current?.present();
        }, 100);
      }
    }
  }

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

      // Verificar status do usuário e criar docs se necessário
      const currentUser = useAuthStore.getState().user;

      if (currentUser) {
        await currentUser.reload();

        if (!currentUser.emailVerified) {
          await useAuthStore.getState().signOut();

          setBottomSheetConfig({
            type: "error",
            title: "E-mail não verificado",
            message: "Por favor, verifique seu e-mail para acessar o aplicativo.",
            primaryButton: {
              label: "Reenviar E-mail",
              onPress: async () => {
                try {
                  await useAuthStore.getState().sendVerificationEmail(currentUser);
                  setBottomSheetConfig({
                    type: "success",
                    title: "E-mail Enviado",
                    message: "Verifique sua caixa de entrada (e spam).",
                    primaryButton: { label: "Ok", onPress: () => {} },
                  });
                  setTimeout(() => bottomSheetModalRef.current?.present(), 500);
                } catch (e) {
                  console.error(e);
                }
              },
            },
            secondaryButton: {
              label: "Cancelar",
              onPress: () => {
                bottomSheetModalRef.current?.dismiss();
              },
            },
          });
          setTimeout(() => {
            bottomSheetModalRef.current?.present();
          }, 100);
          return;
        }

        // Se verificado, garantir que existe no Firestore usando o serviço centralizado
        await userService.ensureUserSync(currentUser);
      }
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
          <Text style={styles.welcomeTitle}>Acesse sua conta</Text>

          {/* Subtítulo */}
          <Text style={styles.subtitle}>
            Informe seus dados para continuar sua jornada de conhecimento e luz.
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
                <Path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"
                />
                <Path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <Path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <Path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </Svg>
              <Text style={styles.googleButtonText}>Acessar com Google</Text>
            </TouchableOpacity>

            {Platform.OS === "ios" && (
              <TouchableOpacity
                style={[styles.socialButton, styles.appleButton]}
                onPress={handleAppleLogin}
                disabled={loading}
                activeOpacity={0.7}
              >
                <FontAwesome
                  name="apple"
                  size={20}
                  color="#FFFFFF"
                  style={{ marginTop: -2 }}
                />
                <Text style={styles.appleButtonText}>Acessar com Apple</Text>
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
              ou acesse com e-mail
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: theme.colors.border }} />
          </View>

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

          {/* Botão Convidado */}
          {/* Continue as Guest (Link style) */}
          <TouchableOpacity
            style={{
              alignSelf: "center",
              marginBottom: theme.spacing.md,
            }}
            onPress={loginAsGuest}
            disabled={loading}
          >
            <Text
              style={{
                ...theme.text("md", "medium"),
                color: theme.colors.textSecondary,
                textDecorationLine: "underline",
              }}
            >
              Continuar como visitante
            </Text>
          </TouchableOpacity>

          {/* Termos e Privacidade */}
          <TermsAndPrivacy />
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomSheetMessage ref={bottomSheetModalRef} config={bottomSheetConfig} />
    </View>
  );
}
