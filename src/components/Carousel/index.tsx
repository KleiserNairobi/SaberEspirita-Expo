import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { useAppTheme } from "@/hooks/useAppTheme";
import { ICourse } from "@/types/course";

const { width } = Dimensions.get("window");
const SPACING = 10;
const ITEM_SIZE = width * 0.72;
const SPACER_ITEM_SIZE = (width - ITEM_SIZE) / 2;

interface CarouselProps {
  data: ICourse[];
  onCoursePress: (courseId: string) => void;
}

interface CarouselItemProps {
  index: number;
  item: ICourse;
  scrollX: SharedValue<number>;
  onPress: (courseId: string) => void;
}

function CarouselItem({ index, item, scrollX, onPress }: CarouselItemProps) {
  const { theme } = useAppTheme();

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
    typeof item.imageUrl === "string"
      ? { uri: item.imageUrl }
      : require("@/assets/images/course_placeholder.png"); // Fallback

  return (
    <View style={{ width: ITEM_SIZE }}>
      <Animated.View style={[styles.itemContainer, animatedStyle]}>
        <View style={styles.imageContainer}>
          <Image source={imageSource} style={styles.imageView} />
          {/* Overlay escuro */}
          <View style={styles.overlay} />
          {/* Texto sobreposto */}
          <View style={styles.textOverlayContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            {item.description && (
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
            )}
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={() => onPress(item.id)}
            >
              <Text style={styles.buttonText}>INICIAR CURSO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

export function Carousel({ data, onCoursePress }: CarouselProps) {
  const scrollX = useSharedValue(0);
  // Adiciona spacers virtuais no array
  const DATA_WITH_SPACERS = [{ id: "left-spacer" }, ...data, { id: "right-spacer" }];

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  if (data.length === 0) {
    return null; // ou um esqueleto de loading
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
        return (
          <CarouselItem
            key={item.id}
            index={index}
            item={item as ICourse}
            scrollX={scrollX}
            onPress={onCoursePress}
          />
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    // padding: SPACING,
    marginHorizontal: SPACING,
    // alignItems: "center",
    // backgroundColor: "white",
    borderRadius: 24,
    // elevation: 5,
    overflow: "hidden",
    // shadowColor: "#000",
    // height: 600,
  },
  imageContainer: {
    width: "100%",
    height: 300,
    borderRadius: 16,
    overflow: "hidden",
    alignSelf: "center",
    // marginBottom: 10,
  },
  imageView: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  textOverlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    padding: SPACING * 2,
  },
  textContainer: {
    // alignItems: "center",
    paddingHorizontal: SPACING,
    paddingBottom: SPACING * 2,
  },
  title: {
    fontFamily: "Oswald_300Light",
    fontSize: 20,
    marginBottom: 5,
    color: "white",
    // textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  description: {
    fontFamily: "Oswald_300Light",
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 16,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  button: {
    alignSelf: "stretch",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: "Oswald_600SemiBold",
    fontSize: 14,
    color: "#FFFFFF",
    letterSpacing: 0.5,
    textAlign: "center",
  },
});
