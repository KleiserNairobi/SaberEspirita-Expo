import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
  Edit3,
  MessageSquare,
  MessagesSquare,
  Plus,
  Trash2,
  X,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useChatHistory } from "@/hooks/useChatHistory";
import {
  ChatConversationDetail,
  ChatConversationSummary,
  ChatType,
} from "@/types/chat";

import { createStyles } from "./styles";

export interface ChatHistoryBottomSheetProps {
  chatType: ChatType | "emotional" | "scientific";
  currentConversationId?: string | null;
  onSelectConversation: (detail: ChatConversationDetail) => void;
  onNewChat: () => void;
}

export const ChatHistoryBottomSheet = forwardRef<
  BottomSheetModal,
  ChatHistoryBottomSheetProps
>(function ChatHistoryBottomSheet(
  {
    chatType,
    currentConversationId,
    onSelectConversation,
    onNewChat,
  },
  ref
) {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);

  const internalModalRef = useRef<BottomSheetModal>(null);
  const messageModalRef = useRef<BottomSheetModal>(null);
  const [messageConfig, setMessageConfig] = useState<BottomSheetMessageConfig | null>(null);

  useImperativeHandle(ref, () => internalModalRef.current as BottomSheetModal);

  const {
    conversations,
    groupedConversations,
    loading,
    hasFetched,
    fetchConversations,
    loadConversation,
    renameConversation,
    deleteConversation,
  } = useChatHistory(chatType);

  const [renamingItem, setRenamingItem] = useState<ChatConversationSummary | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [isRenamingLoading, setIsRenamingLoading] = useState(false);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index >= 0) {
        fetchConversations();
      }
    },
    [fetchConversations]
  );

  const handleSelect = async (item: ChatConversationSummary) => {
    const detail = await loadConversation(item.id);
    if (detail) {
      onSelectConversation(detail);
      internalModalRef.current?.dismiss();
    } else {
      setMessageConfig({
        type: "error",
        title: "Erro ao Carregar",
        message: "Não foi possível carregar as mensagens desta conversa. Verifique sua conexão e tente novamente.",
        primaryButton: {
          label: "Entendi",
          onPress: () => messageModalRef.current?.dismiss(),
        },
      });
      messageModalRef.current?.present();
    }
  };

  const handleStartNewChat = () => {
    onNewChat();
    internalModalRef.current?.dismiss();
  };

  const handleOpenRename = (item: ChatConversationSummary) => {
    setRenamingItem(item);
    setNewTitle(item.title);
  };

  const handleConfirmRename = async () => {
    if (!renamingItem || !newTitle.trim()) return;
    setIsRenamingLoading(true);
    const success = await renameConversation(renamingItem.id, newTitle.trim());
    setIsRenamingLoading(false);
    if (success) {
      setRenamingItem(null);
      setNewTitle("");
    } else {
      setMessageConfig({
        type: "error",
        title: "Erro ao Renomear",
        message: "Não foi possível atualizar o título da conversa. Tente novamente.",
        primaryButton: {
          label: "Entendi",
          onPress: () => messageModalRef.current?.dismiss(),
        },
      });
      messageModalRef.current?.present();
    }
  };

  const handleDelete = (item: ChatConversationSummary) => {
    setMessageConfig({
      type: "question",
      title: "Excluir Conversa",
      message: `Deseja realmente remover o histórico "${item.title}"?\n\nEsta ação não poderá ser desfeita.`,
      secondaryButton: {
        label: "Cancelar",
        onPress: () => messageModalRef.current?.dismiss(),
      },
      primaryButton: {
        label: "Excluir",
        onPress: async () => {
          messageModalRef.current?.dismiss();
          await deleteConversation(item.id);
        },
      },
    });
    messageModalRef.current?.present();
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      const hours = d.getHours().toString().padStart(2, "0");
      const mins = d.getMinutes().toString().padStart(2, "0");
      const day = d.getDate().toString().padStart(2, "0");
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      return `${day}/${month} às ${hours}:${mins}`;
    } catch {
      return "";
    }
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={internalModalRef}
      snapPoints={["80%"]}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: theme.colors.card }}
      handleIndicatorStyle={{ backgroundColor: theme.colors.border }}
    >
      <BottomSheetView
        style={[styles.container, { paddingBottom: Math.max(insets.bottom, 16) }]}
      >
        {/* Cabeçalho com Botão Fechar à Esquerda */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => internalModalRef.current?.dismiss()}
            activeOpacity={0.7}
          >
            <X size={18} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Histórico de Conversas</Text>
        </View>

        {/* Botão de Iniciar Nova Conversa */}
        <TouchableOpacity
          style={styles.newChatButton}
          onPress={handleStartNewChat}
          activeOpacity={0.7}
        >
          <Plus
            size={20}
            color={theme.colors.primary}
            style={styles.newChatButtonIcon}
          />
          <Text style={styles.newChatButtonText}>Iniciar Nova Conversa</Text>
        </TouchableOpacity>

        {/* Conteúdo Principal */}
        {loading || !hasFetched ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
          </View>
        ) : conversations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <MessagesSquare
                size={40}
                color={theme.colors.muted}
                strokeWidth={1.5}
              />
            </View>
            <Text style={styles.emptyTitle}>Nenhuma conversa salva</Text>
            <Text style={styles.emptyText}>
              Suas conversas e estudos com o assistente ficarão salvos aqui para você
              revisitar quando quiser.
            </Text>
          </View>
        ) : (
          <BottomSheetScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {groupedConversations.map((group) => (
              <View key={group.title}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionHeaderText}>{group.title}</Text>
                </View>

                {group.data.map((item) => {
                  const isActive = currentConversationId === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.conversationCard,
                        isActive && styles.conversationCardActive,
                      ]}
                      onPress={() => handleSelect(item)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.cardIconContainer}>
                        <MessageSquare size={16} color={theme.colors.primary} />
                      </View>

                      <View style={styles.cardContent}>
                        <Text style={styles.cardTitle} numberOfLines={1}>
                          {item.title}
                        </Text>
                        <View style={styles.cardMetaRow}>
                          <Text style={styles.cardDate}>
                            {formatDate(item.updatedAt || item.createdAt)}
                          </Text>
                          {item.messageCount > 0 && (
                            <Text style={styles.cardMessageBadge}>
                              {item.messageCount}{" "}
                              {item.messageCount === 1 ? "mensagem" : "mensagens"}
                            </Text>
                          )}
                        </View>
                      </View>

                      <View style={styles.cardActions}>
                        <TouchableOpacity
                          style={styles.cardActionButton}
                          onPress={() => handleOpenRename(item)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <Edit3 size={15} color={theme.colors.textSecondary} />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.cardActionButton}
                          onPress={() => handleDelete(item)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <Trash2 size={15} color={theme.colors.error || "#E53935"} />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </BottomSheetScrollView>
        )}

        {/* Modal de Renomeação Flat */}
        {renamingItem && (
          <View style={styles.renameModalOverlay}>
            <View style={styles.renameModalCard}>
              <Text style={styles.renameModalTitle}>Renomear Conversa</Text>
              <Text style={styles.renameModalSubtitle}>
                Dê um título personalizado para identificar seu estudo.
              </Text>

              <TextInput
                style={styles.renameInput}
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder="Ex: Roteiro Palestra de Domingo"
                placeholderTextColor={theme.colors.muted}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleConfirmRename}
              />

              <View style={styles.renameActionsRow}>
                <View style={{ flex: 1 }}>
                  <Button
                    title="Cancelar"
                    variant="outline"
                    onPress={() => setRenamingItem(null)}
                    disabled={isRenamingLoading}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Button
                    title="Salvar"
                    onPress={handleConfirmRename}
                    loading={isRenamingLoading}
                    disabled={!newTitle.trim()}
                  />
                </View>
              </View>
            </View>
          </View>
        )}
        {/* Modal de Confirmação e Mensagens (BottomSheetMessage) */}
        <BottomSheetMessage ref={messageModalRef} config={messageConfig} />
      </BottomSheetView>
    </BottomSheetModal>
  );
});
