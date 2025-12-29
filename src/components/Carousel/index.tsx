import { ImageSlider } from "@/data/SliderData";
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

const { width } = Dimensions.get("window");
const SPACING = 10;
const ITEM_SIZE = width * 0.72;
const SPACER_ITEM_SIZE = (width - ITEM_SIZE) / 2;

interface CarouselProps {
  index?: number;
  item: (typeof ImageSlider)[number];
  scrollX: SharedValue<number>;
}

function CarouselItem({ index, item, scrollX }: CarouselProps) {
  const inputRange = [
    (index! - 2) * ITEM_SIZE,
    (index! - 1) * ITEM_SIZE,
    index! * ITEM_SIZE,
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

  return (
    <View style={{ width: ITEM_SIZE }}>
      <Animated.View style={[styles.itemContainer, animatedStyle]}>
        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.imageView} />
          {/* Overlay escuro para melhor legibilidade do texto */}
          <View style={styles.overlay}></View>
          {/* Container do texto sobreposto na imagem */}
          <View style={styles.textOverlayContainer}>
            <Text style={styles.title}>{item.title}</Text>
            {item.description && (
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
            )}
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={() => console.log("Iniciar curso:", item.title)}
            >
              <Text style={styles.buttonText}>INICIAR CURSO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

export function Carousel() {
  const scrollX = useSharedValue(0);
  const DATA_LENGTH = ImageSlider.length;

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <Animated.FlatList
      horizontal
      data={ImageSlider}
      keyExtractor={(_item, index) => index.toString()}
      showsHorizontalScrollIndicator={false}
      // contentContainerStyle={{ alignItems: "center" }}
      snapToInterval={ITEM_SIZE}
      bounces={false}
      decelerationRate={"fast"}
      scrollEventThrottle={16}
      onScroll={onScrollHandler}
      renderItem={({ item, index }) => {
        if (index === 0 || index === DATA_LENGTH - 1) {
          return <View style={{ width: SPACER_ITEM_SIZE }} />;
        }
        return <CarouselItem key={index} index={index} item={item} scrollX={scrollX} />;
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
    paddingVertical: 12,
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
