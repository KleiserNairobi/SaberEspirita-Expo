import React, { useCallback, useRef, useState } from "react";

import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";
import { CommunityLevelUpModal } from "@/components/CommunityLevelUpModal";
import { RateAppBottomSheet } from "@/components/RateAppBottomSheet";
import { ReadingToolbar } from "@/components/ReadingToolbar";
import {
  COURSE_PROGRESS_KEYS,
  useCourseProgress,
  useTouchCourseAccess,
} from "@/hooks/queries/useCourseProgress";
import { useExercises } from "@/hooks/queries/useExercises";
import { useForumHasNewComments } from "@/hooks/queries/useLessonForum";
import { LESSONS_KEYS, useLesson, useLessons } from "@/hooks/queries/useLessons";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useRateApp } from "@/hooks/useRateApp";
import { AppStackParamList } from "@/routers/types";
import {
  getLevelUpIfAny,
  getStoredCommunityLevelRaw,
  setStoredCommunityLevel,
} from "@/services/community/communityLevelService";
import { forumApiService } from "@/services/api/forumApiService";
import { glossaryApiService } from "@/services/api/glossaryApiService";
import { lessonApiService } from "@/services/api/lessonApiService";
import { userActivityApiService } from "@/services/api/userActivityApiService";
import { statsApiService } from "@/services/api/statsApiService";
import { useAuthStore } from "@/stores/authStore";
import { usePrayerPreferencesStore } from "@/stores/prayerPreferencesStore";
import { IGlossaryTerm } from "@/types/glossary";
import { SHARE_FOOTER } from "@/utils/constants";
import { isSpeaking, speakText, stopSpeaking } from "@/utils/textToSpeech";

import {
  saveLessonSlideProgress,
  getLessonSlideProgress,
  clearLessonSlideProgress,
} from "@/utils/lessonProgressStorage";

import { GlossaryTermBottomSheet } from "./components/GlossaryTermBottomSheet";
import { LessonActionsFAB } from "./components/LessonActionsFAB";
import { LessonSlide } from "./components/LessonSlide";
import { SlideIndicator } from "./components/SlideIndicator";
import { createStyles } from "./styles";

type LessonPlayerRouteProp = RouteProp<AppStackParamList, "LessonPlayer">;
type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

const { width } = Dimensions.get("window");

