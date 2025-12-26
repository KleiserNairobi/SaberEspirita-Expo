import { createContext, useContext } from "react";
import { ViewStyle } from "react-native";

export interface InputContextProps {
  required: boolean;
  error: string | undefined;
  //   maskType: "cpf" | "cnpj" | "date" | undefined;
  iconPosition: "left" | "right";
  placeholder: string | undefined;
  value: string;
  fieldStyle: ViewStyle;
  isFocused: boolean;
  onChangeText: (text: string) => void;
  setIsFocused: (focused: boolean) => void;
}

export const InputContext = createContext<InputContextProps | undefined>(
  undefined
);

export const useInputContext = () => {
  const context = useContext(InputContext);
  if (!context) {
    throw new Error(
      "Os componentes compostos de entrada devem ser renderizados no componente pai de entrada"
    );
  }
  return context;
};
