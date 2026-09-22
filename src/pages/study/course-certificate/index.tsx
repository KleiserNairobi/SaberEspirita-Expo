import React, { useRef, useState } from "react";

import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import * as Print from "expo-print";
import {
  ArrowLeft,
  Award,
  CheckCircle,
  Eye,
  FileCheck,
  Home,
  Share2,
} from "lucide-react-native";

import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";
import { Button } from "@/components/Button";
import { useCourseProgress } from "@/hooks/queries/useCourseProgress";
import { useCourse } from "@/hooks/queries/useCourses";
import { useAppTheme } from "@/hooks/useAppTheme";
import { AppStackParamList } from "@/routers/types";
import {
  parseExerciseResults,
  userActivityApiService,
} from "@/services/api/userActivityApiService";
import { useAuthStore } from "@/stores/authStore";
import {
  CertificateData,
  generateCertificateHTML,
} from "@/templates/certificateTemplate";
import { shareCertificate, shareCertificateFile } from "@/utils/sharing";

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

  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { data: course, isLoading: isLoadingCourse } = useCourse(courseId!);
  const { data: progress, isLoading: isLoadingProgress } = useCourseProgress(courseId!);

  // Busca lista de certificados do usuário para identificar emissão prévia
  const { data: userCertificates = [], isLoading: isLoadingCertificates } = useQuery({
    queryKey: ["userCertificates", user?.uid],
    queryFn: () => userActivityApiService.getCertificates(),
    enabled: !!user?.uid,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [localPdfUri, setLocalPdfUri] = useState<string | null>(null);
  const [generatedCertNumber, setGeneratedCertNumber] = useState<string | null>(null);
  const [generatedValidationCode, setGeneratedValidationCode] = useState<string | null>(
    null
  );
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [bottomSheetConfig, setBottomSheetConfig] =
    useState<BottomSheetMessageConfig | null>(null);

  // Busca se já existe um certificado deste curso
  const existingCert = userCertificates.find(
    (c) => c.courseId === courseId || c.courseId === course?.id
  );

  const totalExercises =
    (course?.stats?.exerciseCount ?? 0) > 0
      ? (course?.stats?.exerciseCount ?? 0)
      : ((course as any)?.exerciseCount ?? 0);

  const exerciseResultsList = parseExerciseResults(progress?.exerciseResults);
  const completedExercises =
    exerciseResultsList.filter((r: any) => r && r.passed).length || 0;

  const exercisesProgress =
    totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

  const completedLessonsCount = progress?.completedLessons?.length || 0;
  const totalLessons = course?.lessonCount || 0;
  const lessonsProgress =
    totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;

  const certificateEnabled = course?.certification?.enabled ?? false;
  const requiredLessonsPercent = course?.certification?.requiredLessonsPercent ?? 100;
  const requiredExercisesPercent = course?.certification?.requiredExercisesPercent ?? 100;

  const isEligible =
    certificateEnabled &&
    lessonsProgress >= requiredLessonsPercent &&
    (totalExercises === 0 || exercisesProgress >= requiredExercisesPercent);

  // Determina se o certificado já está emitido (seja pelo banco, progresso ou sessão atual)
  const isIssued =
    !!existingCert ||
    !!progress?.certificateIssued ||
    !!generatedCertNumber ||
    !!generatedPdfUrl;

  const activeCertNumber =
    generatedCertNumber ||
    existingCert?.certificateNumber ||
    (progress as any)?.certificateNumber ||
    existingCert?.id ||
    "CERTIFICADO";

  const activePdfUrl =
    generatedPdfUrl ||
    existingCert?.pdfUrl ||
    (progress as any)?.certificatePdfUrl ||
    localPdfUri ||
    "";

  const activeValidationCode =
    generatedValidationCode ||
    existingCert?.validationCode ||
    (progress as any)?.validationCode ||
    "";

  const finalGrade =
    existingCert?.finalGrade ||
    (exerciseResultsList.length > 0
      ? Math.round(
          exerciseResultsList.reduce(
            (acc: number, curr: any) => acc + (curr?.bestScore || 0),
            0
          ) / exerciseResultsList.length
        )
      : 100);

  const workloadHours = Math.round((course?.workloadMinutes || 60) / 60);

  function buildCertificateData(cert: {
    certificateNumber: string;
    validationCode?: string;
    validationUrl?: string;
    finalGrade?: number;
  }): CertificateData {
    return {
      studentName: user?.displayName || "Estudante Espírita",
      studentEmail: user?.email || "",
      courseTitle: course?.title || "Série Espírita",
      courseAuthor: course?.author || "Saber Espírita",
      workloadHours: workloadHours > 0 ? workloadHours : 1,
      finalGrade: cert.finalGrade || finalGrade,
      completedLessons: completedLessonsCount > 0 ? completedLessonsCount : totalLessons,
      completedExercises: completedExercises,
      certificateNumber: cert.certificateNumber,
      validationCode: cert.validationCode,
      issuedDate: format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: ptBR }),
      validationUrl: cert.validationUrl,
    };
  }

  /**
   * Emissão Única Oficial de Certificado
   */
  async function handleIssueCertificate() {
    if (!user || !course || !progress || !isEligible) return;

    setIsGenerating(true);
    try {
      // 1. Gera registro no backend com numeração única e idempotente
      const cert = await userActivityApiService.generateCertificate(course.id);
      const certNum = cert.certificateNumber || cert.id;

      // 2. Monta dados e renderiza HTML do certificado
      const certData = buildCertificateData({
        certificateNumber: certNum,
        validationCode: cert.validationCode,
        validationUrl: cert.validationUrl,
        finalGrade: cert.finalGrade,
      });
      const html = generateCertificateHTML(certData);

      // 3. Gera PDF nativo
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      setLocalPdfUri(uri);
      setGeneratedCertNumber(certNum);
      setGeneratedValidationCode(cert.validationCode || "");

      // 4. Faz upload para o Cloudflare R2 / CDN
      let finalUrl = uri;
      try {
        const uploadedCert = await userActivityApiService.uploadCertificate(
          course.id,
          uri
        );
        finalUrl = uploadedCert.pdfUrl || cert.pdfUrl || uri;
        setGeneratedPdfUrl(finalUrl);
      } catch (uploadErr) {
        console.warn("Upload do PDF falhou, utilizando URI local:", uploadErr);
        setGeneratedPdfUrl(cert.pdfUrl || uri);
      }

      // 5. Invalida caches para persistência imediata
      queryClient.invalidateQueries({ queryKey: ["courseProgress", course.id] });
      queryClient.invalidateQueries({ queryKey: ["userCertificates", user.uid] });

      // 6. Apresenta modal comemorativo de sucesso
      setBottomSheetConfig({
        type: "success",
        title: "Certificado Emitido com Sucesso!",
        message:
          "Parabéns pelo seu empenho e dedicação aos estudos doutrinários! Seu certificado oficial com selo digital já está disponível.",
        primaryButton: {
          label: "Visualizar Certificado",
          onPress: () => {
            bottomSheetModalRef.current?.dismiss();
            setTimeout(() => {
              navigation.navigate("BookletViewer", {
                id: certNum,
                fileUrl: finalUrl,
                title: course.title,
                canShare: true,
                subtitle: "Certificado Oficial de Conclusão",
              });
            }, 300);
          },
        },
        secondaryButton: {
          label: "Compartilhar Conquista",
          onPress: () => {
            bottomSheetModalRef.current?.dismiss();
            setTimeout(() => {
              if (finalUrl && finalUrl.startsWith("http")) {
                shareCertificate(finalUrl, course.title);
              } else {
                shareCertificateFile(uri, course.title);
              }
            }, 300);
          },
        },
      });
      setTimeout(() => {
        bottomSheetModalRef.current?.present();
      }, 150);
    } catch (error) {
      console.error("Erro ao emitir certificado:", error);
      setBottomSheetConfig({
        type: "error",
        title: "Falha na Emissão",
        message:
          "Não foi possível emitir seu certificado no momento. Verifique sua conexão e tente novamente.",
        primaryButton: {
          label: "Entendi",
          onPress: () => bottomSheetModalRef.current?.dismiss(),
        },
      });
      setTimeout(() => {
        bottomSheetModalRef.current?.present();
      }, 150);
    } finally {
      setIsGenerating(false);
    }
  }

  /**
   * Abre o visualizador de tela cheia nativo com zoom e botão de compartilhar
   */
  function handleOpenViewer() {
    if (!course) return;

    // Se já temos a URL (CDN ou local), abre o BookletViewer diretamente
    const targetUrl = activePdfUrl || localPdfUri;
    if (targetUrl) {
      navigation.navigate("BookletViewer", {
        id: activeCertNumber,
        fileUrl: targetUrl,
        title: course.title,
        canShare: true,
        subtitle: "Certificado Oficial de Conclusão",
      });
    } else {
      // Se por algum motivo o arquivo ainda não tem URL, reemite/recarrega
      handleIssueCertificate();
    }
  }

  /**
   * Compartilha o certificado (link web oficial ou arquivo)
   */
  async function handleShareCertificate() {
    if (!course) return;

    try {
      if (activePdfUrl && activePdfUrl.startsWith("http")) {
        await shareCertificate(activePdfUrl, course.title);
      } else if (localPdfUri) {
        await shareCertificateFile(localPdfUri, course.title);
      } else {
        // Se ainda não gerou PDF local, gera e compartilha
        handleIssueCertificate();
      }
    } catch (error) {
      console.error("Erro ao compartilhar certificado:", error);
    }
  }

  function handleGoHome() {
    navigation.navigate("Tabs");
  }

  if (isLoadingCourse || isLoadingProgress || isLoadingCertificates) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!course || !progress) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Série espiritual ou progresso não encontrado.
        </Text>
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
          {/* Linha 1: Botão Voltar | Ícone Central | Espaço */}
          <View style={styles.headerRow}>
            <View style={styles.headerSide}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <ArrowLeft size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.iconRingsContainer}>
              <View style={styles.ringOuter} />
              <View style={styles.ringMiddle} />
              <View style={styles.ringInner} />
              <View style={styles.iconLargeContainer}>
                <Award size={40} color={theme.colors.background} />
              </View>
            </View>

            <View style={styles.headerSide} />
          </View>

          {/* Linha 2: Título e Subtítulo */}
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              {isIssued ? "Certificado Conquistado" : "Certificado de Mérito"}
            </Text>
            <Text style={styles.headerSubtitle}>
              {isIssued
                ? "Documento oficial de reconhecimento doutrinário"
                : "Crescimento espiritual através do estudo"}
            </Text>
          </View>
        </View>

        {/* Card de Conquista / Mérito */}
        <View style={styles.meritCard}>
          <View style={styles.meritBadgePill}>
            {isIssued ? (
              <>
                <CheckCircle size={14} color={theme.colors.success} />
                <Text
                  style={[styles.meritBadgeText, { color: theme.colors.success }]}
                >
                  Certificado Emitido
                </Text>
              </>
            ) : (
              <>
                <Award size={14} color={theme.colors.primary} />
                <Text style={styles.meritBadgeText}>Conquista Doutrinária</Text>
              </>
            )}
          </View>

          <Text style={styles.meritCourseTitle}>{course.title}</Text>
          <Text style={styles.meritSubtitle}>
            {isIssued
              ? `Registro Nº ${activeCertNumber}`
              : "Conclusão com excelência do programa de estudos"}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statsItem}>
              <Text style={styles.statsValue}>{finalGrade}%</Text>
              <Text style={styles.statsLabel}>Aproveitamento</Text>
            </View>
            <View style={styles.statsItem}>
              <Text style={styles.statsValue}>
                {workloadHours > 0 ? `${workloadHours}h` : "1h"}
              </Text>
              <Text style={styles.statsLabel}>Carga Horária</Text>
            </View>
            <View style={styles.statsItem}>
              <Text style={styles.statsValue}>
                {completedLessonsCount}/{totalLessons}
              </Text>
              <Text style={styles.statsLabel}>Aulas</Text>
            </View>
          </View>
        </View>

        {/* Bloco de Ações e Estados */}
        {!isEligible && !isIssued ? (
          <View style={styles.actionsContainer}>
            <View
              style={[
                styles.infoCard,
                {
                  backgroundColor: `${theme.colors.warning}10`,
                  borderColor: `${theme.colors.warning}40`,
                  borderWidth: 1,
                  borderRadius: theme.radius.md,
                },
              ]}
            >
              <Text
                style={[
                  styles.infoTitle,
                  { color: theme.colors.warning, fontSize: 16, marginBottom: 6 },
                ]}
              >
                Requisitos Pendentes
              </Text>
              <Text style={[styles.infoText, { textAlign: "left", lineHeight: 22 }]}>
                Para emitir seu certificado de conclusão, é necessário atingir os
                seguintes critérios:
                {"\n"}• {requiredLessonsPercent}% das aulas concluídas (
                {completedLessonsCount}/{totalLessons})
                {totalExercises > 0 &&
                  `\n• ${requiredExercisesPercent}% dos exercícios com nota ≥ ${course.certification?.minimumGrade ?? 70} (${completedExercises}/${totalExercises})`}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.shareButton,
                { backgroundColor: theme.colors.primary, marginTop: 16 },
              ]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.shareButtonText}>Voltar ao Currículo</Text>
            </TouchableOpacity>
          </View>
        ) : !isIssued ? (
          /* Estado Elegível - Emissão Única */
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={styles.issueButton}
              onPress={handleIssueCertificate}
              disabled={isGenerating}
              activeOpacity={0.8}
            >
              {isGenerating ? (
                <>
                  <ActivityIndicator size="small" color="#FFF" />
                  <Text style={styles.issueButtonText}>Emitindo Certificado...</Text>
                </>
              ) : (
                <>
                  <FileCheck size={22} color="#FFF" />
                  <Text style={styles.issueButtonText}>Emitir Certificado Oficial</Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.issueHintText}>
              Gera seu documento oficial com selo digital e validação online.
            </Text>
          </View>
        ) : (
          /* Estado Emitido - Visualização e Compartilhamento */
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={handleOpenViewer}
              activeOpacity={0.8}
            >
              <Eye size={20} color="#FFF" />
              <Text style={styles.viewButtonText}>Visualizar em Tela Cheia</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleShareCertificate}
              activeOpacity={0.8}
            >
              <Share2 size={20} color={theme.colors.primary} />
              <Text style={styles.secondaryButtonText}>Compartilhar Conquista</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.homeButton}
              onPress={handleGoHome}
              activeOpacity={0.8}
            >
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
