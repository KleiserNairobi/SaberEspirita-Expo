import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface CertificateData {
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  courseAuthor: string;
  workloadHours: number;
  finalGrade: number;
  completedLessons: number;
  completedExercises: number;
  certificateNumber: string;
  validationCode?: string; // Opcional (só se salvar na nuvem)
  issuedDate: string;
  validationUrl?: string; // Opcional (só se salvar na nuvem)
}

export const generateCertificateHTML = (data: CertificateData): string => {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Allura&family=Oswald:wght@400;700&family=Baskervville:ital@0;1&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    @page {
      size: A4 landscape;
      margin: 0;
    }

    body {
      font-family: 'Baskervville', serif;
      background: #F7F8F6;
      width: 297mm;
      height: 210mm;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }

    .certificate {
      width: 100%;
      height: 100%;
      background: #FFFFFF;
      border-radius: 8px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 48px;
      overflow: hidden;
    }

    /* Borda interna sutil */
    .certificate::before {
      content: '';
      position: absolute;
      top: 16px;
      left: 16px;
      right: 16px;
      bottom: 16px;
      border: 2px solid #E3E2DA;
      pointer-events: none;
      z-index: 0;
    }

    /* Marca d'água central */
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 640px;
      opacity: 0.03;
      z-index: 0;
      pointer-events: none;
      color: #6F7C60;
      line-height: 1;
    }

    /* Logo/Brand */
    .brand-name {
      font-family: 'Allura', cursive;
      font-size: 48px;
      color: #6F7C60;
      margin-bottom: 24px;
      z-index: 10;
      position: relative;
    }

    /* Título */
    .title-section {
      margin-bottom: 40px;
      z-index: 10;
      position: relative;
    }

    .title {
      font-family: 'Oswald', sans-serif;
      font-size: 36px;
      font-weight: 700;
      letter-spacing: 0.15em;
      color: #222222;
      text-transform: uppercase;
    }

    .title-underline {
      width: 128px;
      height: 2px;
      background: #6F7C60;
      margin: 8px auto 0;
      opacity: 0.3;
    }

    /* Corpo do texto */
    .body-section {
      z-index: 10;
      position: relative;
      max-width: 700px;
    }

    .intro-text {
      font-family: 'Baskervville', serif;
      font-size: 20px;
      color: #222222;
      line-height: 1.6;
    }

    .student-name {
      font-family: 'Allura', cursive;
      font-size: 60px;
      color: #6F7C60;
      margin: 24px 0;
      display: block;
    }

    .conclusion-text {
      font-family: 'Baskervville', serif;
      font-size: 20px;
      color: #222222;
      line-height: 1.6;
      margin-bottom: 48px;
    }

    .course-title {
      font-family: 'Oswald', sans-serif;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 18px;
      color: #222222;
    }

    /* Rodapé */
    .footer-section {
      width: 100%;
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding: 0 48px 16px;
      z-index: 10;
      position: relative;
    }

    .footer-left {
      text-align: left;
    }

    .signature-handwritten {
      font-family: 'Allura', cursive;
      font-size: 28px;
      color: #222222;
      margin-bottom: 4px;
    }

    .signature-line {
      width: 192px;
      border-top: 1px solid rgba(34, 34, 34, 0.3);
      padding-top: 8px;
      margin-bottom: 4px;
    }

    .signature-text {
      font-family: 'Oswald', sans-serif;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: #6F7C60;
    }

    .signature-id {
      font-family: 'Oswald', sans-serif;
      font-size: 10px;
      color: rgba(111, 124, 96, 0.6);
      margin-top: 4px;
    }

    .footer-center {
      text-align: center;
      font-family: 'Baskervville', serif;
      font-style: italic;
      color: #6F7C60;
      font-size: 14px;
      padding: 0 32px;
    }

    .footer-right {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .seal-container {
      width: 80px;
      height: 80px;
      border: 3px solid #D9E4CC;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      background: rgba(247, 248, 246, 0.3);
      margin-bottom: 16px;
    }

    .seal-icon {
      font-size: 40px;
      color: #6F7C60;
      opacity: 0.7;
    }

    .seal-badge {
      position: absolute;
      bottom: -8px;
      background: #FFFFFF;
      padding: 2px 8px;
      border: 1px solid #E3E2DA;
      border-radius: 4px;
      font-size: 8px;
      font-weight: 700;
      color: #6F7C60;
      font-family: 'Oswald', sans-serif;
    }

    .footer-date {
      font-family: 'Oswald', sans-serif;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: #6F7C60;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <!-- Marca d'água central -->
    <div class="watermark">🌿</div>

    <!-- Logo/Brand -->
    <div class="brand-name">Saber Espírita</div>

    <!-- Título -->
    <div class="title-section">
      <h1 class="title">Certificado de Conclusão</h1>
      <div class="title-underline"></div>
    </div>

    <!-- Corpo -->
    <div class="body-section">
      <p class="intro-text">Certificamos, para os devidos fins, que o aluno(a)</p>
      <span class="student-name">${data.studentName}</span>
      <p class="conclusion-text">
        concluiu com êxito e dedicação o curso de 
        <strong class="course-title">${data.courseTitle}</strong>, 
        ministrado pela plataforma Saber Espírita, cumprindo integralmente a carga horária e os requisitos pedagógicos estabelecidos.
      </p>
    </div>

    <!-- Rodapé -->
    <div class="footer-section">
      <div class="footer-left">
        <p class="signature-handwritten">Saber Espírita</p>
        <div class="signature-line"></div>
        <p class="signature-text">Saber Espírita</p>
        <p class="signature-id">ID: ${data.certificateNumber}</p>
      </div>

      <div class="footer-center">
        "Na luz do conhecimento, o espírito se eleva"
      </div>

      <div class="footer-right">
        <div class="seal-container">
          <span class="seal-icon">✓</span>
          <div class="seal-badge">SELO DIGITAL</div>
        </div>
        <p class="footer-date">${data.issuedDate}</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};
