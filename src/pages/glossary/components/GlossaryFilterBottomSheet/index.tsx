import React, { forwardRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BookOpen, Heart, Tag, RotateCcw } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { GlossaryFilterType, GLOSSARY_FILTER_OPTIONS } from "@/types/glossaryFilter";
import { createStyles } from "./styles";

interface GlossaryFilterBottomSheetProps {
  filterType: GlossaryFilterType;
  onFilterChange: (filterType: GlossaryFilterType) => void;
}

// Mapeamento de ícones para cada filtro
const FILTER_ICONS: Record<GlossaryFilterType, any> = {
  ALL: BookOpen,
  FAVORITES: Heart,
  BY_CATEGORY: Tag,
};

export const GlossaryFilterBottomSheet = forwardRef<
  BottomSheetModal,
  GlossaryFilterBottomSheetProps
>(function GlossaryFilterBottomSheet({ filterType, onFilterChange }, ref) {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);

  function handleFilterSelect(newFilter: GlossaryFilterType) {
    onFilterChange(newFilter);
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

  const filterOptions = Object.values(GLOSSARY_FILTER_OPTIONS);

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      enableDynamicSizing={true}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetView
        style={[styles.container, { paddingBottom: Math.max(insets.bottom, 40) + 10 }]}
      >
        <Text style={styles.title}>Filtrar Termos</Text>

        {filterOptions.map((option, index) => {
          const Icon = FILTER_ICONS[option.value];
          const isSelected = filterType === option.value;

          return (
            <View key={option.value}>
              <TouchableOpacity
                style={[styles.option, isSelected && styles.optionSelected]}
                onPress={() => handleFilterSelect(option.value)}
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
                      color={isSelected ? theme.colors.background : theme.colors.primary}
                    />
                  </View>
                  <Text
                    style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}
                  >
                    {option.label}
                  </Text>
                </View>

                {isSelected && <View style={styles.selectedDot} />}
              </TouchableOpacity>

              {index < filterOptions.length - 1 && <View style={styles.separator} />}
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
});
