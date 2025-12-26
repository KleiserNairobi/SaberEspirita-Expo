import OpenAI from "openai";
// @ts-ignore
import { fetch as expoFetch } from "expo/fetch";

/**
 * Cliente OpenAI configurado para a API DeepSeek
 */
export const deepSeekClient = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY,
  baseURL: process.env.EXPO_PUBLIC_DEEPSEEK_API_URL || "https://api.deepseek.com/v1",
  dangerouslyAllowBrowser: true, // Necessário para Expo
  fetch: expoFetch as any, // Polyfill para suportar streaming
});