export function LessonPlayerScreen() {
  const { theme } = useAppTheme();
  const { user, isGuest } = useAuthStore();
  const styles = createStyles(theme);
  const route = useRoute<LessonPlayerRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const queryClient = useQueryClient();

  // Glossário Contextual
  const glossarySheetRef = useRef<BottomSheetModal>(null);
  const [selectedGlossaryTerm, setSelectedGlossaryTerm] = useState<IGlossaryTerm | null>(
    null
  );
  const [matchedGlossaryWord, setMatchedGlossaryWord] = useState<string | undefined>();

  // Controle de Fonte
  const { fontSizeLevel, increaseFontSize, decreaseFontSize, getFontSize } =
    usePrayerPreferencesStore();

  // Estado para configuração do BottomSheet genérico
  const [messageConfig, setMessageConfig] = useState<BottomSheetMessageConfig | null>(
    null
  );

  const [levelUpVisible, setLevelUpVisible] = useState(false);
  const [levelUpId, setLevelUpId] = useState<
    "sementeiro" | "cultivador" | "arvore_frondosa"
  >("sementeiro");
  const [navigateAfterLevelUp, setNavigateAfterLevelUp] = useState(false);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const showMessage = useCallback((config: BottomSheetMessageConfig) => {
    setMessageConfig(config);
    setTimeout(() => bottomSheetRef.current?.present(), 100);
  }, []);

  // Rate App Hook
  const {
    checkIfShouldAsk,
    handleRateNow,
    handleRemindLater,
    incrementLessonsCompletedCount,
  } = useRateApp({ showMessage });
  const rateAppSheetRef = useRef<BottomSheetModal>(null);

  const { courseId, lessonId } = route.params;
  const { data: courseProgress } = useCourseProgress(courseId);
  const { mutate: touchAccess } = useTouchCourseAccess();
  const isLessonAlreadyCompleted =
    !!courseProgress?.completedLessons?.includes?.(lessonId);

  const lastTouchedLessonRef = useRef<string | null>(null);

  React.useEffect(() => {
    if (!user?.uid || isGuest) return;
    const key = `${courseId}_${lessonId}`;
    if (lastTouchedLessonRef.current === key) return;
    lastTouchedLessonRef.current = key;
    touchAccess({ courseId, lessonId, userId: user.uid });
  }, [courseId, isGuest, lessonId, user?.uid, touchAccess]);

  const navigateBackAfterCompletion = useCallback(() => {
    const state = navigation.getState();
    const prevRoute = state.routes[state.routes.length - 2];

    if (navigation.canGoBack() && prevRoute?.name === "CourseCurriculum") {
      navigation.goBack();
      return;
    }

    navigation.replace("CourseCurriculum", { courseId });
  }, [courseId, navigation]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isNarrating, setIsNarrating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Ref para FlatList (Carrossel)
  const flatListRef = useRef<FlatList>(null);

  // Fetch da aula
  const { data: lesson, isLoading: isLoadingLesson } = useLesson(courseId, lessonId);
  const { data: hasNewForum } = useForumHasNewComments(lessonId);

  // Fetch dos exercícios associados
  const { isLoading: isLoadingExercises } = useExercises(lessonId);

  // Loading unificado
  const isLoading = isLoadingLesson || isLoadingExercises;

  // Variáveis derivadas
  const totalSlides = lesson?.slides.length || 0;
  const isLastSlide = currentSlideIndex === totalSlides - 1;
  const isFirstSlide = currentSlideIndex === 0;
  const currentSlide = lesson?.slides[currentSlideIndex];

  // ✅ Restauração do progresso de slide salvo da aula
  const isRestoredRef = useRef(false);

  React.useEffect(() => {
    if (!lesson || isRestoredRef.current || totalSlides === 0) return;
    isRestoredRef.current = true;

    const savedProgress = getLessonSlideProgress(user?.uid, lessonId);
    if (
      savedProgress &&
      typeof savedProgress.slideIndex === "number" &&
      savedProgress.slideIndex > 0 &&
      savedProgress.slideIndex < totalSlides
    ) {
      const targetIndex = savedProgress.slideIndex;
      setCurrentSlideIndex(targetIndex);
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: targetIndex, animated: false });
      }, 100);
    }
  }, [lesson, lessonId, totalSlides, user?.uid]);

  // ✅ Prefetch da próxima aula
  const { data: allLessons } = useLessons(courseId);

  React.useEffect(() => {
    if (!isLastSlide || !allLessons || !lesson) return;

    const currentLessonIndex = allLessons.findIndex((l) => l?.id === lesson.id);
    const nextLesson = allLessons[currentLessonIndex + 1];

    if (nextLesson?.id) {
      queryClient.prefetchQuery({
        queryKey: LESSONS_KEYS.detail(courseId, nextLesson.id),
        queryFn: () => lessonApiService.getLessonById(nextLesson.id),
        staleTime: 1000 * 60 * 5, // 5 minutos
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

        // Salva o progresso do slide atual
        saveLessonSlideProgress(user?.uid, lessonId, newIndex, totalSlides);

        // Para narração ao mudar de slide
        if (isNarrating) {
          stopSpeaking();
          setIsNarrating(false);
        }
      }
    },
    [currentSlideIndex, isNarrating, lessonId, totalSlides, user?.uid]
  );

  async function handleFinish() {
    const targetCourseId = lesson?.courseId || courseId;
    const targetLessonId = lesson?.id || lessonId;

    if (!targetLessonId || !targetCourseId) return;

    // Limpa o progresso temporário do slide pois a aula foi concluída
    clearLessonSlideProgress(user?.uid, targetLessonId);

    if (!isGuest && isLessonAlreadyCompleted) {
      navigateBackAfterCompletion();
      return;
    }

    if (useAuthStore.getState().isGuest) {
      try {
        statsApiService.logEvent({
          eventName: "lesson_completed",
          category: "course",
          label: lesson?.title || "Aula",
          metadata: { courseId: targetCourseId, lessonId: targetLessonId },
        });
      } catch {}

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
      await userActivityApiService.completeLesson(targetCourseId, targetLessonId);

      try {
        statsApiService.logEvent({
          eventName: "lesson_completed",
          category: "course",
          label: lesson?.title || "Aula",
          metadata: { courseId: targetCourseId, lessonId: targetLessonId },
        });
      } catch {}

      incrementLessonsCompletedCount();

      if (user?.uid) {
        try {
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: COURSE_PROGRESS_KEYS.byUserAndCourse(user.uid, targetCourseId),
            }),
            queryClient.invalidateQueries({
              queryKey: ["coursesProgressList"],
            }),
            queryClient.invalidateQueries({
              queryKey: ["allCoursesProgress"],
            }),
            queryClient.invalidateQueries({
              queryKey: ["lastAccessedCourse"],
            }),
            queryClient.invalidateQueries({
              queryKey: ["user-activity"],
            }),
          ]);
        } catch {}
      }

      if (user?.uid) {
        try {
          await new Promise((resolve) => setTimeout(resolve, 800));
          const progress = await forumApiService.getCommunityProgress();
          if (progress) {
            const raw = getStoredCommunityLevelRaw(user.uid);
            if (raw === null) {
              setStoredCommunityLevel(user.uid, progress.communityLevelId);
            } else {
              const levelUp = getLevelUpIfAny({
                userId: user.uid,
                currentLevelId: progress.communityLevelId,
              });
              if (levelUp) {
                setLevelUpId(levelUp);
                setNavigateAfterLevelUp(true);
                setLevelUpVisible(true);
                setStoredCommunityLevel(user.uid, levelUp);
                setIsProcessing(false);
                return;
              }
            }
          }
        } catch {}
      }

      // Verificar se deve pedir avaliação
      if (checkIfShouldAsk()) {
        setIsProcessing(false);
        // Pequeno delay para garantir que a UI atualizou (opcional, mas bom pra UX)
        setTimeout(() => {
          rateAppSheetRef.current?.present();
        }, 300);
      } else {
        navigateBackAfterCompletion();
      }
    } catch (error) {
      console.error("Erro ao salvar progresso da lição:", error);
      setIsProcessing(false);
      setMessageConfig({
        type: "error",
        title: "Erro",
        message: "Não foi possível salvar o progresso.",
        primaryButton: {
          label: "OK",
          onPress: () => bottomSheetRef.current?.dismiss(),
        },
      });
      setTimeout(() => bottomSheetRef.current?.present(), 100);
    }
  }

  function handleGoBack() {
    navigation.goBack();
  }

  const handleAskAI = useCallback(() => {
    if (!lesson) return;
    navigation.navigate("ScientificChat", {
      origin: "lesson",
      lessonId: lesson.id,
      initialMessage: `Olá, Sr. Allan! Acabei de completar a aula "${lesson.title}" e gostaria de tirar uma dúvida sobre este tema.`,
    });
  }, [lesson, navigation]);

  const handleOpenForum = useCallback(() => {
    if (!lesson || !lesson.id) return;

    if (useAuthStore.getState().isGuest) {
      showMessage({
        type: "info",
        title: "Fórum",
        message: "Crie uma conta para participar do fórum e salvar seu progresso.",
        primaryButton: {
          label: "Criar Conta",
          onPress: () => {
            bottomSheetRef.current?.dismiss();
            navigation.navigate("Tabs", { screen: "AccountTab" } as any);
          },
        },
        secondaryButton: {
          label: "Continuar",
          onPress: () => bottomSheetRef.current?.dismiss(),
        },
      });
      return;
    }

    const anchorQuestion = lesson.reflectionQuestions?.[0]?.question ?? "";
    const focusTag = lesson.reflectionQuestions?.[0]?.focus ?? "Autoconhecimento";

    navigation.navigate("LessonForum", {
      courseId: lesson.courseId || courseId,
      lessonId: lesson.id,
      lessonTitle: lesson.title || "Fórum",
      anchorQuestion,
      focusTag,
    });
  }, [courseId, lesson, navigation, showMessage]);

  const handleGlossaryTermPress = useCallback(
    async (termId: string, matchedWord?: string) => {
      const cleanId = termId.trim();
      let term: IGlossaryTerm | undefined | null;

      // Prioriza buscar no glossário local da aula atual
      if (currentSlide?.glossary) {
        term = currentSlide.glossary.find((t) => t.id === cleanId);
      }

      // Se não achou na aula, busca no glossário global sob demanda
      if (!term) {
        try {
          term = (await glossaryApiService.getGlossaryTermById(cleanId)) || undefined;
        } catch (error) {
          console.warn("[LessonPlayer] Erro ao buscar termo do glossário sob demanda:", error);
        }
      }

      if (term) {
        statsApiService.logEvent({
          eventName: "glossary_view",
          category: "glossary",
          label: term.term,
          metadata: { origin: "lesson", lessonId: lesson?.id },
        });
        setSelectedGlossaryTerm(term);
        setMatchedGlossaryWord(matchedWord);
        setTimeout(() => glossarySheetRef.current?.present(), 50);
      } else {
        setMessageConfig({
          type: "warning",
          title: "Aviso",
          message: `O termo não foi encontrado no dicionário atual (${cleanId}).`,
          primaryButton: {
            label: "OK",
            onPress: () => bottomSheetRef.current?.dismiss(),
          },
        });
        setTimeout(() => bottomSheetRef.current?.present(), 100);
      }
    },
    [currentSlide?.glossary, user?.uid, lesson?.id]
  );

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
      shareMessage += SHARE_FOOTER;
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
            glossaryTerms={[]}
            onGlossaryTermPress={handleGlossaryTermPress}
            slideIndex={index}
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
            style={[styles.finishButton, isProcessing && styles.finishButtonDisabled]}
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
          navigateBackAfterCompletion();
        }}
        onDismiss={() => {
          navigateBackAfterCompletion();
        }}
      />

      <GlossaryTermBottomSheet
        ref={glossarySheetRef}
        term={selectedGlossaryTerm}
        matchedWord={matchedGlossaryWord}
      />

      <CommunityLevelUpModal
        visible={levelUpVisible}
        levelId={levelUpId}
        onClose={() => {
          setLevelUpVisible(false);
          if (navigateAfterLevelUp) {
            setNavigateAfterLevelUp(false);
            navigateBackAfterCompletion();
          }
        }}
      />

      <LessonActionsFAB
        visible={isLastSlide}
        hasNewForum={!!hasNewForum}
        onAskAI={handleAskAI}
        onOpenForum={handleOpenForum}
        forumEnabled={!!lesson.forumEnabled}
      />
    </SafeAreaView>
  );
}
