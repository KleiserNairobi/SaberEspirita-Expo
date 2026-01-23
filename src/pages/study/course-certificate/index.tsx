import React, { useRef, useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Share } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ViewShot, { captureRef } from "react-native-view-shot";
import { Share as ShareIcon, Home, Award } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuthStore } from "@/stores/authStore";
import { useCourse } from "@/hooks/queries/useCourses";
import { useCourseProgress } from "@/hooks/queries/useCourseProgress";

import { ActivityIndicator } from "react-native";
import { Button } from "@/components/Button";

import { createStyles } from "./styles";

export function CourseCertificateScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const viewShotRef = useRef<ViewShot>(null);

  const { user } = useAuthStore();
  const { data: course, isLoading: isLoadingCourse } = useCourse(courseId!);
  const { data: progress, isLoading: isLoadingProgress } = useCourseProgress(courseId!);

  const [finalGrade, setFinalGrade] = useState<number | null>(null);

  useEffect(() => {
    if (progress?.exerciseResults && progress.exerciseResults.length > 0) {
      const totalScore = progress.exerciseResults.reduce(
        (acc, curr) => acc + (curr.bestScore || 0),
        0
      );
      const average = totalScore / progress.exerciseResults.length;
      setFinalGrade(average);
    }
  }, [progress]);

  async function handleShare() {
    try {
      const uri = await captureRef(viewShotRef, {
        format: "png",
        quality: 1.0,
        result: "tmpfile",
      });

      await Share.share({
        url: uri,
        title: `Certificado - ${course?.title}`,
        message: `Acabei de concluir o curso "${course?.title}" no app Saber Espírita!`,
      });
    } catch (error) {
      console.error("Erro ao compartilhar certificado:", error);
      Alert.alert("Erro", "Não foi possível compartilhar o certificado.");
    }
  }

  function handleGoHome() {
    router.dismissAll();
    router.replace("/(tabs)/study");
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
        <Button title="Voltar" onPress={() => router.back()} />
      </View>
    );
  }

  const certificateNumber = `CERT-${user?.uid.substring(0, 5).toUpperCase()}-${course.id.substring(0, 5).toUpperCase()}-${format(new Date(), "yyyyMMdd")}`;
  const conclusionDate = format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Conclusão de Curso</Text>
        <Text style={styles.headerSubtitle}>Parabéns pela sua conquista!</Text>
      </View>

      {/* Área do Certificado para Captura */}
      <ViewShot
        ref={viewShotRef}
        options={{ format: "png", quality: 1.0 }}
        style={styles.certificateContainer}
      >
        <View style={styles.certificateBorder}>
          <View style={styles.certificateInnerBorder}>
            {/* Cabeçalho do Certificado */}
            <View style={styles.certHeader}>
              <Award size={40} color={theme.colors.primary} style={styles.certIcon} />
              <Text style={styles.certTitle}>CERTIFICADO</Text>
              <Text style={styles.certSubtitle}>DE CONCLUSÃO</Text>
            </View>

            {/* Corpo do Certificado */}
            <View style={styles.certBody}>
              <Text style={styles.certText}>Certificamos que</Text>
              <Text style={styles.studentName}>{user?.displayName || "Aluno(a)"}</Text>

              <Text style={styles.certText}>concluiu com êxito o curso</Text>
              <Text style={styles.courseTitle}>{course.title}</Text>

              <View style={styles.metadataContainer}>
                <View style={styles.metadataItem}>
                  <Text style={styles.metadataLabel}>Carga Horária</Text>
                  <Text style={styles.metadataValue}>
                    {Math.round(course.workloadMinutes / 60)} horas
                  </Text>
                </View>

                {finalGrade !== null && (
                  <View style={styles.metadataItem}>
                    <Text style={styles.metadataLabel}>Nota Final</Text>
                    <Text style={styles.metadataValue}>{finalGrade.toFixed(1)}/10</Text>
                  </View>
                )}

                <View style={styles.metadataItem}>
                  <Text style={styles.metadataLabel}>Exercícios</Text>
                  <Text style={styles.metadataValue}>
                    {progress.exerciseResults.length} realizados
                  </Text>
                </View>
              </View>

              <Text style={styles.dateText}>{conclusionDate}</Text>
            </View>

            {/* Rodapé do Certificado */}
            <View style={styles.certFooter}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureText}>Saber Espírita</Text>
              <Text style={styles.certHash}>Cod: {certificateNumber}</Text>
            </View>
          </View>
        </View>
      </ViewShot>

      {/* Ações */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <ShareIcon size={20} color="#FFF" />
          <Text style={styles.shareButtonText}>Compartilhar Certificado</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
          <Home size={20} color={theme.colors.text} />
          <Text style={styles.homeButtonText}>Voltar ao Início</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
