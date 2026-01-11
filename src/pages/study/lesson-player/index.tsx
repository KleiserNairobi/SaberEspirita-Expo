import React, { useState, useRef } from "react";
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
import { ArrowLeft } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuthStore } from "@/stores/authStore";
import { usePrayerPreferencesStore } from "@/stores/prayerPreferencesStore"; // Store de preferências de leitura
import { AppStackParamList } from "@/routers/types";
import { useLesson } from "@/hooks/queries/useLessons";
import { useExercises } from "@/hooks/queries/useExercises"; // Import Hook updated to Plural

import {
  useCourseProgress,
  COURSE_PROGRESS_KEYS,
} from "@/hooks/queries/useCourseProgress";
import {
  markLessonAsCompleted,
  markExerciseAsPending,
} from "@/services/firebase/progressService";
import { speakText, stopSpeaking, isSpeaking } from "@/utils/textToSpeech"; // Utils de TTS

import { SlideContent } from "./components/SlideContent";
import { HighlightCard } from "./components/HighlightCard";
import { ReferenceCard } from "./components/ReferenceCard";
import { SlideIndicator } from "./components/SlideIndicator";
import { NavigationButtons } from "./components/NavigationButtons";
import { ReadingToolbar } from "@/components/ReadingToolbar"; // Nova Toolbar
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

  // Fetch da aula
  const { data: lesson, isLoading: isLoadingLesson } = useLesson(courseId, lessonId);

  // Fetch dos exercícios associados (PLURAL)
  const { data: exercises, isLoading: isLoadingExercises } = useExercises(lessonId);

  // Fetch do progresso (para atualizar depois)
  const { data: progress } = useCourseProgress(courseId);

  const currentSlide = lesson?.slides[currentSlideIndex];
  const isFirstSlide = currentSlideIndex === 0;
  const isLastSlide = currentSlideIndex === (lesson?.slides.length || 0) - 1;

  // Loading unificado
  const isLoading = isLoadingLesson || isLoadingExercises;

  // Verifica se tem exercícios
  const hasExercises = exercises && exercises.length > 0;

  function handlePrevious() {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  }

  function handleNext() {
    if (currentSlideIndex < (lesson?.slides.length || 0) - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  }

  async function handleFinish() {
    if (!lesson) return;

    console.log("🎬 [LessonPlayer] handleFinish INÍCIO", {
      courseId: lesson.courseId,
      lessonId: lesson.id,
      hasExercises,
      userId: user?.uid,
    });

    // Se houver exercícios, exibe BottomSheet de decisão
    if (hasExercises) {
      console.log(
        "📝 [LessonPlayer] Aula tem exercícios, exibindo BottomSheet de decisão"
      );

      setMessageConfig({
        type: "question",
        title: "Exercício de Fixação",
        message:
          "Teste seus conhecimentos sobre esta aula para garantir seu certificado ao final do curso!\n\n Os exercícios são obrigatórios para obter o certificado.",
        primaryButton: {
          label: "FAZER EXERCÍCIO AGORA",
          onPress: handleExerciseNow,
        },
        secondaryButton: {
          label: "Fazer Depois",
          onPress: handleExerciseLater,
        },
      });

      bottomSheetRef.current?.present();
      return;
    }

    try {
      console.log("💾 [LessonPlayer] Chamando markLessonAsCompleted...");
      await markLessonAsCompleted(lesson.courseId, lesson.id, user?.uid);
      console.log("✅ [LessonPlayer] markLessonAsCompleted retornou com sucesso");

      // Invalidar cache de progresso para atualizar a tela anterior
      if (user?.uid) {
        console.log("🔄 [LessonPlayer] Invalidando cache React Query...");
        queryClient.invalidateQueries({
          queryKey: COURSE_PROGRESS_KEYS.byUserAndCourse(user.uid, lesson.courseId),
        });
        console.log("✅ [LessonPlayer] Cache invalidado");
      }

      // Exibe BottomSheet de conclusão
      setMessageConfig({
        type: "success",
        title: "Aula Concluída!",
        message: `Parabéns! Você concluiu a aula "${lesson.title}" com sucesso.`,
        primaryButton: {
          label: "Continuar",
          onPress: () => {
            console.log("👋 [LessonPlayer] Voltando para tela anterior");
            navigation.goBack();
          },
        },
      });

      bottomSheetRef.current?.present();
    } catch (error) {
      console.error("❌ [LessonPlayer] Erro ao marcar aula como concluída:", error);

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

  async function markLessonAsCompletedAndReturn() {
    if (!lesson) return;

    try {
      console.log("💾 [LessonPlayer] Chamando markLessonAsCompleted...");
      await markLessonAsCompleted(lesson.courseId, lesson.id, user?.uid);
      console.log("✅ [LessonPlayer] markLessonAsCompleted retornou com sucesso");

      if (user?.uid) {
        queryClient.invalidateQueries({
          queryKey: COURSE_PROGRESS_KEYS.byUserAndCourse(user.uid, lesson.courseId),
        });
      }

      console.log("👋 [LessonPlayer] Voltando para tela anterior");
      navigation.goBack();
    } catch (error) {
      console.error("❌ [LessonPlayer] Erro ao marcar aula como concluída:", error);

      setMessageConfig({
        type: "error",
        title: "Erro",
        message: "Não foi possível marcar a aula como concluída. Tente novamente.",
        primaryButton: { label: "OK", onPress: () => {} },
      });
      bottomSheetRef.current?.present();
    }
  }

  function handleExerciseNow() {
    console.log("🚀 [LessonPlayer] handleExerciseNow chamado");
    if (!lesson || !exercises || exercises.length === 0) return;

    setIsProcessing(true); // Desabilita botão

    // Fecha bottom sheet
    bottomSheetRef.current?.dismiss();

    const firstExercise = exercises[0];

    // Marca aula como concluída em background
    markLessonAsCompleted(lesson.courseId, lesson.id, user?.uid).then(() => {
      if (user?.uid) {
        queryClient.invalidateQueries({
          queryKey: COURSE_PROGRESS_KEYS.byUserAndCourse(user.uid, lesson.courseId),
        });
      }
    });

    if (firstExercise.quizId) {
      navigation.navigate("CourseQuiz", {
        courseId: lesson.courseId,
        lessonId: lesson.id,
        quizId: firstExercise.quizId,
        exerciseId: firstExercise.id, // ✅ NOVO: Passando exerciseId correto
        mode: "course",
        categoryName: "Exercício de Fixação",
        subcategoryName: lesson.title,
      });
    }
  }

  async function handleExerciseLater() {
    console.log("🕒 [LessonPlayer] handleExerciseLater chamado");
    if (!lesson) return;

    setIsProcessing(true); // Desabilita botão

    // Fecha bottom sheet atual
    bottomSheetRef.current?.dismiss();

    try {
      // 1. Marca aula como concluída
      await markLessonAsCompleted(lesson.courseId, lesson.id, user?.uid);

      // 2. Marca exercício como pendente
      await markExerciseAsPending(lesson.courseId, lesson.id, user?.uid);

      // 3. Invalida cache
      if (user?.uid) {
        queryClient.invalidateQueries({
          queryKey: COURSE_PROGRESS_KEYS.byUserAndCourse(user.uid, lesson.courseId),
        });
      }

      // 4. Volta direto para o currículo (badge laranja será exibido)
      navigation.goBack();
    } catch (error) {
      console.error("❌ [LessonPlayer] Erro ao processar exercício pendente:", error);

      setMessageConfig({
        type: "error",
        title: "Erro",
        message: "Não foi possível salvar o progresso. Tente novamente.",
        primaryButton: { label: "OK", onPress: () => {} },
      });
      bottomSheetRef.current?.present();
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
      {/* Header - Apenas Título (Botão Voltar removido pois já existe na Toolbar) */}
      <View style={styles.header}>
        {/* Placeholder vazio para equilíbrio visual */}
        <View style={styles.headerButton} />
        <Text style={styles.headerTitle} numberOfLines={1}>
          {lesson.title}
        </Text>
        {/* Placeholder vazio para equilíbrio visual */}
        <View style={styles.headerButton} />
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

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <SlideContent
          title={currentSlide.title}
          content={currentSlide.content}
          imagePrompt={currentSlide.imagePrompt}
          fontSize={getFontSize()}
        />

        {currentSlide.highlights && currentSlide.highlights.length > 0 && (
          <HighlightCard highlights={currentSlide.highlights} fontSize={getFontSize()} />
        )}

        {currentSlide.references && (
          <ReferenceCard references={currentSlide.references} fontSize={getFontSize()} />
        )}

        <SlideIndicator
          currentIndex={currentSlideIndex}
          totalSlides={lesson.slides.length}
        />
      </ScrollView>

      {/* Navigation */}
      <NavigationButtons
        onPrevious={handlePrevious}
        onNext={handleNext}
        isFirstSlide={isFirstSlide}
        isLastSlide={isLastSlide}
        onFinish={handleFinish}
        finishLabel="FINALIZAR AULA"
        isLoading={isProcessing}
      />
      {/* BottomSheet Genérico para Mensagens */}
      <BottomSheetMessage ref={bottomSheetRef} config={messageConfig} />
    </SafeAreaView>
  );
}
