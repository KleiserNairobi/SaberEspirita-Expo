import React, { useCallback, useRef, useState } from "react";

import { FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import { differenceInDays } from "date-fns";
import { Bell, ChevronRight, Leaf, Sprout, TreePalm } from "lucide-react-native";
import { Feather } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AssistantCard } from "@/components/AssistantCard";
import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";
import { Carousel } from "@/components/Carousel";
import { JourneyBottomSheet } from "@/components/JourneyBottomSheet";
import { ResumeCard } from "@/components/ResumeCard";
import { Biblioteca } from "@/data/Biblioteca";
import { useAllCoursesProgress } from "@/hooks/queries/useAllCoursesProgress";
import { COURSES_KEYS, useFeaturedCourses } from "@/hooks/queries/useCourses";
import { useLastAccessedCourse } from "@/hooks/queries/useLastAccessedCourse";
import { useCommunityProgress } from "@/hooks/queries/useLessonForum";
import { NOTIFICATION_KEYS, useHasUnreadNotifications } from "@/hooks/queries/useNotifications";
import { usePodcasts } from "@/hooks/queries/usePodcasts";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useGlossaryTerms } from "@/pages/glossary/hooks/useGlossaryTerms";
import { AppStackParamList } from "@/routers/types";
import { useAuthStore } from "@/stores/authStore";
import { prefetchImages } from "@/utils/imagePrefetch";

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

  // Fetching de cursos populares via React Query
  const { data: featuredCourses = [] } = useFeaturedCourses();

  // Fetching de todos os progressos para o Carrossel Inteligente
  const { data: allProgress = {} } = useAllCoursesProgress();

  // Fetching do último curso acessado
  const { data: lastAccessed } = useLastAccessedCourse();

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
        queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.hasUnread(currentUserId) }),
        queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.list(currentUserId) }),
        queryClient.invalidateQueries({ queryKey: ["communityProgress", currentUserId] }),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [queryClient, user?.uid]);

  // Fetching de podcasts e termos do glossário para verificar existência de conteúdo novo (createdAt <= 15 dias)
  const { data: podcasts = [] } = usePodcasts();
  const { data: glossaryTerms = [] } = useGlossaryTerms();

  // Prefetch automático e deduplicado das capas dos podcasts e dos cursos Populares
  React.useEffect(() => {
    const urlsToPrefetch: (string | number | undefined | null)[] = [];
    if (podcasts && podcasts.length > 0) {
      urlsToPrefetch.push(...podcasts.map((p) => p.imageUrl));
    }
    if (featuredCourses && featuredCourses.length > 0) {
      urlsToPrefetch.push(...featuredCourses.map((c) => c.imageUrl));
    }
    if (urlsToPrefetch.length > 0) {
      prefetchImages(urlsToPrefetch);
    }
  }, [podcasts, featuredCourses]);

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

  function handleResumePress() {
    if (lastAccessed) {
      navigation.navigate("CourseCurriculum", { courseId: lastAccessed.course.id });
    }
  }

  function handleCoursePress(courseId: string) {
    const progress = allProgress[courseId];
    if (progress) {
      navigation.navigate("CourseCurriculum", { courseId });
    } else {
      navigation.navigate("CourseDetails", { courseId });
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

  function renderHeader() {
    return (
      <View>
        <View style={styles.headerContainer}>
          <View style={styles.headerTopRow}>
            <View style={styles.headerTextBlock}>
              <Text style={styles.greetingText}>
                Olá, {user?.displayName || "Usuário"}!
              </Text>
              <Text style={styles.subtitleText}>
                {lastAccessed
                  ? "Vamos continuar sua jornada?"
                  : "Vamos começar sua jornada?"}
              </Text>
            </View>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={handleOpenNotifications}
                activeOpacity={0.8}
                accessibilityLabel="Abrir Notificações"
              >
                <Bell size={20} color={theme.colors.primary} />
                {hasUnreadNotifications && <View style={styles.notificationDot} />}
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
            </View>
          </View>
        </View>

        {/* Card de Continuar (Resume) */}
        {lastAccessed && (
          <ResumeCard
            course={lastAccessed.course}
            progress={lastAccessed.progress}
            nextLesson={lastAccessed.nextLesson}
            onPress={handleResumePress}
          />
        )}

        {/* Seção Populares - Mostra apenas se tiver cursos carregados */}
        {featuredCourses.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Populares</Text>
              <TouchableOpacity onPress={() => navigation.navigate("CoursesCatalog")}>
                <Text style={styles.seeAllText}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            <Carousel
              data={featuredCourses}
              onCoursePress={handleCoursePress}
              progressMap={allProgress}
            />
          </>
        )}

        {/* Seção Biblioteca */}
        <View style={{ marginTop: featuredCourses.length > 0 ? 24 : 20 }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore a Biblioteca</Text>
          </View>
        </View>
      </View>
    );
  }

  function renderFooter() {
    return (
      <View style={{ marginHorizontal: 20, marginBottom: 20, marginTop: 10 }}>
        <AssistantCard
          title="Pergunte ao Sr. Allan"
          description="Tire suas dúvidas científicas e filosóficas com base nas obras básicas."
          buttonText="Perguntar"
          icon={Feather}
          onPress={() => navigation.navigate("ScientificChat", { origin: "direct" })}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={Biblioteca}
        numColumns={1}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        renderItem={({ item }) => {
          const IconComponent = item.icon;
          const isItemNew =
            (item.id === "3" && hasNewPodcast) || (item.id === "2" && hasNewGlossaryTerm);

          return (
            <TouchableOpacity
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
        }}
      />

      <BottomSheetMessage ref={bottomSheetRef} config={messageConfig} />
      <JourneyBottomSheet
        ref={journeySheetRef}
        currentLevelId={communityProgress?.communityLevelId}
      />
    </SafeAreaView>
  );
}
