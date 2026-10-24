import React, { useMemo, useRef, useState } from "react";

import {
  ActivityIndicator,
  PanResponder,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";

import { Image } from "expo-image";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { useAppTheme } from "@/hooks/useAppTheme";
import { navigationRef } from "@/routers/RootNavigator";
import { logEvent } from "@/services/analytics/analyticsService";
import { useAuthStore } from "@/stores/authStore";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { DailyTime, OnboardingGoal, SpiritismMoment } from "@/types/onboarding";

import { OnboardingHeader } from "./components/OnboardingHeader";
import { OnboardingOptionCard } from "./components/OnboardingOptionCard";
import { OnboardingProgressBar } from "./components/OnboardingProgressBar";
import { createStyles } from "./styles";

export function OnboardingFlowScreen() {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);
  const { user, isGuest } = useAuthStore();
  const { answers, setOnboardingAnswer, completeOnboarding } = useOnboardingStore();

  // 0: Boas-vindas (Jesus + Design System do app)
  // 1: Pergunta 1 (Momento)
  // 2: Pergunta 2 (Objetivo)
  // 3: Pergunta 3 (Tempo)
  // 4: Transição / Personalização ("Aha! Moment")
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isFinishing, setIsFinishing] = useState<boolean>(false);

  // Opções da Pergunta 1: Momento com a Doutrina
  const momentOptions = [
    {
      id: "consolation" as SpiritismMoment,
      title: "Busco paz, acolhimento e consolo",
      subtitle: "Passando por momento difícil, dor, ansiedade ou luto",
      iconName: "heart",
    },
    {
      id: "curious" as SpiritismMoment,
      title: "Estou conhecendo / Tenho curiosidade",
      subtitle: "Quero entender o que é o Espiritismo e seus princípios",
      iconName: "compass",
    },
    {
      id: "studying" as SpiritismMoment,
      title: "Já estudo e leio as obras espíritas",
      subtitle: "Desejo aprofundar reflexões, obras e prática diária",
      iconName: "book-open",
    },
  ];

  interface Step2Config {
    title: string;
    subtitle: string;
    options: Array<{
      id: OnboardingGoal;
      title: string;
      subtitle: string;
      iconName: string;
    }>;
  }

  const getStep2Config = (moment?: SpiritismMoment): Step2Config => {
    switch (moment) {
      case "consolation":
        return {
          title: "O que traria mais alívio e paz ao seu coração?",
          subtitle: "Selecione o que você mais necessita encontrar neste momento.",
          options: [
            {
              id: "daily_wisdom",
              title: "Gotas de Sabedoria e reflexões",
              subtitle: "Mensagens curtas para serenar os pensamentos no dia a dia",
              iconName: "sparkles",
            },
            {
              id: "prayers_relief",
              title: "Preces e orações para o coração",
              subtitle: "Orações para momentos de aflição, angústia ou ansiedade",
              iconName: "heart",
            },
            {
              id: "grief_comfort",
              title: "Consolo para a saudade e o luto",
              subtitle:
                "Mensagens esclarecedoras sobre a imortalidade da alma e a vida futura",
              iconName: "sun",
            },
            {
              id: "family_peace",
              title: "Preces para a paz no lar e na família",
              subtitle: "Orações para proteger e harmonizar o ambiente doméstico",
              iconName: "home",
            },
          ],
        };

      case "curious":
        return {
          title: "Por onde prefere começar a conhecer?",
          subtitle: "Apresentaremos os conceitos com clareza e acolhimento.",
          options: [
            {
              id: "basics_step_by_step",
              title: "Princípios básicos explicados passo a passo",
              subtitle:
                "Deus, imortalidade da alma, reencarnação e lei de causa e efeito",
              iconName: "graduation-cap",
            },
            {
              id: "daily_wisdom_curious",
              title: "Gotas de Sabedoria diárias",
              subtitle: "Pílulas rápidas com ensinamentos espíritas práticos",
              iconName: "sparkles",
            },
            {
              id: "how_to_pray",
              title: "Como orar segundo o Espiritismo",
              subtitle: "A prece sincera, simples e compreensível explicada na prática",
              iconName: "heart",
            },
            {
              id: "kardec_history",
              title: "Quem foi Allan Kardec e como surgiu",
              subtitle:
                "O método de pesquisa, as mesas girantes e o nascimento da Doutrina",
              iconName: "book-open",
            },
          ],
        };

      case "studying":
      default:
        return {
          title: "Qual o seu foco principal de estudo?",
          subtitle: "Escolha como deseja estruturar sua rotina de aprofundamento.",
          options: [
            {
              id: "kardec_deep",
              title: "Estudo metódico de O Livro dos Espíritos",
              subtitle: "Perguntas, respostas e comentários fundamentais da Codificação",
              iconName: "book-open",
            },
            {
              id: "gospel_at_home",
              title: "Evangelho no Lar e Preces",
              subtitle: "Roteiros para a reunião semanal e orações comentadas",
              iconName: "home",
            },
            {
              id: "daily_wisdom_study",
              title: "Gotas de Sabedoria e Meditações",
              subtitle: "Reflexões espirituais diárias e meditações guiadas em áudio",
              iconName: "sparkles",
            },
            {
              id: "fix_quizzes",
              title: "Quizzes e fixação do conhecimento",
              subtitle: "Avalie e fortaleça seu aprendizado das obras espíritas",
              iconName: "check-circle",
            },
          ],
        };
    }
  };

  // Opções da Pergunta 3: Tempo diário planejado
  const timeOptions = [
    {
      id: "3_min" as DailyTime,
      title: "3 minutos por dia",
      subtitle: "Uma gota de sabedoria ou uma oração rápida",
      iconName: "clock",
    },
    {
      id: "10_min" as DailyTime,
      title: "10 minutos por dia",
      subtitle: "Uma lição curta, reflexão ou quiz diário",
      iconName: "sun",
    },
    {
      id: "own_pace" as DailyTime,
      title: "No meu próprio ritmo",
      subtitle: "Acessar quando o coração pedir sem horários fixos",
      iconName: "moon",
    },
  ];

  const handleStartQuestions = () => {
    logEvent("onboarding_started", {});
    setCurrentStep(1);
  };

  const handleSelectMoment = (momentId: string) => {
    setOnboardingAnswer("moment", momentId as SpiritismMoment);
    logEvent("onboarding_step_completed", { step: 1, answer: momentId });
    setCurrentStep(2);
  };

  const handleSelectGoal = (goalId: string) => {
    setOnboardingAnswer("goal", goalId as OnboardingGoal);
    logEvent("onboarding_step_completed", { step: 2, answer: goalId });
    setCurrentStep(3);
  };

  const handleSelectTime = (timeId: string) => {
    setOnboardingAnswer("dailyTime", timeId as DailyTime);
    logEvent("onboarding_step_completed", { step: 3, answer: timeId });
    finishOnboardingAndRoute();
  };

  const handleSkip = () => {
    logEvent("onboarding_skipped", { atStep: currentStep });
    finishOnboardingAndRoute(true);
  };

  const currentStepRef = useRef(currentStep);
  currentStepRef.current = currentStep;

  const handleBack = () => {
    if (currentStepRef.current > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Gesto: arrastar para a direita para voltar ao passo anterior
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          // Detecta arraste horizontal para a direita com pelo menos 20px
          // e garante que não conflita com rolagem vertical do ScrollView
          return (
            gestureState.dx > 20 &&
            Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.5
          );
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx > 45 || (gestureState.dx > 20 && gestureState.vx > 0.3)) {
            handleBack();
          }
        },
      }),
    []
  );

  const finishOnboardingAndRoute = (skipped = false) => {
    setCurrentStep(4);
    setIsFinishing(true);

    logEvent("onboarding_completed", { skipped });

    // Transição suave de 1.8 segundos para transmitir carinho e personalização
    setTimeout(async () => {
      // Ler do store garantindo os valores mais recentes persistidos
      const store = useOnboardingStore.getState();
      const selectedGoal = store.answers.goal;

      const isAuthenticated = Boolean(user && !isGuest);
      await completeOnboarding(isAuthenticated);

      if (skipped) {
        logEvent("onboarding_aha_moment_delivered", { destination: "Home" });
        navigationRef.current?.navigate("App");
        return;
      }

      // Direcionamento personalizado conforme resposta do Passo 2
      setTimeout(() => {
        switch (selectedGoal) {
          // Destino 1: Estudo - O Livro dos Espíritos (pílula LE)
          case "kardec_deep":
            logEvent("onboarding_aha_moment_delivered", {
              destination: "StudyTab",
              initialCategory: "LE",
            });
            navigationRef.current?.navigate("App", {
              screen: "Tabs",
              params: {
                screen: "StudyTab",
                params: {
                  initialCategory: "LE",
                },
              },
            });
            break;

          // Destino 2: Estudo - Iniciação Espírita (pílula INIC)
          case "basics_step_by_step":
          case "kardec_history":
            logEvent("onboarding_aha_moment_delivered", {
              destination: "StudyTab",
              initialCategory: "INIC",
            });
            navigationRef.current?.navigate("App", {
              screen: "Tabs",
              params: {
                screen: "StudyTab",
                params: {
                  initialCategory: "INIC",
                },
              },
            });
            break;

          // Destino 3: Orações e Preces (aba Ore)
          case "prayers_relief":
          case "how_to_pray":
          case "family_peace":
          case "gospel_at_home":
            logEvent("onboarding_aha_moment_delivered", { destination: "PrayTab" });
            navigationRef.current?.navigate("App", {
              screen: "Tabs",
              params: {
                screen: "PrayTab",
              },
            });
            break;

          // Destino 4: Quizzes e Fixação (aba Fixe)
          case "fix_quizzes":
            logEvent("onboarding_aha_moment_delivered", { destination: "FixTab" });
            navigationRef.current?.navigate("App", {
              screen: "Tabs",
              params: {
                screen: "FixTab",
              },
            });
            break;

          // Destino 5: Gotas de Sabedoria / Consolo (Home da aba Medite)
          case "daily_wisdom":
          case "daily_wisdom_curious":
          case "daily_wisdom_study":
          case "grief_comfort":
          case "prayers_reflections":
          default:
            logEvent("onboarding_aha_moment_delivered", { destination: "MeditateTab" });
            navigationRef.current?.navigate("App", {
              screen: "Tabs",
              params: {
                screen: "MeditateTab",
              },
            });
            break;
        }
      }, 150);
    }, 1800);
  };

  // RENDERIZAÇÃO DA TRANSIÇÃO EMPÁTICA (Step 4)
  if (currentStep === 4) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <Animated.View entering={FadeIn.duration(400)} style={styles.transitionContainer}>
          <View style={styles.transitionLogoWrapper}>
            <Image
              source={require("@/assets/images/logo512.webp")}
              style={styles.transitionLogo}
              contentFit="contain"
              priority="high"
            />
          </View>
          <Text style={styles.transitionTitle}>Personalizando sua jornada...</Text>
          <Text style={styles.transitionSubtitle}>
            Conectando reflexões de luz, {"\n"}preces e ensinamentos confortadores {"\n"}
            para o seu momento.
          </Text>
          <ActivityIndicator
            size="small"
            color={theme.colors.primary}
            style={styles.spinner}
          />
        </Animated.View>
      </SafeAreaView>
    );
  }

  // RENDERIZAÇÃO DA TELA DE BOAS-VINDAS INICIAL (Step 0)
  if (currentStep === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        {/* 1. Header com Imagem de Jesus estabelecido no design do app */}
        <View style={styles.welcomeHeader}>
          <Image
            source={require("@/assets/images/jesus.webp")}
            style={styles.welcomeCoverImage}
            contentFit="cover"
            priority="high"
            transition={200}
          />
          <View style={styles.welcomeImageOverlay} />
        </View>

        {/* 2. Área central com cantos arredondados estabelecida no design do app */}
        <View style={styles.welcomeSheet}>
          <ScrollView
            style={styles.welcomeScroll}
            contentContainerStyle={[
              styles.welcomeScrollContent,
              { paddingBottom: Math.max(insets.bottom + 16, 28) },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View entering={FadeIn.duration(400)} style={styles.welcomeWrapper}>
              <View style={styles.titleContainer}>
                <Text style={styles.titleFirstLine}>Seja bem-vindo(a) ao</Text>
                <Text style={styles.titleSecondLine}>Saber Espírita</Text>
              </View>

              <View style={styles.bodyContainer}>
                <Text style={styles.bodyText}>
                  Este aplicativo foi criado com carinho e dedicação para auxiliar seu
                  estudo da Doutrina Espírita e trazer paz ao seu coração.
                </Text>

                <Text style={styles.bodyText}>
                  Para acolher melhor seu momento espiritual e preparar uma experiência
                  feita para você, gostaríamos de fazer 3 perguntas rápidas.
                </Text>

                <Animated.View
                  entering={FadeIn.duration(450).delay(150)}
                  style={styles.quoteContainer}
                >
                  <Text style={styles.quoteText}>
                    “Estudar ilumina a mente; orar aquece o coração. Entre os dois, a vida
                    se transforma.”
                  </Text>
                  <Text style={styles.quoteAuthor}>— Saber Espírita</Text>
                </Animated.View>
              </View>
            </Animated.View>

            <Animated.View
              entering={FadeInUp.duration(350).delay(250)}
              style={styles.buttonContainer}
            >
              <Button
                title="Personalizar Minha Experiência"
                onPress={handleStartQuestions}
                variant="primary"
                fullWidth
              />
              <Button
                title="Entrar diretamente no aplicativo"
                onPress={handleSkip}
                variant="outline"
                fullWidth
                textStyle={styles.secondaryButtonText}
              />
            </Animated.View>
          </ScrollView>
        </View>
      </View>
    );
  }

  // RENDERIZAÇÃO DO QUESTIONÁRIO (Steps 1, 2 e 3)
  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
      {...panResponder.panHandlers}
    >
      <OnboardingHeader
        canGoBack={currentStep >= 1}
        onBack={handleBack}
        onSkip={handleSkip}
        canSkip={true}
      />

      <OnboardingProgressBar currentStep={currentStep} totalSteps={3} />

      <ScrollView
        contentContainerStyle={styles.questionScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {currentStep === 1 && (
          <View style={styles.stepContainer}>
            <Animated.View
              entering={FadeInDown.duration(280)}
              style={styles.questionHeader}
            >
              <Text style={styles.stepBadge}>PASSO 1 DE 3</Text>
              <Text style={styles.questionTitle}>
                Qual é o seu momento com o Espiritismo hoje?
              </Text>
              <Text style={styles.questionSubtitle}>
                Escolha a opção que mais se aproxima do seu coração.
              </Text>
            </Animated.View>

            <View style={styles.optionsList}>
              {momentOptions.map((opt, index) => (
                <Animated.View
                  key={`step1-${opt.id}`}
                  entering={FadeInDown.duration(280).delay(index * 60)}
                >
                  <OnboardingOptionCard
                    id={opt.id}
                    title={opt.title}
                    subtitle={opt.subtitle}
                    iconName={opt.iconName}
                    isSelected={answers.moment === opt.id}
                    onSelect={handleSelectMoment}
                  />
                </Animated.View>
              ))}
            </View>
          </View>
        )}

        {currentStep === 2 &&
          (() => {
            const step2Config = getStep2Config(answers.moment);
            return (
              <View style={styles.stepContainer}>
                <Animated.View
                  entering={FadeInDown.duration(280)}
                  style={styles.questionHeader}
                >
                  <Text style={styles.stepBadge}>PASSO 2 DE 3</Text>
                  <Text style={styles.questionTitle}>{step2Config.title}</Text>
                  <Text style={styles.questionSubtitle}>{step2Config.subtitle}</Text>
                </Animated.View>

                <View style={styles.optionsList}>
                  {step2Config.options.map((opt, index) => (
                    <Animated.View
                      key={`step2-${answers.moment || "default"}-${opt.id}`}
                      entering={FadeInDown.duration(280).delay(index * 60)}
                    >
                      <OnboardingOptionCard
                        id={opt.id}
                        title={opt.title}
                        subtitle={opt.subtitle}
                        iconName={opt.iconName}
                        isSelected={answers.goal === opt.id}
                        onSelect={handleSelectGoal}
                      />
                    </Animated.View>
                  ))}
                </View>
              </View>
            );
          })()}

        {currentStep === 3 && (
          <View style={styles.stepContainer}>
            <Animated.View
              entering={FadeInDown.duration(280)}
              style={styles.questionHeader}
            >
              <Text style={styles.stepBadge}>PASSO 3 DE 3</Text>
              <Text style={styles.questionTitle}>
                Quanto tempo você gostaria de dedicar por dia?
              </Text>
              <Text style={styles.questionSubtitle}>
                Pequenos momentos diários trazem serenidade contínua.
              </Text>
            </Animated.View>

            <View style={styles.optionsList}>
              {timeOptions.map((opt, index) => (
                <Animated.View
                  key={`step3-${opt.id}`}
                  entering={FadeInDown.duration(280).delay(index * 60)}
                >
                  <OnboardingOptionCard
                    id={opt.id}
                    title={opt.title}
                    subtitle={opt.subtitle}
                    iconName={opt.iconName}
                    isSelected={answers.dailyTime === opt.id}
                    onSelect={handleSelectTime}
                  />
                </Animated.View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
