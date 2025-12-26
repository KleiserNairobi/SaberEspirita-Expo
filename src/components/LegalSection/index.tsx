import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";

import { ChevronDown, type LucideIcon } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface LegalSectionProps {
  icon: LucideIcon;
  title: string;
  summary: string;
  content: string;
  isFirst?: boolean;
  isLast?: boolean;
}

export function LegalSection({
  icon: Icon,
  title,
  summary,
  content,
  isFirst,
  isLast,
}: LegalSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  // Animação de altura e opacidade
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (expanded) {
      // Expandir
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Colapsar
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [expanded]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={[styles.container, isFirst && styles.first, isLast && styles.last]}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
        style={styles.header}
      >
        <View style={styles.iconContainer}>
          <Icon size={20} color={theme.colors.icon} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.summary}>{summary}</Text>
        </View>
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <ChevronDown size={20} color={theme.colors.icon} />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.contentWrapper,
          {
            maxHeight: animatedHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1000], // Altura máxima estimada
            }),
            opacity: animatedOpacity,
          },
        ]}
      >
        <View style={styles.content}>
          <Text style={styles.contentText}>{content}</Text>
        </View>
      </Animated.View>
    </View>
  );
}
