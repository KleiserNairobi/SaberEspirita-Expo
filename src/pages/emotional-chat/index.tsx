import React, { useRef, useEffect } from "react";
import { View, FlatList, Text, Platform, KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Compass } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useDeepSeekChat } from "@/hooks/useDeepSeekChat";
import { ChatType } from "@/services/prompt";
import { Message } from "@/types/chat";

import { ChatHeader } from "./components/ChatHeader";
import { MessageBubble } from "./components/MessageBubble";
import { ChatInput } from "./components/ChatInput";
import { TypingIndicator } from "./components/TypingIndicator";
import { createStyles } from "./styles";

export default function EmotionalChatScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const flatListRef = useRef<FlatList>(null);

  const { messages, isLoading, error, sendMessage, clearChat } = useDeepSeekChat(
    ChatType.EMOTIONAL
  );

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
        <Text style={styles.emptyIcon}>🕊️</Text>
        <Text style={styles.emptyTitle}>Bem-vindo ao Guia</Text>
        <Text style={styles.emptyText}>
          Estou aqui para oferecer apoio emocional e {"\n"}consolo espiritual. Como posso
          ajudar seu coração hoje?
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
        {/* Avatar do Guia */}
        <View style={styles.typingAvatar}>
          <Compass size={18} color={theme.colors.primary} strokeWidth={2} />
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
          title="Conversando com o Guia"
          subtitle="Apoio emocional e consolo"
          onClear={messages.length > 0 ? clearChat : undefined}
        />

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
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
