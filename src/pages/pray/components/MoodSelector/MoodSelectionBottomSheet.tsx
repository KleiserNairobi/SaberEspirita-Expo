import React, { forwardRef, useCallback, useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { RotateCcw, X } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useMoodStore } from "@/stores/moodStore";
import { MOODS } from "./constants";
import { createStyles } from "./styles";

export const MoodSelectionBottomSheet = forwardRef<BottomSheetModal>(
  function MoodSelectionBottomSheet(_props, ref) {
    const { theme } = useAppTheme();
    const { currentMood, setMood } = useMoodStore();
    const insets = useSafeAreaInsets();
    const styles = createStyles(theme);
    const snapPoints = useMemo(() => ["80%"], []);

    function handleMoodSelect(moodId: any) {
      setMood(moodId);
      (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
    }

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          pressBehavior="close"
        />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        topInset={insets.top}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <View style={styles.modalHeader}>
          <View style={styles.headerTextBlock}>
            <Text style={styles.modalTitle}>Como está seu coração?</Text>
            <Text style={styles.modalSubtitle}>
              Compartilhe seu estado presente para sintonia na prece
            </Text>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => (ref as React.RefObject<BottomSheetModal>).current?.dismiss()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Fechar"
            accessibilityRole="button"
          >
            <X size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <BottomSheetScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 24) + 48 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {MOODS.map((mood) => {
            const Icon = mood.icon;
            const isSelected = currentMood === mood.id;

            return (
              <TouchableOpacity
                key={mood.id}
                style={[styles.moodOption, isSelected && styles.moodOptionSelected]}
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
                <View style={styles.optionContent}>
                  <Text
                    style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}
                  >
                    {mood.label}
                  </Text>
                  <Text style={styles.optionSubtitle}>{mood.subtitle}</Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {currentMood && currentMood !== "NORMAL" && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => handleMoodSelect("NORMAL")}
              activeOpacity={0.7}
            >
              <RotateCcw size={18} color={theme.colors.primary} />
              <Text style={styles.clearButtonText}>Restabelecer sintonia equilibrada</Text>
            </TouchableOpacity>
          )}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);
