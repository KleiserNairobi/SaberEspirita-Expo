import { AnswerOption } from "@/components/AnswerOption";
import { useAppTheme } from "@/hooks/useAppTheme";
import { IQuestion } from "@/types/quiz";
import React from "react";
import { View } from "react-native";
import { createStyles } from "./styles";

interface QuestionCardProps {
  question?: IQuestion | null;
  selectedIndex: number | null;
  onSelectAnswer: (index: number) => void;
  showFeedback: boolean; // Mostrar cores após confirmar
}

function parseSingleAlternative(item: any): string {
  if (item === null || item === undefined) return "";
  if (typeof item === "string") return item.trim();
  if (typeof item === "number" || typeof item === "boolean") return String(item);
  if (typeof item === "object") {
    const text =
      item.text ??
      item.label ??
      item.option ??
      item.content ??
      item.title ??
      item.value ??
      item.description ??
      item.statement ??
      item.resposta;

    if (text !== undefined && text !== null) {
      return parseSingleAlternative(text);
    }

    const vals = Object.values(item).filter((v) => typeof v === "string");
    if (vals.length > 0) return String(vals[0]).trim();
  }
  return String(item).trim();
}

function parseAlternatives(raw: any): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map(parseSingleAlternative).filter((s) => s.length > 0);
  }
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed);
        return parseAlternatives(parsed);
      } catch {
        // Fallthrough
      }
    }
    if (trimmed.includes(";") || trimmed.includes(",")) {
      const sep = trimmed.includes(";") ? ";" : ",";
      return trimmed
        .split(sep)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
    return [trimmed];
  }
  if (typeof raw === "object" && raw !== null) {
    const values = Object.values(raw);
    if (values.length > 0) {
      return values.map(parseSingleAlternative).filter((s) => s.length > 0);
    }
  }
  return [];
}

export function extractQuestionAlternatives(q: any): string[] {
  if (!q) return [];
  if (typeof q === "string") {
    try {
      const parsed = JSON.parse(q);
      return extractQuestionAlternatives(parsed);
    } catch {
      return [];
    }
  }

  const candidates = [
    q.alternativesJson,
    q.alternatives_json,
    q.alternatives,
    q.options,
    q.choices,
    q.answers,
    q.alternativas,
    q.respostas,
    q.items,
    q.optionList,
    q.alternativeList,
    q.options_list,
    q.alternatives_list,
    q.answer_options,
    q.question_options,
    q.data?.alternativesJson,
    q.data?.alternatives,
    q.data?.options,
    q.payload?.alternativesJson,
    q.payload?.alternatives,
    q.payload?.options,
    q.attributes?.alternativesJson,
    q.attributes?.alternatives,
    q.attributes?.options,
  ];

  for (const candidate of candidates) {
    const result = parseAlternatives(candidate);
    if (result.length > 0) {
      return result;
    }
  }

  return [];
}

export function QuestionCard({
  question,
  selectedIndex,
  onSelectAnswer,
  showFeedback,
}: QuestionCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const alternatives = extractQuestionAlternatives(question);

  if (alternatives.length === 0) {
    console.warn("[QuestionCard] Nenhuma alternativa encontrada para a questão:", question);
    return null;
  }

  return (
    <View style={styles.container}>
      {alternatives.map((alternative: string, index: number) => (
        <AnswerOption
          key={index}
          text={alternative || ""}
          checked={showFeedback && selectedIndex === index}
          isCorrect={question?.correct === index}
          disabled={selectedIndex !== null}
          onPress={() => onSelectAnswer(index)}
        />
      ))}
    </View>
  );
}
