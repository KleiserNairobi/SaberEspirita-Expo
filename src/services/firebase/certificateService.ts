import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { db, storage } from "@/configs/firebase/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  generateCertificateHTML,
  CertificateData,
} from "@/templates/certificateTemplate";
import { ICourse, IUserCourseProgress } from "@/types/course";

/**
 * Gera código único de validação (UUID simplificado)
 */
export function generateValidationCode(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Gera número do certificado
 */
export function generateCertificateNumber(userId: string, courseId: string): string {
  const userPart = userId.substring(0, 5).toUpperCase();
  const coursePart = courseId.substring(0, 5).toUpperCase();
  const datePart = format(new Date(), "yyyyMMdd");
  return `CERT-${userPart}-${coursePart}-${datePart}`;
}

/**
 * Calcula nota final do aluno
 */
function calculateFinalGrade(progress: IUserCourseProgress): number {
  if (!progress.exerciseResults || progress.exerciseResults.length === 0) {
    return 0;
  }

  const totalScore = progress.exerciseResults.reduce(
    (acc, curr) => acc + (curr.bestScore || 0),
    0
  );
  return totalScore / progress.exerciseResults.length;
}

/**
 * Prepara dados do certificado
 */
function prepareCertificateData(
  studentName: string,
  studentEmail: string,
  course: ICourse,
  progress: IUserCourseProgress,
  options: {
    includeValidation: boolean;
    certificateNumber: string;
    validationCode?: string;
  }
): CertificateData {
  const finalGrade = calculateFinalGrade(progress);

  return {
    studentName,
    studentEmail,
    courseTitle: course.title,
    courseAuthor: course.author,
    workloadHours: Math.round(course.workloadMinutes / 60),
    finalGrade,
    completedLessons: progress.completedLessons.length,
    completedExercises: progress.exerciseResults.filter((r) => r.passed).length,
    certificateNumber: options.certificateNumber,
    validationCode: options.includeValidation ? options.validationCode : undefined,
    issuedDate: format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: ptBR }),
    validationUrl:
      options.includeValidation && options.validationCode
        ? `saberespirita.app/validate/${options.validationCode}`
        : undefined,
  };
}

/**
 * OPÇÃO 1: Gera PDF localmente (sem upload)
 * Rápido e simples, apenas para compartilhamento
 */
export async function generateCertificateLocal(
  studentName: string,
  studentEmail: string,
  course: ICourse,
  progress: IUserCourseProgress
): Promise<{ uri: string; certificateNumber: string }> {
  const certificateNumber = generateCertificateNumber(progress.userId, course.id);

  const certificateData = prepareCertificateData(
    studentName,
    studentEmail,
    course,
    progress,
    {
      includeValidation: false,
      certificateNumber,
    }
  );

  const html = generateCertificateHTML(certificateData);

  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });

  console.log(`✅ [Certificate] PDF gerado localmente: ${uri}`);

  return { uri, certificateNumber };
}

/**
 * OPÇÃO 2: Gera PDF e salva na nuvem (com validação)
 * Mais completo, com backup e validação online
 */
export async function generateCertificateCloud(
  studentName: string,
  studentEmail: string,
  course: ICourse,
  progress: IUserCourseProgress
): Promise<{
  uri: string;
  certificateNumber: string;
  validationCode: string;
  pdfUrl: string;
}> {
  const certificateNumber = generateCertificateNumber(progress.userId, course.id);
  const validationCode = generateValidationCode();

  // 1. Gerar PDF com código de validação
  const certificateData = prepareCertificateData(
    studentName,
    studentEmail,
    course,
    progress,
    {
      includeValidation: true,
      certificateNumber,
      validationCode,
    }
  );

  const html = generateCertificateHTML(certificateData);

  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });

  console.log(`✅ [Certificate] PDF gerado: ${uri}`);

  // 2. Upload para Firebase Storage
  const fileName = `${certificateNumber}.pdf`;
  const storagePath = `certificates/${progress.userId}/${course.id}/${fileName}`;

  const storageRef = ref(storage, storagePath);

  // Ler arquivo como blob
  const response = await fetch(uri);
  const blob = await response.blob();

  await uploadBytes(storageRef, blob);
  const pdfUrl = await getDownloadURL(storageRef);

  console.log(`✅ [Certificate] Upload concluído: ${pdfUrl}`);

  // 3. Salvar metadados no Firestore
  const certificateRef = doc(collection(db, "certificates"), validationCode);
  await setDoc(certificateRef, {
    id: validationCode,
    userId: progress.userId,
    courseId: course.id,
    studentName,
    studentEmail,
    courseTitle: course.title,
    courseAuthor: course.author,
    courseWorkloadMinutes: course.workloadMinutes,
    finalGrade: calculateFinalGrade(progress),
    lessonsCompleted: progress.completedLessons.length,
    exercisesCompleted: progress.exerciseResults.filter((r) => r.passed).length,
    certificateNumber,
    validationCode,
    issuedAt: serverTimestamp(),
    pdfUrl,
    validationUrl: `https://saberespirita.app/validate/${validationCode}`,
  });

  console.log(`✅ [Certificate] Metadados salvos no Firestore`);

  return { uri, certificateNumber, validationCode, pdfUrl };
}

/**
 * Compartilha certificado via sistema nativo
 */
export async function shareCertificate(
  pdfUri: string,
  courseTitle: string
): Promise<void> {
  const isAvailable = await Sharing.isAvailableAsync();

  if (!isAvailable) {
    throw new Error("Compartilhamento não disponível neste dispositivo");
  }

  await Sharing.shareAsync(pdfUri, {
    mimeType: "application/pdf",
    dialogTitle: `Certificado - ${courseTitle}`,
    UTI: "com.adobe.pdf",
  });

  console.log(`✅ [Certificate] Compartilhado com sucesso`);
}
