import { View } from "react-native";

import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import { ImageSliderType } from "@/data/SliderData";

import { SliderItem } from "../SliderItem";

type Props = {
  itemList: ImageSliderType[];
};

export function Slider({ itemList }: Props) {
  const scrollX = useSharedValue(0);

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <View>
      <Animated.FlatList
        data={itemList}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <SliderItem item={item} index={index} scrollX={scrollX} />
        )}
        horizontal
        onScroll={onScrollHandler}
        scrollEventThrottle={16}
      />
    </View>
  );
}
