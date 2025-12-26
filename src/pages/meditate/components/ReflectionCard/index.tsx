import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Clock, ChevronRight } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { IReflection } from "@/types/reflection";
import { createStyles } from "./styles";

interface ReflectionCardProps {
  reflection: IReflection;
  onPress: () => void;
}

export function ReflectionCard({ reflection, onPress }: ReflectionCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Imagem */}
      {reflection.imageUrl && (
        <Image source={{ uri: reflection.imageUrl }} style={styles.image} />
      )}

      {/* Conteúdo */}
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {reflection.title}
          </Text>
          {reflection.subtitle && (
            <Text style={styles.subtitle} numberOfLines={2}>
              {reflection.subtitle}
            </Text>
          )}

          {/* Tempo de leitura */}
          <View style={styles.footer}>
            <View style={styles.readingTime}>
              <Clock size={14} color={theme.colors.muted} />
              <Text style={styles.readingTimeText}>
                Leitura: {reflection.readingTimeMinutes}min
              </Text>
            </View>
          </View>
        </View>

        {/* Ícone de navegação */}
        <ChevronRight size={20} color={theme.colors.muted} />
      </View>
    </TouchableOpacity>
  );
}
