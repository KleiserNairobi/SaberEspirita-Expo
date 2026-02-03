import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { createStyles } from "./styles";
import { RootStackParamList } from "@/routers/types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function WelcomeScreen() {
  const { theme, resolvedThemeType } = useAppTheme();
  const { markWelcomeAsSeen } = useOnboardingStore();
  const navigation = useNavigation<NavigationProp>();
  const styles = createStyles(theme);

  // Selecionar imagem baseada no tema
  const kardecImage =
    resolvedThemeType === "dark"
      ? require("@/assets/images/kardec/kardecDark.png")
      : require("@/assets/images/kardec/kardecLight.png");

  const handleStart = () => {
    console.log("WelcomeScreen: Usuário iniciou jornada");
    markWelcomeAsSeen();
    // Navegação será tratada automaticamente pelo RootNavigator
    // quando hasSeenWelcome mudar para true
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          {/* Imagem de Allan Kardec */}
          <View style={styles.imageContainer}>
            <Image source={kardecImage} style={styles.kardecImage} resizeMode="cover" />
          </View>

          {/* Título */}
          <View style={styles.titleContainer}>
            <Text style={styles.titleFirstLine}>Seja bem-vindo(a) ao</Text>
            <Text style={styles.titleSecondLine}>Saber Espírita</Text>
          </View>

          {/* Corpo do texto */}
          <View style={styles.bodyContainer}>
            <Text style={styles.bodyText}>
              Este aplicativo foi criado com carinho e dedicação para auxiliar seu estudo
              da Doutrina Espírita. Aqui você encontrará cursos, textos, orações e
              ferramentas para aprofundar seu conhecimento.
            </Text>

            <Text style={styles.bodyText}>
              Agradecemos por escolher o Saber Espírita como companheiro nesta caminhada
              de aprendizado e transformação.
            </Text>

            {/* Citação de Allan Kardec */}
            <View style={styles.quoteContainer}>
              <Text style={styles.quoteText}>
                O Espiritismo é a ciência que trata da natureza, origem e destino dos
                Espíritos, e de suas relações com o mundo corporal.
              </Text>
              <Text style={styles.quoteAuthor}>Allan Kardec</Text>
            </View>
          </View>
        </View>

        {/* Botão de ação */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleStart}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Iniciar Minha Jornada</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
