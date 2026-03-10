
import { create } from "zustand";
import { devtools, persist } from 'zustand/middleware';
import { isTokenExpired } from "../lib/tokenExpired";
import { decodeJWT } from "../utils/jwt";
import type { UserProps } from "../types/userTypes";

interface AuthState {
    // Estado
    // permissions: UserPermissions[] | null
    user: UserProps | null;
    token: string | null;
    // refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Ações
    setUser: (user: UserProps | null) => void;
    setToken: (token: string | null) => void;
    // setRefreshToken: (refreshToken: string | null) => void;
    setLoading: (loading: boolean) => void;
    login: (token: string,
        //  refreshToken?: string
    ) => Promise<void>;
    logout: () => void;
    // refreshAuthToken: () => Promise<boolean>;
    // setHasPermissions: (permissions: UserPermissions[] | null) => void;
    // hasPermission: (permission: string) => boolean;
    // hasRole: (role: RoleProps) => boolean;
    initializeAuth: (token: string | null, refreshToken: string | null) => void;
}

// Store Zustand
export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                // Estado inicial
                permissions: null,
                user: null,
                token: null,
                refreshToken: null,
                isAuthenticated: false,
                isLoading: true,

                // Setters
                // setHasPermissions: (permissions) => set({permissions}),
                setUser: (user) => set({ user }),
                setToken: (token) => set({ token }),
                // setRefreshToken: (refreshToken) => set({ refreshToken }),
                setLoading: (isLoading) => set({ isLoading }),

                // Extrai dados do usuário do token
                extractUserFromToken: (token: string): any | null => {
                    const payload = decodeJWT(token);
                    if (!payload) return null;

                    return {
                        id: payload.sub,
                        email: payload.email,
                        name: payload.name,
                        permissions: payload.permissions,
                        role: payload.role,
                    };
                },

                // Inicializa autenticação (chamado pelo hook useCookie)
                initializeAuth: (token) => {
                    set({ isLoading: true });

                    if (!token || isTokenExpired(token)) {
                        set({
                            user: null,
                            token: null,
                            // refreshToken: null,
                            isAuthenticated: false,
                            isLoading: false
                        });
                        return;
                    }

                    const payload = decodeJWT(token);
                    if (!payload) {
                        set({
                            user: null,
                            token: null,
                            // refreshToken: null,
                            isAuthenticated: false,
                            isLoading: false
                        });
                        return;
                    }

                    const user: UserProps = {
                        id: payload.sub,
                        email: payload.email,
                        name: payload.name,
                        department: payload.department,
                        role: payload.role,
                        // permissions: payload.permissions
                    };

                    set({
                        user,
                        token,
                        // refreshToken,
                        isAuthenticated: true,
                        isLoading: false
                    });
                },

                // Login
                login: async (token: string,
                    // refreshTokenValue?: string
                ) => {
                    if (isTokenExpired(token)) {
                        throw new Error('Token expirado');
                    }

                    const payload = decodeJWT(token);
                    if (!payload) {
                        throw new Error('Token inválido');
                    }

                    const user: UserProps = {
                        id: payload.sub,
                        email: payload.email,
                        name: payload.name,
                        department: payload.department,
                        role: payload.role,
                        // permissions: payload.permissions
                    };

                    set({
                        user,
                        token,
                        // refreshToken: refreshTokenValue || null,
                        isAuthenticated: true,
                        isLoading: false
                    });
                },

                // Logout
                logout: () => {
                    set({
                        user: null,
                        token: null,
                        // refreshToken: null,
                        isAuthenticated: false,
                        isLoading: false,
                        // permissions: null
                    });
                },

                // Refresh token
                // refreshAuthToken: async () => {
                //     const { refreshToken, logout } = get();

                //     if (!refreshToken) {
                //         logout();
                //         return false;
                //     }

                //     try {
                //         const response = await fetch('/api/auth/refresh', {
                //             method: 'POST',
                //             headers: {
                //                 'Content-Type': 'application/json',
                //             },
                //             body: JSON.stringify({ refreshToken })
                //         });

                //         if (response.ok) {
                //             const { token: newToken, refreshToken: newRefreshToken } = await response.json();
                //             await get().login(newToken, 
                //                 // newRefreshToken
                //             );
                //             return true;
                //         } else {
                //             logout();
                //             return false;
                //         }
                //     } catch (error) {
                //         console.error('Erro ao renovar token:', error);
                //         logout();
                //         return false;
                //     }
                // },

                // // Verifica permissão
                // hasPermission: (permission: string) => {
                //     const { user } = get();
                //     return user?.permissions.includes(permission) || false;
                // },

                // Verifica role
                // hasRole: (role: RoleProps) => {
                //     const { user } = get();
                //     return user?.role.id === role.id;
                // },
            }),
            {
                name: 'auth-storage',
                // Apenas persiste dados não sensíveis
                partialize: (state) => ({
                    user: state.user,
                    isAuthenticated: state.isAuthenticated,
                }),
            }
        ),
        {
            name: 'auth-store',
        }
    )
);