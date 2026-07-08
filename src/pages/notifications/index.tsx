import { useCallback, useMemo, useRef, useState } from "react";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  ArrowLeft,
  Brain,
  CheckCheck,
  HandHeart,
  Heart,
  Lightbulb,
  Megaphone,
  MessageSquare,
  Sparkles,
} from "lucide-react-native";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/hooks/queries/useNotifications";
import { useAppTheme } from "@/hooks/useAppTheme";
import type { AppStackParamList } from "@/routers/types";
import { getLessonById } from "@/services/firebase/lessonService";
import { useAuthStore } from "@/stores/authStore";
import type { NotificationItem } from "@/types/notifications";

import { createStyles } from "./styles";

type Props = NativeStackScreenProps<AppStackParamList, "Notifications">;

function formatWhen(date: Date | null): string {
  if (!date) return "";
  return date.toLocaleString("pt-BR");
}

function getTitle(item: NotificationItem): string {
  if (item.type === "admin_broadcast") return item.title || "Aviso do sistema";
  if (item.type === "forum_reaction_received") return "Nova reação";
  return "Novo comentário";
}

function getReactionIcon(reactionType: string | null) {
  if (reactionType === "me_tocou") return Heart;
  if (reactionType === "aprendi_algo") return Lightbulb;
  if (reactionType === "quero_refletir") return Brain;
  if (reactionType === "gratidao") return HandHeart;
  if (reactionType === "luz") return Sparkles;
  return Sparkles;
}



function renderItemText(item: NotificationItem, styles: any) {
  if (item.type === "admin_broadcast") {
    return (
      <Text style={styles.rowSubtitle}>{item.body || ""}</Text>
    );
  }

  const fromUser = item.fromUserName || "Alguém";
  const lessonName = item.lessonTitle;

  if (item.type === "forum_reaction_received") {
    const reactionLabel =
      item.reactionType === "me_tocou" ? "Me tocou" :
      item.reactionType === "aprendi_algo" ? "Aprendi" :
      item.reactionType === "quero_refletir" ? "Refletir" :
      item.reactionType === "gratidao" ? "Gratidão" :
      item.reactionType === "luz" ? "Luz" : "Reação";

    if (lessonName) {
      return (
        <Text style={styles.rowSubtitle}>
          <Text style={styles.boldText}>{fromUser}</Text> reagiu com <Text style={styles.boldText}>{reactionLabel}</Text> à sua reflexão na aula <Text style={styles.boldText}>{lessonName}</Text>.
        </Text>
      );
    }
    return (
      <Text style={styles.rowSubtitle}>
        <Text style={styles.boldText}>{fromUser}</Text> reagiu ao seu comentário no fórum.
      </Text>
    );
  }

  // forum_new_comment_thread
  if (lessonName) {
    return (
      <Text style={styles.rowSubtitle}>
        <Text style={styles.boldText}>{fromUser}</Text> comentou na aula <Text style={styles.boldText}>{lessonName}</Text>.
      </Text>
    );
  }
  return (
    <Text style={styles.rowSubtitle}>
      <Text style={styles.boldText}>{fromUser}</Text> comentou em uma aula que você participou.
    </Text>
  );
}

