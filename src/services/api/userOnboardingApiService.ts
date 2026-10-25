import { OnboardingAnswers } from "@/types/onboarding";

import { apiClient } from "./apiClient";

export interface OnboardingBackendPayload {
  moment?: string;
  goal?: string;
  dailyTime?: string;
}

export const userOnboardingApiService = {
  /**
   * Envia as preferências do questionário de acolhimento para o backend no PostgreSQL.
   */
  async updateOnboarding(answers: OnboardingAnswers): Promise<boolean> {
    try {
      const payload: OnboardingBackendPayload = {
        moment: answers.moment,
        goal: answers.goal,
        dailyTime: answers.dailyTime,
      };

      const response = await apiClient.put("/users/me/onboarding", payload);
      return response.status === 200;
    } catch (error) {
      console.warn(
        "userOnboardingApiService: Falha ao persistir onboarding no backend:",
        error
      );
      return false;
    }
  },
};
