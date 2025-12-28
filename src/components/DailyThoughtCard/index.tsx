import React from "react";
import { ImageBackground, Text, TouchableOpacity, View, Share } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Share2 } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { getDailyThought } from "@/utils/dailyThought";
import { createStyles } from "./styles";

export function DailyThoughtCard() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const { quote, author, backgroundImage } = getDailyThought();

  async function handleShare() {
    try {
      await Share.share({
        message: `"${quote}"\n— ${author}\n\nCompartilhado via App Saber Espírita`,
      });
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={backgroundImage}
        style={styles.imageBackground}
        imageStyle={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.3)", "rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0.7)"]}
          style={styles.gradient}
        >
          {/* Botão compartilhar no topo direito */}
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Share2 size={20} color="#fff" />
          </TouchableOpacity>

          {/* Citação */}
          <Text style={styles.quote}>{quote}</Text>

          {/* Autor */}
          <Text style={styles.author}>{author}</Text>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}
