import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  HelpCircle,
  Info,
  KeyRound,
  Lock,
  Mail,
  RefreshCw,
} from "lucide-react-native";

import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";
import { Button } from "@/components/Button";
import { useAppTheme } from "@/hooks/useAppTheme";
import type { AuthStackParamList } from "@/routers/types";
import { useAuthStore } from "@/stores/authStore";

import { createStyles } from "./styles";

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "ForgotPassword"
>;

type ForgotPasswordScreenRouteProp = RouteProp<
  AuthStackParamList,
  "ForgotPassword"
>;

export function ForgotPasswordScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const route = useRoute<ForgotPasswordScreenRouteProp>();

  const initialEmail = route.params?.email || "";

  const {
    sendPasswordResetEmail,
    confirmPasswordReset,
    loading,
    clearError,
  } = useAuthStore();

  const [step, setStep] = useState<1 | 2>(initialEmail ? 2 : 1);
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [bottomSheetConfig, setBottomSheetConfig] =
    useState<BottomSheetMessageConfig | null>(null);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const inputRef = useRef<TextInput>(null);

  // Contador regressivo para reenviar código
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 2 && timer > 0) {
      setCanResend(false);
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (step === 2) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Dispara o e-mail de redefinição se vier com e-mail inicial preenchido
  useEffect(() => {
    if (initialEmail && step === 2) {
      handleSendCode(initialEmail);
    }
  }, []);

  function validateEmail(text: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.trim());
  }

  async function handleSendCode(targetEmail?: string) {
    const emailToUse = (targetEmail || email).trim().toLowerCase();
    if (!validateEmail(emailToUse)) {
      setBottomSheetConfig({
        type: "error",
        title: "E-mail Inválido",
        message: "Por favor, digite um endereço de e-mail válido.",
        primaryButton: { label: "Entendido", onPress: () => {} },
      });
      setTimeout(() => bottomSheetModalRef.current?.present(), 100);
      return;
    }

    try {
      clearError();
      await sendPasswordResetEmail(emailToUse);

      setEmail(emailToUse);
      setStep(2);
      setTimer(60);
      setCanResend(false);

      if (!targetEmail) {
        setBottomSheetConfig({
          type: "success",
          title: "Código Enviado!",
          message: `Enviamos um código de 6 dígitos para ${emailToUse}.\n Verifique sua caixa de entrada.`,
          primaryButton: { label: "Ok", onPress: () => {} },
        });
        setTimeout(() => bottomSheetModalRef.current?.present(), 100);
      }
    } catch (err: any) {
      console.error("ForgotPassword send code error:", err);
      const apiMessage =
        err?.response?.data?.message ||
        err?.message ||
        useAuthStore.getState().error;

      setBottomSheetConfig({
        type: "error",
        title: "Erro ao Enviar Código",
        message:
          apiMessage ||
          "Não foi possível enviar o código de recuperação neste momento.",
        primaryButton: { label: "Tentar Novamente", onPress: () => {} },
      });

      setTimeout(() => bottomSheetModalRef.current?.present(), 100);
    }
  }

  async function handleResetPassword() {
    if (code.length !== 6) {
      setBottomSheetConfig({
        type: "error",
        title: "Código Incompleto",
        message: "Por favor, digite os 6 dígitos do código recebido por e-mail.",
        primaryButton: { label: "Entendido", onPress: () => {} },
      });
      setTimeout(() => bottomSheetModalRef.current?.present(), 100);
      return;
    }

    if (newPassword.length < 6) {
      setBottomSheetConfig({
        type: "error",
        title: "Senha Curta",
        message: "A nova senha deve ter no mínimo 6 caracteres.",
        primaryButton: { label: "Entendido", onPress: () => {} },
      });
      setTimeout(() => bottomSheetModalRef.current?.present(), 100);
      return;
    }

    if (newPassword !== confirmPassword) {
      setBottomSheetConfig({
        type: "error",
        title: "Senhas Não Conferem",
        message: "A confirmação de senha não coincide com a nova senha digitada.",
        primaryButton: { label: "Entendido", onPress: () => {} },
      });
      setTimeout(() => bottomSheetModalRef.current?.present(), 100);
      return;
    }

    try {
      clearError();
      await confirmPasswordReset(email, code, newPassword);

      setBottomSheetConfig({
        type: "success",
        title: "Senha Redefinida!",
        message:
          "Sua senha foi alterada com sucesso. Você já pode acessar a sua conta com a nova senha.",
        primaryButton: {
          label: "Fazer Login",
          onPress: () => {
            bottomSheetModalRef.current?.dismiss();
            navigation.navigate("Login");
          },
        },
      });

      setTimeout(() => bottomSheetModalRef.current?.present(), 100);
    } catch (err: any) {
      console.error("ResetPassword error:", err);
      const apiMessage =
        err?.response?.data?.message ||
        err?.message ||
        useAuthStore.getState().error;

      setBottomSheetConfig({
        type: "error",
        title: "Erro na Redefinição",
        message:
          apiMessage ||
          "Não foi possível redefinir sua senha. Verifique o código e tente novamente.",
        primaryButton: { label: "Tentar Novamente", onPress: () => {} },
      });

      setTimeout(() => bottomSheetModalRef.current?.present(), 100);
    }
  }

  function handleCodeChange(text: string) {
    const cleaned = text.replace(/[^0-9]/g, "").slice(0, 6);
    setCode(cleaned);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Row: Botão Voltar + Ícone Central Concêntrico */}
          <View style={styles.headerRow}>
            <View style={styles.headerSide}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  if (step === 2 && !initialEmail) {
                    setStep(1);
                  } else {
                    navigation.goBack();
                  }
                }}
                activeOpacity={0.7}
              >
                <ArrowLeft size={20} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {/* Ícone Central Concêntrico */}
            <View style={styles.iconRingsContainer}>
              <View style={styles.ringOuter} />
              <View style={styles.ringMiddle} />
              <View style={styles.ringInner} />
              <View style={styles.iconLargeContainer}>
                <KeyRound size={36} color={theme.colors.onPrimary} />
              </View>
            </View>

            <View style={styles.headerSide} />
          </View>

          {/* Título e Subtítulo Centralizados */}
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Recuperar Senha</Text>
            {step === 1 ? (
              <Text style={styles.subtitle}>
                Informe seu e-mail cadastrado para receber o código de 6 dígitos.
              </Text>
            ) : (
              <>
                <Text style={styles.subtitle}>
                  Enviamos o código de redefinição para o endereço:
                </Text>
                <Text style={styles.emailText}>{email}</Text>
              </>
            )}
          </View>

          {/* ETAPA 1: Digitar E-mail */}
          {step === 1 && (
            <>
              <View style={styles.formGroup}>
                <Text style={styles.label}>E-mail</Text>
                <View style={styles.inputContainer}>
                  <Mail
                    size={20}
                    color={theme.colors.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="seu@email.com"
                    placeholderTextColor={theme.colors.muted}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <Button
                title="Enviar Código de Recuperação"
                onPress={() => handleSendCode()}
                loading={loading}
                disabled={!email || loading}
                style={styles.actionButton}
              />
            </>
          )}

          {/* ETAPA 2: Digitar Código OTP + Nova Senha */}
          {step === 2 && (
            <>
              {/* Caixas de Código OTP de 6 dígitos */}
              <TouchableOpacity
                activeOpacity={1}
                style={styles.otpContainer}
                onPress={() => inputRef.current?.focus()}
              >
                <TextInput
                  ref={inputRef}
                  value={code}
                  onChangeText={handleCodeChange}
                  keyboardType="number-pad"
                  maxLength={6}
                  style={styles.hiddenInput}
                  autoFocus
                  caretHidden
                />

                {Array.from({ length: 6 }).map((_, index) => {
                  const digit = code[index] || "";
                  const isFocused =
                    code.length === index ||
                    (code.length === 6 && index === 5);
                  return (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.9}
                      onPress={() => inputRef.current?.focus()}
                      style={[
                        styles.otpBox,
                        digit ? styles.otpBoxFilled : null,
                        isFocused ? styles.otpBoxFocused : null,
                      ]}
                    >
                      <Text style={styles.otpDigit}>{digit}</Text>
                    </TouchableOpacity>
                  );
                })}
              </TouchableOpacity>

              {code.length > 0 && (
                <TouchableOpacity
                  style={styles.clearCodeButton}
                  onPress={() => {
                    setCode("");
                    inputRef.current?.focus();
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.clearCodeText}>✕ Limpar dígitos</Text>
                </TouchableOpacity>
              )}

              {/* Campo: Nova Senha */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nova Senha</Text>
                <View style={styles.inputContainer}>
                  <Lock
                    size={20}
                    color={theme.colors.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Sua nova senha (mínimo 6 caracteres)"
                    placeholderTextColor={theme.colors.muted}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showNewPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeIconButton}
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    activeOpacity={0.7}
                  >
                    {showNewPassword ? (
                      <EyeOff size={20} color={theme.colors.textSecondary} />
                    ) : (
                      <Eye size={20} color={theme.colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Campo: Confirmar Nova Senha */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Confirmar Nova Senha</Text>
                <View style={styles.inputContainer}>
                  <Lock
                    size={20}
                    color={theme.colors.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Repita sua nova senha"
                    placeholderTextColor={theme.colors.muted}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeIconButton}
                    onPress={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    activeOpacity={0.7}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color={theme.colors.textSecondary} />
                    ) : (
                      <Eye size={20} color={theme.colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Botão de Redefinir */}
              <Button
                title="Redefinir Senha"
                onPress={handleResetPassword}
                loading={loading}
                disabled={
                  code.length !== 6 ||
                  newPassword.length < 6 ||
                  confirmPassword.length < 6 ||
                  loading
                }
                style={styles.actionButton}
              />

              {/* Opção de Reenviar Código */}
              <TouchableOpacity
                onPress={() => handleSendCode(email)}
                disabled={!canResend || loading}
                style={styles.resendContainer}
                activeOpacity={0.7}
              >
                <RefreshCw
                  size={18}
                  color={canResend ? theme.colors.primary : theme.colors.muted}
                />
                <Text
                  style={[
                    styles.resendText,
                    !canResend ? styles.resendTextDisabled : null,
                  ]}
                >
                  {canResend
                    ? "Reenviar Código de Recuperação"
                    : `Aguarde 00:${timer < 10 ? `0${timer}` : timer} para novo envio`}
                </Text>
              </TouchableOpacity>

              {/* Spam Hint & Validity Info */}
              <View style={styles.spamHintContainer}>
                <View style={styles.hintRow}>
                  <Info
                    size={16}
                    color={theme.colors.primary}
                    style={styles.hintIcon}
                  />
                  <Text style={styles.hintText}>
                    O código enviado por e-mail é válido por{" "}
                    <Text style={{ fontWeight: "bold", color: theme.colors.text }}>
                      15 minutos
                    </Text>.
                  </Text>
                </View>
                <View style={styles.hintRow}>
                  <HelpCircle
                    size={16}
                    color={theme.colors.textSecondary}
                    style={styles.hintIcon}
                  />
                  <Text style={styles.hintText}>
                    Não encontrou na caixa de entrada? Verifique também sua pasta de{" "}
                    <Text style={{ fontWeight: "bold", color: theme.colors.text }}>
                      Spam
                    </Text>{" "}
                    ou{" "}
                    <Text style={{ fontWeight: "bold", color: theme.colors.text }}>
                      Lixo Eletrônico
                    </Text>.
                  </Text>
                </View>
              </View>
            </>
          )}
        </ScrollView>

        {/* Modal BottomSheet de Feedback */}
        {bottomSheetConfig && (
          <BottomSheetMessage
            ref={bottomSheetModalRef}
            config={bottomSheetConfig}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
