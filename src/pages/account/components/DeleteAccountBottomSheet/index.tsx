import React, { forwardRef, useMemo, useState } from "react";

import { Linking, Pressable, Text, TouchableOpacity, View } from "react-native";

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { useAppTheme } from "@/hooks/useAppTheme";

import { CONTACT_EMAIL } from "../../constants";
import { createStyles } from "./styles";

interface DeleteAccountBottomSheetProps {
  onConfirm: (reason: string) => Promise<void>;
}

const REASONS = [
  "Não utilizo mais o aplicativo",
  "Problemas técnicos ou travamentos constantes",
  "Achei os conteúdos (aulas, meditações ou orações) pouco relevantes",
  "Não gostei da dinâmica dos quizzes e desafios",
  "Encontrei conteúdo que considero incompatível com a Doutrina Espírita",
  "Outro motivo",
];

interface FeedbackCardConfig {
  message: string;
  buttonText?: string;
  emailSubject?: string;
}

const FEEDBACK_CONFIGS: Record<string, FeedbackCardConfig> = {
  "Não utilizo mais o aplicativo": {
    message: "Agradecemos por ter utilizado o Saber Espírita.",
  },
  "Problemas técnicos ou travamentos constantes": {
    message:
      "Problemas técnicos podem ser resolvidos. Se esse for o motivo da exclusão, fale com o suporte antes de continuar.",
    buttonText: "Falar com o suporte",
    emailSubject: "Problemas técnicos ou travamentos constantes antes de excluir conta",
  },
  "Encontrei conteúdo que considero incompatível com a Doutrina Espírita": {
    message:
      "Se você encontrou algum conteúdo que considere incompatível com a Doutrina Espírita, gostaríamos de analisar o caso. Fale com o suporte antes de excluir sua conta.",
    buttonText: "Reportar conteúdo",
    emailSubject: "Conteúdo incompatível com a Doutrina Espírita antes de excluir conta",
  },
  "Achei os conteúdos (aulas, meditações ou orações) pouco relevantes": {
    message:
      "Seu feedback pode nos ajudar a oferecer conteúdos mais úteis. Se desejar, conte-nos o que sentiu falta.",
    buttonText: "Enviar sugestão",
    emailSubject: "Sugestão sobre conteúdos relevantes antes de excluir conta",
  },
  "Não gostei da dinâmica dos quizzes e desafios": {
    message:
      "Estamos sempre evoluindo a experiência do aplicativo. Conte-nos o que poderia ser melhor.",
    buttonText: "Enviar sugestão",
    emailSubject: "Sugestão sobre dinâmica de quizzes antes de excluir conta",
  },
};

export const DeleteAccountBottomSheet = forwardRef<
  BottomSheetModal,
  DeleteAccountBottomSheetProps
>(function DeleteAccountBottomSheet({ onConfirm }, ref) {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);

  const snapPoints = useMemo(() => ["100%"], []);

  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [customReason, setCustomReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [clickedSupport, setClickedSupport] = useState(false);

  async function handleConfirm() {
    if (!selectedReason) return;

    let finalReason = selectedReason;
    if (selectedReason === "Outro motivo") {
      finalReason = customReason.trim()
        ? `Outro motivo: ${customReason.trim()}`
        : "Outro motivo (não detalhado)";
    }

    setIsLoading(true);
    try {
      await onConfirm(finalReason);
      // O fechamento ocorrerá com o redirecionamento, mas por segurança fechamos aqui se necessário
      // @ts-ignore
      ref.current?.dismiss();
    } catch (error) {
      console.error("Erro no fluxo de exclusão de conta:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelectReason(reason: string) {
    setSelectedReason(reason);
    setClickedSupport(false);
  }

  function handleFeedbackAction(config: FeedbackCardConfig) {
    setClickedSupport(true);
    if (config.buttonText && config.emailSubject) {
      Linking.openURL(
        `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(config.emailSubject)}`
      );
    }
  }

  function handleCancel() {
    if (isLoading) return;
    setSelectedReason(null);
    setCustomReason("");
    setClickedSupport(false);
    // @ts-ignore
    ref.current?.dismiss();
  }

  function renderBackdrop(props: any) {
    return (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    );
  }

  const isConfirmDisabled = isLoading || !selectedReason;

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: theme.colors.card }}
      handleIndicatorStyle={{ backgroundColor: theme.colors.border }}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
    >
      <BottomSheetScrollView
        contentContainerStyle={[
          styles.container,
          { paddingBottom: Math.max(insets.bottom, 24) },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <Text style={styles.title}>Excluir Conta</Text>
        </View>

        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            Aviso importante: Esta ação é irreversível. Todos os seus dados de progresso,
            conquistas, posts e conta serão excluídos definitivamente de nossos
            servidores.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Por que deseja excluir sua conta?</Text>

        <View style={styles.optionsList}>
          {REASONS.map((reason) => {
            const isSelected = selectedReason === reason;
            return (
              <Pressable
                key={reason}
                style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                onPress={() => handleSelectReason(reason)}
                disabled={isLoading}
              >
                <Text
                  style={[styles.optionText, isSelected && styles.optionTextSelected]}
                >
                  {reason}
                </Text>
                <View
                  style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}
                >
                  {isSelected && <View style={styles.radioDot} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        {selectedReason === "Outro motivo" && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Escreva o motivo (opcional)</Text>
            <BottomSheetTextInput
              style={styles.input}
              value={customReason}
              onChangeText={setCustomReason}
              placeholder="Conte-nos o que houve para podermos melhorar..."
              placeholderTextColor={theme.colors.muted}
              multiline
              numberOfLines={3}
              maxLength={200}
              editable={!isLoading}
            />
          </View>
        )}

        {(() => {
          if (!selectedReason) return null;
          const feedbackConfig = FEEDBACK_CONFIGS[selectedReason];
          if (!feedbackConfig) return null;

          return (
            <View
              style={{
                backgroundColor: theme.colors.primary + "0D",
                padding: 16,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme.colors.primary + "20",
                gap: feedbackConfig.buttonText ? 12 : 0,
                marginTop: 4,
              }}
            >
              <Text
                style={[
                  theme.text("sm", "regular", theme.colors.textSecondary),
                  { lineHeight: 20 },
                ]}
              >
                {feedbackConfig.message}
              </Text>

              {feedbackConfig.buttonText && (
                <TouchableOpacity
                  onPress={() => handleFeedbackAction(feedbackConfig)}
                  style={{
                    alignSelf: "flex-start",
                    backgroundColor: theme.colors.primary,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 8,
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={theme.text("sm", "semibold", theme.colors.card)}>
                    {feedbackConfig.buttonText}
                  </Text>
                </TouchableOpacity>
              )}

              {clickedSupport && (
                <Text
                  style={[
                    theme.text("xs", "regular", theme.colors.textSecondary),
                    { lineHeight: 16, marginTop: 4, fontStyle: "italic" },
                  ]}
                >
                  Caso prefira continuar, a exclusão da conta continuará disponível.
                </Text>
              )}
            </View>
          );
        })()}

        <View style={styles.actions}>
          <Button
            title="Cancelar"
            variant="outline"
            onPress={handleCancel}
            disabled={isLoading}
            fullWidth
          />

          <Button
            title="Excluir Permanentemente"
            onPress={handleConfirm}
            loading={isLoading}
            disabled={isConfirmDisabled}
            fullWidth
          />
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});
