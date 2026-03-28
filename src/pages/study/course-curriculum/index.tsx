import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  CheckCircle,
  PlayCircle,
  Lock,
  ChevronRight,
  BookOpen,
  Tag,
  Clock,
  Info,
  CircleAlert,
} from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { AppStackParamList } from "@/routers/types";
import { useLessons, LESSONS_KEYS } from "@/hooks/queries/useLessons";
import { useCourse } from "@/hooks/queries/useCourses";
import { useCourseProgress } from "@/hooks/queries/useCourseProgress";
import { useExercises, useCourseExercises } from "@/hooks/queries/useExercises";
import { useQueryClient } from "@tanstack/react-query";
import { getLessonById } from "@/services/firebase/lessonService";
import { saveBoolean, loadBoolean } from "@/utils/Storage";
import { ILesson } from "@/types/course";
import { ProgressSummaryCard } from "./components/ProgressSummaryCard";
import { BottomSheetMessage } from "@/components/BottomSheetMessage"; // ✅ NOVO
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types"; // ✅ NOVO
import { BottomSheetModal } from "@gorhom/bottom-sheet"; // ✅ NOVO
import { Button } from "@/components/Button"; // ✅ NOVO
import { CourseFeedbackBottomSheet } from "@/components/CourseFeedbackBottomSheet";
import { saveCourseFeedback } from "@/services/firebase/courseFeedbackService";
import { useAuthStore } from "@/stores/authStore";
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
  const { courseId } = route.params;

  // Fetch das aulas reais
  const { data: lessons = [], isLoading: isLoadingLessons } = useLessons(courseId);

  // ✅ Fetch do curso para exibir título
  const { data: course, isLoading: isLoadingCourse } = useCourse(courseId);

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

  const completedExercises =
    progress?.exerciseResults?.filter((r) => r.passed).length || 0;

  // ✅ CORREÇÃO: Calcular porcentagem dinamicamente para evitar dados estaleiros
  const exercisesProgress =
    totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

  // ✅ NOVO: Verificar elegibilidade para certificado (Backend ou Local)
  const certificateEnabled = course?.certification?.enabled ?? false;
  const serverCertificateEligible = progress?.certificateEligible || false;

  // Apenas elegível se certificado estiver habilitado E (backend autorizou OU cumpriu requisitos locais)
  const isReadyForCertificate =
    certificateEnabled &&
    (serverCertificateEligible || (lessonsProgress === 100 && exercisesProgress === 100));

  // ✅ NOVO: Estado e ref para BottomSheet de certificado
  const [messageConfig, setMessageConfig] = useState<BottomSheetMessageConfig | null>(
    null
  );
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // ✅ NOVO: Ref e Ações para BottomSheet de Avaliação de Curso
  const feedbackSheetRef = useRef<BottomSheetModal>(null);
  const { user } = useAuthStore();

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

    await saveCourseFeedback({
      userId: user.uid,
      courseId,
      rating,
      comment,
    });

    // Trigger re-render by updating local state or forcing a refetch if needed
    saveBoolean(`course_${courseId}_review_submitted`, true);
    setHasGloballySubmittedState(true); // NOVO

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
  };

  const handleOpenMethodology = () => {
    setMessageConfig({
      type: "info",
      title: "Entenda nossa pedagogia",
      message:
        "Nossas séries espirituais foram desenvolvidas com uma metodologia própria, pensada para transformar o estudo em uma experiência ativa e envolvente.\n\nAo longo das aulas, você perceberá que alguns textos terminam com reticências (...). Isso é intencional. Esses momentos funcionam como pausas reflexivas, convidando você a pensar, internalizar e conectar o conteúdo com sua própria vida.\n\nAs aulas seguem uma progressão estruturada — da pergunta inicial à aplicação prática — como uma jornada de descoberta. Por isso, recomendamos que você avance slide a slide, respeitando esse ritmo.\n\nAqui, você não apenas lê:\n você reflete, compreende e transforma.",
      primaryButton: {
        label: "FECHAR",
        onPress: () => {
          bottomSheetRef.current?.dismiss();
        },
      },
    });
    bottomSheetRef.current?.present();
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

  // ✅ NOVO: QueryClient para prefetch
  const queryClient = useQueryClient();

  // ✅ NOVO: Prefetch inteligente das primeiras 3 aulas
  useEffect(() => {
    if (!lessons || lessons.length === 0) return;

    // Prefetch das primeiras 3 aulas para carregamento instantâneo
    const lessonsToPrefetch = lessons.slice(0, 3);

    lessonsToPrefetch.forEach((lesson) => {
      queryClient.prefetchQuery({
        queryKey: LESSONS_KEYS.detail(courseId, lesson.id),
        queryFn: () => getLessonById(courseId, lesson.id),
        staleTime: 1000 * 60 * 60 * 12, // 12 horas
      });
    });

    console.log(
      `✅ [CourseCurriculum] Prefetch de ${lessonsToPrefetch.length} aulas iniciado`
    );
  }, [lessons, courseId, queryClient]);

  function getLessonStatus(lesson: ILesson, index: number): LessonStatus {
    // Verificar se a aula foi concluída
    if (progress?.completedLessons.includes(lesson.id)) {
      return LessonStatus.COMPLETED;
    }

    // Verificar se é a próxima aula (em andamento)
    if (progress?.lastLessonId === lesson.id) {
      return LessonStatus.IN_PROGRESS;
    }

    // Lógica ÁGIL (Híbrida):
    // Todas as outras aulas estão visualmente DISPONÍVEIS ao invés de BLOQUEADAS (cadeado).
    // O aviso de pulo será dado ao clicar.
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
  // ✅ NOVO: Handler para botão de certificado
  function handleGetCertificate() {
    if (!isReadyForCertificate) {
      // Mostrar popup de aviso via BottomSheet
      const missingCount = totalExercises - completedExercises;

      setMessageConfig({
        type: "warning",
        title: "Certificado Bloqueado",
        message: `Você ainda precisa completar ${missingCount} exercícios para obter o certificado. Verifique as aulas e complete os exercícios pendentes.`,
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
        previousLesson &&
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
  const renderExerciseItem = (exercise: any, lessonId: string, index: number) => {
    // 1. Verificar progresso do exercício
    const exerciseResult = progress?.exerciseResults?.find(
      (r) => r.exerciseId === exercise.id
    );
    const isCompleted = !!exerciseResult?.passed;
    const isFailed = !!(exerciseResult && !exerciseResult.passed);

    // 2. Verificar se a AULA PAI foi completada
    const isLessonCompleted = progress?.completedLessons.includes(lessonId);

    // 3. Regra Ágil Híbrida: Ao invés de travar o exercício, apenas avisamos o usuário
    const isAhead = !isLessonCompleted;

    const handleExercisePress = () => {
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
                  quizId: exercise.quizId,
                  exerciseId: exercise.id,
                  mode: "course",
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
          quizId: exercise.quizId,
          exerciseId: exercise.id,
          mode: "course",
          categoryName: "Exercício de Fixação",
          subcategoryName: exercise.title || `Exercício ${index + 1}`,
        });
      }
    };

    return (
      <TouchableOpacity
        key={exercise.id}
        style={styles.exerciseCard}
        onPress={handleExercisePress}
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
              ]}
            >
              {exercise.title || `Exercício ${index + 1}`}
            </Text>
          </View>
        </View>

        <ChevronRight size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>
    );
  };

  const renderLessonItem = ({ item, index }: { item: ILesson; index: number }) => {
    // Verificar se a lição está em breve
    const isComingSoon = item.status === "COMING_SOON";

    const status = getLessonStatus(item, index);

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
                      color={theme.colors.primary}
                      fill={theme.colors.primary}
                      fillOpacity={0.1}
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

          {/* BARRA DE PROGRESSO INTERNA (Só para Em Andamento) */}
          {status === LessonStatus.IN_PROGRESS && (
            <View style={styles.internalProgressBarBg}>
              <View style={[styles.internalProgressBarFill, { width: "55%" }]} />
            </View>
          )}
        </TouchableOpacity>

        {/* LISTA DE EXERCÍCIOS (Renderizada abaixo do card da aula) */}
        {lessonExercises.length > 0 && (
          <View style={styles.exercisesListContainer}>
            {lessonExercises.map((ex, idx) => renderExerciseItem(ex, item.id, idx))}
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

            <Text style={styles.navTitle} numberOfLines={1}>
              {course?.title || "Aulas da Série"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.infoButton}
            onPress={handleGoToCourseDetails}
            activeOpacity={0.7}
          >
            <Info size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={lessons}
            keyExtractor={(item) => item.id}
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
                onRateCourse={hasGloballySubmittedState ? undefined : handleOpenFeedback}
                onOpenMethodology={handleOpenMethodology}
              />
            }
            renderItem={renderLessonItem}
            ListEmptyComponent={
              <Text
                style={{
                  textAlign: "center",
                  color: theme.colors.textSecondary,
                  marginTop: 40,
                }}
              >
                Nenhuma aula encontrada.
              </Text>
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
    </SafeAreaView>
  );
}
