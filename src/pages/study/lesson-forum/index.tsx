import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Linking,
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
import { ArrowLeft, MoreVertical, Send, Sparkles, Tag } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppBackground } from "@/components/AppBackground";
import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";
import { CommunityLevelUpModal } from "@/components/CommunityLevelUpModal";
import {
  useCommunityProgress,
  useCreateForumComment,
  useLessonForumComments,
  useRemoveForumReaction,
  useSetForumLastSeen,
  useSetForumReaction,
  useSoftDeleteForumComment,
} from "@/hooks/queries/useLessonForum";
import { useAppTheme } from "@/hooks/useAppTheme";
import type { AppStackParamList } from "@/routers/types";
import {
  getLevelUpIfAny,
  getStoredCommunityLevelRaw,
  setStoredCommunityLevel,
} from "@/services/community/communityLevelService";
import { useAuthStore } from "@/stores/authStore";
import { ForumComment, ForumReactionType } from "@/types/forum";

import { createStyles } from "./styles";

type Props = NativeStackScreenProps<AppStackParamList, "LessonForum">;

const REACTIONS: Array<{ type: ForumReactionType; emoji: string; label: string }> = [
  { type: "me_tocou", emoji: "🕊️", label: "Me tocou" },
  { type: "aprendi_algo", emoji: "💡", label: "Aprendi" },
  { type: "quero_refletir", emoji: "🤔", label: "Refletir" },
  { type: "gratidao", emoji: "🙏", label: "Gratidão" },
  { type: "luz", emoji: "✨", label: "Luz" },
];

function getLevelLabel(levelId: ForumComment["userCommunityLevel"]): string {
  if (levelId === "arvore_frondosa") return "🌳 Árvore Frondosa";
  if (levelId === "cultivador") return "🌿 Cultivador";
  return "🌱 Sementeiro";
}

