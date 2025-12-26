import React from "react";
import { Text, TextStyle } from "react-native";
import { useInputContext } from "./InputContext";
import { styles } from "./styles";

interface ErrorProps {
  style?: TextStyle;
}

export const InputError = ({ style }: ErrorProps) => {
  const { error } = useInputContext();

  if (!error) {
    return null;
  }

  return <Text style={[styles.errorText, style]}>{error}</Text>;
};
