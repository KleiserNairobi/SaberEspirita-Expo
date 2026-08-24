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

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, HelpCircle, Info, Mail, RefreshCw } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";
import { Button } from "@/components/Button";
import { useAppTheme } from "@/hooks/useAppTheme";
import type { AuthStackParamList } from "@/routers/types";
import { useAuthStore } from "@/stores/authStore";

import { createStyles } from "./styles";

type VerifyEmailScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "VerifyEmail"
>;

type VerifyEmailScreenRouteProp = RouteProp<AuthStackParamList, "VerifyEmail">;

export function VerifyEmailScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<VerifyEmailScreenNavigationProp>();
  const route = useRoute<VerifyEmailScreenRouteProp>();

  const email = route.params?.email || "";

  const { verifyEmailCode, resendVerificationCode, loading, clearError } = useAuthStore();

  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [bottomSheetConfig, setBottomSheetConfig] =
    useState<BottomSheetMessageConfig | null>(null);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const inputRef = useRef<TextInput>(null);

  // Contador regressivo para reenviar código
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      setCanResend(false);
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  async function handleVerify() {
    if (code.length !== 6) {
      setBottomSheetConfig({
        type: "error",
        title: "Código Incompleto",
        message: "Por favor, digite os 6 dígitos do código enviado para seu e-mail.",
        primaryButton: { label: "Entendido", onPress: () => {} },
      });
      setTimeout(() => bottomSheetModalRef.current?.present(), 100);
      return;
    }

    try {
      clearError();
      await verifyEmailCode(email, code);

      setBottomSheetConfig({
        type: "success",
        title: "E-mail Verificado!",
        message: "Sua conta foi ativada com sucesso. Bem-vindo(a) ao Saber Espírita!",
        primaryButton: {
          label: "Acessar Aplicativo",
          onPress: () => {
            bottomSheetModalRef.current?.dismiss();
          },
        },
      });

      setTimeout(() => bottomSheetModalRef.current?.present(), 100);
    } catch (err: any) {
      console.error("Verify email error:", err);
      const apiMessage =
        err?.response?.data?.message || err?.message || useAuthStore.getState().error;

      setBottomSheetConfig({
        type: "error",
        title: "Erro de Verificação",
        message: apiMessage || "Código incorreto ou expirado. Tente novamente.",
        primaryButton: { label: "Tentar Novamente", onPress: () => {} },
      });

      setTimeout(() => bottomSheetModalRef.current?.present(), 100);
    }
  }

  async function handleResend() {
    if (!canResend || loading) return;

    try {
      clearError();
      await resendVerificationCode(email);

      setTimer(60);
      setCanResend(false);

      setBottomSheetConfig({
        type: "success",
        title: "Código Reenviado",
        message: `Enviamos um novo código de 6 dígitos para ${email}.\n Verifique sua caixa de entrada.`,
        primaryButton: { label: "Ok", onPress: () => {} },
      });

      setTimeout(() => bottomSheetModalRef.current?.present(), 100);
    } catch (err: any) {
      console.error("Resend error:", err);
      const apiMessage =
        err?.response?.data?.message || err?.message || useAuthStore.getState().error;

      setBottomSheetConfig({
        type: "error",
        title: "Erro ao Reenviar",
        message: apiMessage || "Não foi possível reenviar o código neste momento.",
        primaryButton: { label: "Ok", onPress: () => {} },
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
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Row: Botão Voltar + Ícone Central Concêntrico perfeitamente alinhados na mesma linha */}
          <View style={styles.headerRow}>
            {/* Lado Esquerdo: Botão Voltar */}
            <View style={styles.headerSide}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <ArrowLeft size={20} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {/* Centro: Ícone Central com Anéis Concêntricos */}
            <View style={styles.iconRingsContainer}>
              <View style={styles.ringOuter} />
              <View style={styles.ringMiddle} />
              <View style={styles.ringInner} />
              <View style={styles.iconLargeContainer}>
                <Mail size={36} color={theme.colors.onPrimary} />
              </View>
            </View>

            {/* Lado Direito: Espaçador para alinhamento simétrico perfeito */}
            <View style={styles.headerSide} />
          </View>

          {/* Título e Subtítulo Centralizados */}
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Confirme seu E-mail</Text>
            <Text style={styles.subtitle}>
              Enviamos um código de 6 dígitos para o endereço:
            </Text>
            <Text style={styles.emailText}>{email}</Text>
          </View>

          {/* OTP Input Fields (Renderizado via TextInput invisível sobre 6 caixas) */}
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
                code.length === index || (code.length === 6 && index === 5);
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

          {/* Botão para Limpar Código em caso de digitação incorreta */}
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

          {/* Confirm Button */}
          <Button
            title="Confirmar Código"
            onPress={handleVerify}
            loading={loading}
            disabled={code.length !== 6 || loading}
            style={styles.confirmButton}
          />

          {/* Resend Code Option */}
          <TouchableOpacity
            onPress={handleResend}
            disabled={!canResend || loading}
            style={styles.resendContainer}
            activeOpacity={0.7}
          >
            <RefreshCw
              size={18}
              color={canResend ? theme.colors.primary : theme.colors.muted}
            />
            <Text
              style={[styles.resendText, !canResend ? styles.resendTextDisabled : null]}
            >
              {canResend
                ? "Reenviar Código de Confirmação"
                : `Aguarde 00:${timer < 10 ? `0${timer}` : timer} para novo envio`}
            </Text>
          </TouchableOpacity>

          {/* Spam Hint & Validity Info */}
          <View style={styles.spamHintContainer}>
            <View style={styles.hintRow}>
              <Info size={16} color={theme.colors.primary} style={styles.hintIcon} />
              <Text style={styles.hintText}>
                O código enviado por e-mail é válido por{" "}
                <Text style={{ fontWeight: "bold", color: theme.colors.text }}>
                  15 minutos
                </Text>
                .
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
                <Text style={{ fontWeight: "bold", color: theme.colors.text }}>Spam</Text>{" "}
                ou{" "}
                <Text style={{ fontWeight: "bold", color: theme.colors.text }}>
                  Lixo Eletrônico
                </Text>
                .
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* BottomSheet Modal de Feedback */}
        {bottomSheetConfig && (
          <BottomSheetMessage ref={bottomSheetModalRef} config={bottomSheetConfig} />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
