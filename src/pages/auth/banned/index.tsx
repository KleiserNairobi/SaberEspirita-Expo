import React, { useEffect, useRef, useState } from "react";

import { Linking, Text, View } from "react-native";

import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { ShieldAlert } from "lucide-react-native";

import { Button } from "@/components/Button";
import { useAppTheme } from "@/hooks/useAppTheme";
import { getDeviceIdentifiers } from "@/utils/device";
import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";

import { createStyles } from "./styles";

export function BannedScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const [deviceRefId, setDeviceRefId] = useState<string>("Carregando...");
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [bottomSheetConfig, setBottomSheetConfig] =
    useState<BottomSheetMessageConfig | null>(null);

  useEffect(() => {
    async function loadId() {
      try {
        const { secureDeviceId } = await getDeviceIdentifiers();
        // Exibe um formato mais amigável ou o próprio ID completo
        setDeviceRefId(secureDeviceId);
      } catch (error) {
        setDeviceRefId("Erro ao carregar ID");
      }
    }
    loadId();
  }, []);

  function handleSupportContact() {
    const email = "app.saberespirita@gmail.com";
    const subject = encodeURIComponent("Suporte: Dispositivo Suspenso");
    const body = encodeURIComponent(
      `Olá, meu dispositivo foi suspenso por violação dos termos.\n\nCódigo de Referência do Aparelho: ${deviceRefId}\n\nGostaria de solicitar a revisão desta decisão.`
    );
    Linking.openURL(`mailto:${email}?subject=${subject}&body=${body}`).catch((err) => {
      console.warn("Erro ao abrir cliente de e-mail:", err);
      setBottomSheetConfig({
        type: "info",
        title: "Suporte",
        message: `Não foi possível abrir seu aplicativo de e-mail automaticamente.\n\nPor favor, envie um e-mail manualmente para:\n${email}\n\nCódigo de Referência:\n${deviceRefId}`,
        primaryButton: {
          label: "Entendido",
          onPress: () => {},
        },
      });
      bottomSheetModalRef.current?.present();
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <ShieldAlert size={40} color={theme.colors.error} />
      </View>

      <Text style={styles.title}>Acesso Suspenso</Text>

      <Text style={styles.message}>
        Este dispositivo foi suspenso permanentemente devido a violações repetidas dos
        nossos Termos de Uso e Diretrizes da Comunidade.
      </Text>

      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>Código de Referência</Text>
        <Text style={styles.detailsText} selectable={true}>
          {deviceRefId}
        </Text>
      </View>

      <Button
        title="Contatar Suporte"
        onPress={handleSupportContact}
        fullWidth={true}
        variant="primary"
      />

      <BottomSheetMessage ref={bottomSheetModalRef} config={bottomSheetConfig} />
    </View>
  );
}
