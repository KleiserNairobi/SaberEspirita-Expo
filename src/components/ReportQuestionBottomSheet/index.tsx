import React, { forwardRef, useMemo, useState } from "react";

import { Pressable, Text, View } from "react-native";

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { AlertTriangle, CheckCircle } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { useAppTheme } from "@/hooks/useAppTheme";
import { quizApiService } from "@/services/api/quizApiService";
import { IQuestion, IQuestionReportPayload } from "@/types/quiz";

import { createStyles } from "./styles";

interface ReportQuestionBottomSheetProps {
  question: IQuestion | { title: string; alternatives: string[]; correct: number } | null;
  selectedAnswerIndex?: number | null;
  quizId?: string;
  questionIndex?: number;
}

const REPORT_REASONS = [
  { id: "gabarito_incorreto", text: "A resposta indicada como correta está errada" },
  { id: "pergunta_confusa", text: "A pergunta ou alternativas estão confusas/ambíguas" },
  { id: "erro_digitacao", text: "Há erros de digitação ou ortografia" },
  { id: "outro", text: "Outro motivo" },
];

export const ReportQuestionBottomSheet = forwardRef<
  BottomSheetModal,
  ReportQuestionBottomSheetProps
>(function ReportQuestionBottomSheet(
  { question, selectedAnswerIndex = null, quizId = "", questionIndex = -1 },
  ref
) {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);

  const snapPoints = useMemo(() => ["85%"], []);

  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [customComment, setCustomComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSendReport() {
    if (!selectedReason || !question) return;

    const questionId =
      (question as any).id || (questionIndex >= 0 ? `q_${questionIndex}` : "unknown");

    const selectedReasonObj = REPORT_REASONS.find((r) => r.id === selectedReason);
    const reasonText = selectedReasonObj ? selectedReasonObj.text : "Não especificado";

    const fullReason = customComment.trim()
      ? `${reasonText} - Detalhes: ${customComment.trim()}`
      : reasonText;

    const payload: IQuestionReportPayload = {
      quizId: quizId || "unknown",
      reason: fullReason,
      details: customComment.trim() || undefined,
    };

    setIsLoading(true);
    try {
      await quizApiService.reportQuestion(questionId, payload);
      setIsSuccess(true);
    } catch (error) {
      console.error("Erro ao enviar reporte de questão:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleClose() {
    if (isLoading) return;
    setSelectedReason(null);
    setCustomComment("");
    setIsSuccess(false);
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

  const isSubmitDisabled = isLoading || !selectedReason;

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
        {isSuccess ? (
          <View style={styles.successContainer}>
            <CheckCircle size={64} color={theme.colors.success} />
            <Text style={styles.successTitle}>Relato enviado!</Text>
            <Text style={styles.successSubtitle}>
              Muito obrigado por nos ajudar. Analisaremos esta questão e faremos as
              correções necessárias em breve.
            </Text>
            <View style={{ width: "100%", marginTop: 12 }}>
              <Button title="Fechar" onPress={handleClose} fullWidth />
            </View>
          </View>
        ) : (
          <>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <AlertTriangle size={24} color={theme.colors.warning} />
              <Text style={styles.title}>Reportar Questão</Text>
            </View>

            <Text style={styles.sectionTitle}>Qual é o problema com esta questão?</Text>

            <View style={styles.optionsList}>
              {REPORT_REASONS.map((reason) => {
                const isSelected = selectedReason === reason.id;
                return (
                  <Pressable
                    key={reason.id}
                    style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                    onPress={() => setSelectedReason(reason.id)}
                    disabled={isLoading}
                  >
                    <Text
                      style={[styles.optionText, isSelected && styles.optionTextSelected]}
                    >
                      {reason.text}
                    </Text>
                    <View
                      style={[
                        styles.radioCircle,
                        isSelected && styles.radioCircleSelected,
                      ]}
                    >
                      {isSelected && <View style={styles.radioDot} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {(selectedReason === "outro" || selectedReason !== null) && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  {selectedReason === "outro"
                    ? "Escreva o motivo (obrigatório)"
                    : "Adicione detalhes (opcional)"}
                </Text>
                <BottomSheetTextInput
                  style={styles.input}
                  value={customComment}
                  onChangeText={setCustomComment}
                  placeholder={
                    selectedReason === "outro"
                      ? "Por favor, explique o problema encontrado..."
                      : "Deseja explicar melhor? Escreva aqui..."
                  }
                  placeholderTextColor={theme.colors.muted}
                  multiline
                  numberOfLines={3}
                  maxLength={300}
                  editable={!isLoading}
                />
              </View>
            )}

            <View style={styles.actions}>
              <Button
                title="Cancelar"
                variant="outline"
                onPress={handleClose}
                disabled={isLoading}
                fullWidth
              />

              <Button
                title="Enviar Relatório"
                onPress={handleSendReport}
                loading={isLoading}
                disabled={
                  isSubmitDisabled ||
                  (selectedReason === "outro" && !customComment.trim())
                }
                fullWidth
              />
            </View>
          </>
        )}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});
