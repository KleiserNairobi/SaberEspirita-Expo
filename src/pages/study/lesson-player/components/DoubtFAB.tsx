import React, { useEffect, useRef } from "react";
import { StyleSheet, Animated, TouchableOpacity, View } from "react-native";
import { MessageSquare } from "lucide-react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ITheme } from "@/configs/theme/types";

interface DoubtFABProps {
  onPress: () => void;
  visible: boolean;
}

export function DoubtFAB({ onPress, visible }: DoubtFABProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  // Animação de escala
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: visible ? 1 : 0,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [visible, scale]);

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={[
        styles.container,
        {
          transform: [{ scale }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityLabel="Perguntar ao Sr. Allan"
      >
        <MessageSquare size={24} color="#FFFFFF" strokeWidth={2.5} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      right: theme.spacing.lg,
      bottom: 100, // Ajustado para ficar acima da barra de navegação
      zIndex: 999,
      // Sombra
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
    button: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
  });
