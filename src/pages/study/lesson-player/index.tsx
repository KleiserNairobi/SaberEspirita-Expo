import React, { useState, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Share,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuthStore } from "@/stores/authStore";
import { usePrayerPreferencesStore } from "@/stores/prayerPreferencesStore"; // Store de preferências de leitura
import { AppStackParamList } from "@/routers/types";
import { useLesson, useLessons, LESSONS_KEYS } from "@/hooks/queries/useLessons";
import { useExercises } from "@/hooks/queries/useExercises"; // Import Hook updated to Plural
import { getLessonById } from "@/services/firebase/lessonService";

import {
  useCourseProgress,
  COURSE_PROGRESS_KEYS,
} from "@/hooks/queries/useCourseProgress";
import { markLessonAsCompleted } from "@/services/firebase/progressService";
import { speakText, stopSpeaking, isSpeaking } from "@/utils/textToSpeech"; // Utils de TTS

import { SlideContent } from "./components/SlideContent";
import { HighlightCard } from "./components/HighlightCard";
import { ReferenceCard } from "./components/ReferenceCard";
import { ReflectionQuestionsCard } from "./components/ReflectionQuestionsCard";
import { SlideIndicator } from "./components/SlideIndicator";
import { ReadingToolbar } from "@/components/ReadingToolbar";
import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { createStyles } from "./styles";

