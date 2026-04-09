import React, { forwardRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { RotateCcw, Sparkles } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useMoodStore } from "@/stores/moodStore";
import { MOODS } from "./index";
import { createStyles } from "./styles";

export const MoodSelectionBottomSheet = forwardRef<BottomSheetModal>(
  function MoodSelectionBottomSheet(_, ref) {
    const { theme } = useAppTheme();
    const { currentMood, setMood } = useMoodStore();
    const insets = useSafeAreaInsets();
    const styles = createStyles(theme);

    function handleMoodSelect(moodId: any) {
      setMood(moodId);
      (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
    }

    function renderBackdrop(props: any) {
      return (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          pressBehavior="close"
        />
      );
    }

    return (
      <BottomSheetModal
        ref={ref}
        enableDynamicSizing={true}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetView
          style={[styles.modalContent, { paddingBottom: Math.max(insets.bottom, 24) }]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Como está seu coração?</Text>
          </View>

          {MOODS.map((mood, index) => {
            const Icon = mood.icon;
            const isSelected = currentMood === mood.id;
            const isLast = index === MOODS.length - 1;

            return (
              <TouchableOpacity
                key={mood.id}
                style={[
                  styles.moodOption,
                  isSelected && styles.moodOptionSelected,
                  isLast && { borderBottomWidth: 0 },
                ]}
                onPress={() => handleMoodSelect(mood.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.optionIconContainer,
                    isSelected && styles.optionIconContainerSelected,
                  ]}
                >
                  <Icon
                    size={20}
                    color={isSelected ? theme.colors.background : theme.colors.primary}
                  />
                </View>
                <Text
                  style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}
                >
                  {mood.label}
                </Text>
                {isSelected && <View style={styles.selectionDot} />}
              </TouchableOpacity>
            );
          })}

          {currentMood && currentMood !== "NORMAL" && (
            <View style={{ marginTop: 24 }}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => handleMoodSelect("NORMAL")}
                activeOpacity={0.7}
              >
                <RotateCcw size={18} color={theme.colors.textSecondary} />
                <Text style={styles.clearButtonText}>Limpar sentimento</Text>
              </TouchableOpacity>
            </View>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);
