import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface EditProfileBottomSheetProps {
  initialName: string;
  onSave: (newName: string) => Promise<void>;
}

export const EditProfileBottomSheet = forwardRef<
  BottomSheetModal,
  EditProfileBottomSheetProps
>(function EditProfileBottomSheet({ initialName, onSave }, ref) {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);

  const [name, setName] = useState(initialName);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const emailLikeRegex = /(@|\.com|\.br|\.net|\.org|gmail|hotmail|outlook|yahoo)/i;

  // Sincroniza o estado local se o initialName mudar externamente
  useEffect(() => {
    setName(initialName);
    setError("");
  }, [initialName]);

  function validateName(value: string): boolean {
    if (!value.trim()) {
      setError("Por favor, informe seu nome/apelido.");
      return false;
    }

    if (value.trim().length < 3) {
      setError("O nome/apelido deve ter no mínimo 3 caracteres.");
      return false;
    }

    if (emailLikeRegex.test(value.trim())) {
      setError("Por favor, não utilize um e-mail como nome/apelido.");
      return false;
    }

    setError("");
    return true;
  }

  async function handleSave() {
    if (name.trim() === initialName) return;
    if (!validateName(name)) return;

    setIsLoading(true);
    try {
      await onSave(name.trim());
      // @ts-ignore
      ref.current?.dismiss();
    } catch (error) {
      console.error("Erro ao salvar nome:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleCancel() {
    setName(initialName);
    setError("");
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

  const isSaveDisabled =
    isLoading || !name.trim() || name.trim() === initialName || !!error;

  return (
    <BottomSheetModal
      ref={ref}
      enableDynamicSizing
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: theme.colors.card }}
      handleIndicatorStyle={{ backgroundColor: theme.colors.border }}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
    >
      <BottomSheetView
        style={[styles.container, { paddingBottom: Math.max(insets.bottom, 24) }]}
      >
        <View>
          <Text style={styles.title}>Editar Perfil</Text>
          <Text style={styles.description}>
            Como você gostaria de ser chamado nos placares e rankings?
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome ou Apelido</Text>
          <BottomSheetTextInput
            style={[styles.input, !!error && styles.inputError]}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (error) setError("");
            }}
            onBlur={() => validateName(name)} // Valida ao sair do campo também
            placeholder="Digite seu nome ou apelido"
            placeholderTextColor={theme.colors.muted}
            autoFocus
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />
          {!!error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        <View style={styles.actions}>
          <Button
            title="Cancelar"
            variant="outline"
            onPress={handleCancel}
            disabled={isLoading}
            fullWidth
          />

          <Button
            title="Salvar Alterações"
            onPress={handleSave}
            loading={isLoading}
            disabled={isSaveDisabled}
            fullWidth
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});
