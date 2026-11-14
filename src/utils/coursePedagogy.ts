import { ICourse } from "@/types/course";

export type CoursePedagogicalKind = "reflective" | "formative" | "mixed";

export interface CoursePedagogicalProfile {
  kind: CoursePedagogicalKind;
  label: string;
  fullLabel: string;
  supportText: string;
}

export function getCoursePedagogicalProfile(
  course?: ICourse | null
): CoursePedagogicalProfile {
  if (!course) {
    return {
      kind: "formative",
      label: "Formativo",
      fullLabel: "Estudo formativo",
      supportText:
        "Esta série conta com atividades práticas de fixação e fórum reflexivo de autoconhecimento.",
    };
  }

  const profile = course.pedagogicalProfile;
  const courseId = String(course.id || "").toUpperCase();
  const normalizedTitle = String(course.title || "").toLowerCase();

  // 1. Perfil explícito cadastrado no banco/objeto
  if (profile === "reflective" || profile === "introductory") {
    return {
      kind: "reflective",
      label: "Reflexivo",
      fullLabel: "Estudo reflexivo",
      supportText:
        "Esta série prioriza a reflexão pessoal e a escuta sensível, sem avaliações formais.",
    };
  }

  if (profile === "formative" || profile === "advanced") {
    return {
      kind: "formative",
      label: "Formativo",
      fullLabel: "Estudo formativo",
      supportText:
        "Esta série conta com atividades práticas de fixação e fórum reflexivo de autoconhecimento.",
    };
  }

  if (profile === "mixed") {
    return {
      kind: "mixed",
      label: "Misto",
      fullLabel: "Estudo misto",
      supportText:
        "Esta série combina pausas reflexivas com atividades práticas e fórum de autoconhecimento.",
    };
  }

  // 2. Cursos especificamente reflexivos e de acolhimento (sem exercícios de fixação)
  if (courseId === "COURSE-00025" || normalizedTitle.includes("a casa espírita")) {
    return {
      kind: "reflective",
      label: "Reflexivo",
      fullLabel: "Estudo reflexivo",
      supportText:
        "Esta série prioriza a reflexão pessoal e a escuta sensível, sem avaliações formais.",
    };
  }

  // 3. Cursos com certificação ou com exercícios confirmados são Formativos
  const hasCertification = course.certification?.enabled ?? false;
  const exerciseCount =
    course.stats?.exerciseCount ??
    (course as unknown as { exerciseCount?: number })?.exerciseCount ??
    0;

  if (hasCertification || exerciseCount > 0) {
    return {
      kind: "formative",
      label: "Formativo",
      fullLabel: "Estudo formativo",
      supportText:
        "Esta série conta com atividades práticas de fixação e fórum reflexivo de autoconhecimento.",
    };
  }

  // 4. Cursos das obras básicas ou séries estruturadas (padrão formativo do Saber Espírita)
  const categoryId = String(course.categoryId || "").toUpperCase();
  if (["LE", "ESE", "LM", "CI", "AG"].includes(categoryId)) {
    return {
      kind: "formative",
      label: "Formativo",
      fullLabel: "Estudo formativo",
      supportText:
        "Esta série conta com atividades práticas de fixação e fórum reflexivo de autoconhecimento.",
    };
  }

  // 5. Cursos com certificado desabilitado E sem exercícios (caso haja novos no futuro)
  if (course.certification && course.certification.enabled === false && exerciseCount === 0) {
    return {
      kind: "reflective",
      label: "Reflexivo",
      fullLabel: "Estudo reflexivo",
      supportText:
        "Esta série prioriza a reflexão pessoal e a escuta sensível, sem avaliações formais.",
    };
  }

  // 6. Padrão geral da plataforma: Formativo
  return {
    kind: "formative",
    label: "Formativo",
    fullLabel: "Estudo formativo",
    supportText:
      "Esta série conta com atividades práticas de fixação e fórum reflexivo de autoconhecimento.",
  };
}
