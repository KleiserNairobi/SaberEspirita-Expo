import React from "react";
import { ScrollView, View, ViewStyle } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface ContentSheetProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

export function ContentSheet({
  children,
  style,
  contentContainerStyle,
}: ContentSheetProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.mainContentContainer, style]}>
      <ScrollView
        style={styles.cardScroll}
        contentContainerStyle={[styles.cardScrollContent, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}
