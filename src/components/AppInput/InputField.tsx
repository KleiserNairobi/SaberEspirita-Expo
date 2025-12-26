import React from "react";
import { TextInput, TextInputProps, View } from "react-native";
// import { MaskService } from "react-native-masked-text";
import { useInputContext } from "./InputContext";
import { styles } from "./styles";

// Helper function to apply mask
// const applyMask = (text: string, type: "cpf" | "cnpj" | "date"): string => {
//   let mask = "";
//   let typeMask = "";
//   switch (type) {
//     case "cpf":
//       mask = "999.999.999-99";
//       typeMask = "cpf";
//       break;
//     case "cnpj":
//       mask = "99.999.999/9999-99";
//       typeMask = "cnpj";
//       break;
//     case "date":
//       mask = "99/99/9999";
//       typeMask = "datetime";
//       break;
//     default:
//       return text;
//   }

// Using MaskService to apply the mask
//   return MaskService.toMask(typeMask, text, {
//     format: mask,
//   });
// };

interface FieldProps
  extends Omit<TextInputProps, "value" | "onChangeText" | "placeholder"> {
  // We omit value, onChangeText, and placeholder because they come from context
}

export const InputField = (props: FieldProps) => {
  const {
    value,
    onChangeText,
    placeholder,
    error,
    fieldStyle,
    isFocused,
    setIsFocused,
    // maskType,
    iconPosition,
  } = useInputContext();

  const handleTextChange = (text: string) => {
    // if (maskType) {
    //   const maskedText = applyMask(text, maskType);
    //   onChangeText(maskedText);
    // } else {
    onChangeText(text);
    // }
  };

  const inputStyle = [styles.input];

  // Remove children from props to avoid passing them to TextInput
  const { children, ...textInputProps } = props;

  // Apply icon styles to children if they exist
  const iconChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const childElement = child as React.ReactElement<{ style?: any }>;
      return React.cloneElement(childElement, {
        style: [
          childElement.props.style,
          iconPosition === "left" ? styles.iconLeft : styles.iconRight,
        ],
      });
    }
    return child;
  });

  return (
    <View
      style={[
        fieldStyle,
        error ? styles.fieldContainerError : undefined,
        isFocused ? styles.fieldContainerFocused : undefined,
      ]}
    >
      {iconPosition === "left" && iconChildren}
      <TextInput
        {...textInputProps}
        style={inputStyle}
        value={value}
        onChangeText={handleTextChange}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        // Ensure keyboard type is appropriate for masked inputs
        keyboardType={props.keyboardType || "default"}
        // keyboardType={maskType ? "numeric" : props.keyboardType || "default"}
      />
      {iconPosition === "right" && iconChildren}
    </View>
  );
};
