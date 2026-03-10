import { useEffect } from 'react';
import { useSocketStore } from '../socketStore';
import { useNavigate } from 'react-router-dom';
import useCookie from '../../lib/cookies';
import { useAuthStore } from '../../store/useAuthStore';


export const useAuth = () => {
  const store = useAuthStore();
  const connect = useSocketStore((s) => s.connect);
  const setSocketToken = useSocketStore((s) => s.setSocketToken);
  const navigate = useNavigate()

//   const ability: PureAbility = useMemo(() => {
//     if (!store.permissions) return defineAbilitiesFor([])
//     return defineAbilitiesFor(store.permissions)
//   }, [store.permissions])


  const [authToken, setAuthToken, removeAuthToken] = useCookie<string | null>(
    'authToken',
    null,
    {
      maxAge: 24 * 60 * 60,
      secure: import.meta.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      path: '/'
    }
  );

  const [refreshTokenCookie] = useCookie<string | null>(
    'refreshToken',
    null,
    {
      maxAge: 30 * 24 * 60 * 60,
      secure: import.meta.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      path: '/'
    }
  );

  
  const login = async (token: string,
  ) => {
    await store.login(token,
    );
    setAuthToken(token);
    setSocketToken(token);
    setTimeout(() => connect(), 0);
  };

  const logout = () => {
    store.logout();
    removeAuthToken();
    // removeRefreshTokenCookie();
    navigate("/")
  };


  useEffect(() => {
    store.initializeAuth(authToken, refreshTokenCookie);
  }, [authToken, refreshTokenCookie, store.initializeAuth]);


//   useEffect(() => {
//   if (!authToken || !store.isAuthenticated) return;

//   const timeUntilExpiry = getTokenExpiresIn(authToken);

//   const refreshTimeMs = Math.max(0, (timeUntilExpiry - 300) * 1000);

//   const refreshTimeout = setTimeout(async () => {
//     const success = await store.refreshAuthToken();

//     if (success && store.token) {
//       setAuthToken(store.token);

//       if (store.refreshToken) {
//         setRefreshTokenCookie(store.refreshToken);
//       }
//     } else {
//       logout();
//     }
//   }, refreshTimeMs);

//   const logoutTimeout = setTimeout(() => {
//     logout();
//   }, timeUntilExpiry * 1000);

//   return () => {
//     clearTimeout(refreshTimeout);
//     clearTimeout(logoutTimeout);
//   };
// }, [
//   authToken,
//   store.isAuthenticated,
//   store.refreshAuthToken,
// ]);


  return {
    ...store,
    login,
    logout,
    // ability,
  };
};