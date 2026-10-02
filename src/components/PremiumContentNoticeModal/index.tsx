import React, { forwardRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { CheckCircle2, Crown, Lock, Sparkles } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";

import { createStyles } from "./styles";

export type PremiumNoticeType = "lesson" | "material" | "course" | "trial_completed";

export interface PremiumContentNoticeModalProps {
  type?: PremiumNoticeType;
  title?: string;
  itemName?: string;
  description?: string;
  benefits?: string[];
  buttonText?: string;
  onPressButton?: () => void;
  onClose?: () => void;
}

const DEFAULT_BENEFITS: Record<PremiumNoticeType, string[]> = {
  lesson: [
    "Acesso ilimitado a todas as aulas e estudos guiados",
    "Análises comparadas com a Codificação Kardequiana",
    "Emissão de certificados oficiais de conclusão",
    "Infográficos doutrinários, obras de apoio e podcasts",
  ],
  material: [
    "Infográficos conceituais em alta resolução",
    "Obras e textos de referência doutrinária",
    "Podcasts e reflexões em áudio exclusivas",
    "Contribua diretamente com a disseminação da Doutrina",
  ],
  course: [
    "Acesso completo a todas as séries e módulos",
    "Certificados de conclusão ao finalizar as aulas",
    "Exercícios, reflexões e materiais complementares",
  ],
  trial_completed: [
    "Acesso a todas as próximas aulas da série",
    "Infográficos e materiais de estudo aprofundado",
    "Podcasts reflexivos e certificado de conclusão",
  ],
};

const DEFAULT_TITLES: Record<PremiumNoticeType, string> = {
  lesson: "Aula Exclusiva para Assinantes",
  material: "Material Exclusivo",
  course: "Série Exclusiva",
  trial_completed: "Aula Demonstrativa Concluída!",
};

const DEFAULT_DESCRIPTIONS: Record<PremiumNoticeType, string> = {
  lesson:
    "Esta aula faz parte dos Estudos Guiados Premium do Saber Espírita. Torne-se assinante para ter acesso irrestrito a todas as aulas, análises comparadas e materiais de apoio.",
  material:
    "Este material complementar é reservado para apoiadores e membros premium. Apoie o Saber Espírita para ter acesso irrestrito a infográficos, livros de apoio, podcasts e reflexões exclusivas.",
  course:
    "Esta série de estudo é exclusiva para membros assinantes. Assine o Saber Espírita para desbloquear todas as aulas e certificados.",
  trial_completed:
    "Parabéns por concluir a aula de degustação! Para continuar a jornada pelas próximas aulas e ter acesso ao conteúdo completo, torne-se um membro Premium.",
};

export const PremiumContentNoticeModal = forwardRef<
  BottomSheetModal,
  PremiumContentNoticeModalProps
>(
  (
    {
      type = "material",
      title,
      itemName,
      description,
      benefits,
      buttonText = "ENTENDI",
      onPressButton,
      onClose,
    },
    ref
  ) => {
    const { theme } = useAppTheme();
    const insets = useSafeAreaInsets();
    const styles = createStyles(theme);

    const resolvedTitle = title || DEFAULT_TITLES[type] || "Conteúdo Exclusivo";
    const resolvedDescription =
      description || DEFAULT_DESCRIPTIONS[type] || DEFAULT_DESCRIPTIONS.material;
    const resolvedBenefits = benefits || DEFAULT_BENEFITS[type] || DEFAULT_BENEFITS.material;

    function handleButtonPress() {
      if (onPressButton) {
        onPressButton();
      } else {
        handleClose();
      }
    }

    function handleClose() {
      // @ts-ignore
      ref?.current?.dismiss();
      onClose?.();
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

    return (
      <BottomSheetModal
        ref={ref}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetView
          style={[
            styles.container,
            { paddingBottom: Math.max(insets.bottom, 24) + 16 },
          ]}
        >
          <View style={styles.iconContainer}>
            <Crown size={32} color={theme.colors.warning} />
          </View>

          <Text style={styles.title}>{resolvedTitle}</Text>

          {itemName && (
            <Text style={styles.subtitle} numberOfLines={2}>
              {itemName}
            </Text>
          )}

          <Text style={styles.description}>{resolvedDescription}</Text>

          <View style={styles.benefitsCard}>
            {resolvedBenefits.map((benefit, index) => (
              <View key={`benefit_${index}`} style={styles.benefitItem}>
                <CheckCircle2 size={18} color={theme.colors.primary} />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleButtonPress}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>{buttonText}</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default PremiumContentNoticeModal;
