// services/useUserApi.ts
import { apiClient } from "../lib/apiClient";
import type { UserProps } from "../types/userTypes";

export function useUserApi() {
    const findAllUsers = async (): Promise<UserProps[]> => {
        const response = await apiClient.get<UserProps[]>("/v1/users");
        return response;
    };

    return {
        findAllUsers,
    };
}
