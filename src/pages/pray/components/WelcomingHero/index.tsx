import React, { useState, useRef, useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View, Animated } from "react-native";
import { ChevronDown, Compass, Sparkles, ChevronRight } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useAppTheme } from "@/hooks/useAppTheme";
import { UserMood, useMoodStore } from "@/stores/moodStore";
import { useAuthStore } from "@/stores/authStore";
import { useSuggestedContent } from "../../hooks/useSuggestedContent";
import { AppStackParamList, PrayStackParamList } from "@/routers/types";
import { createStyles } from "./styles";

const MOOD_TO_NOUN: Record<UserMood, string> = {
  NORMAL: "harmonia",
  CALMO: "calma",
  TRISTE: "consolo",
  ANSIOSO: "paz",
  GRATO: "luz",
  IRRITADO: "equilíbrio",
  CANSADO: "renovação",
  DESCONHECIDO: "luz",
};

export function WelcomingHero() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList & PrayStackParamList>>();

  const { user } = useAuthStore();
  const { currentMood, lastMood, lastMoodDate } = useMoodStore();
  const { suggestedContent } = useSuggestedContent(currentMood);

  const moodNoun = currentMood ? MOOD_TO_NOUN[currentMood] : "";

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

  // Lógica de Saudação (Memória Emocional)
  const greeting = React.useMemo(() => {
    if (currentMood) {
      return `Que sua busca por ${moodNoun} seja abençoada.`;
    }

    if (lastMood && lastMoodDate) {
      const lastMoodNoun = MOOD_TO_NOUN[lastMood] || "luz";
      return `Ontem você buscou ${lastMoodNoun}. Como seu coração está hoje?`;
    }

    return `Como posso ajudar seu coração hoje?`;
  }, [currentMood, lastMood, lastMoodDate, moodNoun]);

  function handlePrayerPress(prayerId: string) {
    navigation.navigate("PrayerPrep", { id: prayerId });
  }

  function handleAIChatPress() {
    const moodContext = currentMood
      ? `Estou me sentindo ${currentMood.toLowerCase()}.`
      : "";
    navigation.navigate("EmotionalChat", {
      initialMessage: `Olá. ${moodContext} Poderia me ajudar com uma oração personalizada para o meu momento?`,
    } as any);
  }

  // Card Retrátil: Se não houve escolha, mostramos apenas o acolhimento inicial
  const hasMood = !!currentMood;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.headerRow}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Sparkles size={20} color={theme.colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.suggestionHeader}>
            <Text style={styles.suggestionLabel}>Para o seu Momento</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate("AllPrayers", {})}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.allPrayersLink}>Catálogo de Preces</Text>
            </TouchableOpacity>
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
              Escolha como você se sente acima para receber sugestões especiais.
            </Text>
          )}

          {suggestedContent?.prayers && (
            <View style={{ marginTop: 0 }}>
              <Text style={styles.scrollTip}>Role a lista para ver outras orações</Text>
              <View style={[styles.prayerList, { maxHeight: 180, paddingHorizontal: 4 }]}>
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
          )}
        </View>
      </Animated.View>
    </View>
  );
}
