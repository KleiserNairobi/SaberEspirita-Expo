import React, { useState, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "@/routers/types";
import {
  Share as ShareIcon,
  Home,
  Award,
  Download,
  Cloud,
  CheckCircle,
} from "lucide-react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuthStore } from "@/stores/authStore";
import { useCourse } from "@/hooks/queries/useCourses";
import { useCourseProgress } from "@/hooks/queries/useCourseProgress";
import {
  generateCertificateLocal,
  generateCertificateCloud,
  shareCertificate,
} from "@/services/firebase/certificateService";

import { ActivityIndicator } from "react-native";
import { Button } from "@/components/Button";
import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";
import { createStyles } from "./styles";

type CertificateScreenRouteProp = RouteProp<AppStackParamList, "CourseCertificate">;
type CertificateScreenNavProp = NativeStackNavigationProp<
  AppStackParamList,
  "CourseCertificate"
>;

export function CourseCertificateScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<CertificateScreenNavProp>();
  const route = useRoute<CertificateScreenRouteProp>();
  const { courseId } = route.params;

  const { user } = useAuthStore();
  const { data: course, isLoading: isLoadingCourse } = useCourse(courseId!);
  const { data: progress, isLoading: isLoadingProgress } = useCourseProgress(courseId!);

  const [isGenerating, setIsGenerating] = useState(false);
  const [certificateUri, setCertificateUri] = useState<string | null>(null);
  const [certificateNumber, setCertificateNumber] = useState<string | null>(null);
  const [validationCode, setValidationCode] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [bottomSheetConfig, setBottomSheetConfig] =
    useState<BottomSheetMessageConfig | null>(null);

  /**
   * OPÇÃO 1: Gerar e Compartilhar (Local - Rápido)
   */
  async function handleGenerateLocal() {
    if (!user || !course || !progress) return;

    setIsGenerating(true);
    try {
      const { uri, certificateNumber: certNum } = await generateCertificateLocal(
        user.displayName || "Aluno(a)",
        user.email || "",
        course,
        progress
      );

      setCertificateUri(uri);
      setCertificateNumber(certNum);

      // Compartilhar automaticamente
      await shareCertificate(uri, course.title);

      setBottomSheetConfig({
        type: "success",
        title: "Certificado Gerado!",
        message: "Seu certificado foi gerado e compartilhado com sucesso.",
        primaryButton: {
          label: "Ok",
          onPress: () => {},
        },
      });
      setTimeout(() => {
        bottomSheetModalRef.current?.present();
      }, 100);
    } catch (error) {
      console.error("Erro ao gerar certificado local:", error);
      setBottomSheetConfig({
        type: "error",
        title: "Erro",
        message: "Não foi possível gerar o certificado. Tente novamente.",
        primaryButton: {
          label: "Ok",
          onPress: () => {},
        },
      });
      setTimeout(() => {
        bottomSheetModalRef.current?.present();
      }, 100);
    } finally {
      setIsGenerating(false);
    }
  }

  /**
   * OPÇÃO 2: Gerar e Salvar na Nuvem (com validação)
   */
  async function handleGenerateCloud() {
    if (!user || !course || !progress) return;

    setIsGenerating(true);
    try {
      const result = await generateCertificateCloud(
        user.displayName || "Aluno(a)",
        user.email || "",
        course,
        progress
      );

      setCertificateUri(result.uri);
      setCertificateNumber(result.certificateNumber);
      setValidationCode(result.validationCode);
      setPdfUrl(result.pdfUrl);

      setBottomSheetConfig({
        type: "success",
        title: "Certificado Salvo na Nuvem!",
        message:
          "Seu certificado foi gerado, salvo e está disponível para validação online.",
        primaryButton: {
          label: "Compartilhar",
          onPress: () => shareCertificate(result.uri, course.title),
        },
        secondaryButton: {
          label: "Ok",
          onPress: () => {},
        },
      });
      setTimeout(() => {
        bottomSheetModalRef.current?.present();
      }, 100);
    } catch (error) {
      console.error("Erro ao gerar certificado na nuvem:", error);
      setBottomSheetConfig({
        type: "error",
        title: "Erro",
        message:
          "Não foi possível salvar o certificado na nuvem. Verifique sua conexão e tente novamente.",
        primaryButton: {
          label: "Ok",
          onPress: () => {},
        },
      });
      setTimeout(() => {
        bottomSheetModalRef.current?.present();
      }, 100);
    } finally {
      setIsGenerating(false);
    }
  }

  /**
   * Compartilhar certificado já gerado
   */
  async function handleShare() {
    if (!certificateUri || !course) return;

    try {
      await shareCertificate(certificateUri, course.title);
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
      setBottomSheetConfig({
        type: "error",
        title: "Erro",
        message: "Não foi possível compartilhar o certificado.",
        primaryButton: {
          label: "Ok",
          onPress: () => {},
        },
      });
      setTimeout(() => {
        bottomSheetModalRef.current?.present();
      }, 100);
    }
  }

  function handleGoHome() {
    navigation.navigate("Tabs");
  }

  if (isLoadingCourse || isLoadingProgress) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!course || !progress) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Curso ou progresso não encontrado.</Text>
        <Button title="Voltar" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          {/* Ícone Central com Anéis (sem botões laterais) */}
          <View style={styles.iconRingsContainer}>
            <View style={styles.ringOuter} />
            <View style={styles.ringMiddle} />
            <View style={styles.ringInner} />
            <View style={styles.iconLargeContainer}>
              <Award size={40} color={theme.colors.background} />
            </View>
          </View>

          {/* Título e Subtítulo */}
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Certificado de Mérito</Text>
            <Text style={styles.headerSubtitle}>
              Crescimento espiritual através do estudo
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{course.title}</Text>
          <Text style={styles.infoText}>
            Você concluiu {progress.completedLessons.length} aulas e{" "}
            {progress.exerciseResults.filter((r) => r.passed).length} exercícios.
          </Text>
        </View>

        {!certificateUri ? (
          <View style={styles.actionsContainer}>
            <Text style={styles.optionsTitle}>Escolha como gerar seu certificado:</Text>

            {/* OPÇÃO 1: Local (Rápido) */}
            <TouchableOpacity
              style={[styles.optionButton, styles.optionButtonLocal]}
              onPress={handleGenerateLocal}
              disabled={isGenerating}
            >
              <View style={styles.optionIconContainer}>
                <Download size={24} color="#FFF" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Gerar e Compartilhar</Text>
                <Text style={styles.optionDescription}>
                  Rápido • Apenas compartilhamento local
                </Text>
              </View>
            </TouchableOpacity>

            {/* OPÇÃO 2: Nuvem (Completo) */}
            <TouchableOpacity
              style={[styles.optionButton, styles.optionButtonCloud]}
              onPress={handleGenerateCloud}
              disabled={isGenerating}
            >
              <View style={styles.optionIconContainer}>
                <Cloud size={24} color="#FFF" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Salvar na Nuvem</Text>
                <Text style={styles.optionDescription}>
                  Backup • Validação online • Reemissão
                </Text>
              </View>
            </TouchableOpacity>

            {isGenerating && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Gerando certificado...</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.actionsContainer}>
            <View style={styles.successContainer}>
              <CheckCircle size={38} color={theme.colors.success} />
              <Text style={styles.successText}>Certificado gerado com sucesso!</Text>
              <Text style={styles.certNumber}>Nº {certificateNumber}</Text>

              {validationCode && (
                <View style={styles.validationContainer}>
                  <Text style={styles.validationLabel}>Código de Validação:</Text>
                  <Text style={styles.validationCode}>
                    {validationCode.substring(0, 8).toUpperCase()}
                  </Text>
                  <Text style={styles.validationHint}>
                    Use este código para validar o certificado online
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <ShareIcon size={20} color="#FFF" />
              <Text style={styles.shareButtonText}>Compartilhar Novamente</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
              <Home size={20} color={theme.colors.text} />
              <Text style={styles.homeButtonText}>Voltar ao Início</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <BottomSheetMessage
        ref={bottomSheetModalRef}
        config={bottomSheetConfig}
        onDismiss={() => setBottomSheetConfig(null)}
      />
    </>
  );
}
