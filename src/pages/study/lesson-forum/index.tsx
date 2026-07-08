import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  ActivityIndicator,
  Animated,
  Linking,
  SectionList,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";


import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { doc, getDoc } from "firebase/firestore";
import {
  ArrowLeft,
  Brain,
  ChevronDown,
  ChevronUp,
  Compass,
  EyeOff,
  HandHeart,
  Heart,
  Leaf,
  Lightbulb,
  MoreVertical,
  PenTool,
  Send,
  Sparkles,
  Sprout,
  TreePalm,
  X,
} from "lucide-react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { AppBackground } from "@/components/AppBackground";
import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";
import { CommunityLevelUpModal } from "@/components/CommunityLevelUpModal";
import { auth, db } from "@/configs/firebase/firebase";
import {
  useCommunityProgress,
  useCreateForumComment,
  useLessonForumComments,
  useRemoveForumReaction,
  useSetForumLastSeen,
  useSetForumReaction,
  useSoftDeleteForumComment,
} from "@/hooks/queries/useLessonForum";
import { useLesson } from "@/hooks/queries/useLessons";
import { useAppTheme } from "@/hooks/useAppTheme";
import type { AppStackParamList } from "@/routers/types";
import {
  getLevelUpIfAny,
  getStoredCommunityLevelRaw,
  setStoredCommunityLevel,
} from "@/services/community/communityLevelService";
import { touchCourseAccess } from "@/services/firebase/progressService";
import { useAuthStore } from "@/stores/authStore";
import { ForumComment, ForumReactionType } from "@/types/forum";

import { createStyles } from "./styles";

type Props = NativeStackScreenProps<AppStackParamList, "LessonForum">;

const REACTIONS: Array<{ type: ForumReactionType; Icon: React.FC<any>; label: string }> =
  [
    { type: "me_tocou", Icon: Heart, label: "Me tocou" },
    { type: "aprendi_algo", Icon: Lightbulb, label: "Aprendi" },
    { type: "quero_refletir", Icon: Brain, label: "Refletir" },
    { type: "gratidao", Icon: HandHeart, label: "Gratidão" },
    { type: "luz", Icon: Sparkles, label: "Luz" },
  ];

function getLevelLabel(levelId: ForumComment["userCommunityLevel"]): string {
  if (levelId === "arvore_frondosa") return "Árvore Frondosa";
  if (levelId === "cultivador") return "Cultivador(a)";
  return "Sementeiro(a)";
}

