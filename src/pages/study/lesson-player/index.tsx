import React, { useState, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
  FlatList,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuthStore } from "@/stores/authStore";
import { usePrayerPreferencesStore } from "@/stores/prayerPreferencesStore";
import { AppStackParamList } from "@/routers/types";
import { useLesson, useLessons, LESSONS_KEYS } from "@/hooks/queries/useLessons";
import { useExercises } from "@/hooks/queries/useExercises";
import { getLessonById } from "@/services/firebase/lessonService";

import {
  useCourseProgress,
  COURSE_PROGRESS_KEYS,
} from "@/hooks/queries/useCourseProgress";
import { markLessonAsCompleted } from "@/services/firebase/progressService";
import { speakText, stopSpeaking, isSpeaking } from "@/utils/textToSpeech";

import { LessonSlide } from "./components/LessonSlide";
import { SlideIndicator } from "./components/SlideIndicator";
import { ReadingToolbar } from "@/components/ReadingToolbar";
import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { createStyles } from "./styles";

import { useRateApp } from "@/hooks/useRateApp";
import { RateAppBottomSheet } from "@/components/RateAppBottomSheet";

// ... existing imports

type LessonPlayerRouteProp = RouteProp<AppStackParamList, "LessonPlayer">;
type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

const { width } = Dimensions.get("window");

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

  // Rate App Hook
  const {
    checkIfShouldAsk,
    handleRateNow,
    handleRemindLater,
    incrementLessonsCompletedCount,
  } = useRateApp();
  const rateAppSheetRef = useRef<BottomSheetModal>(null);

  const { courseId, lessonId } = route.params;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isNarrating, setIsNarrating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Estado para configuração do BottomSheet genérico
  const [messageConfig, setMessageConfig] = useState<BottomSheetMessageConfig | null>(
    null
  );

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // Ref para FlatList (Carrossel)
  const flatListRef = useRef<FlatList>(null);

  // Fetch da aula
  const { data: lesson, isLoading: isLoadingLesson } = useLesson(courseId, lessonId);

  // Fetch dos exercícios associados
  const { data: exercises, isLoading: isLoadingExercises } = useExercises(lessonId);

  // Loading unificado
  const isLoading = isLoadingLesson || isLoadingExercises;

  // Variáveis derivadas
  const totalSlides = lesson?.slides.length || 0;
  const isLastSlide = currentSlideIndex === totalSlides - 1;
  const isFirstSlide = currentSlideIndex === 0;
  const currentSlide = lesson?.slides[currentSlideIndex];

  // ✅ Prefetch da próxima aula
  const { data: allLessons } = useLessons(courseId);

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
    }
  }, [isLastSlide, allLessons, lesson, courseId, queryClient]);

  // Função para navegar programaticamente
  const scrollToSlide = (index: number) => {
    if (index >= 0 && index < totalSlides) {
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
      });
    }
  };

  const handlePrevious = () => {
    if (currentSlideIndex > 0) {
      scrollToSlide(currentSlideIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentSlideIndex < totalSlides - 1) {
      scrollToSlide(currentSlideIndex + 1);
    }
  };

  // Callback ao terminar o scroll (Swipe ou Botão)
  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const newIndex = Math.round(contentOffsetX / width);

      if (newIndex !== currentSlideIndex) {
        setCurrentSlideIndex(newIndex);

        // Para narração ao mudar de slide
        if (isNarrating) {
          stopSpeaking();
          setIsNarrating(false);
        }
      }
    },
    [currentSlideIndex, isNarrating]
  );

  async function handleFinish() {
    if (!lesson) return;

    // Verificar se é convidado
    if (useAuthStore.getState().isGuest) {
      setMessageConfig({
        type: "info",
        title: "Modo Visitante",
        message:
          "Seu progresso não será salvo pois você está navegando como visitante. Crie uma conta para registrar suas conquistas!",
        primaryButton: {
          label: "Criar Conta",
          onPress: () => {
            bottomSheetRef.current?.dismiss();
            // Navegar para a aba de conta onde tem o botão de criar conta
            // @ts-ignore
            navigation.navigate("Tabs", { screen: "AccountTab" });
          },
        },
        secondaryButton: {
          label: "Sair sem salvar",
          onPress: () => {
            bottomSheetRef.current?.dismiss();
            navigation.goBack();
          },
        },
      });
      setTimeout(() => bottomSheetRef.current?.present(), 100);
      return;
    }

    setIsProcessing(true);

    try {
      await markLessonAsCompleted(lesson.courseId, lesson.id, user?.uid);
      incrementLessonsCompletedCount();

      if (user?.uid) {
        await queryClient.invalidateQueries({
          queryKey: COURSE_PROGRESS_KEYS.byUserAndCourse(user.uid, lesson.courseId),
        });
      }

      // Verificar se deve pedir avaliação
      if (checkIfShouldAsk()) {
        setIsProcessing(false);
        // Pequeno delay para garantir que a UI atualizou (opcional, mas bom pra UX)
        setTimeout(() => {
          rateAppSheetRef.current?.present();
        }, 300);
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.error("Erro ao finalizar:", error);
      setIsProcessing(false);
      Alert.alert("Erro", "Não foi possível salvar o progresso.");
    }
  }

  function handleGoBack() {
    navigation.goBack();
  }

  // --- Funções da Toolbar ---
  async function handleShare() {
    if (!currentSlide) return;
    try {
      let shareMessage = `${currentSlide.title}\n\n${currentSlide.content}`;
      if (currentSlide.highlights?.length) {
        shareMessage +=
          "\n\n💡 Destaques:\n" +
          currentSlide.highlights.map((h) => `• ${h.title}: ${h.content}`).join("\n");
      }
      await Share.share({ message: shareMessage });
    } catch (error) {
      console.error(error);
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
        let fullText = `${currentSlide.title}. ${currentSlide.content}`;
        if (currentSlide.highlights?.length) {
          fullText +=
            ". Destaques: " +
            currentSlide.highlights.map((h) => `${h.title}: ${h.content}.`).join(" ");
        }
        await speakText(
          fullText,
          undefined,
          () => setIsNarrating(false), // onDone
          () => setIsNarrating(false) // onStopped
        );
        // Não setamos false aqui imediatamente, pois o speakText roda em background
      }
    } catch (error) {
      setIsNarrating(false);
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!lesson) return null;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {lesson.title}
        </Text>
      </View>

      <ReadingToolbar
        onBack={handleGoBack}
        onShare={handleShare}
        onNarrate={handleNarrate}
        isNarrating={isNarrating}
        onIncreaseFontSize={increaseFontSize}
        onDecreaseFontSize={decreaseFontSize}
        canIncreaseFontSize={fontSizeLevel < 4}
        canDecreaseFontSize={fontSizeLevel > 0}
        showFavorite={false}
      />

      {/* Carrossel de Slides */}
      <FlatList
        ref={flatListRef}
        data={lesson.slides}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={3}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ item, index }) => (
          <LessonSlide
            slide={item}
            fontSize={getFontSize()}
            isLastSlide={index === lesson.slides.length - 1}
            reflectionQuestions={lesson.reflectionQuestions}
          />
        )}
      />

      {/* Navegação Inferior */}
      <View style={styles.bottomNavigation}>
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

        <View style={styles.bottomIndicatorCenter}>
          <SlideIndicator currentIndex={currentSlideIndex} totalSlides={totalSlides} />
        </View>

        {isLastSlide ? (
          <TouchableOpacity
            style={styles.finishButton}
            onPress={handleFinish}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={[styles.finishButtonText, { marginLeft: 8 }]}>
                  Finalizando
                </Text>
              </>
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

      <BottomSheetMessage ref={bottomSheetRef} config={messageConfig} />

      <RateAppBottomSheet
        ref={rateAppSheetRef}
        onRate={handleRateNow}
        onRemindLater={() => {
          handleRemindLater();
          navigation.goBack();
        }}
        onDismiss={() => {
          // Se fechar sem interagir (tap fora ou swipe down), consideramos como navegar de volta (sem marcar remind later explicitamente talvez?
          // Ou melhor, checkar se interagiu. Mas para simplicidade, se dismiss e não interagiu, apenas sai.
          // O hook não muda estado no dismiss puro para não spammar 'remind later' se for só um misclick, mas talvez seja melhor tratar.
          // Pelo plano: "Na ação do BottomSheet ou fechar -> goBack."
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}