export function LessonForumScreen({ route, navigation }: Props) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const { user, isGuest } = useAuthStore();

  const { courseId, lessonId, lessonTitle, anchorQuestion, focusTag } = route.params;

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const reactionSheetRef = useRef<BottomSheetModal>(null);
  const reactionSnapPoints = useMemo(() => ["40%"], []);
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

  const [reactionTarget, setReactionTarget] = useState<ForumComment | null>(null);

  const [levelUpVisible, setLevelUpVisible] = useState(false);
  const [levelUpId, setLevelUpId] =
    useState<ForumComment["userCommunityLevel"]>("sementeiro");

  const comments = useMemo(() => {
    const pages = data?.pages ?? [];
    return pages.flatMap((p) => p.comments);
  }, [data?.pages]);

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
    if (!user?.uid || isGuest) return;
    const current = communityProgress?.communityLevelId;
    if (!current) return;

    const levelUp = getLevelUpIfAny({ userId: user.uid, currentLevelId: current });
    if (!levelUp) return;

    setLevelUpId(levelUp);
    setLevelUpVisible(true);
    setStoredCommunityLevel(user.uid, levelUp);
  }, [communityProgress?.communityLevelId, isGuest, user?.uid]);

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
    (comment: ForumComment) => {
      if (isGuest) {
        showGuestMessage();
        return;
      }
      if (!user?.uid) return;
      if (comment.userId === user.uid) {
        setMessageConfig({
          type: "info",
          title: "Reações",
          message: "Você não pode reagir ao seu próprio comentário.",
        });
        setTimeout(() => bottomSheetRef.current?.present(), 100);
        return;
      }
      setReactionTarget(comment);
      reactionSheetRef.current?.present();
    },
    [isGuest, showGuestMessage, user?.uid]
  );

  const handleSelectReaction = useCallback(
    async (type: ForumReactionType) => {
      if (!reactionTarget) return;
      if (!user?.uid) return;

      if (reactionTarget.myReaction === type) {
        await removeReaction({ lessonId, commentId: reactionTarget.id });
      } else {
        await setReaction({ lessonId, commentId: reactionTarget.id, type });
      }

      reactionSheetRef.current?.dismiss();
      setReactionTarget(null);
      void refetch();
    },
    [lessonId, reactionTarget, refetch, removeReaction, setReaction, user?.uid]
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
      const isMine = !!user?.uid && item.userId === user.uid;
      const canRemove = isMine && !item.isDeleted;
      const hasAnyReaction =
        item.reactions.me_tocou +
          item.reactions.aprendi_algo +
          item.reactions.quero_refletir +
          item.reactions.gratidao +
          item.reactions.luz >
        0;
      const myReactionMeta = item.myReaction
        ? (REACTIONS.find((r) => r.type === item.myReaction) ?? null)
        : null;

      const content = item.isDeleted ? "Comentário removido pelo autor" : item.content;

      return (
        <View style={styles.commentCard}>
          <View style={styles.commentHeader}>
            <View style={styles.commentHeaderLeft}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {(item.userName || "E").charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.userName}</Text>
                <Text style={styles.meta}>{createdAtLabel}</Text>
                <Text style={styles.levelTag}>
                  {getLevelLabel(item.userCommunityLevel)}
                </Text>
              </View>
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

          <Text style={styles.content}>{content}</Text>

          <View style={styles.reactionsRow}>
            <View style={styles.reactionsCounts}>
              {REACTIONS.filter((r) => (item.reactions[r.type] ?? 0) > 0).map((r) => (
                <Text key={r.type} style={styles.reactionCount}>
                  {r.emoji} {item.reactions[r.type]}
                </Text>
              ))}
              {!hasAnyReaction && (
                <Text style={styles.reactionCount}>
                  {myReactionMeta
                    ? `Sua reação: ${myReactionMeta.emoji} ${myReactionMeta.label}`
                    : "Seja o primeiro a reagir"}
                </Text>
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
    [handleConfirmDelete, handleOpenReactionPicker, styles, user?.uid]
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
              <View style={styles.anchorIconContainer}>
                <Sparkles size={20} color={theme.colors.onPrimary} />
              </View>
              <View style={styles.anchorHeaderText}>
                <Text style={styles.anchorTitle}>Pergunta para reflexão</Text>
                {/* <Text style={styles.anchorSubtitle}>Uma nova pergunta te aguarda</Text> */}
              </View>
            </View>

            <Text style={styles.anchorQuestionText}>{anchorQuestion}</Text>

            <View style={styles.anchorMetaRow}>
              <View style={styles.anchorMetaItem}>
                <Tag size={16} color={theme.colors.muted} />
                <Text style={styles.anchorMetaText}>{focusTag}</Text>
              </View>
              <View style={styles.commentCountPill}>
                <Text style={styles.commentCountText}>{totalCountLabel}</Text>
              </View>
            </View>
          </View>

          <View style={styles.inputCard}>
            <View style={styles.inputRow}>
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Compartilhe sua reflexão…"
                placeholderTextColor={theme.colors.textSecondary}
                multiline
                maxLength={600}
                style={styles.forumInput}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handlePublish}
                disabled={isCreating || text.trim().length === 0}
                style={[
                  styles.sendButton,
                  (isCreating || text.trim().length === 0) && styles.sendButtonDisabled,
                ]}
              >
                {isCreating ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Send size={20} color="#fff" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.inputFooter}>
              <Text style={styles.counter}>{text.length}/600</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: theme.spacing.sm,
                }}
              >
                <Text style={styles.counter}>Anônimo</Text>
                <Switch
                  value={isAnonymous}
                  onValueChange={setIsAnonymous}
                  trackColor={{
                    false: theme.colors.muted,
                    true: theme.colors.primary,
                  }}
                  thumbColor={isAnonymous ? "#FFFFFF" : "#f4f3f4"}
                  ios_backgroundColor={theme.colors.muted}
                />
              </View>
            </View>
          </View>

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
            <FlatList
              data={comments}
              keyExtractor={(item) => item.id}
              renderItem={renderComment}
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
            <BottomSheetView style={styles.reactionSheetContent}>
              <Text style={styles.reactionSheetTitle}>Reagir</Text>
              <View style={styles.reactionOptions}>
                {REACTIONS.map((r) => (
                  <TouchableOpacity
                    key={r.type}
                    activeOpacity={0.7}
                    style={[
                      styles.reactionOption,
                      reactionTarget?.myReaction === r.type &&
                        styles.reactionOptionSelected,
                    ]}
                    onPress={() => handleSelectReaction(r.type)}
                  >
                    <Text style={styles.reactionOptionText}>
                      {r.emoji} {r.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </BottomSheetView>
          </BottomSheetModal>
        </View>
      </AppBackground>
    </SafeAreaView>
  );
}
