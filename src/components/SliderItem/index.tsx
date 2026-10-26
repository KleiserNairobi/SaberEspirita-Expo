import { Text, TouchableOpacity, View, useWindowDimensions } from "react-native";

import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Heart } from "lucide-react-native";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

import { ImageSliderType } from "@/data/SliderData";
import { useAppTheme } from "@/hooks/useAppTheme";

import { createStyles } from "./styles";

type Props = {
  index: number;
  item: ImageSliderType;
  scrollX: SharedValue<number>;
};

export function SliderItem({ index, item, scrollX }: Props) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const { width } = useWindowDimensions();

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
        contentFit="cover"
        style={{
          width: 280,
          height: 400,
          borderRadius: theme.radius.md,
        }}
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.background}
      >
        <View style={{ alignItems: "flex-end" }}>
          <TouchableOpacity style={styles.icon}>
            <Heart size={28} color={theme.colors.onPrimary} />
          </TouchableOpacity>
        </View>
        <View style={{ gap: theme.spacing.sm }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}
