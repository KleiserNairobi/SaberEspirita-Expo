import React, { forwardRef } from "react";

import { Text, View } from "react-native";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Leaf, Sprout, TreePalm } from "lucide-react-native";

import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";
import { useAppTheme } from "@/hooks/useAppTheme";

import { createStyles } from "./styles";

interface JourneyBottomSheetProps {
  currentLevelId?: string;
  onDismiss?: () => void;
}

export const JourneyBottomSheet = forwardRef<BottomSheetModal, JourneyBottomSheetProps>(
  ({ currentLevelId = "sementeiro", onDismiss }, ref) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);

    const config: BottomSheetMessageConfig = {
      type: "info",
      title: "Sua Jornada de Conhecimento",
      message: "Avance nos estudos e contribua com a comunidade para evoluir.",
      primaryButton: {
        label: "Entendi",
        onPress: () => {
          (ref as any)?.current?.dismiss();
          if (onDismiss) onDismiss();
        },
      },
    };

    const levels = [
      {
        id: "sementeiro",
        title: "Sementeiro",
        icon: Sprout,
        description: "Deu os primeiros passos na jornada do conhecimento.",
        rules: "Ponto de partida automático ao criar a conta.",
      },
      {
        id: "cultivador",
        title: "Cultivador",
        icon: Leaf,
        description: "Cultiva o estudo com constância e partilha sua reflexão.",
        rules: "10 aulas, 5 comentários, 10 reações e 1 curso > 50%.",
      },
      {
        id: "arvore_frondosa",
        title: "Árvore Frondosa",
        icon: TreePalm,
        description: "Referência de presença, profundidade e fraternidade na comunidade.",
        rules:
          "40 aulas, 2 cursos, 20 comentários, 50 reações (15 🕊️/🙏) e 30 dias ativos.",
      },
    ];

    return (
      <BottomSheetMessage ref={ref} config={config} onDismiss={onDismiss}>
        <View style={styles.container}>
          {levels.map((level, index) => {
            const isCurrent = level.id === currentLevelId;
            const isPast =
              (currentLevelId === "arvore_frondosa" && index < 2) ||
              (currentLevelId === "cultivador" && index === 0);

            const IconComponent = level.icon;

            return (
              <View
                key={level.id}
                style={[styles.levelItem, isCurrent && styles.levelItemCurrent]}
              >
                <View
                  style={[
                    styles.iconContainer,
                    isCurrent && styles.iconContainerCurrent,
                    isPast && styles.iconContainerPast,
                  ]}
                >
                  <IconComponent
                    size={24}
                    color={
                      isCurrent
                        ? theme.colors.primary
                        : isPast
                          ? theme.colors.primary
                          : theme.colors.textSecondary
                    }
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text
                    style={[
                      styles.levelTitle,
                      (isCurrent || isPast) && styles.levelTitleActive,
                    ]}
                  >
                    {level.title}
                    {isCurrent && " (Atual)"}
                  </Text>
                  <Text style={styles.levelDescription}>{level.description}</Text>
                  <Text style={styles.levelRules}>{level.rules}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </BottomSheetMessage>
    );
  }
);

JourneyBottomSheet.displayName = "JourneyBottomSheet";
