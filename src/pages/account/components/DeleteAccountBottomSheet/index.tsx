import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useMemo, useState } from "react";
import { Text, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface DeleteAccountBottomSheetProps {
  onConfirm: (reason: string) => Promise<void>;
}

const REASONS = [
  "Não utilizo mais o aplicativo",
  "Problemas técnicos ou travamentos constantes",
  "Achei os conteúdos (aulas, meditações ou orações) pouco relevantes",
  "Não gostei da dinâmica dos quizzes e desafios",
  "Conteúdo não condizente com a Doutrina Espírita",
  "Outro motivo",
];

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

  function handleCancel() {
    if (isLoading) return;
    setSelectedReason(null);
    setCustomReason("");
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
        contentContainerStyle={[styles.container, { paddingBottom: Math.max(insets.bottom, 24) }]}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <Text style={styles.title}>Excluir Conta</Text>
        </View>

        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            Aviso importante: Esta ação é irreversível. Todos os seus dados de progresso, conquistas, posts e conta serão excluídos definitivamente de nossos servidores.
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
                onPress={() => setSelectedReason(reason)}
                disabled={isLoading}
              >
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {reason}
                </Text>
                <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
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
