import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Pdf from "react-native-pdf";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, BookOpen, ZoomIn } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { AppStackParamList } from "@/routers/types";
import apiClient from "@/services/api/apiClient";
import { resolveCdnUrl } from "@/services/api/courseApiService";
import { IBooklet } from "@/types/booklet";

import { ZoomableImage } from "./components/ZoomableImage";
import { createStyles } from "./styles";

type BookletViewerRouteProp = RouteProp<AppStackParamList, "BookletViewer">;
type BookletViewerNavProp = NativeStackNavigationProp<AppStackParamList, "BookletViewer">;

function isImageUrl(url?: string): boolean {
  if (!url) return false;
  const cleanUrl = url.split("?")[0].toLowerCase();
  return (
    cleanUrl.endsWith(".png") ||
    cleanUrl.endsWith(".jpg") ||
    cleanUrl.endsWith(".jpeg") ||
    cleanUrl.endsWith(".webp") ||
    cleanUrl.endsWith(".gif") ||
    cleanUrl.endsWith(".svg")
  );
}

export function BookletViewerScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<BookletViewerNavProp>();
  const route = useRoute<BookletViewerRouteProp>();

  const { id, fileUrl: initialFileUrl, title: initialTitle } = route.params || {};

  const [booklet, setBooklet] = useState<IBooklet | null>(() => {
    if (initialFileUrl) {
      return {
        id: id || "booklet",
        title: initialTitle || "Guia Digital",
        fileUrl: resolveCdnUrl(initialFileUrl) || initialFileUrl,
      };
    }
    return null;
  });

  const [isLoadingMetadata, setIsLoadingMetadata] = useState<boolean>(!initialFileUrl);
  const [isFileLoading, setIsFileLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBooklet() {
      if (initialFileUrl) {
        setBooklet({
          id: id || "booklet",
          title: initialTitle || "Guia Digital",
          fileUrl: resolveCdnUrl(initialFileUrl) || initialFileUrl,
        });
        setIsLoadingMetadata(false);
        return;
      }

      if (!id) {
        setError("Identificador do material não fornecido.");
        setIsLoadingMetadata(false);
        return;
      }

      try {
        setIsLoadingMetadata(true);
        setError(null);
        const res = await apiClient.get<IBooklet>(`/booklets/${id}`);
        if (res.data) {
          setBooklet({
            ...res.data,
            fileUrl: resolveCdnUrl(res.data.fileUrl) || res.data.fileUrl,
          });
        } else {
          setError("Material não encontrado.");
        }
      } catch (err) {
        console.warn("[BookletViewer] Erro ao carregar metadados do material:", err);
        setError("Não foi possível carregar as informações do documento.");
      } finally {
        setIsLoadingMetadata(false);
      }
    }

    loadBooklet();
  }, [id, initialFileUrl, initialTitle]);

  const fileUrl = booklet?.fileUrl;
  const isImage = isImageUrl(fileUrl);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Header Nativo e Seguro */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={20} color={theme.colors.primary} />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {booklet?.title || initialTitle || (isImage ? "Infográfico" : "Guia Digital")}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isImage ? "Infográfico & Mapa Visual" : "Leitura Digital Protegida"}
          </Text>
        </View>

        {isImage ? (
          <View style={styles.pageBadge}>
            <Text style={styles.pageBadgeText}>HD</Text>
          </View>
        ) : totalPages > 0 ? (
          <View style={styles.pageBadge}>
            <Text style={styles.pageBadgeText}>
              {currentPage}/{totalPages}
            </Text>
          </View>
        ) : (
          <View style={styles.headerRightPlaceholder} />
        )}
      </View>

      {/* Conteúdo Principal */}
      <View style={isImage ? styles.imageContainer : styles.pdfContainer}>
        {isLoadingMetadata && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Carregando material...</Text>
          </View>
        )}

        {error && !isLoadingMetadata && (
          <View style={styles.errorContainer}>
            <BookOpen size={48} color={theme.colors.error} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                setError(null);
                setIsFileLoading(true);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        )}

        {fileUrl && !error && (
          <>
            {isImage ? (
              <>
                <ZoomableImage
                  uri={fileUrl}
                  onLoadEnd={() => setIsFileLoading(false)}
                  onError={() => {
                    setError("Erro ao carregar a imagem do infográfico.");
                    setIsFileLoading(false);
                  }}
                />

                {/* Dica de UX para Gestos */}
                {!isFileLoading && (
                  <View style={styles.hintContainer} pointerEvents="none">
                    <ZoomIn size={14} color={theme.colors.primary} />
                    <Text style={styles.hintText}>
                      Toque 2x ou use pinça para ampliar
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <Pdf
                source={{ uri: fileUrl, cache: true }}
                onLoadComplete={(numberOfPages) => {
                  setTotalPages(numberOfPages);
                  setIsFileLoading(false);
                }}
                onPageChanged={(page) => {
                  setCurrentPage(page);
                }}
                onError={(err) => {
                  console.warn("[BookletViewer] Erro ao renderizar PDF:", err);
                  setError("Erro ao renderizar o arquivo PDF.");
                  setIsFileLoading(false);
                }}
                style={styles.pdf}
                enablePaging={false}
                trustAllCerts={false}
              />
            )}

            {isFileLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>
                  {isImage ? "Carregando infográfico..." : "Carregando páginas..."}
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

export default BookletViewerScreen;

