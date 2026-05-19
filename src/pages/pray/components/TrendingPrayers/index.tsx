import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Animated } from "react-native";
import { ChevronRight, TrendingUp, ChevronDown, Users } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useAppTheme } from "@/hooks/useAppTheme";
import { PrayStackParamList } from "@/routers/types";
import { useTrendingPrayers, TrendingPeriod } from "@/pages/pray/hooks/useTrendingPrayers";
import { createStyles } from "./styles";

export function TrendingPrayers() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<PrayStackParamList>>();
  
  const [expanded, setExpanded] = useState(false);
  const [period, setPeriod] = useState<TrendingPeriod>("day");
  
  const { data: prayers, isLoading, isFetching } = useTrendingPrayers(period);

  // Animações para comportamento retrátil
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: expanded ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedOpacity, {
        toValue: expanded ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue: expanded ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [expanded]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const filterOptions: { label: string; value: TrendingPeriod }[] = [
    { label: "Hoje", value: "day" },
    { label: "Semana", value: "week" },
    { label: "Geral", value: "total" },
  ];

  function handlePrayerPress(prayerId: string) {
    navigation.navigate("PrayerPrep", { id: prayerId });
  }

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.headerRow}
          onPress={() => setExpanded(!expanded)}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <TrendingUp size={20} color={theme.colors.primary} />
          </View>
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Orações em Alta (Top 10)</Text>
            <Text style={styles.subtitle}>As preces mais lidas pela comunidade</Text>
          </View>

          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <ChevronDown size={20} color={theme.colors.textSecondary} />
          </Animated.View>
        </TouchableOpacity>

        <Animated.View
          style={{
            maxHeight: animatedHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1200],
            }),
            opacity: animatedOpacity,
            overflow: "hidden",
          }}
        >
          <View style={styles.activeContent}>
            {/* Filtros Internos */}
            <View style={styles.filterContainer}>
              {filterOptions.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.filterButton,
                    period === opt.value && styles.activeFilterButton,
                  ]}
                  onPress={() => setPeriod(opt.value)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      period === opt.value && styles.activeFilterText,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Lista de Ranking */}
            <View style={styles.prayerList}>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color={theme.colors.primary} />
                </View>
              ) : prayers && prayers.length > 0 ? (
                prayers.map((prayer, index) => {
                  const isLast = index === prayers.length - 1;
                  const rank = index + 1;
                  
                  return (
                    <TouchableOpacity
                      key={prayer.id}
                      style={[styles.prayerItem, isLast && styles.prayerItemLast]}
                      onPress={() => handlePrayerPress(prayer.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.rankWrapper}>
                        <Text style={styles.rankText}>{rank}</Text>
                      </View>
                      
                      <View style={styles.prayerInfo}>
                        <Text style={styles.prayerTitle} numberOfLines={1}>
                          {prayer.title}
                        </Text>
                        <Text style={styles.prayerAuthor} numberOfLines={1}>
                          {prayer.author || prayer.source || "Autoria Desconhecida"}
                        </Text>
                      </View>

                      <View style={styles.countContainer}>
                        <Users size={12} color={theme.colors.textSecondary} />
                        <Text style={styles.countText}>
                          {formatCount((prayer as any).displayCount || 0)}
                        </Text>
                      </View>
                      
                      <ChevronRight size={18} color={theme.colors.primary} />
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    Ainda não há dados de leitura para este período.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
