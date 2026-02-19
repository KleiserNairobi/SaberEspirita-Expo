import React, { useRef, useEffect } from "react";
import { View, FlatList, Text, Platform, KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { BookOpen } from "lucide-react-native";
import { useRoute, RouteProp } from "@react-navigation/native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useDeepSeekChat } from "@/hooks/useDeepSeekChat";
import { ChatType } from "@/services/prompt";
import { Message } from "@/types/chat";
import { AppStackParamList } from "@/routers/types";

import { ChatHeader } from "../components/ChatHeader";
import { MessageBubble } from "../components/MessageBubble";
import { ChatInput } from "../components/ChatInput";
import { TypingIndicator } from "../components/TypingIndicator";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { createStyles } from "../components/styles";

import { useChatLimits, useIncrementChatUsage } from "@/hooks/queries/useChatLimits";
import { ChatLimitIndicator } from "@/components/ChatLimitIndicator";
import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";
import { useAuth } from "@/stores/authStore";
import { logScientificChat } from "@/services/firebase/chatAnalyticsService";

type RouteParams = RouteProp<AppStackParamList, "ScientificChat">;

export function ScientificChatScreen() {
  const { user } = useAuth();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const flatListRef = useRef<FlatList>(null);
  const route = useRoute<RouteParams>();

  const { initialMessage } = route.params || {};

  const { messages, isLoading, error, sendMessage, clearChat } = useDeepSeekChat(
    ChatType.SCIENTIFIC
  );

  // Importações adicionais
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
  const [bottomSheetConfig, setBottomSheetConfig] =
    React.useState<BottomSheetMessageConfig | null>(null);

  const { data: limits } = useChatLimits("scientific");
  const incrementUsage = useIncrementChatUsage();

  async function handleSendMessage(text: string) {
    if (!text.trim()) return;

    // 1. Verificar limites antes de enviar
    if (limits && !limits.canSend) {
      setBottomSheetConfig({
        type: "info",
        title: "Limite diário atingido",
        message: `${limits.reason || "Limite atingido"}\n\nEnquanto isso, que tal explorar nossos cursos ou fazer uma leitura edificante?`,
        primaryButton: {
          label: "Entendi",
          onPress: () => bottomSheetModalRef.current?.dismiss(),
        },
      });
      bottomSheetModalRef.current?.present();
      return;
    }

    // 2. Enviar mensagem
    await sendMessage(text);

    // 3. Incrementar uso
    incrementUsage.mutate("scientific");

    // 4. Log Analytics
    logScientificChat(user?.uid || "guest", text.length);
  }

  // Envia mensagem inicial se fornecida
  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      // Pequeno delay para garantir que os limites foram carregados
      setTimeout(() => {
        handleSendMessage(initialMessage);
      }, 500);
    }
  }, [initialMessage]); // Removido messages.length do dep array para evitar loop, embora a lógica interna proteja

  // Auto-scroll para última mensagem
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  function renderMessage({ item }: { item: Message }) {
    return <MessageBubble message={item} />;
  }

  function renderEmpty() {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📚</Text>
        <Text style={styles.emptyTitle}>Bem-vindo, estudante</Text>
        <Text style={styles.emptyText}>
          Estou aqui para esclarecer suas dúvidas {"\n"}doutrinárias sobre o Espiritismo.
          {"\n"}Como posso ajudá-lo?
        </Text>
      </View>
    );
  }

  function renderFooter() {
    if (!isLoading) return null;

    // Verifica se a última mensagem é do assistente e está vazia (ainda não começou o streaming)
    const lastMessage = messages[messages.length - 1];
    const shouldShowTyping =
      !lastMessage || lastMessage.isUser || lastMessage.text === "";

    if (!shouldShowTyping) return null;

    return (
      <View
        style={[
          styles.container,
          {
            flexDirection: "row",
            marginVertical: 8,
            marginHorizontal: 16,
            alignItems: "flex-start",
          },
        ]}
      >
        {/* Avatar do Sr. Allan */}
        <View style={styles.typingAvatar}>
          <BookOpen size={18} color={theme.colors.primary} strokeWidth={2} />
        </View>

        {/* Balão com indicador de digitação */}
        <View style={styles.typingBubble}>
          <TypingIndicator />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {/* Header */}
        <ChatHeader
          title="Pergunte ao Sr. Allan"
          subtitle="Esclarecimentos doutrinários"
          onClear={messages.length > 0 ? clearChat : undefined}
        />

        {/* Indicador de Limites */}
        {limits && limits.canSend && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
            <ChatLimitIndicator
              remainingToday={limits.remainingToday || 0}
              remainingMonth={limits.remainingMonth || 0}
            />
          </View>
        )}

        {/* Lista de mensagens */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        />

        {/* Mensagem de erro */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Input */}
        <ChatInput
          onSend={handleSendMessage}
          disabled={isLoading}
          placeholder="Faça sua pergunta..."
        />

        {/* Modal de Limite Atingido (BottomSheet) */}
        <BottomSheetMessage ref={bottomSheetModalRef} config={bottomSheetConfig} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
