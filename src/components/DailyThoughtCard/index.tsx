import React from "react";

import {
  Share,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Share2 } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { SHARE_FOOTER } from "@/utils/constants";
import { getDailyThought } from "@/utils/dailyThought";

import { createStyles } from "./styles";

interface DailyThoughtCardProps {
  style?: StyleProp<ViewStyle>;
}

export function DailyThoughtCard({ style }: DailyThoughtCardProps = {}) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const { quote, author, backgroundImage } = getDailyThought();

  async function handleShare() {
    try {
      await Share.share({
        message: `"${quote}"\n— ${author}${SHARE_FOOTER}`,
      });
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.imageBackground}>
        <Image
          source={backgroundImage}
          style={[StyleSheet.absoluteFillObject, styles.backgroundImage]}
          contentFit="cover"
        />
        <LinearGradient
          colors={[
            "rgba(0, 0, 0, 0.1)", // Topo: quase transparente
            "rgba(0, 0, 0, 0.3)", // Meio: leve escurecimento
            "rgba(0, 0, 0, 0.6)", // Baixo: mais escuro para legibilidade do texto
          ]}
          style={styles.gradient}
        >
          {/* Botão compartilhar no topo direito */}
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Share2 size={14} color="#fff" />
          </TouchableOpacity>

          {/* Citação */}
          <Text style={styles.quote}>{quote}</Text>

          {/* Autor */}
          <Text style={styles.author}>{author}</Text>
        </LinearGradient>
      </View>
    </View>
  );
}
