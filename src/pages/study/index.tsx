import React, { useCallback, useRef, useState } from "react";

import { FlatList, Text, TouchableOpacity, View } from "react-native";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
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
import { useFeaturedCourses } from "@/hooks/queries/useCourses";
import { useLastAccessedCourse } from "@/hooks/queries/useLastAccessedCourse";
import { useCommunityProgress } from "@/hooks/queries/useLessonForum";
import { useHasUnreadNotifications } from "@/hooks/queries/useNotifications";
import { useAppTheme } from "@/hooks/useAppTheme";
import { AppStackParamList } from "@/routers/types";
import { useAuthStore } from "@/stores/authStore";

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

  // Fetching de cursos populares via React Query
  const { data: featuredCourses = [], isLoading: loadingFeatured } = useFeaturedCourses();

  // Fetching de todos os progressos para o Carrossel Inteligente
  const { data: allProgress = {} } = useAllCoursesProgress();

  // Fetching do último curso acessado
  const { data: lastAccessed } = useLastAccessedCourse();

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
        renderItem={({ item }) => {
          const IconComponent = item.icon;
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

              <ChevronRight size={20} color={theme.colors.textSecondary} />
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