export function NotificationsScreen({ navigation }: Props) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const { user, isGuest } = useAuthStore();

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [messageConfig, setMessageConfig] = useState<BottomSheetMessageConfig | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotifications();

  const { mutateAsync: markRead } = useMarkNotificationRead();
  const { mutateAsync: markAllRead, isPending: isMarkingAll } = useMarkAllNotificationsRead();

  const items = useMemo(() => {
    const pages = data?.pages ?? [];
    return pages.flatMap((p) => p.items);
  }, [data?.pages]);

  const handleOpenItem = useCallback(
    async (item: NotificationItem) => {
      if (isGuest) return;
      if (!user?.uid) return;

      // admin_broadcast: sem destino de navegação — só marca como lida
      if (item.type === "admin_broadcast") {
        if (!item.readAt) {
          await markRead(item.id).catch(() => {});
        }
        return;
      }

      if (!item.courseId || !item.lessonId) {
        setMessageConfig({
          type: "warning",
          title: "Notificações",
          message: "Esta notificação não possui referência para abrir.",
        });
        setTimeout(() => bottomSheetRef.current?.present(), 100);
        return;
      }

      try {
        if (!item.readAt) {
          await markRead(item.id);
        }

        const lesson = await getLessonById(item.courseId, item.lessonId);
        if (!lesson) {
          setMessageConfig({
            type: "error",
            title: "Notificações",
            message: "Não foi possível abrir a aula desta notificação.",
          });
          setTimeout(() => bottomSheetRef.current?.present(), 100);
          return;
        }

        const anchorQuestion = lesson.reflectionQuestions?.[0]?.question ?? "";
        const focusTag = lesson.reflectionQuestions?.[0]?.focus ?? "Autoconhecimento";

        navigation.navigate("LessonForum", {
          courseId: lesson.courseId,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          anchorQuestion,
          focusTag,
        });
      } catch (_e) {
        setMessageConfig({
          type: "error",
          title: "Notificações",
          message: "Não foi possível abrir esta notificação agora.",
        });
        setTimeout(() => bottomSheetRef.current?.present(), 100);
      }
    },
    [isGuest, markRead, navigation, user?.uid]
  );

  const handleMarkAll = useCallback(async () => {
    if (isGuest) return;
    if (!user?.uid) return;

    try {
      await markAllRead();
    } catch (_e) {
      setMessageConfig({
        type: "error",
        title: "Notificações",
        message: "Não foi possível marcar todas como lidas agora.",
      });
      setTimeout(() => bottomSheetRef.current?.present(), 100);
    }
  }, [isGuest, markAllRead, user?.uid]);

  const emptyLabel = isGuest
    ? "Crie uma conta para receber notificações."
    : "Nenhuma notificação por aqui.";

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      edges={["top"]}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            accessibilityLabel="Voltar"
          >
            <ArrowLeft size={20} color={theme.colors.primary} />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.title}>Notificações</Text>
            <Text style={styles.subtitle}>Suas notificações e avisos</Text>
          </View>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleMarkAll}
            activeOpacity={0.7}
            disabled={isMarkingAll || isGuest}
            accessibilityLabel="Marcar todas como lidas"
          >
            {isMarkingAll ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <CheckCheck size={20} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : isError ? (
          <View style={styles.center}>
            <Text style={styles.emptyText}>Não foi possível carregar agora.</Text>
            {!!error && __DEV__ && (
              <Text style={[styles.emptyText, { marginTop: theme.spacing.sm }]} selectable>
                {String((error as any)?.message ?? error)}
              </Text>
            )}
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => refetch()}
              activeOpacity={0.7}
            >
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            contentContainerStyle={items.length === 0 ? styles.emptyList : styles.list}
            showsVerticalScrollIndicator={false}
            refreshing={false}
            onRefresh={() => refetch()}
            ListEmptyComponent={<Text style={styles.emptyText}>{emptyLabel}</Text>}
            renderItem={({ item }) => {
              const isUnread = !item.readAt;
              const IconComponent =
                item.type === "admin_broadcast"
                  ? Megaphone
                  : item.type === "forum_reaction_received"
                  ? getReactionIcon(item.reactionType)
                  : MessageSquare;

              const iconColor = theme.colors.primary;

              return (
                <TouchableOpacity
                  style={[styles.row, !isUnread && styles.rowRead]}
                  onPress={() => handleOpenItem(item)}
                  activeOpacity={0.7}
                  disabled={isGuest}
                >
                  {isUnread && <View style={styles.unreadDot} />}

                  <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
                    <IconComponent size={20} color={iconColor} strokeWidth={2.2} />
                  </View>

                  <View style={styles.contentWrap}>
                    <View style={styles.rowTop}>
                      <Text style={styles.rowTitle}>{getTitle(item)}</Text>
                      <Text style={styles.rowWhen}>{formatWhen(item.createdAt)}</Text>
                    </View>
                    {renderItemText(item, styles)}
                  </View>
                </TouchableOpacity>
              );
            }}
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
          />
        )}

        <BottomSheetMessage ref={bottomSheetRef} config={messageConfig} />
      </View>
    </SafeAreaView>
  );
}
