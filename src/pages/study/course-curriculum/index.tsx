import React, { useCallback, useEffect, useRef, useState } from "react";

import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, BookOpen, CheckCircle, ChevronRight } from "lucide-react-native";
import { CircleAlert, Clock, Info, Lock, PlayCircle, Tag } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";
import { Button } from "@/components/Button";
import { CourseFeedbackBottomSheet } from "@/components/CourseFeedbackBottomSheet";
import { PremiumContentNoticeModal } from "@/components/PremiumContentNoticeModal";
import {
  useCourseProgress,
  useTouchCourseAccess,
} from "@/hooks/queries/useCourseProgress";
import { COURSES_KEYS, useCourse, useCourseMaterials } from "@/hooks/queries/useCourses";
import { useCourseExercises } from "@/hooks/queries/useExercises";
import { useLessons } from "@/hooks/queries/useLessons";
import { useAppTheme } from "@/hooks/useAppTheme";
import { CourseMaterialsTab } from "@/pages/study/course-details/components/CourseMaterialsTab";
import { AppStackParamList } from "@/routers/types";
import { courseApiService } from "@/services/api/courseApiService";
import { parseExerciseResults } from "@/services/api/userActivityApiService";
import { useAuthStore } from "@/stores/authStore";
import { ILesson } from "@/types/course";
import { loadBoolean, saveBoolean } from "@/utils/Storage";
import { getLessonSlideProgress } from "@/utils/lessonProgressStorage";

import { ProgressSummaryCard } from "./components/ProgressSummaryCard";
import { createStyles } from "./styles";

type CourseCurriculumRouteProp = RouteProp<AppStackParamList, "CourseCurriculum">;
type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

// Enum para facilitar a lógica de renderização
enum LessonStatus {
  COMPLETED = "COMPLETED",
  IN_PROGRESS = "IN_PROGRESS",
  LOCKED = "LOCKED",
  AVAILABLE = "AVAILABLE",
}

// Mapa global (nível de módulo) para persistir a posição do scroll entre remounts.
// Indexado pelo courseId para suportar múltiplos cursos na mesma sessão.
const scrollOffsetMap: Map<string, number> = new Map();

