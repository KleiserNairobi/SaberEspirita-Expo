import React, { forwardRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { BookOpen, Heart, Sparkles, User, RotateCcw, Tag } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { PrayerFilterType, ContentFilterType } from "@/types/prayer";
import { createStyles } from "@/pages/pray/components/FilterBottomSheet/styles";

interface FilterBottomSheetProps {
  filterType: ContentFilterType;
  onFilterChange: (filter: ContentFilterType) => void;
  title?: string; // Título customizável
  filterOptions?: readonly { id: ContentFilterType; label: string; icon: any }[]; // Opções customizáveis
}

const FILTER_OPTIONS = [
  { id: "ALL" as ContentFilterType, label: "Todos", icon: BookOpen },
  { id: "FAVORITES" as ContentFilterType, label: "Apenas Favoritos", icon: Heart },
  { id: "BY_AUTHOR" as ContentFilterType, label: "Por Autor", icon: User },
  { id: "BY_SOURCE" as ContentFilterType, label: "Por Fonte", icon: Sparkles },
] as const;

export const FilterBottomSheet = forwardRef<BottomSheetModal, FilterBottomSheetProps>(
  (
    {
      filterType,
      onFilterChange,
      title = "Filtrar Orações",
      filterOptions = FILTER_OPTIONS,
    },
    ref
  ) => {
    const { theme } = useAppTheme();
    const insets = useSafeAreaInsets();
    const styles = createStyles(theme);

    function handleFilterSelect(filter: ContentFilterType) {
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
        enableDynamicSizing={true}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetView
          style={[styles.container, { paddingBottom: Math.max(insets.bottom, 40) + 10 }]}
        >
          <Text style={styles.title}>{title}</Text>

          {filterOptions.map((option, index) => {
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
  }
);

FilterBottomSheet.displayName = "FilterBottomSheet";
