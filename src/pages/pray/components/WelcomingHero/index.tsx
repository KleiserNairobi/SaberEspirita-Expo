import React, { useState, useRef, useEffect } from "react";
import { ActivityIndicator, Animated, ScrollView, StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { ChevronDown, Compass, ChevronRight, WifiOff } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Button } from "@/components/Button";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useMoodStore } from "@/stores/moodStore";
import { useSuggestedContent } from "@/pages/pray/hooks/useSuggestedContent";
import { AppStackParamList, PrayStackParamList } from "@/routers/types";
import { createStyles } from "./styles";

interface WelcomingHeroProps {
  style?: StyleProp<ViewStyle>;
}

export function WelcomingHero({ style }: WelcomingHeroProps = {}) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList & PrayStackParamList>>();

  const { currentMood, lastMood, lastMoodDate, checkDayTransition } = useMoodStore();
  const { suggestedContent, isLoading, isError, refetch, isRefetching } =
    useSuggestedContent(currentMood);

  // Garante que virada de dia civil atualize a mensagem de acolhimento
  useEffect(() => {
    checkDayTransition();
  }, [checkDayTransition]);

  // Animações para comportamento retrátil (Padrão LegalSection)
  const [expanded, setExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Auto-expande quando o humor é selecionado
  useEffect(() => {
    if (currentMood) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  }, [currentMood]);

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

  // Lógica de Saudação (Curadoria e Acolhimento)
  const greeting = React.useMemo(() => {
    if (currentMood) {
      return `Auxílio para seu momento atual. Sentimento mudou? Toque acima.`;
    }

    if (lastMood && lastMoodDate) {
      return `Novo dia! Como seu coração está hoje? Escolha seu sentimento acima.`;
    }

    return `Como podemos acompanhar seu coração hoje?`;
  }, [currentMood, lastMood, lastMoodDate]);

  function handlePrayerPress(prayerId: string) {
    navigation.navigate("PrayerPrep", { id: prayerId });
  }

  // Card Retrátil: Se não houve escolha, mostramos apenas o acolhimento inicial
  const hasMood = !!currentMood;

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.headerRow}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Compass size={20} color={theme.colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.suggestionHeader}>
            <Text style={styles.suggestionLabel}>Para o seu Momento</Text>
          </View>
          <Text style={styles.greeting} numberOfLines={expanded ? 0 : 1}>
            {greeting}
          </Text>
        </View>
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <ChevronDown size={20} color={theme.colors.textSecondary} />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View
        style={{
          maxHeight: animatedHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 500], // Altura máxima do conteúdo aberto
          }),
          opacity: animatedOpacity,
          overflow: "hidden",
        }}
      >
        <View style={styles.activeContent}>
          {!hasMood && (
            <Text style={styles.description}>
              Identifique seu sentimento para que possamos te acompanhar com o melhor
              auxílio.
            </Text>
          )}

          {hasMood && isLoading && (
            <View style={{ paddingVertical: 16, alignItems: "center" }}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
          )}

          {hasMood && !isLoading && (
            suggestedContent?.prayers && suggestedContent.prayers.length > 0 ? (
              <View style={{ marginTop: 0 }}>
                <Text style={styles.scrollTip}>Role a lista para ver outras orações</Text>
                <View style={[styles.prayerList, { maxHeight: 243, paddingHorizontal: 4 }]}>
                  <ScrollView
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                    style={{ transform: [{ scaleX: -1 }] }}
                  >
                    <View style={{ transform: [{ scaleX: -1 }] }}>
                      {suggestedContent.prayers.map((prayer, index) => {
                        const isLast =
                          index === (suggestedContent.prayers?.length || 0) - 1;
                        return (
                          <TouchableOpacity
                            key={prayer.id}
                            style={[styles.prayerItem, isLast && styles.prayerItemLast]}
                            onPress={() => handlePrayerPress(prayer.id)}
                            activeOpacity={0.7}
                          >
                            <View style={styles.prayerInfo}>
                              <Text style={styles.prayerTitle}>{prayer.title}</Text>
                              {(prayer.author || prayer.source) && (
                                <Text style={styles.prayerCategory}>
                                  {prayer.author || prayer.source}
                                </Text>
                              )}
                            </View>
                            <ChevronRight size={18} color={theme.colors.primary} />
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </ScrollView>
                </View>
              </View>
            ) : isError ? (
              <View style={{ alignItems: "center", paddingVertical: 12, gap: 8 }}>
                <WifiOff size={22} color={theme.colors.textSecondary} />
                <Text style={[styles.description, { textAlign: "center" }]}>
                  Não foi possível carregar as preces recomendadas. Verifique sua conexão com a internet.
                </Text>
                <Button
                  title="Tentar novamente"
                  size="sm"
                  variant="outline"
                  loading={isRefetching}
                  onPress={() => refetch()}
                  style={{ marginTop: 4 }}
                />
              </View>
            ) : (
              <Text style={styles.description}>
                Nenhuma prece disponível para este momento.
              </Text>
            )
          )}
        </View>
      </Animated.View>
    </View>
  );
}
