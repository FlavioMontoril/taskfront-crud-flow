import { useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "../store/authStore";
import type { RoleOptions, User } from "../types/tokenType";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, clearUser, finishLoading } = useAuthStore();

  useEffect(() => {
    const token = Cookies.get("token"); // lê cookie
    if (token) {
      try {
        // decodifica o JWT
        const decoded = jwtDecode<{
          id: string;
          name: string;
          email: string;
          role: {
            id: string;
            name: RoleOptions;
          };
          department: string;
        }>(token);

        // mapeia role string para RoleData
        const user: User = {
          ...decoded,
          role: {
            id: undefined,
            name: decoded?.role?.name as RoleOptions,
            // description: "",
          },
        };

        setUser(user!); // atualiza store
        console.log("✅ sessão restaurada via cookie");
      } catch {
        clearUser(); // token inválido
      }
    } else {
      clearUser(); // sem token
    }
    finishLoading();
  }, [setUser, clearUser, finishLoading]);

  return <>{children}</>;
}
