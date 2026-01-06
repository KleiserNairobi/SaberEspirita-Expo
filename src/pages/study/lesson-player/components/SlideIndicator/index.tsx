import React from "react";
import { View, Text } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface SlideIndicatorProps {
  currentIndex: number;
  totalSlides: number;
}

export function SlideIndicator({ currentIndex, totalSlides }: SlideIndicatorProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.dotsContainer}>
        {Array.from({ length: totalSlides }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index <= currentIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
      <Text style={styles.counter}>
        {currentIndex + 1}/{totalSlides}
      </Text>
    </View>
  );
}
