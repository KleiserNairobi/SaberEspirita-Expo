import React, { forwardRef, useMemo } from "react";
import { View, Text } from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Target, AlertTriangle } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { Button } from "@/components/Button";
import { createStyles } from "./styles";

interface ExerciseDecisionBottomSheetProps {
  lessonTitle: string;
  onPressNow: () => void;
  onPressLater: () => void;
}

export const ExerciseDecisionBottomSheet = forwardRef<
  BottomSheetModal,
  ExerciseDecisionBottomSheetProps
>(({ lessonTitle, onPressNow, onPressLater }, ref) => {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const snapPoints = useMemo(() => ["60%"], []);

  const handlePressNow = () => {
    onPressNow();
    (ref as any)?.current?.dismiss();
  };

  const handlePressLater = () => {
    onPressLater();
    (ref as any)?.current?.dismiss();
  };

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.5}
      pressBehavior="close"
    />
  );

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={styles.container}>
        {/* Ícone */}
        <View style={styles.iconContainer}>
          <Target size={32} color={theme.colors.primary} />
        </View>

        {/* Título */}
        <Text style={styles.title}>Exercício de Fixação</Text>

        {/* Descrição */}
        <Text style={styles.description}>
          Teste seus conhecimentos sobre esta aula para garantir seu certificado ao final
          do curso!
        </Text>

        {/* Aviso Importante */}
        <View style={styles.warningCard}>
          <AlertTriangle size={20} color={theme.colors.warning} />
          <View style={styles.warningTextContainer}>
            <Text style={styles.warningTitle}>Importante</Text>
            <Text style={styles.warningText}>
              Os exercícios são obrigatórios para obter o certificado.
            </Text>
          </View>
        </View>

        {/* Botões */}
        <View style={styles.buttonContainer}>
          <Button title="FAZER EXERCÍCIO AGORA" onPress={handlePressNow} fullWidth />
          <Button
            title="Fazer Depois"
            variant="outline"
            onPress={handlePressLater}
            fullWidth
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

ExerciseDecisionBottomSheet.displayName = "ExerciseDecisionBottomSheet";
