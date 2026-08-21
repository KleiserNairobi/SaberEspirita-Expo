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

// Interceptor de Requisições: Injeta Token JWT da API REST PostgreSQL
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Obter token JWT armazenado no MMKV
      const token = Storage.loadString("jwt_token");

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn("apiClient: Falha ao obter token JWT para a requisição:", error);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor de Respostas: Tratamento de Erros & Renovação Transparente Sem Interromper Sessão
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      console.warn(`[API Client Error ${status}]:`, data || error.message);

      // Tentar renovar token se receber 401 e houver refresh_token salvo (evitando loop infinito com _retry)
      if (status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = Storage.loadString("refresh_token");

        if (refreshToken) {
          try {
            console.log("apiClient: Tentando renovar token JWT expirado via refresh_token...");
            const refreshResponse = await axios.post<{ token: string; refreshToken?: string }>(
              `${API_URL}/auth/refresh`,
              { refreshToken }
            );

            if (refreshResponse.data?.token) {
              Storage.saveString("jwt_token", refreshResponse.data.token);
              if (refreshResponse.data.refreshToken) {
                Storage.saveString("refresh_token", refreshResponse.data.refreshToken);
              }

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
              }
              return apiClient(originalRequest);
            }
          } catch (refreshErr) {
            console.warn("apiClient: Falha ao renovar token de acesso silenciosamente:", refreshErr);
          }
        }
      }

      // REGRA INVIOLÁVEL DO APP: Erros HTTP 401/403 JAMAIS devem deslogar o usuário ou limpar auth-storage.
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

