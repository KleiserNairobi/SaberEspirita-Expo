import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";

interface FilledTextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  containerStyle?: ViewStyle;
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  secureTextEntry?: boolean;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "number-pad"
    | "decimal-pad"
    | "visible-password"
    | "ascii-capable"
    | "numbers-and-punctuation"
    | "url"
    | "name-phone-pad"
    | "twitter"
    | "web-search";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  autoComplete?:
    | "off"
    | "username"
    | "password"
    | "email"
    | "name"
    | "tel"
    | "street-address"
    | "postal-code"
    | "cc-number"
    | "cc-csc"
    | "cc-exp"
    | "cc-exp-month"
    | "cc-exp-year"
    | "one-time-code";
  placeholder?: string;
  placeholderTextColor?: string;
  editable?: boolean;
}

export const FilledTextInput = forwardRef<TextInput, FilledTextInputProps>(
  (
    {
      label,
      value,
      onChangeText,
      style,
      inputStyle,
      containerStyle,
      error,
      disabled,
      onFocus: onFocusProp,
      onBlur: onBlurProp,
      multiline = false,
      secureTextEntry = false,
      ...rest
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
    const focusAnim = useRef(new Animated.Value(0)).current;
    const inputRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => inputRef.current as TextInput);

    useEffect(() => {
      const toValue = focused || !!value ? 1 : 0;
      Animated.timing(labelAnim, {
        toValue,
        duration: 160,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();

      Animated.timing(focusAnim, {
        toValue: focused ? 1 : 0,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();
    }, [focused, value, labelAnim, focusAnim]);

    function handleFocus(e: any) {
      setFocused(true);
      onFocusProp && onFocusProp(e);
    }

    function handleBlur(e: any) {
      setFocused(false);
      onBlurProp && onBlurProp(e);
    }

    function handlePress() {
      inputRef.current?.focus();
    }

    const labelTranslateY = labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [14, -8],
    });

    const labelScale = labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.85],
    });

    const backgroundColor = focusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["rgba(0,0,0,0.06)", "rgba(25,118,210,0.06)"],
    });

    const underlineScale = focusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    const underlineColor = error ? "rgb(211,47,47)" : "rgb(25,118,210)";

    return (
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={[styles.wrapper, containerStyle]}>
          <Animated.View
            style={[
              styles.filledBox,
              { backgroundColor },
              disabled && styles.disabled,
              error && styles.errorBox,
              style,
            ]}
          >
            <Animated.Text
              numberOfLines={1}
              style={[
                styles.label,
                {
                  transform: [{ translateY: labelTranslateY }, { scale: labelScale }],
                  color: focused
                    ? "rgb(25,118,210)"
                    : value
                      ? "rgb(81,81,81)"
                      : "rgb(117,117,117)",
                  opacity: labelAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1],
                  }),
                },
              ]}
              pointerEvents="none"
            >
              {label}
            </Animated.Text>

            <TextInput
              ref={inputRef}
              style={[
                styles.input,
                multiline && styles.inputMultiline,
                inputStyle,
                disabled && styles.inputDisabled,
              ]}
              value={value}
              onChangeText={onChangeText}
              editable={!disabled}
              onFocus={handleFocus}
              onBlur={handleBlur}
              multiline={multiline}
              secureTextEntry={secureTextEntry}
              underlineColorAndroid="transparent"
              placeholder={focused || value ? "" : label}
              placeholderTextColor="rgba(0,0,0,0.3)"
              {...rest}
            />
          </Animated.View>

          <View style={styles.underlineContainer}>
            <View style={styles.underlineBase} />
            <Animated.View
              style={[
                styles.underlineActive,
                {
                  backgroundColor: underlineColor,
                  transform: [{ scaleX: underlineScale }],
                  opacity: error ? 1 : underlineScale,
                },
              ]}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      </TouchableWithoutFeedback>
    );
  }
);

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginVertical: 10,
  },
  filledBox: {
    // height: 60,
    position: "relative",

    borderRadius: 4,
    paddingHorizontal: 14,
    paddingTop: 24,
    paddingBottom: 5,
    borderWidth: Platform.OS === "android" ? 0 : 0,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.02,
        shadowRadius: 1,
        shadowOffset: { width: 0, height: 1 },
      },
    }),
  },
  label: {
    position: "absolute",
    // left: 12,
    fontSize: 16,
    backgroundColor: "transparent",
    paddingTop: 10,
    paddingHorizontal: 14,
  },
  input: {
    fontSize: 16,
    padding: 0,
    margin: 0,
    color: "#111",
    minHeight: 20,
  },
  inputMultiline: {
    minHeight: 60,
    paddingTop: 6,
  },
  inputDisabled: {
    color: "rgba(0,0,0,0.38)",
  },
  underlineContainer: {
    height: 2,
    // marginTop: 6,
    overflow: "hidden",
  },
  underlineBase: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.12)",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  underlineActive: {
    height: 2,
    width: "100%",
    transformOrigin: "center",
    bottom: 0,
  },
  errorText: {
    marginTop: 6,
    color: "rgb(211,47,47)",
    fontSize: 12,
  },
  disabled: {
    opacity: 0.7,
  },
  errorBox: {},
});
