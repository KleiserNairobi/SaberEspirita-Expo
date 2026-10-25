import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

export interface AdaptiveReadingContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  maxWidth?: number;
}

export function AdaptiveReadingContainer({
  children,
  style,
  maxWidth,
}: AdaptiveReadingContainerProps) {
  const { isCompact, maxReadingWidth } = useResponsiveLayout();

  return (
    <View
      style={[
        styles.container,
        !isCompact && {
          maxWidth: maxWidth ?? maxReadingWidth,
          width: "100%",
          alignSelf: "center",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
