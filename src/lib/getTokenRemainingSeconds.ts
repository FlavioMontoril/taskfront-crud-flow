import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
}

export function getTokenRemainingSeconds(token: string): number {
  const decoded = jwtDecode<JwtPayload>(token);

  const nowInSeconds = Math.floor(Date.now() / 1000);

  return decoded.exp - nowInSeconds;
}
