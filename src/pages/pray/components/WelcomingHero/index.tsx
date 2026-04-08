import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Compass, Sparkles } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useMoodStore } from "@/stores/moodStore";
import { useAuthStore } from "@/stores/authStore";
import { useSuggestedContent } from "../../hooks/useSuggestedContent";
import { AppStackParamList, PrayStackParamList } from "@/routers/types";
import { createStyles } from "./styles";

export function WelcomingHero() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList & PrayStackParamList>>();
  
  const { user } = useAuthStore();
  const { currentMood, lastMood, lastMoodDate } = useMoodStore();
  const { suggestedContent } = useSuggestedContent(currentMood);

  // Lógica de Saudação (Memória Emocional)
  const greeting = React.useMemo(() => {
    const userName = user?.displayName?.split(" ")[0] || "Irmão";
    
    if (currentMood) {
      return `Que sua busca por ${currentMood.toLowerCase()} seja abençoada, ${userName}.`;
    }

    if (lastMood && lastMoodDate) {
      return `Ontem você se sentiu ${lastMood.toLowerCase()}. Como seu coração está hoje, ${userName}?`;
    }

    return `Olá, ${userName}. Como posso ajudar seu coração hoje?`;
  }, [user, currentMood, lastMood, lastMoodDate]);

  function handlePrayerPress() {
    if (suggestedContent?.prayer) {
      navigation.navigate("Prayer", { id: suggestedContent.prayer.id });
    }
  }

  function handleAIChatPress() {
    const moodContext = currentMood ? `Estou me sentindo ${currentMood.toLowerCase()}.` : "";
    navigation.navigate("EmotionalChat", { 
      initialMessage: `Olá. ${moodContext} Poderia me ajudar com uma oração personalizada para o meu momento?` 
    } as any);
  }

  if (!currentMood) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.description}>
            Escolha como você se sente acima para receber uma sugestão especial.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.activeContent}>
        <View style={styles.headerRow}>
          <View style={styles.iconContainer}>
            <Sparkles size={20} color={theme.colors.primary} />
          </View>
          <Text style={styles.suggestionLabel}>UMA SUGESTÃO PARA VOCÊ</Text>
        </View>
        
        <Text style={styles.greeting}>{greeting}</Text>
        
        {suggestedContent?.prayer && (
          <TouchableOpacity 
            style={styles.suggestionCard} 
            onPress={handlePrayerPress}
            activeOpacity={0.8}
          >
            <View style={styles.prayerInfo}>
              <Text style={styles.prayerTitle}>{suggestedContent.prayer.title}</Text>
              <Text style={styles.prayerCategory}>Recomendada para o seu estado</Text>
            </View>
            <View style={styles.actionButton}>
              <Text style={styles.actionButtonText}>ORAR AGORA</Text>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={styles.aiLink} 
          onPress={handleAIChatPress}
          activeOpacity={0.7}
        >
          <Compass size={16} color={theme.colors.textSecondary} />
          <Text style={styles.aiLinkText}>Prefere uma prece exclusiva? Fale com O Guia</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
