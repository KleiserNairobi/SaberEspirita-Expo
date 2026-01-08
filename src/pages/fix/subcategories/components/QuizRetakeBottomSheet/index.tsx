import React, { forwardRef, useMemo } from "react";
import { View, Text } from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { HelpCircle } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { Button } from "@/components/Button";
import { createStyles } from "./styles";

interface QuizRetakeBottomSheetProps {
  onConfirm: () => void;
  onCancel?: () => void;
}

export const QuizRetakeBottomSheet = forwardRef<
  BottomSheetModal,
  QuizRetakeBottomSheetProps
>(({ onConfirm, onCancel }, ref) => {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const snapPoints = useMemo(() => ["45%"], []);

  const handleConfirm = () => {
    onConfirm();
    (ref as any)?.current?.dismiss();
  };

  const handleCancel = () => {
    onCancel?.();
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
        <View style={styles.iconContainer}>
          <HelpCircle size={32} color={theme.colors.primary} />
        </View>

        <Text style={styles.title}>Deseja novamente responder o quiz?</Text>
        <Text style={styles.subtitle}>
          A pontuação desse quiz será zerada e nova pontuação será contabilizada.
        </Text>

        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <Button title="Não" variant="outline" onPress={handleCancel} fullWidth />
          </View>
          <View style={styles.buttonWrapper}>
            <Button title="Sim" onPress={handleConfirm} fullWidth />
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

QuizRetakeBottomSheet.displayName = "QuizRetakeBottomSheet";
