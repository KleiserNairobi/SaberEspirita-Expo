import React, { forwardRef, useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { BookOpen, Heart, Sparkles, User, RotateCcw } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { PrayerFilterType } from "@/types/prayer";
import { createStyles } from "@/pages/pray/components/FilterBottomSheet/styles";

interface FilterBottomSheetProps {
  filterType: PrayerFilterType;
  onFilterChange: (filter: PrayerFilterType) => void;
}

const FILTER_OPTIONS = [
  { id: "ALL" as PrayerFilterType, label: "Todos", icon: BookOpen },
  { id: "FAVORITES" as PrayerFilterType, label: "Apenas Favoritos", icon: Heart },
  { id: "BY_AUTHOR" as PrayerFilterType, label: "Por Autor", icon: User },
  { id: "BY_SOURCE" as PrayerFilterType, label: "Por Fonte", icon: Sparkles },
] as const;

export const FilterBottomSheet = forwardRef<BottomSheetModal, FilterBottomSheetProps>(
  ({ filterType, onFilterChange }, ref) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);

    const snapPoints = useMemo(() => ["60%"], []);

    function handleFilterSelect(filter: PrayerFilterType) {
      onFilterChange(filter);
      // @ts-ignore
      ref?.current?.close();
    }

    function renderBackdrop(props: any) {
      return (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      );
    }

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetView style={styles.container}>
          <Text style={styles.title}>Filtrar Orações</Text>

          {FILTER_OPTIONS.map((option, index) => {
            const Icon = option.icon;
            const isSelected = filterType === option.id;

            return (
              <View key={option.id}>
                <TouchableOpacity
                  style={[styles.option, isSelected && styles.optionSelected]}
                  onPress={() => handleFilterSelect(option.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionLeft}>
                    <View
                      style={[
                        styles.optionIconContainer,
                        isSelected && styles.optionIconContainerSelected,
                      ]}
                    >
                      <Icon
                        size={20}
                        color={
                          isSelected ? theme.colors.background : theme.colors.primary
                        }
                      />
                    </View>
                    <Text
                      style={[
                        styles.optionLabel,
                        isSelected && styles.optionLabelSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </View>

                  {isSelected && <View style={styles.selectedDot} />}
                </TouchableOpacity>

                {index < FILTER_OPTIONS.length - 1 && <View style={styles.separator} />}
              </View>
            );
          })}

          {filterType !== "ALL" && (
            <>
              <View style={styles.separator} />
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => handleFilterSelect("ALL")}
                activeOpacity={0.7}
              >
                <RotateCcw
                  size={20}
                  color={theme.colors.primary}
                  style={styles.clearButtonIcon}
                />
                <Text style={styles.clearButtonText}>Limpar Filtros</Text>
              </TouchableOpacity>
            </>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

FilterBottomSheet.displayName = "FilterBottomSheet";
