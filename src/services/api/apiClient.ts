import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { auth } from "@/configs/firebase/firebase";
import * as Storage from "@/utils/Storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor de Requisições: Injeta Token de Autenticação (JWT / Firebase ID Token)
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      let token: string | null | undefined = null;

      // 1. Tentar obter ID Token atualizado do Firebase Auth
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken(/* forceRefresh */ false);
      }

      // 2. Fallback: Tentar obter token armazenado no MMKV (se houver)
      if (!token) {
        token = Storage.loadString("jwt_token");
      }

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn("apiClient: Falha ao obter token para requisição:", error);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor de Respostas: Tratamento de Erros Sem Interromper Sessão Permanente
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      console.warn(`[API Client Error ${status}]:`, data || error.message);

      // REGRA INVIOLÁVEL: Erros HTTP 401/403 JAMAIS devem deslogar o usuário ou limpar auth-storage.
      // O erro é simplesmente rejeitado para ser tratado no componente/hook consumidor.
    } else if (error.request) {
      console.warn("[API Client Network Error]: Sem resposta do servidor. Verifique a conexão.", error.message);
    } else {
      console.warn("[API Client Error]:", error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
