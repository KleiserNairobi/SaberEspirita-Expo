import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "../styles";
import { TimeFilter, TimeFilterEnum } from "@/types/leaderboard";

interface Props {
  selectedFilter: TimeFilter;
  onFilterChange: (filter: TimeFilter) => void;
}

export function LeaderboardFilter({ selectedFilter, onFilterChange }: Props) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const filters: { label: string; value: TimeFilter }[] = [
    { label: "Semana", value: TimeFilterEnum.WEEK },
    { label: "Mês", value: TimeFilterEnum.MONTH },
    { label: "Sempre", value: TimeFilterEnum.ALL },
  ];

  return (
    <View style={styles.filterContainer}>
      {filters.map((filter) => {
        const isActive = selectedFilter === filter.value;
        return (
          <TouchableOpacity
            key={filter.value}
            style={[styles.filterButton, isActive && styles.activeFilter]}
            onPress={() => onFilterChange(filter.value)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, isActive && styles.activeFilterText]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
