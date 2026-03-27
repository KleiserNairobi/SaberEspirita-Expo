import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { Play, CheckCircle2, Plus, Clock } from "lucide-react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles, ITEM_SIZE, SPACER_ITEM_SIZE } from "./styles";
import type { ICourse, IUserCourseProgress } from "@/types/course";

interface CarouselProps {
  data: ICourse[];
  progressMap?: Record<string, IUserCourseProgress>;
  onCoursePress: (courseId: string) => void;
}

interface CarouselItemProps {
  index: number;
  item: ICourse;
  progress?: IUserCourseProgress;
  scrollX: SharedValue<number>;
  onPress: (courseId: string) => void;
}

function CarouselItem({ index, item, progress, scrollX, onPress }: CarouselItemProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const inputRange = [
    (index - 2) * ITEM_SIZE,
    (index - 1) * ITEM_SIZE,
    index * ITEM_SIZE,
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
        : require("@/assets/images/placeholder.png");

  const isComingSoon = item.status === "COMING_SOON";

  const hasStarted = progress && progress.completedLessons.length > 0;
  const completionPercent =
    item.lessonCount > 0
      ? ((progress?.completedLessons.length || 0) / item.lessonCount) * 100
      : 0;
  const isCompleted = completionPercent >= 100;

  const buttonText = isComingSoon
    ? "EM BREVE"
    : isCompleted
      ? "CONCLUÍDO"
      : hasStarted
        ? "CONTINUAR"
        : "INICIAR CURSO";

  const displayPercent = Math.min(Math.round(completionPercent), 100);

  return (
    <View style={{ width: ITEM_SIZE }}>
      <Animated.View style={[styles.itemContainer, animatedStyle]}>
        <View style={styles.imageContainer}>
          <Image
            source={imageSource}
            style={styles.imageView}
            contentFit="cover"
            transition={200}
            placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
            priority={index <= 2 ? "high" : "normal"}
          />
          <View style={styles.overlay} />
          <View style={styles.textOverlayContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            {item.description && (
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
            )}

            {hasStarted && !isComingSoon && (
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBarFill, { width: `${displayPercent}%` }]} />
                <Text style={styles.percentText}>{displayPercent}%</Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                isComingSoon && styles.buttonComingSoon,
                isCompleted && styles.buttonCompleted,
                hasStarted && !isCompleted && styles.buttonContinuing,
              ]}
              activeOpacity={isComingSoon ? 1 : 0.8}
              onPress={isComingSoon ? undefined : () => onPress(item.id)}
              disabled={isComingSoon}
            >
              <View style={styles.buttonContent}>
                {isComingSoon ? (
                  <Clock size={14} color="#FFF" style={{ marginRight: 6 }} />
                ) : isCompleted ? (
                  <CheckCircle2 size={14} color="#FFF" style={{ marginRight: 6 }} />
                ) : hasStarted ? (
                  <Play size={12} color="#FFF" fill="#FFF" style={{ marginRight: 6 }} />
                ) : (
                  <Plus size={14} color="#FFF" style={{ marginRight: 6 }} />
                )}
                <Text style={styles.buttonText}>{buttonText}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

export function Carousel({ data, progressMap, onCoursePress }: CarouselProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const scrollX = useSharedValue(0);

  const DATA_WITH_SPACERS = [{ id: "left-spacer" }, ...data, { id: "right-spacer" }];

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  if (data.length === 0) {
    return null;
  }

  return (
    <Animated.FlatList
      horizontal
      data={DATA_WITH_SPACERS}
      keyExtractor={(item) => item.id.toString()}
      showsHorizontalScrollIndicator={false}
      snapToInterval={ITEM_SIZE}
      bounces={false}
      decelerationRate={"fast"}
      scrollEventThrottle={16}
      onScroll={onScrollHandler}
      renderItem={({ item, index }) => {
        if (item.id === "left-spacer" || item.id === "right-spacer") {
          return <View style={{ width: SPACER_ITEM_SIZE }} />;
        }

        const courseItem = item as ICourse;
        const progress = progressMap ? progressMap[courseItem.id] : undefined;

        return (
          <CarouselItem
            key={item.id}
            index={index}
            item={courseItem}
            progress={progress}
            scrollX={scrollX}
            onPress={onCoursePress}
          />
        );
      }}
    />
  );
}