export function LessonForumScreen({ route, navigation }: Props) {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);
  const { user, isGuest } = useAuthStore();
  const uid = auth.currentUser?.uid || user?.uid || null;

  const { courseId, lessonId, lessonTitle, anchorQuestion, focusTag } = route.params;

  const { data: lesson, isLoading: isLoadingLesson } = useLesson(courseId, lessonId);

  const displayAnchorQuestion =
    anchorQuestion || lesson?.forumPrompt || "Reflexão da Aula";
  const displayFocusTag = focusTag || lesson?.forumFocusTag || "Reflexão";

  useEffect(() => {
    if (lesson && lesson.forumEnabled === false) {
      setMessageConfig({
        type: "info",
        title: "Fórum",
        message: "O fórum não está habilitado para esta aula.",
        primaryButton: {
          label: "Voltar",
          onPress: () => {
            bottomSheetRef.current?.dismiss();
            navigation.goBack();
          },
        },
      });
      setTimeout(() => bottomSheetRef.current?.present(), 100);
    }
  }, [lesson, navigation]);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const reactionSheetRef = useRef<BottomSheetModal>(null);
  const reactionSnapPoints = useMemo(() => ["50%"], []);
  const [messageConfig, setMessageConfig] = useState<BottomSheetMessageConfig | null>(
    null
  );

  const { data: communityProgress } = useCommunityProgress();
  const { mutateAsync: setLastSeen } = useSetForumLastSeen();
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useLessonForumComments(courseId, lessonId);
  const { mutateAsync: createComment, isPending: isCreating } = useCreateForumComment();
  const { mutateAsync: softDeleteComment } = useSoftDeleteForumComment();
  const { mutateAsync: setReaction } = useSetForumReaction();
  const { mutateAsync: removeReaction } = useRemoveForumReaction();

  const [text, setText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Animação de altura, opacidade e rotação (idêntico ao FAQ)
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isExpanded) {
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isExpanded]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const [reactionTarget, setReactionTarget] = useState<ForumComment | null>(null);
  const reactionRefreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [levelUpVisible, setLevelUpVisible] = useState(false);
  const [levelUpId, setLevelUpId] =
    useState<ForumComment["userCommunityLevel"]>("sementeiro");

  const comments = useMemo(() => {
    const pages = data?.pages ?? [];
    return pages.flatMap((p) => p.comments);
  }, [data?.pages]);

  const sections = useMemo(() => {
    return [{ title: "Comentários", data: comments }];
  }, [comments]);

  useEffect(() => {
    if (!user?.uid || isGuest) return;
    const raw = getStoredCommunityLevelRaw(user.uid);
    if (raw === null && communityProgress?.communityLevelId) {
      setStoredCommunityLevel(user.uid, communityProgress.communityLevelId);
    }
  }, [communityProgress?.communityLevelId, isGuest, user?.uid]);

  useEffect(() => {
    if (!user?.uid || isGuest) return;
    void setLastSeen(lessonId);
  }, [isGuest, lessonId, setLastSeen, user?.uid]);

  useEffect(() => {
    if (!auth.currentUser?.uid || isGuest) return;
    void touchCourseAccess(courseId, { lessonId, userId: auth.currentUser.uid }).catch(
      () => {}
    );
  }, [courseId, isGuest, lessonId]);

  useEffect(() => {
    if (!user?.uid || isGuest) return;
    const current = communityProgress?.communityLevelId;
    if (!current) return;

    const levelUp = getLevelUpIfAny({ userId: user.uid, currentLevelId: current });
    if (!levelUp) return;

    setLevelUpId(levelUp);
    setLevelUpVisible(true);
    setStoredCommunityLevel(user.uid, levelUp);
  }, [communityProgress?.communityLevelId, isGuest, user?.uid]);

  useEffect(() => {
    return () => {
      if (reactionRefreshTimeoutRef.current) {
        clearTimeout(reactionRefreshTimeoutRef.current);
      }
    };
  }, []);

  const ensureCanReact = useCallback(
    async (
      comment: ForumComment
    ): Promise<{ ok: true } | { ok: false; message: string }> => {
      if (isGuest) {
        return {
          ok: false,
          message: "Crie uma conta para participar do fórum e salvar seu progresso.",
        };
      }

      if (!auth.currentUser?.uid) {
        return {
          ok: false,
          message: "Sua sessão expirou. Faça login novamente para reagir.",
        };
      }

      const commentRef = doc(db, "lesson_forums", lessonId, "comments", comment.id);
      const commentSnap = await getDoc(commentRef);
      if (!commentSnap.exists()) {
        return { ok: false, message: "Comentário não encontrado. Tente novamente." };
      }

      const data = commentSnap.data() as Record<string, unknown>;
      const commentUserId = typeof data.userId === "string" ? data.userId : null;
      const commentCourseId = typeof data.courseId === "string" ? data.courseId : null;
      const isDeleted = !!data.isDeleted;
      const moderationStatus =
        typeof data.moderationStatus === "string"
          ? (data.moderationStatus as string)
          : null;

      if (commentUserId && commentUserId === auth.currentUser.uid) {
        return { ok: false, message: "Você não pode reagir ao seu próprio comentário." };
      }

      if (isDeleted) {
        return {
          ok: false,
          message: "Este comentário foi removido e não pode receber reações.",
        };
      }

      if (moderationStatus === "HIDDEN") {
        return {
          ok: false,
          message: "Este comentário não está disponível para reações.",
        };
      }

      if (!commentCourseId) {
        return {
          ok: false,
          message: "Não foi possível validar o curso deste comentário.",
        };
      }

      await touchCourseAccess(commentCourseId, {
        lessonId,
        userId: auth.currentUser.uid,
      }).catch(() => {});

      const progressRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "courseProgress",
        commentCourseId
      );
      const progressSnap = await getDoc(progressRef);
      if (!progressSnap.exists()) {
        return {
          ok: false,
          message: "Você precisa iniciar este curso para reagir no fórum.",
        };
      }

      return { ok: true };
    },
    [isGuest, lessonId]
  );

  const showGuestMessage = useCallback(() => {
    setMessageConfig({
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
    setTimeout(() => bottomSheetRef.current?.present(), 100);
  }, [navigation]);

  const handlePublish = useCallback(async () => {
    if (isGuest) {
      showGuestMessage();
      return;
    }
    if (!user?.uid) return;

    const content = text.trim();
    if (content.length === 0) return;
    if (content.length > 600) return;

    const userName = user.displayName || "Estudante";
    const userAvatar = null;
    const level = communityProgress?.communityLevelId ?? "sementeiro";

    await createComment({
      courseId,
      lessonId,
      content,
      isAnonymous,
      userName,
      userAvatar,
      userCommunityLevel: level,
    });

    setText("");
    setIsAnonymous(false);
    setIsExpanded(false);
    void refetch();
  }, [
    communityProgress?.communityLevelId,
    courseId,
    createComment,
    isAnonymous,
    isGuest,
    lessonId,
    refetch,
    showGuestMessage,
    text,
    user?.displayName,
    user?.uid,
  ]);

  const handleOpenReactionPicker = useCallback(
    async (comment: ForumComment) => {
      const validation = await ensureCanReact(comment);
      if (!validation.ok) {
        if (isGuest) {
          showGuestMessage();
          return;
        }
        setMessageConfig({
          type: "error",
          title: "Reações",
          message: validation.message,
          primaryButton: {
            label: "Entendi",
            onPress: () => bottomSheetRef.current?.dismiss(),
          },
        });
        setTimeout(() => bottomSheetRef.current?.present(), 100);
        return;
      }
      setReactionTarget(comment);
      reactionSheetRef.current?.present();
    },
    [ensureCanReact, isGuest, showGuestMessage]
  );

  const handleSelectReaction = useCallback(
    async (type: ForumReactionType) => {
      if (!reactionTarget) return;
      if (!auth.currentUser?.uid) return;

      const target = reactionTarget;

      // Fecha o picker e limpa o target imediatamente para resposta instantânea na UI
      reactionSheetRef.current?.dismiss();
      setReactionTarget(null);

      try {
        const validation = await ensureCanReact(target);
        if (!validation.ok) {
          throw new Error(validation.message);
        }
        if (target.myReaction === type) {
          await removeReaction({ lessonId, commentId: target.id });
        } else {
          await setReaction({ lessonId, commentId: target.id, type });
        }

        // Removido o setTimeout com refetch() forçado para evitar concorrência com o cache otimista
      } catch (e) {
        const code = String((e as any)?.code ?? "");
        const baseMessage = String((e as any)?.message ?? "").trim();
        const message = code.includes("permission-denied")
          ? __DEV__
            ? `Sem permissão para salvar sua reação.\n\nuid: ${auth.currentUser?.uid ?? "-"}\nprojectId: ${String(auth.app.options.projectId ?? "-")}\nlessonId: ${lessonId}\ncommentId: ${target.id}`
            : "Sem permissão para salvar sua reação. Reabra a aula para validar sua matrícula ou faça login novamente."
          : baseMessage.length > 0
            ? baseMessage
            : "Não foi possível salvar sua reação agora. Tente novamente.";

        setMessageConfig({
          type: "error",
          title: "Reações",
          message,
          primaryButton: {
            label: "Entendi",
            onPress: () => bottomSheetRef.current?.dismiss(),
          },
        });
        setTimeout(() => bottomSheetRef.current?.present(), 100);
      }
    },
    [ensureCanReact, lessonId, reactionTarget, removeReaction, setReaction]
  );

  const handleConfirmDelete = useCallback(
    (comment: ForumComment) => {
      setMessageConfig({
        type: "question",
        title: "Remover comentário",
        message: "Deseja remover este comentário? Ele continuará visível como removido.",
        primaryButton: {
          label: "Remover",
          onPress: async () => {
            bottomSheetRef.current?.dismiss();
            await softDeleteComment({ lessonId, commentId: comment.id });
            void refetch();
          },
        },
        secondaryButton: {
          label: "Cancelar",
          onPress: () => bottomSheetRef.current?.dismiss(),
        },
      });
      setTimeout(() => bottomSheetRef.current?.present(), 100);
    },
    [lessonId, refetch, softDeleteComment]
  );

  const renderComment = useCallback(
    ({ item }: { item: ForumComment }) => {
      const createdAtLabel = item.createdAt ? item.createdAt.toLocaleString("pt-BR") : "";
      const isMine = !!uid && item.userId === uid;
      const canRemove = isMine && !item.isDeleted;

      const baseReactions = item.reactions;
      const baseTotal =
        baseReactions.me_tocou +
        baseReactions.aprendi_algo +
        baseReactions.quero_refletir +
        baseReactions.gratidao +
        baseReactions.luz;

      const displayReactions =
        baseTotal === 0 && item.myReaction
          ? { ...baseReactions, [item.myReaction]: 1 }
          : baseReactions;

      const hasAnyReaction =
        displayReactions.me_tocou +
          displayReactions.aprendi_algo +
          displayReactions.quero_refletir +
          displayReactions.gratidao +
          displayReactions.luz >
        0;

      const content = item.isDeleted ? "Comentário removido pelo autor" : item.content;

      return (
        <View style={[styles.commentCard, item.isDeleted && { backgroundColor: `${theme.colors.error}25` }]}>
          <View style={{ flexDirection: "row", gap: theme.spacing.md }}>
            <View style={[styles.avatar, item.isDeleted && { backgroundColor: `${theme.colors.error}15` }]}>
              <Text style={[styles.avatarText, item.isDeleted && { color: theme.colors.error }]}>
                {(item.userName || "E").charAt(0).toUpperCase()}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <View>
                  <Text style={styles.name}>{item.userName}</Text>
                  <Text style={styles.meta}>{createdAtLabel}</Text>
                </View>
                {canRemove && (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleConfirmDelete(item)}
                    style={styles.commentMenuButton}
                  >
                    <MoreVertical size={18} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>

              {!item.isDeleted && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    marginTop: 6,
                    alignSelf: "flex-start",
                    backgroundColor:
                      item.userCommunityLevel === "arvore_frondosa"
                        ? `${theme.colors.reflection}20`
                        : item.userCommunityLevel === "cultivador"
                          ? `${theme.colors.primary}20`
                          : `${theme.colors.border}60`,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: theme.radius.sm,
                  }}
                >
                {item.userCommunityLevel === "arvore_frondosa" ? (
                  <TreePalm size={12} color={theme.colors.reflection} />
                ) : item.userCommunityLevel === "cultivador" ? (
                  <Leaf size={12} color={theme.colors.primary} />
                ) : (
                  <Sprout size={12} color={theme.colors.textSecondary} />
                )}
                <Text
                  style={[
                    styles.levelTag,
                    {
                      marginTop: 0,
                      fontSize: 10,
                      fontWeight: "600",
                      color:
                        item.userCommunityLevel === "arvore_frondosa"
                          ? theme.colors.reflection
                          : item.userCommunityLevel === "cultivador"
                            ? theme.colors.primary
                            : theme.colors.textSecondary,
                    },
                  ]}
                >
                  {getLevelLabel(item.userCommunityLevel)}
                </Text>
              </View>
              )}

              <Text
                style={[
                  styles.content,
                  { marginTop: 8, marginBottom: 0 },
                  item.isDeleted && { fontStyle: "italic", color: theme.colors.error },
                ]}
              >
                {content}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.reactionsRow,
              { marginTop: theme.spacing.md, marginLeft: 40 + theme.spacing.md },
            ]}
          >
            <View style={styles.reactionsCounts}>
              {REACTIONS.filter((r) => (displayReactions[r.type] ?? 0) > 0).map((r) => {
                const Icon = r.Icon;
                return (
                  <View key={r.type} style={[styles.reactionCountBadge, item.isDeleted && { backgroundColor: `${theme.colors.error}15` }]}>
                    <Icon size={14} color={theme.colors.textSecondary} />
                    <Text style={styles.reactionCountText}>
                      {displayReactions[r.type]}
                    </Text>
                  </View>
                );
              })}
              {!hasAnyReaction && !item.isDeleted && (
                <Text style={styles.reactionCount}>Seja o primeiro a reagir</Text>
              )}
            </View>

            {!item.isDeleted && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleOpenReactionPicker(item)}
                style={styles.reactionActionButton}
              >
                <Text style={styles.reactionActionText}>Reagir ▾</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    },
    [handleConfirmDelete, handleOpenReactionPicker, styles, uid]
  );

  const totalCountLabel = `${comments.length} comentários`;

  const loadErrorMessage = useMemo(() => {
    const msg = String((error as any)?.message ?? error ?? "");
    const isPermission =
      msg.toLowerCase().includes("permission") || msg.toLowerCase().includes("permiss");
    if (isPermission)
      return "Você precisa estar matriculado neste curso para ver o fórum.";
    if (msg.toLowerCase().includes("requires an index")) {
      return "Precisa criar um índice no Firestore para carregar os comentários.";
    }
    return "Não foi possível carregar os comentários agora.";
  }, [error]);

  const indexUrl = useMemo(() => {
    const msg = String((error as any)?.message ?? error ?? "");
    const match = msg.match(/https?:\/\/\S+/);
    return match?.[0] ?? null;
  }, [error]);

  useEffect(() => {
    if (!__DEV__) return;
    if (!indexUrl) return;
    console.log("[Forum] Firestore index URL:", indexUrl);
  }, [indexUrl]);

  const renderReactionBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    []
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      edges={["top"]}
    >
      <AppBackground>
        <View style={styles.container}>
          {isLoading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : isError ? (
            <View style={styles.commentCard}>
              <Text style={theme.text("md", "semibold")}>{loadErrorMessage}</Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: theme.spacing.lg,
                  marginTop: theme.spacing.md,
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate("CourseCurriculum", { courseId } as any)
                  }
                >
                  <Text style={styles.reactButton}>Abrir curso</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()}>
                  <Text style={styles.reactButton}>Voltar</Text>
                </TouchableOpacity>
              </View>
              {!!indexUrl && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => Linking.openURL(indexUrl)}
                >
                  <Text style={[styles.reactButton, { marginTop: theme.spacing.md }]}>
                    Criar índice
                  </Text>
                </TouchableOpacity>
              )}
              {__DEV__ && !!error && (
                <Text style={[styles.meta, { marginTop: theme.spacing.md }]} selectable>
                  {String((error as any)?.message ?? error)}
                </Text>
              )}
            </View>
          ) : (
            <SectionList
              sections={sections}
              keyExtractor={(item) => item.id}
              renderItem={renderComment}
              ListHeaderComponent={
                <>
                  <View style={styles.header}>
                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={() => navigation.goBack()}
                      activeOpacity={0.7}
                    >
                      <ArrowLeft size={20} color={theme.colors.primary} />
                    </TouchableOpacity>

                    <View style={styles.headerTextContainer}>
                      <Text style={styles.title}>Fórum</Text>
                      <Text style={styles.subtitle}>{lessonTitle}</Text>
                    </View>
                  </View>

                  <View style={styles.anchorCard}>
                    <View style={styles.anchorHeader}>
                      <Compass size={20} color={theme.colors.reflection} />
                      <View style={styles.anchorHeaderText}>
                        <Text style={styles.anchorTitle}>Pergunta para reflexão</Text>
                        <View style={styles.focusBadge}>
                          <Text style={styles.focusText}>{displayFocusTag}</Text>
                        </View>
                      </View>
                    </View>

                    <Text style={styles.anchorQuestionText}>{displayAnchorQuestion}</Text>

                    <View style={styles.anchorMetaRow}>
                      <View style={styles.commentCountPill}>
                        <Text style={styles.commentCountText}>{totalCountLabel}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.composerContainer}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => setIsExpanded(!isExpanded)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        paddingVertical: 2,
                      }}
                    >
                      <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.sm }}>
                        <PenTool size={16} color={theme.colors.primary} />
                        <Text
                          style={
                            isExpanded
                              ? { ...theme.text("md", "medium"), color: theme.colors.text }
                              : { ...theme.text("sm", "medium", theme.colors.textSecondary) }
                          }
                        >
                          {isExpanded ? "Sua reflexão" : "Compartilhe sua reflexão..."}
                        </Text>
                      </View>
                      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                        <ChevronDown size={18} color={theme.colors.textSecondary} />
                      </Animated.View>
                    </TouchableOpacity>

                    <Animated.View
                      style={[
                        styles.contentWrapper,
                        {
                          maxHeight: animatedHeight.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 600],
                          }),
                          opacity: animatedOpacity,
                        },
                      ]}
                    >
                      <View style={{ marginTop: theme.spacing.md }}>
                        <View style={styles.inputContainer}>
                          <TextInput
                            value={text}
                            onChangeText={setText}
                            placeholder="Escreva aqui sua reflexão sobre a aula…"
                            placeholderTextColor={theme.colors.textSecondary}
                            multiline
                            maxLength={600}
                            style={styles.forumInput}
                          />
                          <Text style={styles.counter}>{text.length}/600</Text>
                        </View>

                        <View style={styles.anonymousCard}>
                          <View style={styles.anonymousCardLeft}>
                            <View style={styles.anonymousIconBg}>
                              <EyeOff size={18} color={theme.colors.primary} />
                            </View>
                            <View style={styles.anonymousTextColumn}>
                              <Text style={styles.anonymousTitle}>Publicar Anonimamente</Text>
                              <Text style={styles.anonymousDescription}>
                                Sua identidade será preservada
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              height: 36,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Switch
                              value={isAnonymous}
                              onValueChange={setIsAnonymous}
                              trackColor={{
                                false: theme.colors.muted,
                                true: theme.colors.primary,
                              }}
                              thumbColor={isAnonymous ? "#FFFFFF" : "#f4f3f4"}
                              ios_backgroundColor={theme.colors.muted}
                              style={{ margin: 0 }}
                            />
                          </View>
                        </View>

                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={handlePublish}
                          disabled={isCreating || text.trim().length === 0}
                          style={[
                            styles.sendButton,
                            (isCreating || text.trim().length === 0) &&
                              styles.sendButtonDisabled,
                          ]}
                          accessibilityLabel="Publicar"
                        >
                          {isCreating ? (
                            <ActivityIndicator size="small" color={theme.colors.onPrimary} />
                          ) : (
                            <>
                              <Sparkles size={16} color={theme.colors.onPrimary} />
                              <Text style={styles.sendButtonText}>PUBLICAR REFLEXÃO</Text>
                            </>
                          )}
                        </TouchableOpacity>
                      </View>
                    </Animated.View>
                  </View>
                </>
              }
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={
                hasNextPage ? (
                  <TouchableOpacity
                    style={styles.loadMore}
                    onPress={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? (
                      <ActivityIndicator size="small" color={theme.colors.primary} />
                    ) : (
                      <Text style={styles.loadMoreText}>Ver mais</Text>
                    )}
                  </TouchableOpacity>
                ) : null
              }
              refreshing={false}
              onRefresh={() => refetch()}
            />
          )}

          <BottomSheetMessage ref={bottomSheetRef} config={messageConfig} />

          <CommunityLevelUpModal
            visible={levelUpVisible}
            levelId={levelUpId}
            onClose={() => setLevelUpVisible(false)}
          />

          <BottomSheetModal
            ref={reactionSheetRef}
            index={0}
            snapPoints={reactionSnapPoints}
            enablePanDownToClose={true}
            backdropComponent={renderReactionBackdrop}
            backgroundStyle={styles.bottomSheetBackground}
            handleIndicatorStyle={styles.handleIndicator}
            onDismiss={() => setReactionTarget(null)}
          >
            <BottomSheetView
              style={[
                styles.reactionSheetContent,
                { paddingBottom: Math.max(insets.bottom, theme.spacing.xl) },
              ]}
            >
              <View style={styles.reactionSheetHeader}>
                <Text style={styles.reactionSheetTitle}>Reagir</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.closeButton}
                  onPress={() => reactionSheetRef.current?.dismiss()}
                  accessibilityLabel="Fechar opções de reação"
                >
                  <X size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.reactionOptions}>
                {REACTIONS.map((r) => {
                  const Icon = r.Icon;
                  const isSelected = reactionTarget?.myReaction === r.type;
                  return (
                    <TouchableOpacity
                      key={r.type}
                      activeOpacity={0.7}
                      style={[
                        styles.reactionOption,
                        isSelected && styles.reactionOptionSelected,
                      ]}
                      onPress={() => handleSelectReaction(r.type)}
                    >
                      <Icon
                        size={18}
                        color={
                          isSelected ? theme.colors.primary : theme.colors.textSecondary
                        }
                      />
                      <Text
                        style={[
                          styles.reactionOptionText,
                          isSelected && styles.reactionOptionTextSelected,
                        ]}
                      >
                        {r.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </BottomSheetView>
          </BottomSheetModal>
        </View>
      </AppBackground>
    </SafeAreaView>
  );
}
