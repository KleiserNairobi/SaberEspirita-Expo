import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Send } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets.bottom);
  const [text, setText] = useState("");

  function handleSend() {
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText("");
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite sua mensagem..."
        placeholderTextColor={theme.colors.muted}
        value={text}
        onChangeText={setText}
        multiline
        maxLength={500}
        editable={!disabled}
        onSubmitEditing={handleSend}
      />

      <TouchableOpacity
        style={[styles.sendButton, disabled && styles.sendButtonDisabled]}
        onPress={handleSend}
        disabled={disabled || !text.trim()}
        activeOpacity={0.7}
      >
        <Send size={20} color={disabled || !text.trim() ? theme.colors.muted : "#fff"} />
      </TouchableOpacity>
    </View>
  );
}