export function CourseCurriculumScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const route = useRoute<CourseCurriculumRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { courseId, autoEnroll } = route.params;

  // Estado para forçar re-renderização ao retornar do leitor de aula
  const [, setFocusTick] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setFocusTick((prev) => prev + 1);
    }, [])
  );

  // Fetch das aulas reais
  const { data: lessons = [], isLoading: isLoadingLessons } = useLessons(courseId);

  // ✅ Fetch do curso para exibir título
  const { data: course, isLoading: isLoadingCourse } = useCourse(courseId);

  // ✅ Fetch dos materiais complementares do curso
  const { data: materials, isLoading: isLoadingMaterials } = useCourseMaterials(courseId);

  const totalMaterials =
    (materials?.booklets?.length || 0) +
    (materials?.podcasts?.length || 0) +
    (materials?.reflections?.length || 0) +
    (materials?.meditations?.length || 0);

  const [activeTab, setActiveTab] = useState<"lessons" | "materials">("lessons");
  const premiumModalRef = useRef<BottomSheetModal>(null);
  const [selectedPremiumItem, setSelectedPremiumItem] = useState<string>("");

  function handleOpenPremiumModal(itemName: string) {
    setSelectedPremiumItem(itemName);
    premiumModalRef.current?.present();
  }

  // ✅ Fetch do progresso real do usuário
  const { data: progress, isLoading: isLoadingProgress } = useCourseProgress(courseId);

  // ✅ Fetch de todos os exercícios do curso para renderização e cálculo
  const { data: allExercises = [] } = useCourseExercises(courseId);

  // Calcular progresso de aulas
  const totalLessons = lessons.length;
  const completedLessons = progress?.completedLessons.length || 0;
  const lessonsProgress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // ✅ NOVO: Calcular progresso de exercícios
  // Usar total do curso se disponível, senão total de exercícios carregados
  const totalExercises =
    course?.stats?.exerciseCount && course.stats.exerciseCount > 0
      ? course.stats.exerciseCount
      : allExercises.length;

  const exerciseResultsList = parseExerciseResults(progress?.exerciseResults);
  const completedExercises =
    exerciseResultsList.filter((r: any) => r && r.passed).length || 0;

  // ✅ CORREÇÃO: Calcular porcentagem dinamicamente para evitar dados estaleiros
  const exercisesProgress =
    totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

  // ✅ Verificação estrita de elegibilidade para certificado com base nas regras do curso
  const certificateEnabled = course?.certification?.enabled ?? false;
  const requiredLessonsPercent = course?.certification?.requiredLessonsPercent ?? 100;
  const requiredExercisesPercent = course?.certification?.requiredExercisesPercent ?? 100;

  const lessonsMet = lessonsProgress >= requiredLessonsPercent;
  const exercisesMet = totalExercises === 0 || exercisesProgress >= requiredExercisesPercent;

  // Apenas elegível se certificado estiver habilitado E cumpriu aulas E cumpriu exercícios
  const isReadyForCertificate = certificateEnabled && lessonsMet && exercisesMet;

  // ✅ NOVO: Estado e ref para BottomSheet de certificado
  const [messageConfig, setMessageConfig] = useState<BottomSheetMessageConfig | null>(
    null
  );
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // ✅ NOVO: Ref e Ações para BottomSheet de Avaliação de Curso
  const feedbackSheetRef = useRef<BottomSheetModal>(null);
  const queryClient = useQueryClient();
  const { user, isGuest } = useAuthStore();

  // ✅ NOVO: Estado para esconder botão instantaneamente
  const [hasGloballySubmittedState, setHasGloballySubmittedState] = useState<boolean>(
    () => {
      return !!loadBoolean(`course_${courseId}_review_submitted`);
    }
  );

  const handleOpenFeedback = () => {
    feedbackSheetRef.current?.present();
  };

  const handleSubmitFeedback = async (rating: number, comment: string) => {
    if (!user?.uid || !courseId) return;

    try {
      await courseApiService.sendCourseFeedback(courseId, {
        rating,
        comment,
      });

      // Invalida cache de cursos para refletir a nova nota imediatamente nos cards e detalhes
      queryClient.invalidateQueries({ queryKey: COURSES_KEYS.all });
      queryClient.invalidateQueries({ queryKey: COURSES_KEYS.featured });
      queryClient.invalidateQueries({ queryKey: COURSES_KEYS.detail(courseId) });

      // Trigger re-render by updating local state or forcing a refetch if needed
      saveBoolean(`course_${courseId}_review_submitted`, true);
      setHasGloballySubmittedState(true);

      setMessageConfig({
        type: "success",
        title: "Avaliação Enviada!",
        message: "Muito obrigado por compartilhar sua opinião conosco.",
        primaryButton: {
          label: "FECHAR",
          onPress: () => {
            bottomSheetRef.current?.dismiss();
          },
        },
      });

      // Timeout sútil para dar tempo do feedback modal fechar antes do alerta genérico abrir
      setTimeout(() => {
        bottomSheetRef.current?.present();
      }, 500);
    } catch (error) {
      console.warn("[CourseCurriculum] Erro ao enviar avaliação do curso:", error);
    }
  };



  // ✅ NOVO: Lógica Proativa de Avaliação por Marcos (40%, 75%, 100%)
  useEffect(() => {
    // Só avalia se já tiver carregado os dados de progresso e as aulas
    if (isLoadingLessons || totalLessons === 0 || !progress) return;

    // 1. Checa se o usuário DEU a nota pro curso localmente (True = nunca mais abre o bottomsheet orgânico)
    const hasGloballySubmitted = loadBoolean(`course_${courseId}_review_submitted`);
    if (hasGloballySubmitted) return;

    // 2. Define os marcos
    const milestones = [40, 75, 100];

    // Descobrir em qual marco o usuário está baseado no progresso dele E evitar o gatilho se for progresso muito baixo (0-39%)
    const currentMilestone = milestones
      .slice(0)
      .reverse()
      .find((m) => lessonsProgress >= m);

    // Se não atingiu pelo menos 40% ainda, abortar.
    if (!currentMilestone) return;

    // 3. Checa se NÓS já APRESENTAMOS o popup pro milestone atual
    const promptedKey = `course_${courseId}_review_prompted_${currentMilestone}`;
    const hasPromptedThisMilestone = loadBoolean(promptedKey);

    if (!hasPromptedThisMilestone) {
      // Registrar que cobramos nesse marco específico pra não repetir amanhã se ele logar e continuar nos 25%
      saveBoolean(promptedKey, true);

      // Apresentar BottomSheet de forma orgânica e sutil dando 1 seg de delay pra UI carregar
      setTimeout(() => {
        handleOpenFeedback();
      }, 1000);
    }
  }, [lessonsProgress, isLoadingLessons, totalLessons, progress, courseId]);

  // Ref da FlatList para controle programático do scroll
  const flatListRef = useRef<FlatList>(null);
  const { mutate: touchAccess } = useTouchCourseAccess();

  const lastTouchedCourseIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user?.uid || isGuest || !courseId) return;
    if (lastTouchedCourseIdRef.current === courseId) return;

    if (autoEnroll) {
      lastTouchedCourseIdRef.current = courseId;
      touchAccess({ courseId, userId: user.uid });
    }
  }, [courseId, isGuest, user?.uid, autoEnroll, touchAccess]);

  function getLessonStatus(lesson: ILesson, _index: number): LessonStatus {
    // 1. Se a aula já foi concluída ativamente pelo usuário no backend
    if (progress?.completedLessons?.includes(lesson.id)) {
      return LessonStatus.COMPLETED;
    }

    // 2. Se o usuário tem progresso de slide salvo > 0 (qualquer slide a partir do slide 2, incluindo o último)
    const slideProg = getLessonSlideProgress(user?.uid, lesson.id);
    if (
      slideProg &&
      typeof slideProg.slideIndex === "number" &&
      slideProg.slideIndex > 0
    ) {
      return LessonStatus.IN_PROGRESS;
    }

    // 3. Se for a última aula acessada no backend
    if (progress?.lastLessonId === lesson.id) {
      return LessonStatus.IN_PROGRESS;
    }

    // 4. Demais aulas ficam disponíveis (não iniciadas)
    return LessonStatus.AVAILABLE;
  }

  // Loading unificado (curso do BD + progresso salvo)
  const loading = isLoadingCourse || isLoadingProgress || isLoadingLessons;

  // Header Actions
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleGoToCourseDetails = () => {
    navigation.navigate("CourseDetails", { courseId });
  };

  // ✅ NOVO: Handler para botão de certificado
  function handleGetCertificate() {
    if (!isReadyForCertificate) {
      if (!lessonsMet) {
        setMessageConfig({
          type: "warning",
          title: "Aulas Pendentes",
          message: `Você precisa concluir ao menos ${requiredLessonsPercent}% das aulas da série para desbloquear o certificado.`,
          primaryButton: {
            label: "ENTENDI",
            onPress: () => {
              bottomSheetRef.current?.dismiss();
            },
          },
        });
        bottomSheetRef.current?.present();
        return;
      }

      if (!exercisesMet) {
        const missingCount = Math.max(1, totalExercises - completedExercises);
        const minGrade = course?.certification?.minimumGrade ?? 70;
        setMessageConfig({
          type: "warning",
          title: "Exercícios Pendentes",
          message: `Você ainda precisa completar ${missingCount} ${missingCount === 1 ? "exercício" : "exercícios"} com nota ≥ ${minGrade} para desbloquear o certificado. Complete os exercícios de fixação e tente novamente.`,
          primaryButton: {
            label: "ENTENDI",
            onPress: () => {
              bottomSheetRef.current?.dismiss();
            },
          },
        });
        bottomSheetRef.current?.present();
        return;
      }
      return;
    }

    // Navegar para tela de certificado
    if (course) {
      navigation.navigate("CourseCertificate", { courseId: course.id });
    }
  }

  async function handleLessonPress(lesson: ILesson, index: number, status: LessonStatus) {
    if (status === LessonStatus.AVAILABLE) {
      // Verifica se o aluno está pulando as lições essenciais
      const previousLesson = lessons[index - 1];
      const isJumpingAhead =
        index > 0 &&
        previousLesson?.id &&
        (!progress || !progress.completedLessons.includes(previousLesson.id));

      if (isJumpingAhead) {
        setMessageConfig({
          type: "warning", // Ou "info" dependendo do tema visual desejado
          title: "Avançar Aula?",
          message:
            "Recomendamos assistir às aulas anteriores primeiro para uma melhor fixação dos conceitos. Quer ir direto assim mesmo?",
          primaryButton: {
            label: "IR PARA A AULA",
            onPress: () => {
              bottomSheetRef.current?.dismiss();
              // Adiciona leve delay para o modal fechar suavemente antes do roteamento
              setTimeout(() => {
                navigation.navigate("LessonPlayer", { courseId, lessonId: lesson.id });
              }, 300);
            },
          },
          secondaryButton: {
            label: "VOLTAR",
            onPress: () => {
              bottomSheetRef.current?.dismiss();
            },
          },
        });
        bottomSheetRef.current?.present();
        return;
      }
    }

    // Comportamento normal: abre a aula
    navigation.navigate("LessonPlayer", { courseId, lessonId: lesson.id });
  }

  // ✅ Helper para renderizar item de exercício
  const renderExerciseItem = (
    exercise: any,
    lessonId: string,
    lessonTitle: string,
    index: number,
    opts: { isLessonUnavailable: boolean; isComingSoon: boolean }
  ) => {
    const { isLessonUnavailable, isComingSoon } = opts;
    // 1. Verificar progresso do exercício
    const exerciseResultList = parseExerciseResults(progress?.exerciseResults);
    const exerciseResult = exerciseResultList.find(
      (r: any) => r && (r.exerciseId === exercise.id || r.id === exercise.id)
    );
    const isCompleted = !!exerciseResult?.passed;
    const isFailed = !!(exerciseResult && !exerciseResult.passed);

    // 2. Verificar se a AULA PAI foi completada
    const isLessonCompleted = progress?.completedLessons.includes(lessonId);

    // 3. Regra Ágil Híbrida: Ao invés de travar o exercício, apenas avisamos o usuário
    const isAhead = !isLessonCompleted;

    const handleExercisePress = () => {
      if (isLessonUnavailable) {
        setMessageConfig({
          type: "info",
          title: isComingSoon ? "Em breve" : "Aula bloqueada",
          message: isComingSoon
            ? "Esta aula ainda não está disponível. O exercício será liberado quando a aula estiver disponível."
            : "Conclua as aulas anteriores para liberar este exercício.",
          primaryButton: {
            label: "ENTENDI",
            onPress: () => bottomSheetRef.current?.dismiss(),
          },
        });
        bottomSheetRef.current?.present();
        return;
      }

      if (isAhead) {
        setMessageConfig({
          type: "warning",
          title: "Avançar para o Exercício?",
          message:
            "Recomendamos concluir a aula correspondente antes de fazer este exercício. Deseja prosseguir mesmo assim?",
          primaryButton: {
            label: "IR PARA EXERCÍCIO",
            onPress: () => {
              bottomSheetRef.current?.dismiss();
              // Adiciona leve delay para o modal fechar suavemente antes do roteamento
              setTimeout(() => {
                navigation.navigate("CourseQuiz", {
                  courseId,
                  lessonId: lessonId,
                  lessonTitle,
                  quizId: exercise.quizId,
                  exerciseId: exercise.id,
                  categoryName: "Exercício de Fixação",
                  subcategoryName: exercise.title || `Exercício ${index + 1}`,
                });
              }, 300);
            },
          },
          secondaryButton: {
            label: "VOLTAR",
            onPress: () => {
              bottomSheetRef.current?.dismiss();
            },
          },
        });
        bottomSheetRef.current?.present();
      } else {
        navigation.navigate("CourseQuiz", {
          courseId,
          lessonId: lessonId,
          lessonTitle,
          quizId: exercise.quizId,
          exerciseId: exercise.id,
          categoryName: "Exercício de Fixação",
          subcategoryName: exercise.title || `Exercício ${index + 1}`,
        });
      }
    };

    return (
      <TouchableOpacity
        key={exercise.id}
        style={[styles.exerciseCard, isLessonUnavailable && styles.exerciseCardDisabled]}
        onPress={handleExercisePress}
        activeOpacity={0.7}
      >
        <View style={styles.exerciseLeftContent}>
          {/* Linha conectora visual (opcional, pode ser feito com borda esquerda no container) */}
          <View style={styles.connectorLine} />

          <View
            style={[
              styles.exerciseIconContainer,
              isCompleted && styles.exerciseIconCompleted,
              isFailed && styles.exerciseIconFailed,
            ]}
          >
            {/* Ícone de Haltere/Cérebro */}
            {isCompleted ? (
              <CheckCircle
                size={20}
                color={theme.colors.success}
                fill={theme.colors.success}
                fillOpacity={0.1}
              />
            ) : isFailed ? (
              <CircleAlert
                size={20}
                color={theme.colors.warning}
                fill={theme.colors.warning}
                fillOpacity={0.1}
              />
            ) : (
              <View style={styles.exerciseDot} />
            )}
          </View>

          <View style={styles.exerciseTextContainer}>
            <Text
              style={[
                styles.exerciseTitle,
                isCompleted && styles.exerciseTitleCompleted,
                isFailed && styles.exerciseTitleFailed,
                isLessonUnavailable && styles.exerciseTitleDisabled,
              ]}
            >
              {exercise.title || `Exercício ${index + 1}`}
            </Text>
          </View>
        </View>

        <ChevronRight
          size={20}
          color={isLessonUnavailable ? theme.colors.muted : theme.colors.textSecondary}
        />
      </TouchableOpacity>
    );
  };

  const renderForumItem = (
    lesson: ILesson,
    opts: {
      isLessonUnavailable: boolean;
      isComingSoon: boolean;
      lessonStatus: LessonStatus;
    }
  ) => {
    const { isLessonUnavailable, isComingSoon, lessonStatus } = opts;

    const handleForumPress = () => {
      if (isLessonUnavailable) {
        setMessageConfig({
          type: "info",
          title: isComingSoon ? "Em breve" : "Fórum bloqueado",
          message: isComingSoon
            ? "O fórum será liberado quando a aula estiver disponível."
            : "Conclua as aulas anteriores para acessar o fórum desta aula.",
          primaryButton: {
            label: "ENTENDI",
            onPress: () => bottomSheetRef.current?.dismiss(),
          },
        });
        setTimeout(() => bottomSheetRef.current?.present(), 100);
        return;
      }

      if (lessonStatus !== LessonStatus.COMPLETED) {
        setMessageConfig({
          type: "info",
          title: "Fórum bloqueado",
          message: "O fórum estará acessível para você quando concluir esta aula.",
          primaryButton: {
            label: "ENTENDI",
            onPress: () => bottomSheetRef.current?.dismiss(),
          },
        });
        setTimeout(() => bottomSheetRef.current?.present(), 100);
        return;
      }

      navigation.navigate("LessonForum", {
        courseId,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
      });
    };

    return (
      <TouchableOpacity
        key={`forum-${lesson.id}`}
        style={[styles.exerciseCard, isLessonUnavailable && styles.exerciseCardDisabled]}
        onPress={handleForumPress}
        activeOpacity={0.7}
      >
        <View style={styles.exerciseLeftContent}>
          <View style={styles.connectorLine} />

          <View
            style={[
              styles.exerciseIconContainer,
              isLessonUnavailable && { borderColor: theme.colors.muted },
            ]}
          >
            <View style={styles.exerciseDot} />
          </View>

          <View style={styles.exerciseTextContainer}>
            <Text
              style={[
                styles.exerciseTitle,
                isLessonUnavailable && styles.exerciseTitleDisabled,
              ]}
            >
              Fórum: Reflexão
            </Text>
          </View>
        </View>

        <ChevronRight
          size={20}
          color={isLessonUnavailable ? theme.colors.muted : theme.colors.textSecondary}
        />
      </TouchableOpacity>
    );
  };

  const renderLessonItem = ({ item, index }: { item: ILesson; index: number }) => {
    // Verificar se a lição está em breve
    const isComingSoon = item.status === "COMING_SOON";

    const status = getLessonStatus(item, index);
    const slideProg = getLessonSlideProgress(user?.uid, item.id);

    // Obter exercícios desta aula
    const lessonExercises = allExercises
      .filter((e) => e.lessonId === item.id)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    // Define estilos baseados no status
    const containerStyle = [
      styles.lessonCard,
      status === LessonStatus.COMPLETED && styles.cardCompleted,
      status === LessonStatus.IN_PROGRESS && styles.cardInProgress,
      status === LessonStatus.LOCKED && styles.cardLocked,
      status === LessonStatus.AVAILABLE && styles.cardAvailable,
    ];

    return (
      <View style={styles.lessonWrapper}>
        <TouchableOpacity
          style={containerStyle}
          onPress={() => handleLessonPress(item, index, status)}
          disabled={isComingSoon}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardLeftContent}>
              {/* ÍCONE / NÚMERO + BADGE */}
              <View style={styles.iconBadgeContainer}>
                <View style={styles.iconContainer}>
                  {/* EM BREVE - Ícone de Relógio */}
                  {isComingSoon && (
                    <View style={styles.comingSoonIconDetails}>
                      <Clock size={20} color={theme.colors.warning} />
                    </View>
                  )}

                  {/* Status normais (apenas se NÃO for coming soon) */}
                  {!isComingSoon && status === LessonStatus.COMPLETED && (
                    <CheckCircle
                      size={32}
                      color={theme.colors.success}
                      fill={theme.colors.success}
                      fillOpacity={0.1}
                    />
                  )}
                  {!isComingSoon && status === LessonStatus.IN_PROGRESS && (
                    <PlayCircle
                      size={32}
                      color="#E67E22"
                      fill="#E67E22"
                      fillOpacity={0.15}
                    />
                  )}
                  {!isComingSoon && status === LessonStatus.LOCKED && (
                    <View style={styles.lockedIconDetails}>
                      <Lock size={20} color={theme.colors.textSecondary} />
                    </View>
                  )}
                  {!isComingSoon && status === LessonStatus.AVAILABLE && (
                    <PlayCircle
                      size={32}
                      color={theme.colors.textSecondary}
                      fill="transparent"
                    />
                  )}
                </View>

                {/* Badge abaixo do ícone */}
                {isComingSoon && (
                  <View style={styles.statusBadgeComingSoon}>
                    <Text style={styles.statusBadgeTextComingSoon}>EM BREVE</Text>
                  </View>
                )}
                {!isComingSoon && status === LessonStatus.COMPLETED && (
                  <View style={styles.statusBadgeCompleted}>
                    <Text style={styles.statusBadgeTextCompleted}>CONCLUÍDA</Text>
                  </View>
                )}
                {!isComingSoon && status === LessonStatus.IN_PROGRESS && (
                  <>
                    <View style={styles.statusBadgeInProgress}>
                      <Text style={styles.statusBadgeTextInProgress}>EM ANDAMENTO</Text>
                    </View>
                    {slideProg && (
                      <View style={styles.slideProgressBadge}>
                        <Text style={styles.slideProgressText}>
                          Slide {slideProg.slideIndex + 1} de{" "}
                          {slideProg.totalSlides || item.slides?.length || 1}
                        </Text>
                      </View>
                    )}
                  </>
                )}
                {!isComingSoon && status === LessonStatus.LOCKED && (
                  <View style={styles.statusBadgeLocked}>
                    <Text style={styles.statusBadgeTextLocked}>BLOQUEADA</Text>
                  </View>
                )}
                {!isComingSoon && status === LessonStatus.AVAILABLE && (
                  <View style={styles.statusBadgeAvailable}>
                    <Text style={styles.statusBadgeTextAvailable}>DISPONÍVEL</Text>
                  </View>
                )}
              </View>

              {/* TEXTOS */}
              <View style={styles.textContainer}>
                <Text style={styles.lessonTitle} numberOfLines={1}>
                  {index + 1}. {item.title}
                </Text>

                {/* Source com ícone */}
                {item.source && (
                  <View style={styles.metaRow}>
                    <BookOpen size={12} color={theme.colors.textSecondary} />
                    <Text style={styles.lessonMeta} numberOfLines={1}>
                      {item.source}
                    </Text>
                  </View>
                )}
                {/* Chapter com ícone */}
                {item.chapter && (
                  <View style={styles.metaRow}>
                    <Tag size={12} color={theme.colors.textSecondary} />
                    <Text style={styles.lessonMeta} numberOfLines={1}>
                      {item.chapter}
                    </Text>
                  </View>
                )}
                {/* Duração */}
                <View style={styles.metaRow}>
                  <Clock size={12} color={theme.colors.textSecondary} />
                  <Text style={styles.lessonMeta}>{item.durationMinutes} min</Text>
                </View>
              </View>
            </View>

            {/* DIREITA (CHEVRON) */}
            <ChevronRight size={24} color={theme.colors.textSecondary} />
          </View>
        </TouchableOpacity>

        {/* LISTA DE EXERCÍCIOS (Renderizada abaixo do card da aula) */}
        {lessonExercises.length > 0 && (
          <View style={styles.exercisesListContainer}>
            {lessonExercises.map((ex, idx) =>
              renderExerciseItem(ex, item.id, item.title, idx, {
                isLessonUnavailable: isComingSoon || status === LessonStatus.LOCKED,
                isComingSoon,
              })
            )}
          </View>
        )}

        {/* FÓRUM (Renderizado apenas se a aula tiver habilitado) */}
        {item.forumEnabled && (
          <View style={styles.exercisesListContainer}>
            {renderForumItem(item, {
              isLessonUnavailable: isComingSoon || status === LessonStatus.LOCKED,
              isComingSoon,
              lessonStatus: status,
            })}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.container}>
        {/* HEADER DE NAVEGAÇÃO */}
        <View style={styles.navHeader}>
          <View style={styles.navHeaderLeft}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <ArrowLeft size={20} color={theme.colors.primary} />
            </TouchableOpacity>

            {(() => {
              const fullTitle = course?.title || "Aulas da Série";
              const titleLines = fullTitle
                .split(/\n+/)
                .map((s) => s.trim())
                .filter(Boolean);

              const mainTitle = titleLines[0] || fullTitle;
              const subTitle = titleLines.slice(1).join(" ");

              return (
                <View style={styles.navTitleContainer}>
                  <Text style={styles.navTitle} numberOfLines={1}>
                    {mainTitle}
                  </Text>
                  {!!subTitle && (
                    <Text style={styles.navSubtitle} numberOfLines={1}>
                      {subTitle}
                    </Text>
                  )}
                </View>
              );
            })()}
          </View>

          <TouchableOpacity
            style={styles.infoButton}
            onPress={handleGoToCourseDetails}
            activeOpacity={0.7}
          >
            <Info size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* SELETOR DE ABAS FIXO NO TOPO (AULAS E MATERIAIS) */}
        {totalMaterials > 0 && (
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "lessons" && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab("lessons")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "lessons" && styles.activeTabText,
                ]}
              >
                Aulas ({totalLessons})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "materials" && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab("materials")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "materials" && styles.activeTabText,
                ]}
              >
                Materiais ({totalMaterials})
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={activeTab === "lessons" ? lessons : []}
            keyExtractor={(item, index) => `${item?.id ?? index}_${index}`}
            contentContainerStyle={styles.listContent}
            onScroll={(e) => {
              scrollOffsetMap.set(courseId, e.nativeEvent.contentOffset.y);
            }}
            onLayout={() => {
              const offset = scrollOffsetMap.get(courseId) ?? 0;
              if (offset > 0) {
                flatListRef.current?.scrollToOffset({
                  offset,
                  animated: false,
                });
              }
            }}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              activeTab === "lessons" ? (
                <ProgressSummaryCard
                  courseTitle={course?.title || "Série"}
                  lessonsProgress={lessonsProgress}
                  exercisesProgress={exercisesProgress}
                  totalLessons={totalLessons}
                  completedLessons={completedLessons}
                  totalExercises={totalExercises}
                  completedExercises={completedExercises}
                  certificateEligible={isReadyForCertificate}
                  hasCertificate={certificateEnabled}
                  onRateCourse={
                    hasGloballySubmittedState ? undefined : handleOpenFeedback
                  }
                />
              ) : (
                <View style={styles.materialsContent}>
                  <CourseMaterialsTab
                    courseId={courseId}
                    interactive={true}
                    onOpenPremiumModal={handleOpenPremiumModal}
                  />
                </View>
              )
            }
            renderItem={activeTab === "lessons" ? renderLessonItem : null}
            ListEmptyComponent={
              activeTab === "lessons" ? (
                <Text
                  style={{
                    textAlign: "center",
                    color: theme.colors.textSecondary,
                    marginTop: 40,
                  }}
                >
                  Nenhuma aula encontrada.
                </Text>
              ) : null
            }
          />
        )}

        {/* ✅ NOVO: Botão de Certificado (aparece quando 100% aulas E certificado habilitado) */}
        {lessonsProgress === 100 && certificateEnabled && (
          <View style={styles.certificateButtonContainer}>
            <Button
              title={isReadyForCertificate ? "OBTER CERTIFICADO" : "COMPLETAR EXERCÍCIOS"}
              onPress={handleGetCertificate}
              variant={isReadyForCertificate ? "primary" : "outline"}
              fullWidth
            />
          </View>
        )}
      </View>

      {/* ✅ NOVO: BottomSheet para mensagens */}
      <BottomSheetMessage ref={bottomSheetRef} config={messageConfig} />

      {/* ✅ NOVO: BottomSheet de Avaliação */}
      <CourseFeedbackBottomSheet
        ref={feedbackSheetRef}
        courseId={courseId}
        courseTitle={course?.title || "Série"}
        onSubmit={handleSubmitFeedback}
      />

      {/* ✅ Modal de Conteúdo Premium */}
      <PremiumContentNoticeModal
        ref={premiumModalRef}
        itemName={selectedPremiumItem}
      />
    </SafeAreaView>
  );
}
