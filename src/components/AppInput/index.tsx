import React, { useState } from "react";
import { View, ViewStyle } from "react-native";
import { InputContext, InputContextProps } from "./InputContext";
import { InputError } from "./InputError";
import { InputField } from "./InputField";
import { InputIcon } from "./InputIcon";
import { InputLabel } from "./InputLabel";
import { styles } from "./styles";

interface InputProps {
  children: React.ReactNode;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  required?: boolean;
  //   maskType?: 'cpf' | 'cnpj' | 'date';
  iconPosition?: "left" | "right";
  placeholder?: string;
  style?: ViewStyle;
  fieldStyle?: ViewStyle; // Style for the internal field container
}

const AppInput = ({
  children,
  value,
  onChangeText,
  error,
  required = false,
  //   maskType,
  iconPosition = "left",
  placeholder,
  style,
  fieldStyle,
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const contextValue: InputContextProps = {
    required,
    error,
    // maskType,
    iconPosition,
    placeholder,
    value,
    onChangeText,
    fieldStyle: fieldStyle || styles.fieldContainer,
    isFocused,
    setIsFocused,
  };

  return (
    <InputContext.Provider value={contextValue}>
      <View style={[styles.container, style]}>{children}</View>
    </InputContext.Provider>
  );
};

// --- Component Composition ---
AppInput.Label = InputLabel;
AppInput.Field = InputField;
AppInput.Error = InputError;
AppInput.Icon = InputIcon;

export default AppInput;
