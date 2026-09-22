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

/**
 * Abrevia nomes intermediários de forma inteligente para que o nome
 * caiba perfeitamente em uma única linha no certificado sem estourar o layout.
 *
 * Exemplo:
 * "Leine Benvindo de Carvalho" -> "Leine B. de Carvalho"
 * "Maria de Fátima dos Santos Oliveira" -> "Maria F. dos S. Oliveira"
 */
export function formatStudentName(fullName: string, maxLen = 24): string {
  if (!fullName) return "Estudante Espírita";
  const trimmed = fullName.trim().replace(/\s+/g, " ");
  if (trimmed.length <= maxLen) return trimmed;

  const parts = trimmed.split(" ");
  if (parts.length <= 2) {
    return trimmed;
  }

  const prepositions = new Set(["de", "da", "do", "dos", "das", "e"]);
  const firstName = parts[0];
  const lastName = parts[parts.length - 1];
  const middleParts = parts.slice(1, -1);

  const abbreviatedMiddle = middleParts.map((part) => {
    const lower = part.toLowerCase();
    if (prepositions.has(lower)) {
      return lower;
    }
    return `${part[0].toUpperCase()}.`;
  });

  let result = [firstName, ...abbreviatedMiddle, lastName].join(" ");

  // Se ainda estiver longo, remove as preposições intermediárias para compactar
  if (result.length > maxLen) {
    const compactMiddle = middleParts
      .filter((part) => !prepositions.has(part.toLowerCase()))
      .map((part) => `${part[0].toUpperCase()}.`);
    result = [firstName, ...compactMiddle, lastName].join(" ");
  }

  return result;
}

export const generateCertificateHTML = (data: CertificateData): string => {
  const formattedName = formatStudentName(data.studentName, 26);
  
  // Ajuste fino do tamanho da fonte script conforme o comprimento do nome
  let nameFontSize = "50px";
  if (formattedName.length > 28) {
    nameFontSize = "34px";
  } else if (formattedName.length > 20) {
    nameFontSize = "42px";
  }

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
      overflow: hidden;
    }

    .certificate {
      width: 100%;
      height: 100%;
      background: #FFFFFF;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      text-align: center;
      padding: 32px 48px 24px;
      overflow: hidden;
    }

    /* Borda interna sutil */
    .certificate::before {
      content: '';
      position: absolute;
      top: 14px;
      left: 14px;
      right: 14px;
      bottom: 14px;
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
      font-size: 520px;
      opacity: 0.03;
      z-index: 0;
      pointer-events: none;
      color: #6F7C60;
      line-height: 1;
    }

    /* Logo/Brand */
    .brand-name {
      font-family: 'Allura', cursive;
      font-size: 40px;
      color: #6F7C60;
      margin-bottom: 8px;
      z-index: 10;
      position: relative;
      line-height: 1;
    }

    /* Título */
    .title-section {
      margin-bottom: 16px;
      z-index: 10;
      position: relative;
    }

    .title {
      font-family: 'Oswald', sans-serif;
      font-size: 32px;
      font-weight: 700;
      letter-spacing: 0.15em;
      color: #222222;
      text-transform: uppercase;
      line-height: 1.1;
    }

    .title-underline {
      width: 120px;
      height: 2px;
      background: #6F7C60;
      margin: 6px auto 0;
      opacity: 0.3;
    }

    /* Corpo do texto */
    .body-section {
      z-index: 10;
      position: relative;
      max-width: 740px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .intro-text {
      font-family: 'Baskervville', serif;
      font-size: 18px;
      color: #333333;
      line-height: 1.4;
    }

    .student-name {
      font-family: 'Allura', cursive;
      font-size: ${nameFontSize};
      color: #6F7C60;
      margin: 8px 0;
      display: block;
      line-height: 1.15;
      white-space: nowrap;
      max-width: 760px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .conclusion-text {
      font-family: 'Baskervville', serif;
      font-size: 18px;
      color: #333333;
      line-height: 1.5;
    }

    .course-title {
      font-family: 'Oswald', sans-serif;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      font-size: 17px;
      color: #222222;
    }

    /* Rodapé */
    .footer-section {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding: 12px 24px 0;
      z-index: 10;
      position: relative;
      border-top: 1px solid rgba(227, 226, 218, 0.4);
    }

    .footer-left {
      text-align: left;
    }

    .signature-handwritten {
      font-family: 'Allura', cursive;
      font-size: 26px;
      color: #222222;
      margin-bottom: 2px;
      line-height: 1;
    }

    .signature-line {
      width: 170px;
      border-top: 1px solid rgba(34, 34, 34, 0.3);
      padding-top: 4px;
      margin-bottom: 2px;
    }

    .signature-text {
      font-family: 'Oswald', sans-serif;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: #6F7C60;
    }

    .signature-id {
      font-family: 'Oswald', sans-serif;
      font-size: 9px;
      color: rgba(111, 124, 96, 0.7);
      margin-top: 2px;
    }

    .footer-center {
      text-align: center;
      font-family: 'Baskervville', serif;
      font-style: italic;
      color: #6F7C60;
      font-size: 13px;
      padding: 0 16px;
      margin-bottom: 6px;
    }

    .footer-right {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .seal-container {
      width: 64px;
      height: 64px;
      border: 2px solid #D9E4CC;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      background: rgba(247, 248, 246, 0.4);
      margin-bottom: 10px;
    }

    .seal-icon {
      font-size: 32px;
      color: #6F7C60;
      opacity: 0.8;
      line-height: 1;
    }

    .seal-badge {
      position: absolute;
      bottom: -7px;
      background: #FFFFFF;
      padding: 1px 6px;
      border: 1px solid #E3E2DA;
      border-radius: 3px;
      font-size: 7px;
      font-weight: 700;
      color: #6F7C60;
      font-family: 'Oswald', sans-serif;
      letter-spacing: 0.5px;
    }

    .footer-date {
      font-family: 'Oswald', sans-serif;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.15em;
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
      <span class="student-name">${formattedName}</span>
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

