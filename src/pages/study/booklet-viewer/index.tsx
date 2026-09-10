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
import { ArrowLeft, BookOpen, RotateCcw } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { AppStackParamList } from "@/routers/types";
import apiClient from "@/services/api/apiClient";
import { resolveCdnUrl } from "@/services/api/courseApiService";
import { IBooklet } from "@/types/booklet";

import { createStyles } from "./styles";

type BookletViewerRouteProp = RouteProp<AppStackParamList, "BookletViewer">;
type BookletViewerNavProp = NativeStackNavigationProp<AppStackParamList, "BookletViewer">;

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
        title: initialTitle || "Apostila Digital",
        fileUrl: resolveCdnUrl(initialFileUrl) || initialFileUrl,
      };
    }
    return null;
  });

  const [isLoadingMetadata, setIsLoadingMetadata] = useState<boolean>(!initialFileUrl);
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBooklet() {
      if (initialFileUrl) {
        setBooklet({
          id: id || "booklet",
          title: initialTitle || "Apostila Digital",
          fileUrl: resolveCdnUrl(initialFileUrl) || initialFileUrl,
        });
        setIsLoadingMetadata(false);
        return;
      }

      if (!id) {
        setError("Identificador da apostila não fornecido.");
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
          setError("Apostila não encontrada.");
        }
      } catch (err) {
        console.warn("[BookletViewer] Erro ao carregar metadados da apostila:", err);
        setError("Não foi possível carregar as informações do documento.");
      } finally {
        setIsLoadingMetadata(false);
      }
    }

    loadBooklet();
  }, [id, initialFileUrl, initialTitle]);

  const pdfUrl = booklet?.fileUrl;

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
            {booklet?.title || initialTitle || "Apostila Digital"}
          </Text>
          <Text style={styles.headerSubtitle}>Leitura In-App Protegida</Text>
        </View>

        {totalPages > 0 ? (
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
      <View style={styles.pdfContainer}>
        {isLoadingMetadata && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Carregando documento...</Text>
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
                setIsPdfLoading(true);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        )}

        {pdfUrl && !error && (
          <>
            <Pdf
              source={{ uri: pdfUrl, cache: true }}
              onLoadComplete={(numberOfPages) => {
                setTotalPages(numberOfPages);
                setIsPdfLoading(false);
              }}
              onPageChanged={(page) => {
                setCurrentPage(page);
              }}
              onError={(err) => {
                console.warn("[BookletViewer] Erro ao renderizar PDF:", err);
                setError("Erro ao renderizar o arquivo PDF.");
                setIsPdfLoading(false);
              }}
              style={styles.pdf}
              enablePaging={false}
              trustAllCerts={false}
            />

            {isPdfLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Carregando páginas...</Text>
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

export default BookletViewerScreen;