type LessonPlayerRouteProp = RouteProp<AppStackParamList, "LessonPlayer">;
type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export function LessonPlayerScreen() {
  const { theme } = useAppTheme();
  const { user } = useAuthStore();
  const styles = createStyles(theme);
  const route = useRoute<LessonPlayerRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const queryClient = useQueryClient();

  // Controle de Fonte
  const { fontSizeLevel, increaseFontSize, decreaseFontSize, getFontSize } =
    usePrayerPreferencesStore();

  const { courseId, lessonId } = route.params;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isNarrating, setIsNarrating] = useState(false); // Estado de narração
  const [isProcessing, setIsProcessing] = useState(false); // Estado de processamento

  // Estado para configuração do BottomSheet genérico
  const [messageConfig, setMessageConfig] = useState<BottomSheetMessageConfig | null>(
    null
  );

  // Ref para BottomSheet genérico
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // Ref para ScrollView (scroll ao topo ao mudar de slide)
  const scrollViewRef = useRef<ScrollView>(null);

  // 📱 Swipe Gesture Config
  const SWIPE_THRESHOLD = 50; // Distância mínima para considerar como swipe
  const translateX = useSharedValue(0);
  const contentOpacity = useSharedValue(1); // Para animação de fade na transição
  const contentSlideX = useSharedValue(0); // Para animação de entrada do novo slide
  const SCREEN_WIDTH = 300; // Largura aproximada para animação

  // Fetch da aula
  const { data: lesson, isLoading: isLoadingLesson } = useLesson(courseId, lessonId);

  // Fetch dos exercícios associados (PLURAL)
  const { data: exercises, isLoading: isLoadingExercises } = useExercises(lessonId);

  // Fetch do progresso (para atualizar depois)
  const { data: progress } = useCourseProgress(courseId);

  const currentSlide = lesson?.slides[currentSlideIndex];
  const isFirstSlide = currentSlideIndex === 0;
  const isLastSlide = currentSlideIndex === (lesson?.slides.length || 0) - 1;
  const totalSlides = lesson?.slides.length || 0;

  // Shared values para o worklet acessar valores atualizados
  const currentIndexShared = useSharedValue(currentSlideIndex);
  const totalSlidesShared = useSharedValue(totalSlides);

  // Sincroniza shared values com estado React
  React.useEffect(() => {
    currentIndexShared.value = currentSlideIndex;
  }, [currentSlideIndex]);

  React.useEffect(() => {
    totalSlidesShared.value = totalSlides;
  }, [totalSlides]);

  // Loading unificado
  const isLoading = isLoadingLesson || isLoadingExercises;

  // Verifica se tem exercícios
  const hasExercises = exercises && exercises.length > 0;

  // ✅ NOVO: Fetch da lista de aulas para prefetch da próxima
  const { data: allLessons } = useLessons(courseId);

  // ✅ NOVO: Prefetch da próxima aula ao chegar no último slide
  React.useEffect(() => {
    if (!isLastSlide || !allLessons || !lesson) return;

    const currentLessonIndex = allLessons.findIndex((l) => l.id === lesson.id);
    const nextLesson = allLessons[currentLessonIndex + 1];

    if (nextLesson) {
      queryClient.prefetchQuery({
        queryKey: LESSONS_KEYS.detail(courseId, nextLesson.id),
        queryFn: () => getLessonById(courseId, nextLesson.id),
        staleTime: 1000 * 60 * 60 * 12, // 12 horas
      });
      console.log(`✅ [LessonPlayer] Prefetch da próxima aula: ${nextLesson.title}`);
    }
  }, [isLastSlide, allLessons, lesson, courseId, queryClient]);

  // 🎬 Função para animar transição de slide (RÁPIDA - 150ms)
  const animateSlideTransition = useCallback((direction: "next" | "prev") => {
    "worklet";
    const duration = 150; // Animação rápida
    const slideOffset = direction === "next" ? -30 : 30;

    // Animação simples: desloca levemente na direção do swipe
    contentSlideX.value = slideOffset;
    contentOpacity.value = 0.5;

    // Retorna ao normal rapidamente
    contentSlideX.value = withTiming(0, { duration, easing: Easing.out(Easing.ease) });
    contentOpacity.value = withTiming(1, { duration, easing: Easing.out(Easing.ease) });
  }, []);

  // 👆 Callbacks para navegação via swipe (chamados pelo worklet)
  const goToPreviousSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
    scrollViewRef.current?.scrollTo({ y: 0, animated: false }); // Sem animação de scroll
  }, []);

  const goToNextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => prev + 1);
    scrollViewRef.current?.scrollTo({ y: 0, animated: false }); // Sem animação de scroll
  }, []);

  // 🖐️ Gesto de Swipe Horizontal
  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20]) // Ativa apenas com movimento horizontal
    .failOffsetY([-20, 20]) // Falha se movimento for muito vertical (permite scroll)
    .onUpdate((event) => {
      // Limita o arrasto baseado na posição atual
      const canGoLeft = currentIndexShared.value > 0;
      const canGoRight = currentIndexShared.value < totalSlidesShared.value - 1;

      if (event.translationX > 0 && !canGoLeft) {
        // Tentando ir para esquerda mas já está no primeiro
        translateX.value = event.translationX * 0.2; // Resistência
      } else if (event.translationX < 0 && !canGoRight) {
        // Tentando ir para direita mas já está no último
        translateX.value = event.translationX * 0.2; // Resistência
      } else {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      const canGoLeft = currentIndexShared.value > 0;
      const canGoRight = currentIndexShared.value < totalSlidesShared.value - 1;

      if (event.translationX > SWIPE_THRESHOLD && canGoLeft) {
        // Swipe para direita = slide anterior
        animateSlideTransition("prev");
        runOnJS(goToPreviousSlide)();
      } else if (event.translationX < -SWIPE_THRESHOLD && canGoRight) {
        // Swipe para esquerda = próximo slide
        animateSlideTransition("next");
        runOnJS(goToNextSlide)();
      }
      // Retorna à posição original com animação spring
      translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
    });

  // 🎨 Estilo animado para o conteúdo (combina arrasto + transição)
  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value + contentSlideX.value }],
    opacity: contentOpacity.value,
  }));

  function handlePrevious() {
    if (currentSlideIndex > 0) {
      // Animação rápida de transição (150ms)
      const duration = 150;
      contentSlideX.value = 30;
      contentOpacity.value = 0.5;
      contentSlideX.value = withTiming(0, { duration, easing: Easing.out(Easing.ease) });
      contentOpacity.value = withTiming(1, { duration, easing: Easing.out(Easing.ease) });

      setCurrentSlideIndex((prev) => prev - 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }
  }

  function handleNext() {
    if (currentSlideIndex < (lesson?.slides.length || 0) - 1) {
      // Animação rápida de transição (150ms)
      const duration = 150;
      contentSlideX.value = -30;
      contentOpacity.value = 0.5;
      contentSlideX.value = withTiming(0, { duration, easing: Easing.out(Easing.ease) });
      contentOpacity.value = withTiming(1, { duration, easing: Easing.out(Easing.ease) });

      setCurrentSlideIndex((prev) => prev + 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }
  }

  async function handleFinish() {
    if (!lesson) return;

    setIsProcessing(true); // 🔄 Ativa loading

    console.log("🎬 [LessonPlayer] handleFinish INÍCIO", {
      courseId: lesson.courseId,
      lessonId: lesson.id,
      userId: user?.uid,
    });

    try {
      console.log("💾 [LessonPlayer] Chamando markLessonAsCompleted...");
      await markLessonAsCompleted(lesson.courseId, lesson.id, user?.uid);
      console.log("✅ [LessonPlayer] markLessonAsCompleted retornou com sucesso");

      // Invalidar cache de progresso para atualizar a tela anterior
      if (user?.uid) {
        console.log("🔄 [LessonPlayer] Invalidando cache React Query...");
        // Usar await para garantir que a invalidação ocorra antes de voltar?
        // QueryClient.invalidateQueries é assíncrono.
        await queryClient.invalidateQueries({
          queryKey: COURSE_PROGRESS_KEYS.byUserAndCourse(user.uid, lesson.courseId),
        });
        console.log("✅ [LessonPlayer] Cache invalidado");
      }

      console.log("👋 [LessonPlayer] Voltando para tela anterior");
      navigation.goBack(); // 🔙 Volta direto
    } catch (error) {
      console.error("❌ [LessonPlayer] Erro ao marcar aula como concluída:", error);
      setIsProcessing(false); // 🛑 Para loading apenas em erro

      // Exibe erro detalhado
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";

      Alert.alert(
        "Erro ao Salvar Progresso",
        `Não foi possível marcar a aula como concluída.\n\nDetalhes: ${errorMessage}\n\nVerifique sua conexão e tente novamente.`,
        [
          {
            text: "Ver Console",
            onPress: () => console.log("Erro completo:", error),
          },
          {
            text: "OK",
            style: "cancel",
          },
        ]
      );
    }
  }

  function handleGoBack() {
    navigation.goBack();
  }

  // --- Funções da Toolbar de Leitura ---

  async function handleShare() {
    if (!currentSlide) return;
    try {
      // Constrói mensagem completa para compartilhamento
      let shareMessage = `${currentSlide.title}\n\n${currentSlide.content}`;

      // Adiciona destaques
      if (currentSlide.highlights && currentSlide.highlights.length > 0) {
        shareMessage += "\n\n💡 Destaques:\n";
        currentSlide.highlights.forEach((h) => {
          shareMessage += `\n• ${h.title}: ${h.content}`;
        });
      }

      // Adiciona referências
      if (currentSlide.references) {
        shareMessage += "\n\n📖 Referências:";
        if (currentSlide.references.kardeciana) {
          shareMessage += `\n• Kardeciana: ${currentSlide.references.kardeciana}`;
        }
        if (currentSlide.references.biblica) {
          shareMessage += `\n• Bíblica: ${currentSlide.references.biblica}`;
        }
      }

      await Share.share({
        message: shareMessage,
      });
    } catch (error) {
      setMessageConfig({
        type: "error",
        title: "Erro",
        message: "Não foi possível compartilhar.",
        primaryButton: { label: "OK", onPress: () => {} },
      });
      bottomSheetRef.current?.present();
    }
  }

  async function handleNarrate() {
    if (!currentSlide) return;

    try {
      const speaking = await isSpeaking();

      if (speaking || isNarrating) {
        await stopSpeaking();
        setIsNarrating(false);
      } else {
        setIsNarrating(true);

        // Constrói texto completo para narração (sem referências para evitar problemas com capítulos bíblicos)
        let fullText = `${currentSlide.title}. ${currentSlide.content}`;

        // Adiciona destaques
        if (currentSlide.highlights && currentSlide.highlights.length > 0) {
          fullText += ". Destaques: ";
          currentSlide.highlights.forEach((h) => {
            fullText += `${h.title}: ${h.content}. `;
          });
        }

        await speakText(fullText);
        setIsNarrating(false);
      }
    } catch (error) {
      setIsNarrating(false);
      setMessageConfig({
        type: "error",
        title: "Erro",
        message: "Não foi possível narrar o conteúdo.",
        primaryButton: { label: "OK", onPress: () => {} },
      });
      bottomSheetRef.current?.present();
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
        {/* BottomSheet Genérico para Mensagens */}
        <BottomSheetMessage ref={bottomSheetRef} config={messageConfig} />
      </SafeAreaView>
    );
  }

  if (!lesson || !currentSlide) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Aula não encontrada</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleGoBack}>
            <Text style={styles.retryButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
        {/* BottomSheet Genérico para Mensagens */}
        <BottomSheetMessage ref={bottomSheetRef} config={messageConfig} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Header - Apenas Título */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {lesson.title}
        </Text>
      </View>

      {/* Toolbar de Leitura Padronizada */}
      <ReadingToolbar
        onBack={handleGoBack}
        onShare={handleShare}
        onNarrate={handleNarrate}
        isNarrating={isNarrating}
        onIncreaseFontSize={increaseFontSize}
        onDecreaseFontSize={decreaseFontSize}
        canIncreaseFontSize={fontSizeLevel < 4}
        canDecreaseFontSize={fontSizeLevel > 0}
        showFavorite={false} // Não exibe favorito em aulas
      />

      {/* Content com Swipe Gesture */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[{ flex: 1 }, animatedContentStyle]}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <SlideContent
              title={currentSlide.title}
              content={currentSlide.content}
              imagePrompt={currentSlide.imagePrompt}
              fontSize={getFontSize()}
              slideType={currentSlide.slideType}
            />

            {currentSlide.highlights && currentSlide.highlights.length > 0 && (
              <HighlightCard
                highlights={currentSlide.highlights}
                fontSize={getFontSize()}
              />
            )}

            {currentSlide.references && (
              <ReferenceCard
                references={currentSlide.references}
                fontSize={getFontSize()}
              />
            )}

            {/* Perguntas Reflexivas - Apenas no último slide */}
            {isLastSlide &&
              lesson.reflectionQuestions &&
              lesson.reflectionQuestions.length > 0 && (
                <ReflectionQuestionsCard
                  questions={lesson.reflectionQuestions}
                  fontSize={getFontSize()}
                />
              )}
          </ScrollView>
        </Animated.View>
      </GestureDetector>

      {/* Bottom: Navegação Completa */}
      <View style={styles.bottomNavigation}>
        {/* Botão Anterior */}
        <TouchableOpacity
          style={[styles.navButton, isFirstSlide && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={isFirstSlide}
        >
          <ChevronLeft
            size={20}
            color={isFirstSlide ? theme.colors.border : theme.colors.primary}
          />
          <Text
            style={[styles.navButtonText, isFirstSlide && styles.navButtonTextDisabled]}
          >
            Anterior
          </Text>
        </TouchableOpacity>

        {/* Indicador Central */}
        <View style={styles.bottomIndicatorCenter}>
          <SlideIndicator
            currentIndex={currentSlideIndex}
            totalSlides={lesson.slides.length}
          />
        </View>

        {/* Botão Próximo ou Finalizar */}
        {isLastSlide ? (
          <TouchableOpacity
            style={styles.finishButton}
            onPress={handleFinish}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.finishButtonText}>Finalizar</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.navButton} onPress={handleNext}>
            <Text style={styles.navButtonText}>Próximo</Text>
            <ChevronRight size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* BottomSheet Genérico para Mensagens */}
      <BottomSheetMessage ref={bottomSheetRef} config={messageConfig} />
    </SafeAreaView>
  );
}
