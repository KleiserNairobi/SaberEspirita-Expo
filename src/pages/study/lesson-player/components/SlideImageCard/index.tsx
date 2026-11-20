import React, { useEffect, useState } from "react";

import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from "react-native";

import { Image, ImageLoadEventData } from "expo-image";
import { ImageOff, Maximize2, X, ZoomIn } from "lucide-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ZoomableImage } from "@/components/ZoomableImage";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { ISlideImage } from "@/types/course";

import { createStyles } from "./styles";

interface SlideImageCardProps {
  image?: ISlideImage;
}

export function SlideImageCard({ image }: SlideImageCardProps) {
  const { theme } = useAppTheme();
  const { isCompact } = useResponsiveLayout();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);

  const imageUrl = image?.url?.trim();

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [naturalAspectRatio, setNaturalAspectRatio] = useState<number | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setNaturalAspectRatio(null);
    setIsLightboxOpen(false);
  }, [imageUrl]);

  if (!imageUrl) {
    return null;
  }

  const fallbackAspectRatio =
    typeof image?.aspectRatio === "number" && image.aspectRatio > 0
      ? image.aspectRatio
      : 0.75;
  const resolvedAspectRatio = naturalAspectRatio ?? fallbackAspectRatio;
  const isPortrait = resolvedAspectRatio < 1;

  const caption = image?.caption?.trim();
  const accessibleDescription = image?.alt || caption || "Imagem ilustrativa do slide";

  const handleLoad = (event: ImageLoadEventData) => {
    setIsLoading(false);
    setHasError(false);
    if (event.source.width > 0 && event.source.height > 0) {
      setNaturalAspectRatio(event.source.width / event.source.height);
    }
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    setRetryKey((prev) => prev + 1);
  };

  const showFooter = Boolean(caption) || !hasError;

  return (
    <>
      <View style={[styles.card, !isCompact && isPortrait && styles.cardPortraitTablet]}>
        <TouchableOpacity
          style={[styles.imageFrame, { aspectRatio: resolvedAspectRatio }]}
          activeOpacity={0.92}
          disabled={hasError}
          onPress={() => setIsLightboxOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={image?.alt || caption || "Ampliar imagem do slide"}
        >
          <Image
            key={`${imageUrl}-${retryKey}`}
            source={{ uri: imageUrl }}
            style={styles.image}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
            accessibilityLabel={accessibleDescription}
            onLoad={handleLoad}
            onError={handleError}
          />

          {isLoading && !hasError && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
          )}

          {hasError && (
            <View style={styles.errorContainer}>
              <ImageOff size={24} color={theme.colors.muted} />
              <Text style={styles.errorText}>Não foi possível carregar a imagem</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleRetry}
                activeOpacity={0.75}
              >
                <Text style={styles.retryButtonText}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>

        {showFooter && (
          <View style={styles.footerContainer}>
            {Boolean(caption) && <Text style={styles.captionText}>{caption}</Text>}

            {!hasError && (
              <TouchableOpacity
                style={styles.expandAction}
                onPress={() => setIsLightboxOpen(true)}
                activeOpacity={0.75}
                hitSlop={{ top: 8, bottom: 8, left: 12, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel="Toque para ampliar a imagem"
              >
                <Maximize2 size={13} color={theme.colors.primary} />
                <Text style={styles.expandActionText}>Toque para ampliar</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <Modal
        visible={isLightboxOpen}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setIsLightboxOpen(false)}
      >
        <GestureHandlerRootView style={styles.lightboxRoot}>
          <View
            style={[styles.lightboxHeader, { paddingTop: insets.top + theme.spacing.sm }]}
          >
            <TouchableOpacity
              style={styles.lightboxCloseButton}
              onPress={() => setIsLightboxOpen(false)}
              activeOpacity={0.75}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityRole="button"
              accessibilityLabel="Fechar visualização ampliada"
            >
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.lightboxBody}>
            <ZoomableImage uri={imageUrl} accessibilityLabel={accessibleDescription} />
          </View>

          <View
            style={[
              styles.lightboxFooter,
              { paddingBottom: insets.bottom + theme.spacing.md },
            ]}
          >
            {Boolean(caption) && <Text style={styles.lightboxCaption}>{caption}</Text>}
            <View style={styles.lightboxHintRow}>
              <ZoomIn size={14} color="rgba(255, 255, 255, 0.72)" />
              <Text style={styles.lightboxHintText}>
                Toque 2x ou use pinça para ampliar
              </Text>
            </View>
          </View>
        </GestureHandlerRootView>
      </Modal>
    </>
  );
}
