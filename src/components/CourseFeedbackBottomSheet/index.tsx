import React, { forwardRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Star } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";
import { createStyles } from "./styles";

interface CourseFeedbackBottomSheetProps {
  courseId: string;
  courseTitle: string;
  onDismiss?: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
}

export const CourseFeedbackBottomSheet = forwardRef<
  BottomSheetModal,
  CourseFeedbackBottomSheetProps
>(({ courseId, courseTitle, onDismiss, onSubmit }, ref) => {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = async () => {
    if (rating === 0) return; // Forçar no mínimo 1 estrela

    try {
      setIsSubmitting(true);
      await onSubmit(rating, comment);

      // Limpar os campos ao fechar com sucesso
      setRating(0);
      setComment("");

      // Fechar botomsheet
      (ref as any)?.current?.dismiss();
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled = rating === 0 || isSubmitting;

  const config: BottomSheetMessageConfig = {
    type: "question",
    title: "Avalie o Curso",
    message: `Como tem sido a sua experiência com o curso\n"${courseTitle}"?`,
    primaryButton: {
      label: isSubmitting ? "Enviando..." : "Enviar Avaliação",
      onPress: handleSubmit,
    },
    secondaryButton: {
      label: "Cancelar",
      onPress: () => {
        (ref as any)?.current?.dismiss();
        if (onDismiss) onDismiss();
      },
    },
  };

  return (
    <BottomSheetMessage ref={ref} config={config} onDismiss={onDismiss}>
      <View style={styles.contentContainer}>
        {/* Estrelas */}
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((starValue) => {
            const isSelected = starValue <= rating;
            return (
              <TouchableOpacity
                key={starValue}
                activeOpacity={0.7}
                onPress={() => handleRatingPress(starValue)}
                style={styles.starButton}
              >
                <Star
                  size={40}
                  color={isSelected ? theme.colors.warning : theme.colors.border}
                  fill={isSelected ? theme.colors.warning : "transparent"}
                />
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.ratingLabel}>
          {rating === 0
            ? "Toque para avaliar"
            : rating === 1
              ? "Péssimo"
              : rating === 2
                ? "Ruim"
                : rating === 3
                  ? "Razoável"
                  : rating === 4
                    ? "Bom"
                    : "Excelente!"}
        </Text>

        {/* Campo de Comentário */}
        <View style={styles.inputContainer}>
          <BottomSheetTextInput
            style={styles.textInput}
            placeholder="Escreva um comentário sobre sua experiência (opcional)..."
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={setComment}
            textAlignVertical="top"
            maxLength={500}
          />
        </View>
      </View>
    </BottomSheetMessage>
  );
});

CourseFeedbackBottomSheet.displayName = "CourseFeedbackBottomSheet";
