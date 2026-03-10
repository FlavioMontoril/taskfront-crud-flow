import { apiClient } from "../lib/apiClient";

export interface AuthResponse {
  token: string;
}

export const useAuthApi = () => {
  return {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      return apiClient.post<AuthResponse>(
        "/v1/auth",
        { email, password },
        { requireAuth: false } // 👈 MUITO IMPORTANTE
      );
    },
  };
};
