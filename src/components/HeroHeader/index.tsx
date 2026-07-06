import React from "react";

import { Text, TouchableOpacity, View, ViewStyle } from "react-native";

import { Image } from "expo-image";
import { ArrowLeft, Share2 } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@/hooks/useAppTheme";

import { createStyles } from "./styles";

interface HeroHeaderProps {
  imageUrl?: string | number;
  title: string;
  subtitle?: string;
  onBack: () => void;
  onShare?: () => void;
  style?: ViewStyle;
}

export function HeroHeader({
  imageUrl,
  title,
  subtitle,
  onBack,
  onShare,
  style,
}: HeroHeaderProps) {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);

  const imageSource =
    typeof imageUrl === "string" && imageUrl.trim().length > 0
      ? { uri: imageUrl }
      : typeof imageUrl === "number"
        ? imageUrl
        : require("@/assets/images/placeholder.jpeg");

  return (
    <View style={style}>
      {/* IMAGEM DE CAPA NO TOPO */}
      <Image
        source={imageSource}
        placeholder={require("@/assets/images/placeholder.jpeg")}
        placeholderContentFit="cover"
        priority="high"
        style={styles.coverImage}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.imageOverlay} />

      {/* CABEÇALHO FLUTUANTE */}
      <View style={[styles.floatingHeader, { top: insets.top + 10 }]}>
        <TouchableOpacity
          style={styles.floatingBackButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        {onShare && (
          <TouchableOpacity
            style={styles.floatingShareButton}
            onPress={onShare}
            activeOpacity={0.7}
          >
            <Share2 size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {/* TÍTULO E SUBTÍTULO SOBRE A IMAGEM DE CAPA */}
      <View style={styles.staticTitleContainer}>
        <View style={styles.imageTitleSection}>
          <Text style={styles.imageCourseTitle} numberOfLines={2}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.imageCourseSubtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
