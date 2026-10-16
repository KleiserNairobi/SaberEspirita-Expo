import React, { forwardRef } from "react";
import { Dimensions, KeyboardAvoidingView, Platform, Text, View } from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  HelpCircle,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@/hooks/useAppTheme";
import { Button } from "@/components/Button";
import { MessageType, BottomSheetMessageConfig } from "./types";
import { createStyles } from "./styles";

interface BottomSheetMessageProps {
  config: BottomSheetMessageConfig | null;
  onDismiss?: () => void;
  children?: React.ReactNode;
}

export const BottomSheetMessage = forwardRef<BottomSheetModal, BottomSheetMessageProps>(
  ({ config, onDismiss, children }, ref) => {
    const { theme } = useAppTheme();
    const insets = useSafeAreaInsets();
    const styles = createStyles(theme);

    const getIconComponent = (type: MessageType) => {
      const iconSize = 48;
      switch (type) {
        case "success":
          return (
            <CheckCircle
              size={iconSize}
              color={theme.colors.success}
              fill={theme.colors.success}
              fillOpacity={0.2}
            />
          );
        case "error":
          return (
            <XCircle
              size={iconSize}
              color={theme.colors.error}
              fill={theme.colors.error}
              fillOpacity={0.2}
            />
          );
        case "warning":
          return (
            <AlertTriangle
              size={iconSize}
              color={theme.colors.warning}
              fill={theme.colors.warning}
              fillOpacity={0.2}
            />
          );
        case "question":
          return (
            <HelpCircle
              size={iconSize}
              color={theme.colors.primary}
              fill={theme.colors.primary}
              fillOpacity={0.2}
            />
          );
        case "info":
        default:
          return (
            <Info
              size={iconSize}
              color={theme.colors.primary}
              fill={theme.colors.primary}
              fillOpacity={0.2}
            />
          );
      }
    };

    const handlePrimaryPress = () => {
      config?.primaryButton?.onPress();
      (ref as any)?.current?.dismiss();
    };

    const handleSecondaryPress = () => {
      config?.secondaryButton?.onPress();
      (ref as any)?.current?.dismiss();
    };

    const renderBackdrop = (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    );

    return (
      <BottomSheetModal
        ref={ref}
        enableDynamicSizing={true}
        maxDynamicContentSize={
          config?.maxDynamicContentSize ?? Dimensions.get("window").height * 0.82
        }
        topInset={insets.top + 16}
        enablePanDownToClose
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
        backdropComponent={renderBackdrop}
        keyboardBlurBehavior="restore"
        onDismiss={onDismiss}
      >
        <BottomSheetScrollView
          contentContainerStyle={[
            styles.container,
            { paddingBottom: Math.max(insets.bottom, 40) + 10 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ width: "100%", alignItems: "center" }}
          >
            {config && (
              <>
                {/* Ícone */}
                <View style={styles.iconContainer}>{getIconComponent(config.type)}</View>

                {/* Título */}
                <Text style={styles.title}>{config.title}</Text>

                {/* Mensagem e View Condicional (Children) */}
                {config.message ? (
                  <View style={{ width: "100%", alignSelf: "stretch" }}>
                    <Text
                      style={[
                        styles.message,
                        {
                          textAlign: config.textAlign || "center",
                          alignSelf: "stretch",
                          width: "100%",
                        },
                      ]}
                    >
                      {config.message}
                    </Text>
                  </View>
                ) : null}

                {children && (
                  <View style={{ width: "100%", marginVertical: 8 }}>{children}</View>
                )}

                {/* Botões */}
                <View style={styles.buttonContainer}>
                  {config.secondaryButton && (
                    <Button
                      title={config.secondaryButton.label}
                      variant="outline"
                      onPress={handleSecondaryPress}
                      fullWidth
                    />
                  )}
                  {config.primaryButton && (
                    <Button
                      title={config.primaryButton.label}
                      onPress={handlePrimaryPress}
                      fullWidth
                    />
                  )}
                </View>
              </>
            )}
          </KeyboardAvoidingView>
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

BottomSheetMessage.displayName = "BottomSheetMessage";
