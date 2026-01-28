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
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
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
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      width: 297mm;
      height: 210mm;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 15mm;
    }

    .certificate {
      width: 100%;
      height: 100%;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 30px 50px;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .certificate::before {
      content: '';
      position: absolute;
      top: 12px;
      left: 12px;
      right: 12px;
      bottom: 12px;
      border: 3px solid #764ba2;
      border-radius: 15px;
      opacity: 0.3;
    }

    .header {
      text-align: center;
      position: relative;
      z-index: 1;
    }

    .logo {
      width: 60px;
      height: 60px;
      margin: 0 auto 15px;
    }

    .title {
      font-family: 'Playfair Display', serif;
      font-size: 42px;
      font-weight: 700;
      color: #764ba2;
      margin-bottom: 5px;
      letter-spacing: 3px;
    }

    .subtitle {
      font-size: 16px;
      color: #666;
      font-weight: 600;
      letter-spacing: 4px;
      text-transform: uppercase;
    }

    .body {
      text-align: center;
      padding: 20px 0;
      position: relative;
      z-index: 1;
    }

    .intro {
      font-size: 16px;
      color: #666;
      margin-bottom: 15px;
    }

    .student-name {
      font-family: 'Playfair Display', serif;
      font-size: 32px;
      font-weight: 700;
      color: #333;
      margin: 15px 0;
      padding: 8px 0;
      border-bottom: 2px solid #764ba2;
      display: inline-block;
    }

    .conclusion-text {
      font-size: 16px;
      color: #666;
      margin: 15px 0;
    }

    .course-title {
      font-size: 24px;
      font-weight: 700;
      color: #764ba2;
      margin: 15px 0;
    }

    .metadata {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin-top: 20px;
      flex-wrap: wrap;
    }

    .metadata-item {
      text-align: center;
    }

    .metadata-label {
      font-size: 11px;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }

    .metadata-value {
      font-size: 16px;
      font-weight: 700;
      color: #333;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      position: relative;
      z-index: 1;
      margin-top: auto;
    }

    .date {
      text-align: left;
    }

    .date-text {
      font-size: 13px;
      color: #666;
    }

    .signature {
      text-align: center;
    }

    .signature-line {
      width: 180px;
      height: 2px;
      background: #333;
      margin: 8px auto;
    }

    .signature-text {
      font-size: 15px;
      font-weight: 700;
      color: #333;
      margin-bottom: 4px;
    }

    .signature-label {
      font-size: 11px;
      color: #999;
    }

    .validation {
      text-align: right;
    }

    .cert-number {
      font-size: 11px;
      color: #999;
      margin-bottom: 8px;
    }

    .validation-code {
      font-size: 10px;
      color: #764ba2;
      font-weight: 600;
      margin-top: 5px;
    }

    .validation-url {
      font-size: 9px;
      color: #999;
      margin-top: 3px;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="header">
      <div class="logo">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="30" cy="30" r="28" fill="#764ba2" opacity="0.1"/>
          <path d="M30 10L35 22L48 22L38 30L42 42L30 34L18 42L22 30L12 22L25 22L30 10Z" fill="#764ba2"/>
        </svg>
      </div>
      <h1 class="title">CERTIFICADO</h1>
      <p class="subtitle">de Conclusão</p>
    </div>

    <div class="body">
      <p class="intro">Certificamos que</p>
      <h2 class="student-name">${data.studentName}</h2>
      <p class="conclusion-text">concluiu com êxito o curso de</p>
      <h3 class="course-title">${data.courseTitle}</h3>

      <div class="metadata">
        <div class="metadata-item">
          <p class="metadata-label">Carga Horária</p>
          <p class="metadata-value">${data.workloadHours}h</p>
        </div>
        <div class="metadata-item">
          <p class="metadata-label">Nota Final</p>
          <p class="metadata-value">${data.finalGrade.toFixed(1)}/10</p>
        </div>
        <div class="metadata-item">
          <p class="metadata-label">Aulas</p>
          <p class="metadata-value">${data.completedLessons}</p>
        </div>
        <div class="metadata-item">
          <p class="metadata-label">Exercícios</p>
          <p class="metadata-value">${data.completedExercises}</p>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="date">
        <p class="date-text">${data.issuedDate}</p>
      </div>

      <div class="signature">
        <p class="signature-text">Saber Espírita</p>
        <div class="signature-line"></div>
        <p class="signature-label">Certificação Digital</p>
      </div>

      <div class="validation">
        <p class="cert-number">Nº ${data.certificateNumber}</p>
        ${data.validationCode ? `<p class="validation-code">Código: ${data.validationCode.substring(0, 8).toUpperCase()}</p>` : ""}
        ${data.validationUrl ? `<p class="validation-url">${data.validationUrl}</p>` : ""}
      </div>
    </div>
  </div>
</body>
</html>
  `;
};
