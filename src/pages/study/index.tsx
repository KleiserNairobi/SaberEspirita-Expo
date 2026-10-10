import React, { useCallback, useRef, useState } from "react";

import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import { differenceInDays } from "date-fns";
import { Bell, ChevronRight, Leaf, Sprout, TreePalm } from "lucide-react-native";
import { Feather } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AssistantCard } from "@/components/AssistantCard";
import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";
import { JourneyBottomSheet } from "@/components/JourneyBottomSheet";
import { Biblioteca } from "@/data/Biblioteca";
import { useAllCoursesProgress } from "@/hooks/queries/useAllCoursesProgress";
import { COURSES_KEYS, useCourses, useFeaturedCourses } from "@/hooks/queries/useCourses";
import { useLastAccessedCourse } from "@/hooks/queries/useLastAccessedCourse";
import { useCommunityProgress } from "@/hooks/queries/useLessonForum";
import {
  NOTIFICATION_KEYS,
  useHasUnreadNotifications,
} from "@/hooks/queries/useNotifications";
import { usePodcasts } from "@/hooks/queries/usePodcasts";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useGlossaryTerms } from "@/pages/glossary/hooks/useGlossaryTerms";
import { AppStackParamList } from "@/routers/types";
import { useAuthStore } from "@/stores/authStore";
import { ICourse, IUserCourseProgress } from "@/types/course";
import { prefetchImages } from "@/utils/imagePrefetch";
import {
  getCourseActiveLesson,
  getLessonSlideProgress,
} from "@/utils/lessonProgressStorage";

