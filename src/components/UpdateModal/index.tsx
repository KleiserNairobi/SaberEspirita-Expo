import { View, Text, Modal, Linking, Platform } from "react-native";
import { Download } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { Button } from "@/components/Button";
import { UpdateModalProps } from "./types";
import { createStyles } from "./styles";

export function UpdateModal({
  visible,
  critical,
  message,
  updateUrl,
  onClose,
  maintenance,
}: UpdateModalProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  function handleUpdate() {
    if (updateUrl) {
      // Para iOS, usar schema itms-apps:// para melhor experiência
      // No Android, manter https://play.google.com/
      let urlToOpen = updateUrl;

      if (Platform.OS === "ios") {
        // Converter URL da App Store para schema itms-apps://
        urlToOpen = updateUrl.replace(
          "https://apps.apple.com/",
          "itms-apps://apps.apple.com/"
        );
      }

      Linking.openURL(urlToOpen).catch(() => {
        // Fallback para URL original se o schema personalizado falhar
        if (urlToOpen !== updateUrl) {
          Linking.openURL(updateUrl);
        }
      });
    }
  }

  function getTitle(): string {
    if (maintenance) {
      return "Manutenção em Andamento";
    }

    if (typeof message === "object" && message !== null) {
      return message.title || "Atualização Disponível";
    }

    return "Atualização Disponível";
  }

  function getBody(): string {
    if (maintenance) {
      return typeof message === "string" ? message : "";
    }

    if (typeof message === "object" && message !== null) {
      return message.body || "Uma nova versão do aplicativo está disponível.";
    }

    return "Uma nova versão do aplicativo está disponível.";
  }

  function getButtonText(): string {
    if (maintenance) {
      return "Entendido";
    }

    if (typeof message === "object" && message !== null) {
      return message.button_text || "Atualizar Agora";
    }

    return "Atualizar Agora";
  }

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={critical ? undefined : onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.iconContainer}>
          <Download size={64} color={theme.colors.primary} />
        </View>

        <Text style={styles.title}>{getTitle()}</Text>

        <Text style={styles.body}>{getBody()}</Text>

        <View style={styles.buttonContainer}>
          {!critical && !maintenance && (
            <Button title="Depois" onPress={onClose} variant="outline" fullWidth />
          )}

          <Button
            title={getButtonText()}
            onPress={handleUpdate}
            variant="primary"
            fullWidth
          />
        </View>
      </View>
    </Modal>
  );
}
