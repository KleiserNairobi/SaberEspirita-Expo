import { Modal, Text, View } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { Button } from "@/components/Button";
import { CommunityLevelUpModalProps } from "./types";
import { createStyles } from "./styles";

function getPresentation(levelId: CommunityLevelUpModalProps["levelId"]): {
  emoji: string;
  title: string;
  message: string;
} {
  if (levelId === "arvore_frondosa") {
    return {
      emoji: "🌳",
      title: "Árvore Frondosa",
      message:
        "Você se tornou presença viva nesta comunidade. Como a árvore que oferece sombra, sua jornada ilumina a de outros.",
    };
  }

  if (levelId === "cultivador") {
    return {
      emoji: "🌿",
      title: "Cultivador",
      message:
        "Sua constância no estudo e na partilha começa a florescer. A semente que você plantou está se tornando raiz.",
    };
  }

  return {
    emoji: "🌱",
    title: "Sementeiro",
    message: "Deu os primeiros passos na jornada do conhecimento.",
  };
}

export function CommunityLevelUpModal({ visible, levelId, onClose }: CommunityLevelUpModalProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const presentation = getPresentation(levelId);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent={false} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Text style={styles.emoji}>{presentation.emoji}</Text>
        <Text style={styles.title}>{presentation.title}</Text>
        <Text style={styles.body}>{presentation.message}</Text>
        <View style={styles.buttonContainer}>
          <Button title="Continuar minha jornada" onPress={onClose} variant="primary" fullWidth />
        </View>
      </View>
    </Modal>
  );
}

