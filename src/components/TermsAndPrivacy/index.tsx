import React from "react";
import { Text, TouchableOpacity, View, Linking } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface TermsAndPrivacyProps {
  termsUrl?: string;
  privacyUrl?: string;
}

export function TermsAndPrivacy({
  termsUrl = "https://kleisernairobi.github.io/SaberEspirita-Terms/",
  privacyUrl = "https://kleisernairobi.github.io/SaberEspirita-Privacy/",
}: TermsAndPrivacyProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  function handleOpenLink(url: string) {
    Linking.openURL(url).catch((err) => console.error("Erro ao abrir link:", err));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ao continuar, você concorda com nossos</Text>
      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => handleOpenLink(termsUrl)}>
          <Text style={styles.link}>Termos de Uso</Text>
        </TouchableOpacity>
        <Text style={styles.text}> e nossa </Text>
        <TouchableOpacity onPress={() => handleOpenLink(privacyUrl)}>
          <Text style={styles.link}>Política de Privacidade</Text>
        </TouchableOpacity>
        <Text style={styles.text}>.</Text>
      </View>
    </View>
  );
}
