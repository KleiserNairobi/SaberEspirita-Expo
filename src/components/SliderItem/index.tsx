import { ImageSliderType } from "@/data/SliderData";
import { Heart } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { styles } from "./styles";

type Props = {
  index: number;
  item: ImageSliderType;
  scrollX: SharedValue<number>;
};

const { width } = Dimensions.get("window");

export function SliderItem({ index, item, scrollX }: Props) {
  const rnAnimatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

    return {
      transform: [
        {
          translateX: interpolate(
            scrollX.value,
            inputRange,
            [-width * 0.25, 0, width * 0.25],
            Extrapolation.CLAMP
          ),
        },
        {
          scale: interpolate(
            scrollX.value,
            inputRange,
            [0.9, 1, 0.9],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.container, rnAnimatedStyle, { width }]}>
      <Image
        source={typeof item.image === "string" ? { uri: item.image } : item.image}
        style={{
          width: 280,
          height: 400,
          borderRadius: 10,
        }}
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.background}
      >
        <View style={{ alignItems: "flex-end" }}>
          <TouchableOpacity style={styles.icon}>
            <Heart size={28} color="white" />
          </TouchableOpacity>
        </View>
        <View style={{ gap: 10 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}
