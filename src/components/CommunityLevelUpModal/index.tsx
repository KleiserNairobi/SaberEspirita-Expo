import { Modal, Text, View } from "react-native";
import { Leaf, Sprout, TreePalm } from "lucide-react-native";
import React from "react";

import { useAppTheme } from "@/hooks/useAppTheme";
import { Button } from "@/components/Button";
import { CommunityLevelUpModalProps } from "./types";
import { createStyles } from "./styles";

function getPresentation(levelId: CommunityLevelUpModalProps["levelId"]): {
  Icon: React.FC<any>;
  title: string;
  message: string;
} {
  if (levelId === "arvore_frondosa") {
    return {
      Icon: TreePalm,
      title: "Árvore Frondosa",
      message:
        "Você se tornou presença viva nesta comunidade. Como a árvore que oferece sombra, sua jornada ilumina a de outros.",
    };
  }

  if (levelId === "cultivador") {
    return {
      Icon: Leaf,
      title: "Cultivador(a)",
      message:
        "Sua constância no estudo e na partilha começa a florescer. A semente que você plantou está se tornando raiz.",
    };
  }

  return {
    Icon: Sprout,
    title: "Sementeiro(a)",
    message: "Deu os primeiros passos na jornada do conhecimento.",
  };
}

export function CommunityLevelUpModal({ visible, levelId, onClose }: CommunityLevelUpModalProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const presentation = getPresentation(levelId);
  const Icon = presentation.Icon;

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent={false} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={{ marginBottom: theme.spacing.lg }}>
          <Icon size={72} color={theme.colors.primary} />
        </View>
        <Text style={styles.title}>{presentation.title}</Text>
        <Text style={styles.body}>{presentation.message}</Text>
        <View style={styles.buttonContainer}>
          <Button title="Continuar minha jornada" onPress={onClose} variant="primary" fullWidth />
        </View>
      </View>
    </Modal>
  );
}

