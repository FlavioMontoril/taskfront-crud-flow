import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
}

export function isTokenExpired(token: string): boolean {
  if (!token || !isValidJwt(token)) return true;

  const decoded = jwtDecode<JwtPayload>(token);

  if (!decoded.exp) return true;

  return decoded.exp * 1000 <= Date.now();
}

function isValidJwt(token: string) {
  return token.split(".").length === 3;
}
