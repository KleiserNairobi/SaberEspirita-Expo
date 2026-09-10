import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  BookOpen,
  ChevronRight,
  FileText,
  FolderOpen,
  Headphones,
  Lock,
  Mic,
} from "lucide-react-native";

import { useCourseMaterials } from "@/hooks/queries/useCourses";
import { useAppTheme } from "@/hooks/useAppTheme";
import { AppStackParamList } from "@/routers/types";
import { usePodcastPlayerStore } from "@/stores/podcastPlayerStore";
import { IBooklet } from "@/types/booklet";
import { IMeditation } from "@/types/meditate";
import { IPodcast } from "@/types/podcast";
import { IReflection } from "@/types/reflection";

import { createStyles } from "./styles";

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

interface CourseMaterialsTabProps {
  courseId: string;
  onOpenPremiumModal: (itemName: string) => void;
}

export function CourseMaterialsTab({
  courseId,
  onOpenPremiumModal,
}: CourseMaterialsTabProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NavigationProp>();
  const { setCurrentPodcast } = usePodcastPlayerStore();

  const { data: materials, isLoading } = useCourseMaterials(courseId);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Carregando materiais...</Text>
      </View>
    );
  }

  const booklets = materials?.booklets || [];
  const podcasts = materials?.podcasts || [];
  const reflections = materials?.reflections || [];
  const meditations = materials?.meditations || [];

  const totalCount =
    booklets.length + podcasts.length + reflections.length + meditations.length;

  if (totalCount === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <FolderOpen size={24} color={theme.colors.primary} />
        </View>
        <Text style={styles.emptyTitle}>Nenhum material disponível</Text>
        <Text style={styles.emptySubtitle}>
          Esta série ainda não possui materiais complementares cadastrados.
        </Text>
      </View>
    );
  }

  function handleBookletPress(booklet: IBooklet) {
    if (booklet.isPremium) {
      onOpenPremiumModal(booklet.title);
      return;
    }
    navigation.navigate("BookletViewer", {
      id: booklet.id,
      fileUrl: booklet.fileUrl,
      title: booklet.title,
    });
  }

  function handlePodcastPress(podcast: IPodcast) {
    if (podcast.isPremium) {
      onOpenPremiumModal(podcast.title);
      return;
    }
    setCurrentPodcast(podcast);
    navigation.navigate("PodcastPlayer", { id: podcast.id });
  }

  function handleReflectionPress(reflection: IReflection) {
    if (reflection.isPremium) {
      onOpenPremiumModal(reflection.title);
      return;
    }
    navigation.navigate("Reflection", { id: reflection.id });
  }

  function handleMeditationPress(meditation: IMeditation) {
    if (meditation.isPremium) {
      onOpenPremiumModal(meditation.title);
      return;
    }
    navigation.navigate("MeditationPlayer", { id: meditation.id });
  }

  return (
    <View style={styles.container}>
      {/* 1. SEÇÃO DE APOSTILAS & GUIAS DIGITAIS */}
      {booklets.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <FileText size={15} color={theme.colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>Apostilas & Guias Digitais (PDF)</Text>
            <Text style={styles.sectionCount}>{booklets.length}</Text>
          </View>

          <View style={styles.itemsList}>
            {booklets.map((booklet, index) => (
              <TouchableOpacity
                key={booklet.id}
                style={styles.listItem}
                onPress={() => handleBookletPress(booklet)}
                activeOpacity={0.6}
              >
                <Text style={styles.itemText} numberOfLines={1}>
                  {index + 1}. {booklet.title}{" "}
                  {booklet.pageCount ? `(${booklet.pageCount} págs)` : ""}
                </Text>
                <View style={styles.itemRightAction}>
                  {booklet.isPremium && (
                    <View style={styles.premiumTag}>
                      <Lock size={10} color={theme.colors.warning} />
                      <Text style={styles.premiumTagText}>Premium</Text>
                    </View>
                  )}
                  <ChevronRight size={16} color={theme.colors.muted} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* 2. SEÇÃO DE PODCASTS */}
      {podcasts.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Mic size={15} color={theme.colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>Podcasts Exclusivos</Text>
            <Text style={styles.sectionCount}>{podcasts.length}</Text>
          </View>

          <View style={styles.itemsList}>
            {podcasts.map((podcast, index) => (
              <TouchableOpacity
                key={podcast.id}
                style={styles.listItem}
                onPress={() => handlePodcastPress(podcast)}
                activeOpacity={0.6}
              >
                <Text style={styles.itemText} numberOfLines={1}>
                  {index + 1}. {podcast.title}{" "}
                  {podcast.durationMinutes ? `(${podcast.durationMinutes} min)` : ""}
                </Text>
                <View style={styles.itemRightAction}>
                  {podcast.isPremium && (
                    <View style={styles.premiumTag}>
                      <Lock size={10} color={theme.colors.warning} />
                      <Text style={styles.premiumTagText}>Premium</Text>
                    </View>
                  )}
                  <ChevronRight size={16} color={theme.colors.muted} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* 3. SEÇÃO DE LEITURAS & TEXTOS DE APOIO */}
      {reflections.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <BookOpen size={15} color={theme.colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>Leituras & Textos de Apoio</Text>
            <Text style={styles.sectionCount}>{reflections.length}</Text>
          </View>

          <View style={styles.itemsList}>
            {reflections.map((reflection, index) => (
              <TouchableOpacity
                key={reflection.id}
                style={styles.listItem}
                onPress={() => handleReflectionPress(reflection)}
                activeOpacity={0.6}
              >
                <Text style={styles.itemText} numberOfLines={1}>
                  {index + 1}. {reflection.title}{" "}
                  {reflection.readingTimeMinutes
                    ? `(${reflection.readingTimeMinutes} min)`
                    : ""}
                </Text>
                <View style={styles.itemRightAction}>
                  {reflection.isPremium && (
                    <View style={styles.premiumTag}>
                      <Lock size={10} color={theme.colors.warning} />
                      <Text style={styles.premiumTagText}>Premium</Text>
                    </View>
                  )}
                  <ChevronRight size={16} color={theme.colors.muted} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* 4. SEÇÃO DE MEDITAÇÕES GUIADAS */}
      {meditations.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Headphones size={15} color={theme.colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>Meditações Guiadas</Text>
            <Text style={styles.sectionCount}>{meditations.length}</Text>
          </View>

          <View style={styles.itemsList}>
            {meditations.map((meditation, index) => (
              <TouchableOpacity
                key={meditation.id}
                style={styles.listItem}
                onPress={() => handleMeditationPress(meditation)}
                activeOpacity={0.6}
              >
                <Text style={styles.itemText} numberOfLines={1}>
                  {index + 1}. {meditation.title}{" "}
                  {meditation.durationMinutes
                    ? `(${meditation.durationMinutes} min)`
                    : ""}
                </Text>
                <View style={styles.itemRightAction}>
                  {meditation.isPremium && (
                    <View style={styles.premiumTag}>
                      <Lock size={10} color={theme.colors.warning} />
                      <Text style={styles.premiumTagText}>Premium</Text>
                    </View>
                  )}
                  <ChevronRight size={16} color={theme.colors.muted} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

export default CourseMaterialsTab;
