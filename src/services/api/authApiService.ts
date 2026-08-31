import * as Storage from "@/utils/Storage";

import apiClient from "./apiClient";

export interface AuthLoginDTO {
  email: string;
  password?: string;
  deviceId?: string;
}

export interface AuthRegisterDTO {
  displayName: string;
  userName?: string;
  email: string;
  password?: string;
  deviceId?: string;
}

export interface UserProfileDTO {
  id?: string;
  userId?: string;
  userName?: string;
  displayName?: string;
  email: string | null;
  photoURL?: string | null;
  photoUrl?: string | null;
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
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  userId?: string;
  email?: string;
  displayName?: string;
  user?: UserProfileDTO;
}

export interface UpdateProfileDTO {
  userName?: string;
  photoURL?: string;
  photoUrl?: string;
}

export const authApiService = {
  /**
   * Realiza login por e-mail e senha no Spring Boot.
   */
  async login(credentials: AuthLoginDTO): Promise<AuthResponseDTO> {
    const response = await apiClient.post<AuthResponseDTO>("/auth/login", credentials);
    const jwt = response.data?.accessToken || response.data?.token;
    if (jwt) {
      Storage.saveString("jwt_token", jwt);
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
    const jwt = response.data?.accessToken || response.data?.token;
    if (jwt) {
      Storage.saveString("jwt_token", jwt);
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
    name?: string | null,
    deviceId?: string
  ): Promise<AuthResponseDTO> {
    const response = await apiClient.post<AuthResponseDTO>("/auth/social-login", {
      provider,
      idToken,
      name,
      deviceId,
    });
    const jwt = response.data?.accessToken || response.data?.token;
    if (jwt) {
      Storage.saveString("jwt_token", jwt);
      if (response.data.refreshToken) {
        Storage.saveString("refresh_token", response.data.refreshToken);
      }
    }
    return response.data;
  },

  /**
   * Renova o token de acesso (JWT) expirado utilizando o refreshToken salvo.
   */
  async refreshToken(refreshToken: string): Promise<AuthResponseDTO> {
    const response = await apiClient.post<AuthResponseDTO>("/auth/refresh-token", {
      token: refreshToken,
    });
    const jwt = response.data?.accessToken || response.data?.token;
    if (jwt) {
      Storage.saveString("jwt_token", jwt);
      if (response.data.refreshToken) {
        Storage.saveString("refresh_token", response.data.refreshToken);
      }
    }
    return response.data;
  },

  /**
   * Valida o e-mail do usuário utilizando o código OTP de 6 dígitos.
   */
  async verifyEmail(email: string, code: string): Promise<AuthResponseDTO> {
    const response = await apiClient.post<AuthResponseDTO>("/auth/verify-email", {
      email,
      code,
    });
    const jwt = response.data?.accessToken || response.data?.token;
    if (jwt) {
      Storage.saveString("jwt_token", jwt);
      if (response.data.refreshToken) {
        Storage.saveString("refresh_token", response.data.refreshToken);
      }
    }
    return response.data;
  },

  /**
   * Solicita o reenvio de um novo código OTP de 6 dígitos para o e-mail.
   */
  async resendCode(email: string): Promise<void> {
    await apiClient.post("/auth/resend-code", { email });
  },

  /**
   * Solicita o envio do código de 6 dígitos (OTP) para recuperação de senha.
   */
  async forgotPassword(email: string): Promise<void> {
    await apiClient.post("/auth/forgot-password", { email });
  },

  /**
   * Valida o código OTP de 6 dígitos e redefine a senha do usuário.
   */
  async resetPassword(email: string, code: string, newPassword: string): Promise<void> {
    await apiClient.post("/auth/reset-password", { email, code, newPassword });
  },

  /**
   * Realiza o encerramento de sessão (logout) no backend e limpa os tokens salvos localmente.
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // Ignora falhas de rede durante o logout para assegurar a limpeza do storage local
    } finally {
      Storage.remove("jwt_token");
      Storage.remove("refresh_token");
    }
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