import {
  ContinueStudyingSection,
  InProgressCourseItem,
} from "./components/ContinueStudyingSection";
import { ExploreByTheme } from "./components/ExploreByTheme";
import { PremiumBanner } from "./components/PremiumBanner";
import { createStyles } from "./styles";

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export function StudyScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const { user, isGuest } = useAuthStore();
  const navigation = useNavigation<NavigationProp>();

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const journeySheetRef = useRef<BottomSheetModal>(null);
  const [messageConfig, setMessageConfig] = useState<BottomSheetMessageConfig | null>(
    null
  );

  const { data: hasUnreadNotifications = false } = useHasUnreadNotifications();
  const { data: communityProgress } = useCommunityProgress();

  const handleOpenJourney = useCallback(() => {
    journeySheetRef.current?.present();
  }, []);

  const handleOpenNotifications = useCallback(() => {
    if (isGuest) {
      setMessageConfig({
        type: "info",
        title: "Notificações",
        message: "Crie uma conta para receber notificações e acompanhar suas interações.",
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
      setTimeout(() => bottomSheetRef.current?.present(), 100);
      return;
    }

    navigation.navigate("Notifications");
  }, [isGuest, navigation]);

  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  // Fetching de todos os cursos para o Explore por tema
  const { data: allCourses = [] } = useCourses();

  // Fetching de cursos populares via React Query
  const { data: featuredCourses = [] } = useFeaturedCourses();

  // Ids dos cursos em destaque / populares
  const featuredCourseIds = React.useMemo(() => {
    return new Set((featuredCourses || []).map((c) => c.id));
  }, [featuredCourses]);

  // Fetching de todos os progressos para o Carrossel Inteligente
  const { data: allProgress = {} } = useAllCoursesProgress();

  // Fetching do último curso acessado
  const { data: lastAccessed } = useLastAccessedCourse();

  // Revalidar progresso dos cursos, notas e último acessado ao focar na tela
  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ["lastAccessedCourse"] });
      queryClient.invalidateQueries({ queryKey: ["coursesProgressList"] });
      queryClient.invalidateQueries({ queryKey: ["allCoursesProgress"] });
    }, [queryClient])
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const currentUserId = user?.uid || "guest";
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: COURSES_KEYS.all, exact: true }),
        queryClient.invalidateQueries({ queryKey: COURSES_KEYS.featured, exact: true }),
        queryClient.invalidateQueries({ queryKey: ["lastAccessedCourse"] }),
        queryClient.invalidateQueries({ queryKey: ["coursesProgressList"] }),
        queryClient.invalidateQueries({ queryKey: ["podcasts"] }),
        queryClient.invalidateQueries({ queryKey: ["glossaryTerms"] }),
        queryClient.invalidateQueries({
          queryKey: NOTIFICATION_KEYS.hasUnread(currentUserId),
        }),
        queryClient.invalidateQueries({
          queryKey: NOTIFICATION_KEYS.list(currentUserId),
        }),
        queryClient.invalidateQueries({ queryKey: ["communityProgress", currentUserId] }),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [queryClient, user?.uid]);

  // Fetching de podcasts e termos do glossário para verificar existência de conteúdo novo (createdAt <= 15 dias)
  const { data: podcasts = [] } = usePodcasts();
  const { data: glossaryTerms = [] } = useGlossaryTerms();

  // Prefetch automático e deduplicado das capas dos podcasts e dos cursos
  React.useEffect(() => {
    const urlsToPrefetch: (string | number | undefined | null)[] = [];
    if (podcasts && podcasts.length > 0) {
      urlsToPrefetch.push(...podcasts.map((p) => p.imageUrl));
    }
    if (featuredCourses && featuredCourses.length > 0) {
      urlsToPrefetch.push(...featuredCourses.map((c) => c.imageUrl));
    }
    if (allCourses && allCourses.length > 0) {
      urlsToPrefetch.push(...allCourses.map((c) => c.imageUrl));
    }
    if (urlsToPrefetch.length > 0) {
      prefetchImages(urlsToPrefetch);
    }
  }, [podcasts, featuredCourses, allCourses]);

  const hasNewPodcast = React.useMemo(() => {
    if (!podcasts || podcasts.length === 0) return false;
    const now = new Date();
    return podcasts.some((p) => {
      if (!p.createdAt) return false;
      const createdDate =
        p.createdAt instanceof Date ? p.createdAt : new Date(p.createdAt);
      if (isNaN(createdDate.getTime())) return false;
      return differenceInDays(now, createdDate) <= 15;
    });
  }, [podcasts]);

  const hasNewGlossaryTerm = React.useMemo(() => {
    if (!glossaryTerms || glossaryTerms.length === 0) return false;
    const now = new Date();
    return glossaryTerms.some((term) => {
      if (!term.createdAt) return false;
      const createdDate =
        term.createdAt instanceof Date ? term.createdAt : new Date(term.createdAt);
      if (isNaN(createdDate.getTime())) return false;
      return differenceInDays(now, createdDate) <= 15;
    });
  }, [glossaryTerms]);

  // Lista de cursos em andamento para o carrossel "Continue Estudando"
  const inProgressCourses: InProgressCourseItem[] = React.useMemo(() => {
    const items: InProgressCourseItem[] = [];

    // Helper para calcular porcentagem e texto do próximo passo levando em conta slides
    const computeCourseProgress = (
      course: ICourse,
      progress: IUserCourseProgress,
      nextLesson?: any
    ) => {
      const totalLessons = course.lessonCount || (course as any).lessonsCount || 0;
      const completedCount = progress.completedLessons
        ? progress.completedLessons.length
        : 0;

      // Verifica se há progresso de slide salvo na aula ativa
      const slideProg = nextLesson?.id
        ? getLessonSlideProgress(user?.uid, nextLesson.id)
        : null;

      let currentLessonFraction = 0;
      if (slideProg && slideProg.totalSlides > 0 && slideProg.slideIndex > 0) {
        currentLessonFraction = (slideProg.slideIndex + 1) / slideProg.totalSlides;
      }

      let completionPercent = 0;
      if (totalLessons > 0) {
        completionPercent =
          ((completedCount + currentLessonFraction) / totalLessons) * 100;
      } else if ((progress as any)?.progressPercentage !== undefined) {
        completionPercent = (progress as any).progressPercentage;
      }

      let displayPercent = Math.min(Math.round(completionPercent), 100);

      // Se há slides lidos ou a aula foi iniciada, garante pelo menos 1% para feedback visual
      const hasSlideProgress = Boolean(slideProg && slideProg.slideIndex > 0);
      if (displayPercent === 0 && (hasSlideProgress || completedCount > 0)) {
        displayPercent = Math.max(Math.round(completionPercent), 1);
      }

      let nextLessonTitle = "Continuar de onde parou";
      if (nextLesson) {
        const order = (nextLesson as any).order ?? (nextLesson as any).orderIndex ?? 1;
        if (hasSlideProgress) {
          nextLessonTitle = `Aula ${order}: ${nextLesson.title} • Slide ${slideProg!.slideIndex + 1} de ${slideProg!.totalSlides}`;
        } else {
          nextLessonTitle = `Aula ${order}: ${nextLesson.title}`;
        }
      }

      const isActuallyInProgress =
        (completedCount > 0 && displayPercent < 100) ||
        hasSlideProgress ||
        Boolean(progress.startedAt);

      return {
        displayPercent,
        nextLessonTitle,
        isActuallyInProgress,
      };
    };

    // 1. Se temos lastAccessed, garantimos que ele é o primeiro item
    if (lastAccessed?.course && lastAccessed?.progress) {
      const { course, progress, nextLesson } = lastAccessed;
      const computed = computeCourseProgress(course, progress, nextLesson);

      if (computed.displayPercent < 100) {
        items.push({
          course,
          progress,
          displayPercent: Math.max(computed.displayPercent, 1),
          nextLessonTitle: computed.nextLessonTitle,
        });
      }
    }

    // 2. Varre os demais cursos com progresso em andamento
    if (allCourses && allCourses.length > 0) {
      allCourses.forEach((course) => {
        if (lastAccessed?.course?.id === course.id) return;

        const progress =
          allProgress?.[course.id] ||
          allProgress?.[course.id?.toLowerCase()] ||
          allProgress?.[course.id?.toUpperCase()];

        // Verifica se há aula ativa salva localmente para este curso
        const activeLocal = getCourseActiveLesson(user?.uid, course.id);

        if (!progress && !activeLocal) return;

        const effectiveProgress = progress || {
          userId: user?.uid || "guest",
          courseId: course.id,
          completedLessons: [],
          exerciseResults: [],
          certificateEligible: false,
          certificateIssued: false,
          startedAt: activeLocal ? new Date(activeLocal.updatedAt) : new Date(),
          lastAccessedAt: activeLocal ? new Date(activeLocal.updatedAt) : new Date(),
        };

        const mockNextLesson = activeLocal
          ? {
              id: activeLocal.lessonId,
              title: activeLocal.lessonTitle || "Aula em andamento",
              order: activeLocal.lessonOrder || 1,
            }
          : undefined;

        const computed = computeCourseProgress(course, effectiveProgress, mockNextLesson);

        if (computed.isActuallyInProgress && computed.displayPercent < 100) {
          items.push({
            course,
            progress: effectiveProgress,
            displayPercent: Math.max(computed.displayPercent, 1),
            nextLessonTitle: computed.nextLessonTitle,
          });
        }
      });
    }

    return items;
  }, [lastAccessed, allCourses, allProgress, user?.uid]);

  function handleContinueItemPress(item: InProgressCourseItem) {
    navigation.navigate("CourseCurriculum", { courseId: item.course.id });
  }

  const handlePremiumPress = useCallback(() => {
    setMessageConfig({
      type: "info",
      title: "Saber Espírita Premium",
      message:
        "O plano Premium oferece acesso ilimitado a todas as séries das Obras Complementares (André Luiz, Emmanuel, etc.), estudos guiados em áudio e certificados exclusivos.",
      primaryButton: {
        label: "Entendido",
        onPress: () => bottomSheetRef.current?.dismiss(),
      },
    });
    setTimeout(() => bottomSheetRef.current?.present(), 100);
  }, []);

  function handleExploreCoursePress(course: ICourse, hasProgress: boolean) {
    if (course.status === "COMING_SOON") return;
    const activeLocal = getCourseActiveLesson(user?.uid, course.id);
    if (hasProgress || Boolean(activeLocal)) {
      navigation.navigate("CourseCurriculum", { courseId: course.id });
    } else {
      navigation.navigate("CourseDetails", { courseId: course.id });
    }
  }

  function handleLibraryItemPress(itemId: string) {
    switch (itemId) {
      case "1": // Séries Espirituais
        navigation.navigate("CoursesCatalog");
        break;
      case "2": // Glossário Espírita
        navigation.navigate("Glossary");
        break;
      case "3": // Podcasts
        navigation.navigate("AllPodcasts");
        break;
      case "4": // Verdade ou Mentira
        // @ts-ignore - navegação composta entre stacks
        navigation.navigate("FixTab", { screen: "TruthOrFalseHome" });
        break;
      case "5": // Converse com o Guia
        navigation.navigate("EmotionalChat", { origin: "ore" });
        break;
      case "6": // Pergunte ao Sr. Allan
        navigation.navigate("ScientificChat", { origin: "direct" });
        break;
      default:
        console.log(`Item ${itemId} clicado - navegação pendente`);
    }
  }

  const firstName = user?.displayName
    ? user.displayName.trim().split(/\s+/)[0]
    : "Usuário";

  const handleSeeAllCourses = useCallback(() => {
    navigation.navigate("CoursesCatalog");
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.headerContainer}>
          <View style={styles.headerTopRow}>
            <View style={styles.headerTextBlock}>
              <Text style={styles.greetingText}>Olá, {firstName}!</Text>
              {inProgressCourses.length === 0 && (
                <Text style={styles.subtitleText}>Vamos começar sua jornada?</Text>
              )}
            </View>

            <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={() =>
                  navigation.navigate("ScientificChat", { origin: "direct" })
                }
                activeOpacity={0.8}
                accessibilityLabel="Pergunte ao Sr. Allan"
              >
                <Feather size={20} color={theme.colors.primary} />
              </TouchableOpacity>

              {!isGuest && communityProgress && (
                <TouchableOpacity
                  style={styles.notificationButton}
                  onPress={handleOpenJourney}
                  activeOpacity={0.8}
                  accessibilityLabel="Sua Jornada"
                >
                  <View style={styles.notificationIconWrap}>
                    {communityProgress.communityLevelId === "arvore_frondosa" ? (
                      <TreePalm size={20} color={theme.colors.primary} />
                    ) : communityProgress.communityLevelId === "cultivador" ? (
                      <Leaf size={20} color={theme.colors.primary} />
                    ) : (
                      <Sprout size={20} color={theme.colors.primary} />
                    )}
                  </View>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.notificationButton}
                onPress={handleOpenNotifications}
                activeOpacity={0.8}
                accessibilityLabel="Abrir Notificações"
              >
                <Bell size={20} color={theme.colors.primary} />
                {hasUnreadNotifications && <View style={styles.notificationDot} />}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Carrossel de Cursos em Andamento (com histórico real e barra de progresso verde fina) */}
        {inProgressCourses.length > 0 && (
          <ContinueStudyingSection
            items={inProgressCourses}
            onPressItem={handleContinueItemPress}
          />
        )}

        {/* Seção Explore por tema (Trilhas em Carrossel Horizontal e Subcategorias) */}
        {allCourses.length > 0 && (
          <ExploreByTheme
            courses={allCourses}
            progressMap={allProgress}
            featuredCourseIds={featuredCourseIds}
            onCoursePress={handleExploreCoursePress}
            onSeeAllPress={handleSeeAllCourses}
          />
        )}

        {/* Banner do Saber Espírita Premium (100% Flat com Floating Cutout Badge) */}
        {/* <PremiumBanner onPress={handlePremiumPress} /> */}

        {/* Seção Biblioteca */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore a Biblioteca</Text>
        </View>

        {Biblioteca.map((item) => {
          const IconComponent = item.icon;
          const isItemNew =
            (item.id === "3" && hasNewPodcast) || (item.id === "2" && hasNewGlossaryTerm);

          return (
            <TouchableOpacity
              key={item.id}
              style={styles.libraryItem}
              onPress={() => handleLibraryItemPress(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.libraryContentGroup}>
                <View style={styles.iconContainer}>
                  <IconComponent size={20} color={theme.colors.primary} />
                </View>
                <Text style={styles.libraryItemText}>
                  {item.title.replace("\n", " ")}
                </Text>
              </View>

              <View style={styles.rightGroup}>
                {isItemNew && (
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Novo</Text>
                  </View>
                )}
                <ChevronRight size={20} color={theme.colors.textSecondary} />
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Assistente Sr. Allan */}
        <View style={styles.assistantCardContainer}>
          <AssistantCard
            title="Pergunte ao Sr. Allan"
            description="Tire suas dúvidas científicas e filosóficas com base nas obras básicas."
            buttonText="Perguntar"
            icon={Feather}
            onPress={() => navigation.navigate("ScientificChat", { origin: "direct" })}
          />
        </View>
      </ScrollView>

      <BottomSheetMessage ref={bottomSheetRef} config={messageConfig} />
      <JourneyBottomSheet
        ref={journeySheetRef}
        currentLevelId={communityProgress?.communityLevelId}
      />
    </SafeAreaView>
  );
}
