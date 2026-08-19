import apiClient from "./apiClient";
import * as Storage from "@/utils/Storage";

export interface AuthLoginDTO {
  email: string;
  password?: string;
}

export interface AuthRegisterDTO {
  userName: string;
  email: string;
  password?: string;
}

export interface UserProfileDTO {
  userId: string;
  userName: string;
  email: string | null;
  photoURL?: string | null;
  role?: string;
  level?: number;
  totalAllTime?: number;
  totalThisWeek?: number;
  totalThisMonth?: number;
  createdAt?: string;
  updatedAt?: string;
  lastSeenAt?: string;
}

export interface AuthResponseDTO {
  token: string;
  refreshToken?: string;
  user: UserProfileDTO;
}

export interface UpdateProfileDTO {
  userName?: string;
  photoURL?: string;
}

export const authApiService = {
  /**
   * Realiza login por e-mail e senha no Spring Boot.
   */
  async login(credentials: AuthLoginDTO): Promise<AuthResponseDTO> {
    const response = await apiClient.post<AuthResponseDTO>("/auth/login", credentials);
    if (response.data?.token) {
      Storage.saveString("jwt_token", response.data.token);
      if (response.data.refreshToken) {
        Storage.saveString("refresh_token", response.data.refreshToken);
      }
    }
    return response.data;
  },

  /**
   * Realiza cadastro de novo usuário no Spring Boot.
   */
  async register(data: AuthRegisterDTO): Promise<AuthResponseDTO> {
    const response = await apiClient.post<AuthResponseDTO>("/auth/register", data);
    if (response.data?.token) {
      Storage.saveString("jwt_token", response.data.token);
      if (response.data.refreshToken) {
        Storage.saveString("refresh_token", response.data.refreshToken);
      }
    }
    return response.data;
  },

  /**
   * Realiza login social (Google ou Apple) enviando o idToken nativo do provedor.
   */
  async socialLogin(
    provider: "google" | "apple",
    idToken: string,
    name?: string | null
  ): Promise<AuthResponseDTO> {
    const response = await apiClient.post<AuthResponseDTO>("/auth/social-login", {
      provider,
      idToken,
      name,
    });
    if (response.data?.token) {
      Storage.saveString("jwt_token", response.data.token);
      if (response.data.refreshToken) {
        Storage.saveString("refresh_token", response.data.refreshToken);
      }
    }
    return response.data;
  },

  /**
   * Renova o token de acesso (JWT) expirado utilizando o refreshToken salvo.
   */
  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken?: string }> {
    const response = await apiClient.post<{ token: string; refreshToken?: string }>(
      "/auth/refresh",
      { refreshToken }
    );
    if (response.data?.token) {
      Storage.saveString("jwt_token", response.data.token);
      if (response.data.refreshToken) {
        Storage.saveString("refresh_token", response.data.refreshToken);
      }
    }
    return response.data;
  },

  /**
   * Obtém o perfil do usuário autenticado no backend REST Spring Boot.
   */
  async getProfile(): Promise<UserProfileDTO> {
    const response = await apiClient.get<UserProfileDTO>("/users/me");
    return response.data;
  },

  /**
   * Obtém o perfil público de um usuário por ID (para fórum/comunidade).
   */
  async getUserProfile(userId: string): Promise<UserProfileDTO> {
    const response = await apiClient.get<UserProfileDTO>(`/users/${userId}`);
    return response.data;
  },

  /**
   * Atualiza as informações do perfil do usuário no Spring Boot.
   */
  async updateProfile(data: UpdateProfileDTO): Promise<UserProfileDTO> {
    const response = await apiClient.put<UserProfileDTO>("/users/me", data);
    return response.data;
  },

  /**
   * Solicita a exclusão voluntária da conta do usuário no backend REST.
   */
  async deleteAccount(): Promise<void> {
    await apiClient.delete("/users/me");
    Storage.remove("jwt_token");
    Storage.remove("refresh_token");
  },
};
