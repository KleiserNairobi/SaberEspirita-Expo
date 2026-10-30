import React, { useEffect, useRef } from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { useAppTheme } from "@/hooks/useAppTheme";
import { AnimatedSplashScreenProps } from "./types";
import { createStyles } from "./styles";

const MINIMUM_DISPLAY_TIME_MS = 1200;

export function AnimatedSplashScreen({ isReady, onFinish }: AnimatedSplashScreenProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const mountTimestampRef = useRef(Date.now());
  const hasTriggeredExitRef = useRef(false);
  const hasCalledFinishRef = useRef(false);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  const triggerFinishOnce = () => {
    if (hasCalledFinishRef.current) return;
    hasCalledFinishRef.current = true;
    onFinishRef.current();
  };

  // Valores compartilhados para animações
  const containerOpacity = useSharedValue(1);
  const containerScale = useSharedValue(1);
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.92);
  const textOpacity = useSharedValue(0);
  const progressX = useSharedValue(-50);

  useEffect(() => {
    // 1. Animação de entrada da logo
    logoOpacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });

    logoScale.value = withSequence(
      withTiming(1, {
        duration: 700,
        easing: Easing.out(Easing.cubic),
      }),
      withRepeat(
        withTiming(1.03, {
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
        }),
        -1,
        true
      )
    );

    // 2. Animação de entrada dos textos (Allura e Baskervville) com delay elegante
    textOpacity.value = withDelay(
      350,
      withTiming(1, {
        duration: 700,
        easing: Easing.out(Easing.cubic),
      })
    );

    // 3. Animação contínua da barra de progresso (shimmer de luz)
    progressX.value = withRepeat(
      withTiming(130, {
        duration: 1400,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      false
    );
  }, []);

  // Monitora se o app está pronto para disparar a saída
  useEffect(() => {
    if (!isReady || hasTriggeredExitRef.current) {
      return;
    }

    const elapsed = Date.now() - mountTimestampRef.current;
    const remainingDelay = Math.max(0, MINIMUM_DISPLAY_TIME_MS - elapsed);

    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;

    const timer = setTimeout(() => {
      if (hasTriggeredExitRef.current) return;
      hasTriggeredExitRef.current = true;

      // Fallback de segurança caso animações estejam reduzidas/desativadas no SO
      fallbackTimer = setTimeout(() => {
        triggerFinishOnce();
      }, 450);

      // Animação suave de saída (fade-out cinematográfico com leve expansão)
      containerScale.value = withTiming(1.03, {
        duration: 380,
        easing: Easing.out(Easing.cubic),
      });

      containerOpacity.value = withTiming(
        0,
        {
          duration: 380,
          easing: Easing.out(Easing.cubic),
        },
        () => {
          runOnJS(triggerFinishOnce)();
        }
      );
    }, remainingDelay);

    return () => {
      clearTimeout(timer);
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, [isReady]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: containerScale.value }],
  }));

  const animatedLogoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const animatedProgressStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progressX.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]} pointerEvents="none">
      <View style={styles.contentWrapper}>
        <Animated.View style={animatedLogoStyle}>
          <Image
            source={require("@/assets/images/logo512.webp")}
            style={styles.logo}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
        </Animated.View>

        <Animated.View style={animatedTextStyle}>
          <Text style={styles.title}>Saber Espírita</Text>
          <Text style={styles.motto}>Iluminando mentes, confortando corações.</Text>
        </Animated.View>

        <View style={styles.indicatorContainer}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressBar, animatedProgressStyle]} />
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
