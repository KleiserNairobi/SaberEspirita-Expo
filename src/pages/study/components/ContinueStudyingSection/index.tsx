import React, { useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { ChevronRight } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { ICourse, IUserCourseProgress } from "@/types/course";

import { createStyles } from "./styles";

export interface InProgressCourseItem {
  course: ICourse;
  progress: IUserCourseProgress;
  displayPercent: number;
  nextLessonTitle?: string;
}

interface ContinueStudyingSectionProps {
  items: InProgressCourseItem[];
  onPressItem: (item: InProgressCourseItem) => void;
  onSeeAllPress?: () => void;
}

export const ContinueStudyingSection = React.memo(
  function ContinueStudyingSection({
    items,
    onPressItem,
    onSeeAllPress,
  }: ContinueStudyingSectionProps) {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    const [activeIndex, setActiveIndex] = useState(0);

    if (!items || items.length === 0) {
      return null;
    }

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / 300);
      setActiveIndex(Math.max(0, Math.min(index, items.length - 1)));
    };

    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.titleTouchable}
            onPress={onSeeAllPress}
            activeOpacity={onSeeAllPress ? 0.7 : 1}
            disabled={!onSeeAllPress}
          >
            <Text style={styles.sectionTitle}>Continue Estudando</Text>
            {items.length > 1 && (
              <ChevronRight size={18} color={theme.colors.textSecondary} />
            )}
          </TouchableOpacity>

          {items.length > 1 && (
            <Text style={styles.counterText}>
              {activeIndex + 1} de {items.length}
            </Text>
          )}
        </View>

        <FlatList
          data={items}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={296} // 280 (card width) + 16 (gap)
          decelerationRate="fast"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.listContent}
          keyExtractor={(item) => item.course.id}
          renderItem={({ item }) => {
            const { course, displayPercent, nextLessonTitle } = item;
            const imageSource =
              typeof course.imageUrl === "string" && course.imageUrl.trim().length > 0
                ? { uri: course.imageUrl }
                : typeof course.imageUrl === "number"
                  ? course.imageUrl
                  : require("@/assets/images/placeholder.jpeg");

            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => onPressItem(item)}
                activeOpacity={0.8}
              >
                <Image
                  source={imageSource}
                  placeholder={require("@/assets/images/placeholder.jpeg")}
                  style={styles.thumbnail}
                  contentFit="cover"
                  transition={200}
                  cachePolicy="memory-disk"
                />

                <View style={styles.infoContainer}>
                  <View style={styles.cardTopRow}>
                    <Text style={styles.kicker}>EM ANDAMENTO</Text>
                    <Text style={styles.percentText}>{displayPercent}%</Text>
                  </View>

                  <Text style={styles.courseTitle} numberOfLines={1} ellipsizeMode="tail">
                    {course.title}
                  </Text>

                  <Text style={styles.lessonTitle} numberOfLines={1} ellipsizeMode="tail">
                    {nextLessonTitle || "Continuar de onde parou"}
                  </Text>

                  {/* Barra de progresso fina em verde */}
                  <View style={styles.progressBarBackground}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${Math.max(displayPercent, 3)}%` },
                      ]}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }
);
