import React, { forwardRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BookOpen, Circle, CheckCircle2, RotateCcw } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

export type SubcategoryFilterType = "ALL" | "COMPLETED" | "NOT_COMPLETED";

interface SubcategoryFilterBottomSheetProps {
  filterType: SubcategoryFilterType;
  onFilterChange: (filterType: SubcategoryFilterType) => void;
}

const FILTER_OPTIONS: { label: string; value: SubcategoryFilterType }[] = [
  { label: "Todos", value: "ALL" },
  { label: "Concluídos", value: "COMPLETED" },
  { label: "Não concluídos", value: "NOT_COMPLETED" },
];

const FILTER_ICONS: Record<SubcategoryFilterType, any> = {
  ALL: BookOpen,
  COMPLETED: CheckCircle2,
  NOT_COMPLETED: Circle,
};

export const SubcategoryFilterBottomSheet = forwardRef<
  BottomSheetModal,
  SubcategoryFilterBottomSheetProps
>(function SubcategoryFilterBottomSheet({ filterType, onFilterChange }, ref) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  function handleFilterSelect(newFilter: SubcategoryFilterType) {
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

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={["40%"]}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetView style={styles.container}>
        <Text style={styles.title}>Filtrar Subcategorias</Text>

        {FILTER_OPTIONS.map((option, index) => {
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
              <Text style={styles.clearButtonText}>Limpar Filtro</Text>
            </TouchableOpacity>
          </>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
});
