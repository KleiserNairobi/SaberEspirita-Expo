import React, { useEffect, useRef, useState } from "react";

import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useIsFocused } from "@react-navigation/native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { useAppTheme } from "@/hooks/useAppTheme";
import type { ICourse, IUserCourseProgress } from "@/types/course";

import { ITEM_SIZE, SPACER_ITEM_SIZE, createStyles } from "./styles";

// Fator de multiplicação para simular loop infinito
// Reduzido para 10 para evitar avisos de VirtualizedList e economizar memória.
// Com a nova técnica de "Seamless Jump", 10 é mais do que o suficiente para 6 itens.
const MULTIPLIER = 10;

interface CarouselProps {
  data: ICourse[];
  progressMap?: Record<string, IUserCourseProgress>;
  onCoursePress: (courseId: string) => void;
  showRanking?: boolean;
}

interface CarouselItemProps {
  index: number;
  rankIndex?: number;
  item: ICourse;
  progress?: IUserCourseProgress;
  scrollX: SharedValue<number>;
  onPress: (courseId: string) => void;
  showRanking?: boolean;
}

const CarouselItem = React.memo(function CarouselItem({
  index,
  rankIndex,
  item,
  progress,
  scrollX,
  onPress,
  showRanking = false,
}: CarouselItemProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const finalRating = item.averageRating ?? item.rating;

  const inputRange = [
    (index - 1) * ITEM_SIZE,
    index * ITEM_SIZE,
    (index + 1) * ITEM_SIZE,
  ];

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [15, 0, 15],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.9, 1, 0.9],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  const imageSource =
    typeof item.imageUrl === "string" && item.imageUrl.trim().length > 0
      ? { uri: item.imageUrl }
      : typeof item.imageUrl === "number"
        ? item.imageUrl
        : require("@/assets/images/placeholder.jpeg");

  const isComingSoon = item.status === "COMING_SOON";
  const isLegacy = item.status === "LEGACY";

  const hasStarted = !!progress;
  const completionPercent =
    item.lessonCount > 0
      ? ((progress?.completedLessons.length || 0) / item.lessonCount) * 100
      : 0;

  // Apenas cursos COMING_SOON são travados de toque.
  const isLocked = isComingSoon;

  const displayPercent = Math.min(Math.round(completionPercent), 100);

  return (
    <View style={{ width: ITEM_SIZE }}>
      <Animated.View style={[styles.itemContainer, animatedStyle]}>
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={isLocked ? undefined : () => onPress(item.id)}
          disabled={isLocked}
          style={styles.imageContainer}
        >
          <Image
            source={imageSource}
            style={styles.imageView}
            contentFit="cover"
            transition={150}
            cachePolicy="memory-disk"
            placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
            priority={index <= 2 ? "high" : "normal"}
          />

          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.35)", "rgba(0,0,0,0.88)"]}
            locations={[0, 0.4, 1]}
            style={[StyleSheet.absoluteFillObject, { borderRadius: 16 }]}
          />

          {/* RANKING TOP 5 - OPÇÃO A (Número puro grande) */}
          {showRanking && rankIndex !== undefined && (
            <View style={styles.rankBadge}>
              <Text style={styles.rankBadgeText}>{rankIndex}</Text>
            </View>
          )}

          {/* BADGE DE AVALIAÇÃO */}
          {finalRating !== undefined && finalRating !== null && finalRating > 0 && (
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingBadgeStar}>★</Text>
              <Text style={styles.ratingBadgeText}>{finalRating.toFixed(1)}</Text>
            </View>
          )}

          {/* BADGE EM BREVE */}
          {isComingSoon && (
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonBadgeText}>Em breve</Text>
            </View>
          )}

          {/* TÍTULO E PROGRESSO NA BASE */}
          <View style={styles.textOverlayContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>

            {hasStarted && !isComingSoon && (
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBarFill, { width: `${displayPercent}%` }]} />
                <Text style={styles.percentText}>{displayPercent}%</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
});

