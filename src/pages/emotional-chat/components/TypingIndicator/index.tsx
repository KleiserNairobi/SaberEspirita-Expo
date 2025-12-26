import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";

export function TypingIndicator() {
  const { theme } = useAppTheme();
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    function animate(dot: Animated.Value, delay: number) {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    }

    const animation = Animated.parallel([
      animate(dot1, 0),
      animate(dot2, 150),
      animate(dot3, 300),
    ]);

    animation.start();

    return () => animation.stop();
  }, []);

  function animatedStyle(dot: Animated.Value) {
    return {
      opacity: dot.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 1],
      }),
      transform: [
        {
          translateY: dot.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -4],
          }),
        },
      ],
    };
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.dot, { backgroundColor: theme.colors.muted }, animatedStyle(dot1)]}
      />
      <Animated.View
        style={[styles.dot, { backgroundColor: theme.colors.muted }, animatedStyle(dot2)]}
      />
      <Animated.View
        style={[styles.dot, { backgroundColor: theme.colors.muted }, animatedStyle(dot3)]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
