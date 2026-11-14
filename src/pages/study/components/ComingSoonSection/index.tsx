import React, { useEffect, useRef, useState } from "react";

import {
  Animated,
  Easing,
  FlatList,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronRight } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { ICourse } from "@/types/course";

import { createStyles } from "./styles";

interface ComingSoonSectionProps {
  courses: ICourse[];
  onPressCourse: (course: ICourse) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  INIC: "Iniciação",
  INICIACAO: "Iniciação",
  LE: "O Livro dos Espíritos",
  ESE: "O Evangelho",
  AG: "A Gênese",
  LM: "O Livro dos Médiuns",
  MEDIUNIDADE: "O Livro dos Médiuns",
  CI: "O Céu e o Inferno",
  CEU_E_INFERNO: "O Céu e o Inferno",
  COMP: "Obras Complementares",
};

export const ComingSoonSection = React.memo(function ComingSoonSection({
  courses,
  onPressCourse,
}: ComingSoonSectionProps) {
  const { theme } = useAppTheme();
  const { width: windowWidth } = useResponsiveLayout();
  const styles = createStyles(theme);
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const availableWidth = containerWidth || windowWidth;
  const cardWidth = Math.max(availableWidth - theme.spacing.lg * 2, 280);
  const snapInterval = cardWidth + theme.spacing.md;

  const badgePulse = useRef(new Animated.Value(1)).current;
  const mountAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Entrada suave da seção
    Animated.timing(mountAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // 2. Pulso sutil no badge "Em breve" chamando a atenção
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(badgePulse, {
          toValue: 1.06,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(badgePulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.delay(1800),
      ])
    );

    pulseLoop.start();

    return () => {
      pulseLoop.stop();
    };
  }, [badgePulse, mountAnim]);

  if (!courses || courses.length === 0) {
    return null;
  }

  const isSingle = courses.length === 1;

  const handleContainerLayout = (event: LayoutChangeEvent) => {
    const nextWidth = Math.round(event.nativeEvent.layout.width);
    if (nextWidth > 0 && nextWidth !== containerWidth) {
      setContainerWidth(nextWidth);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / snapInterval);
    setActiveIndex(Math.max(0, Math.min(index, courses.length - 1)));
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: mountAnim,
          transform: [
            {
              translateY: mountAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [10, 0],
              }),
            },
          ],
        },
      ]}
      onLayout={handleContainerLayout}
    >
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Em breve</Text>
        {!isSingle && (
          <Text style={styles.counterText}>
            {activeIndex + 1} de {courses.length}
          </Text>
        )}
      </View>

      <FlatList
        data={courses}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={snapInterval}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const categoryName =
            (item.categoryId && CATEGORY_LABELS[item.categoryId]) ||
            "Lançamento";

          const imageSource =
            typeof item.imageUrl === "string" && item.imageUrl.trim().length > 0
              ? { uri: item.imageUrl }
              : typeof item.imageUrl === "number"
                ? item.imageUrl
                : require("@/assets/images/imgPhV.webp");

          return (
            <TouchableOpacity
              style={[styles.card, { width: cardWidth }]}
              onPress={() => onPressCourse(item)}
              activeOpacity={0.85}
            >
              <Image
                source={imageSource}
                placeholder={require("@/assets/images/imgPhV.webp")}
                style={styles.bgImage}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
              />

              <LinearGradient
                colors={[
                  "rgba(0, 0, 0, 0.35)",
                  "rgba(0, 0, 0, 0.48)",
                  "rgba(0, 0, 0, 0.88)",
                ]}
                locations={[0, 0.45, 1]}
                style={styles.gradientOverlay}
              >
                <View style={styles.topRow}>
                  <Animated.View
                    style={[
                      styles.comingSoonBadge,
                      { transform: [{ scale: badgePulse }] },
                    ]}
                  >
                    <Text style={styles.comingSoonText}>Em breve</Text>
                  </Animated.View>

                  <Text style={styles.categoryPill}>{categoryName}</Text>
                </View>

                <View style={styles.bottomContent}>
                  <Text
                    style={styles.courseTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.title}
                  </Text>
                  {item.author ? (
                    <Text
                      style={styles.authorText}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.author}
                    </Text>
                  ) : null}

                  <View style={styles.ctaRow}>
                    <Text style={styles.ctaText}>Conhecer detalhes</Text>
                    <ChevronRight size={14} color={theme.colors.primary} />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          );
        }}
      />
    </Animated.View>
  );
});