export function Carousel({
  data,
  progressMap,
  onCoursePress,
  showRanking = false,
}: CarouselProps) {
  const isFocused = useIsFocused();
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<Animated.FlatList<any>>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Referência para rastrear o índice atual e garantir previsibilidade no autoscroll
  const initialIndex = Math.floor(MULTIPLIER / 2) * data.length;
  const currentIndexRef = useRef(initialIndex);

  // Criar dados para loop infinito multiplicando a lista original
  const expandedData = React.useMemo(() => {
    if (data.length === 0) return [];
    return Array(MULTIPLIER)
      .fill(data)
      .flat()
      .map((item, index) => ({
        ...item,
        uniqueKey: `${item.id}-${index}`,
      }));
  }, [data]);

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  // Gerenciamento de Auto-play
  useEffect(() => {
    if (isFocused && isAutoPlaying && data.length > 1) {
      timerRef.current = setInterval(() => {
        const nextIndex = currentIndexRef.current + 1;

        // TÉCNICA SEAMLESS JUMP NO AUTOPLAY:
        // Se chegarmos ao fim da lista expandida, saltamos instantaneamente para o início do bloco do meio
        // antes de prosseguir com a animação.
        if (nextIndex >= expandedData.length) {
          const relativeIndex = currentIndexRef.current % data.length;
          const middleIndex = Math.floor(MULTIPLIER / 2) * data.length + relativeIndex;

          flatListRef.current?.scrollToIndex({
            index: middleIndex,
            animated: false,
          });

          currentIndexRef.current = middleIndex + 1;
        } else {
          currentIndexRef.current = nextIndex;
        }

        flatListRef.current?.scrollToIndex({
          index: currentIndexRef.current,
          animated: true,
        });
      }, 5000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isFocused, isAutoPlaying, data.length, expandedData.length]);

  const handleScrollBeginDrag = () => {
    setIsAutoPlaying(false);
  };

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Sincroniza a referência do índice com a posição atual após scroll manual
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / ITEM_SIZE);

    // TÉCNICA SEAMLESS JUMP:
    // Se o usuário chegar perto das bordas (primeiro ou último conjunto),
    // saltamos silenciosamente para o conjunto do meio.
    const dataLength = data.length;
    const totalItems = expandedData.length;

    let targetIndex = index;

    // Se estiver no primeiro conjunto (primeiros dataLength itens) ou no último
    if (index < dataLength || index >= totalItems - dataLength) {
      // Calcula a posição relativa dentro do ciclo de 6 itens
      const relativeIndex = index % dataLength;
      // Salta para o "meio" da lista expandida
      targetIndex = Math.floor(MULTIPLIER / 2) * dataLength + relativeIndex;

      // O salto é instantâneo (animated: false), tornando-o invisível
      flatListRef.current?.scrollToIndex({
        index: targetIndex,
        animated: false,
      });
    }

    currentIndexRef.current = targetIndex;

    // Retomar o auto-play após 2 segundos de inatividade após o scroll manual
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 2000);
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <Animated.FlatList
      ref={flatListRef}
      horizontal
      data={expandedData}
      keyExtractor={(item) => item.uniqueKey}
      showsHorizontalScrollIndicator={false}
      snapToInterval={ITEM_SIZE}
      snapToAlignment="center"
      contentContainerStyle={{
        paddingHorizontal: SPACER_ITEM_SIZE,
        paddingVertical: 12,
        alignItems: "center",
      }}
      bounces={false}
      decelerationRate={"fast"}
      scrollEventThrottle={16}
      onScroll={onScrollHandler}
      onScrollBeginDrag={handleScrollBeginDrag}
      onMomentumScrollEnd={handleMomentumScrollEnd}
      // Otimizações de performance para listas grandes
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      windowSize={5}
      removeClippedSubviews={false}
      // Começar no meio da lista para permitir rolagem infinita inicial para ambos os lados
      initialScrollIndex={initialIndex}
      getItemLayout={(_, index) => ({
        length: ITEM_SIZE,
        offset: ITEM_SIZE * index,
        index,
      })}
      renderItem={({ item, index }) => {
        const courseItem = item as ICourse;
        const progress = progressMap ? progressMap[courseItem.id] : undefined;
        const rankIndex = data.length > 0 ? (index % data.length) + 1 : undefined;

        return (
          <CarouselItem
            key={item.uniqueKey}
            index={index}
            rankIndex={rankIndex}
            item={courseItem}
            progress={progress}
            scrollX={scrollX}
            onPress={onCoursePress}
            showRanking={showRanking}
          />
        );
      }}
    />
  );
}
