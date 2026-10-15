import { useWindowDimensions } from "react-native";
import { ResponsiveLayoutConfig, WindowWidthSizeClass } from "@/configs/theme";

const COMPACT_MAX_WIDTH = 599;
const MEDIUM_MAX_WIDTH = 839;
const MAX_READING_WIDTH = 680;

export function useResponsiveLayout(): ResponsiveLayoutConfig {
  const { width, height } = useWindowDimensions();

  let widthSizeClass: WindowWidthSizeClass = "compact";
  let suggestedColumns = 1;

  if (width > MEDIUM_MAX_WIDTH) {
    widthSizeClass = "expanded";
    suggestedColumns = 3;
  } else if (width > COMPACT_MAX_WIDTH) {
    widthSizeClass = "medium";
    suggestedColumns = 2;
  } else {
    widthSizeClass = "compact";
    suggestedColumns = 1;
  }

  const isCompact = widthSizeClass === "compact";
  const isMedium = widthSizeClass === "medium";
  const isExpanded = widthSizeClass === "expanded";
  const isLandscape = width > height;

  return {
    widthSizeClass,
    isCompact,
    isMedium,
    isExpanded,
    isLandscape,
    width,
    height,
    suggestedColumns,
    maxReadingWidth: MAX_READING_WIDTH,
  };
}
