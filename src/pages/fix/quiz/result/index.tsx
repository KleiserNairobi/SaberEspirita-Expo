import { View, Text, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/Button";
import { createStyles } from "./styles";
import { FixStackParamList, AppStackParamList } from "@/routers/types";
import { removeExerciseFromPending } from "@/services/firebase/progressService";
import {
  useCourseProgress,
  COURSE_PROGRESS_KEYS,
} from "@/hooks/queries/useCourseProgress";
import { useEffect, useState, useRef } from "react"; // ✅ NOVO: useState, useRef
import { BottomSheetMessage } from "@/components/BottomSheetMessage"; // ✅ NOVO
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types"; // ✅ NOVO
import { BottomSheetModal } from "@gorhom/bottom-sheet"; // ✅ NOVO
import { IExercise } from "@/types/course"; // ✅ NOVO

type QuizResultRouteProp = RouteProp<FixStackParamList, "QuizResult">;
type QuizResultNavigationProp = NativeStackNavigationProp<
  FixStackParamList & AppStackParamList, // Union to support both stacks
  "QuizResult"
>;

export function QuizResultScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const route = useRoute<QuizResultRouteProp>();
  const navigation = useNavigation<QuizResultNavigationProp>();
  const queryClient = useQueryClient();
  const { user } = useAuthStore(); // ✅ Para invalidar cache corretamente

  const {
    categoryId,
    categoryName,
    subcategoryName,
    subtitle,
    correctAnswers,
    totalQuestions,
    percentage,
    level,
    userAnswers,
    courseId,
    lessonId,
  } = route.params;

  // ✅ NOVO: Estado para BottomSheet de progresso
  const [messageConfig, setMessageConfig] = useState<BottomSheetMessageConfig | null>(
    null
  );
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // ✅ NOVO: Buscar progresso do curso para detectar próximo exercício
  const { data: courseProgress } = useCourseProgress(courseId || "");

  // ✅ NOVO: Função para detectar próximo exercício
  async function getNextExercise() {
    if (!courseId || !lessonId || !user?.uid) return null;

    try {
      const { getExercisesByLessonId } =
        await import("@/services/firebase/exerciseService");
      const allExercises = await getExercisesByLessonId(lessonId);

      if (allExercises.length === 0) return null;

      // ✅ CORRIGIDO: Buscar progresso ATUALIZADO diretamente do Firestore
      const { doc, getDoc } = await import("firebase/firestore");
      const { db } = await import("@/configs/firebase/firebase");

      const progressRef = doc(db, `users/${user.uid}/courseProgress/${courseId}`);
      const progressSnap = await getDoc(progressRef);
      const freshProgress = progressSnap.data();

      // Buscar IDs dos exercícios já completados (dados frescos do Firestore)
      const completedIds =
        freshProgress?.exerciseResults
          ?.filter((r: any) => r.passed)
          .map((r: any) => r.exerciseId) || [];

      console.log("🔍 [DEBUG] Completed IDs (Calculated):", completedIds);

      // Encontrar próximo exercício pendente
      const nextExercise = allExercises.find((ex) => !completedIds.includes(ex.id));

      // Contar quantos exercícios desta aula foram completados
      const lessonExerciseIds = allExercises.map((ex) => ex.id);
      const completedFromThisLesson = completedIds.filter((id: string) =>
        lessonExerciseIds.includes(id)
      ).length;

      console.log(
        `📊 Progresso ATUALIZADO: ${completedFromThisLesson}/${allExercises.length} exercícios completos`
      );

      return {
        nextExercise,
        total: allExercises.length,
        completed: completedFromThisLesson,
        pending: allExercises.length - completedFromThisLesson,
      };
    } catch (error) {
      console.error("❌ Erro ao buscar próximo exercício:", error);
      return null;
    }
  }

  // ✅ Remove exercício dos pendentes e invalida cache quando é exercício de curso
  useEffect(() => {
    async function handleCourseExerciseCompletion() {
      if (courseId && lessonId && user?.uid) {
        try {
          console.log("🎯 Removendo exercício dos pendentes:", { courseId, lessonId });

          // Remove exercício da lista de pendentes
          await removeExerciseFromPending(courseId, lessonId, user.uid);

          // Invalida cache do progresso para atualizar UI
          await queryClient.invalidateQueries({
            queryKey: COURSE_PROGRESS_KEYS.byUserAndCourse(user.uid, courseId),
          });

          console.log("✅ Exercício removido e cache invalidado");

          // ✅ NOVO: Aguardar um pouco para o cache atualizar
          await new Promise((resolve) => setTimeout(resolve, 300));

          // ✅ NOVO: Verificar se há próximo exercício
          const exerciseProgress = await getNextExercise();

          if (exerciseProgress && exerciseProgress.nextExercise) {
            // Ainda há exercícios pendentes - mostrar BottomSheet
            console.log(
              `📊 Progresso: ${exerciseProgress.completed}/${exerciseProgress.total} exercícios completos`
            );
          }
        } catch (error) {
          console.error("❌ Erro ao processar conclusão de exercício:", error);
        }
      }
    }

    handleCourseExerciseCompletion();
  }, [courseId, lessonId, user?.uid, queryClient]);

  // Determinar mensagem de feedback baseada no nível
  function getFeedbackMessage(level: string) {
    const messages = {
      Ótimo: {
        title: "Parabéns, querido estudante!",
        message:
          "Seu entendimento é brilhante! Revisite as explicações para solidificar ainda mais este conhecimento.",
      },
      Bom: {
        title: "Parabéns, querido estudante!",
        message:
          "Bom trabalho! Aproveite para revisar os detalhes dos conceitos mais importantes.",
      },
      Regular: {
        title: "Parabéns, querido estudante!",
        message:
          "Ótimo exercício de aprendizado! Esta é uma oportunidade perfeita para estudar as explicações.",
      },
      Fraco: {
        title: "Parabéns, querido estudante!",
        message:
          "A jornada do conhecimento começa com um passo. Explore as explicações doutrinárias para sua evolução.",
      },
    };

    return messages[level as keyof typeof messages] || messages.Fraco;
  }

  // Determinar imagem de resultado baseada no percentage
  function getResultImage(percentage: number) {
    if (percentage >= 90) return require("@/assets/images/stars/FourStars.png");
    if (percentage >= 70) return require("@/assets/images/stars/ThreeStars.png");
    if (percentage >= 50) return require("@/assets/images/stars/TwoStars.png");
    return require("@/assets/images/stars/OneStar.png");
  }

  const feedback = getFeedbackMessage(level);
  const resultImage = getResultImage(percentage);

  // ✅ NOVO: Handler para navegar para próximo exercício
  function handleContinueToNext(nextExercise: IExercise) {
    bottomSheetRef.current?.dismiss();

    if (!nextExercise.quizId) {
      console.error("❌ Exercício sem quizId");
      return;
    }

    // Usar replace para evitar stack infinito
    navigation.replace("CourseQuiz", {
      courseId: courseId!,
      lessonId: lessonId!,
      quizId: nextExercise.quizId,
      exerciseId: nextExercise.id, // ✅ NOVO
      mode: "course",
      categoryName: "Exercício de Fixação",
      subcategoryName: subcategoryName || "Aula",
    });
  }

  // ✅ NOVO: Handler para fazer depois
  function handleFinishLater() {
    bottomSheetRef.current?.dismiss();

    // Voltar para o currículo
    if (courseId) {
      (navigation as any).reset({
        index: 1,
        routes: [
          { name: "Tabs" },
          {
            name: "CourseCurriculum",
            params: { courseId },
          },
        ],
      });
    } else {
      navigation.goBack();
    }
  }

  async function handleContinue() {
    // ✅ NOVO: Se for exercício de curso, verificar se há próximo exercício
    if (courseId && lessonId) {
      const exerciseProgress = await getNextExercise();

      if (exerciseProgress && exerciseProgress.nextExercise) {
        // Ainda há exercícios pendentes - mostrar BottomSheet
        setMessageConfig({
          type: "success",
          title: `Exercício ${exerciseProgress.completed}/${exerciseProgress.total} Completo! 🎉`,
          message: `Parabéns! Você completou mais um exercício.\n\nAinda faltam ${exerciseProgress.pending} exercício(s) desta aula.\n\nDeseja continuar agora?`,
          primaryButton: {
            label: "PRÓXIMO EXERCÍCIO",
            onPress: () => handleContinueToNext(exerciseProgress.nextExercise!),
          },
          secondaryButton: {
            label: "Fazer Depois",
            onPress: handleFinishLater,
          },
        });

        bottomSheetRef.current?.present();
        return;
      }
    }

    // Se não houver próximo exercício ou não for curso, comportamento normal
    if (courseId) {
      // Cast to any to avoid strict type checking conflict for this specific reset
      (navigation as any).reset({
        index: 1,
        routes: [
          { name: "Tabs" }, // Garante que a Tab esteja na base
          {
            name: "CourseCurriculum",
            params: { courseId },
          },
        ],
      });
      return;
    }

    // Se for desafio diário, voltar para home
    if (categoryId === "DAILY") {
      navigation.reset({
        index: 0,
        routes: [{ name: "FixHome" }],
      });
      return;
    }

    // FIX: Usar reset para limpar a pilha e garantir que o botão voltar leve à FixHome
    navigation.reset({
      index: 1,
      routes: [
        { name: "FixHome" },
        {
          name: "Subcategories",
          params: {
            categoryId: categoryId || "DAILY", // Fallbacks for safety
            categoryName: categoryName || "Desafio",
          },
        },
      ],
    });
  }

  function handleReview() {
    navigation.navigate("QuizReview", {
      categoryId: categoryId || "DAILY",
      categoryName: categoryName || "Desafio",
      subcategoryName: subcategoryName || "Geral",
      subtitle,
      totalQuestions,
      percentage,
      level,
      userAnswers: userAnswers || [],
      courseId, // ← NOVO: Passa courseId para QuizReview
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Ilustração de Estrelas */}
        <View style={styles.starsContainer}>
          <Image source={resultImage} style={styles.resultImage} resizeMode="contain" />
        </View>

        {/* Título */}
        <View style={styles.titleContainer}>
          <Text style={styles.subcategoryName}>{subcategoryName}</Text>
          <Text style={styles.categoryName} numberOfLines={2}>
            {subtitle || categoryName}
          </Text>
        </View>

        {/* Estatísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {correctAnswers} / {totalQuestions}
            </Text>
            <Text style={styles.statLabel}>Questões corretas</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{percentage}%</Text>
            <Text style={styles.statLabel}>Percentual de acertos</Text>
          </View>
        </View>

        {/* Mensagem de Desbloqueio */}
        <Text style={styles.unlockMessage}>
          Você desbloqueou {totalQuestions} explicações doutrinárias
        </Text>

        {/* Feedback */}
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackTitle}>{feedback.title}</Text>
          <Text style={styles.feedbackMessage}>{feedback.message}</Text>
        </View>
      </ScrollView>

      {/* Botões de Ação */}
      <View style={styles.footer}>
        <Button title="Continuar" onPress={handleContinue} variant="outline" fullWidth />
        <Button title="Revisar e Aprender" onPress={handleReview} fullWidth />
      </View>

      {/* ✅ NOVO: BottomSheet de Progresso */}
      <BottomSheetMessage ref={bottomSheetRef} config={messageConfig} />
    </SafeAreaView>
  );
}
