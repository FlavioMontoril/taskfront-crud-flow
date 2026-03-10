import { useState, useCallback, useEffect } from 'react';

// Tipos TypeScript
export type SameSite = 'Strict' | 'Lax' | 'None';

export interface CookieOptions {
  expires?: Date;
  maxAge?: number;
  domain?: string;
  path?: string;
  secure?: boolean;
  sameSite?: SameSite;
  httpOnly?: boolean;
}

export type CookieSetValue<T> = T | ((prevValue: T) => T);

// Utilitários para manipular cookies
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }
  return null;
};

const setCookie = (name: string, value: string, options: CookieOptions = {}): void => {
  if (typeof document === 'undefined') return;

  const {
    expires,
    maxAge,
    domain,
    path = '/',
    secure,
    sameSite = 'Lax',
    httpOnly = false
  } = options;

  let cookieString = `${name}=${encodeURIComponent(value)}; path=${path}`;

  if (expires) {
    cookieString += `; expires=${expires.toUTCString()}`;
  }

  if (maxAge !== undefined) {
    cookieString += `; max-age=${maxAge}`;
  }

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  if (secure) {
    cookieString += `; secure`;
  }

  if (sameSite) {
    cookieString += `; samesite=${sameSite}`;
  }

  if (httpOnly) {
    cookieString += `; httponly`;
  }

  document.cookie = cookieString;
};

const removeCookie = (name: string, options: Omit<CookieOptions, 'expires' | 'maxAge'> = {}): void => {
  setCookie(name, '', {
    ...options,
    expires: new Date(0)
  });
};

// Hook principal
const useCookie = <T>(
  key: string, 
  initialValue: T, 
  options: CookieOptions = {}
): [T, (value: CookieSetValue<T>) => void, () => void] => {
  // State para armazenar o valor do cookie
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = getCookie(key);
      if (item === null) {
        return initialValue;
      }
      
      // Tenta fazer parse se for um objeto/array
      try {
        return JSON.parse(item) as T;
      } catch {
        return item as T;
      }
    } catch (error) {
      console.error(`Erro ao ler cookie ${key}:`, error);
      return initialValue;
    }
  });

  // Função para definir o valor
  const setValue = useCallback((value: CookieSetValue<T>) => {
    try {
      // Permite que value seja uma função como no useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      if (valueToStore === null || valueToStore === undefined) {
        removeCookie(key, options);
      } else {
        // Serializa objetos/arrays
        const serializedValue = typeof valueToStore === 'string' 
          ? valueToStore 
          : JSON.stringify(valueToStore);
        
        setCookie(key, serializedValue, options);
      }
    } catch (error) {
      console.error(`Erro ao definir cookie ${key}:`, error);
    }
  }, [key, storedValue, options]);

  // Função para remover o cookie
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      removeCookie(key, options);
    } catch (error) {
      console.error(`Erro ao remover cookie ${key}:`, error);
    }
  }, [key, initialValue, options]);

  // Escuta mudanças nos cookies (opcional - para sincronização entre abas)
  useEffect(() => {
    const handleStorageChange = () => {
      const item = getCookie(key);
      if (item !== null) {
        try {
          const parsedItem = JSON.parse(item) as T;
          setStoredValue(parsedItem);
        } catch {
          setStoredValue(item as T);
        }
      } else {
        setStoredValue(initialValue);
      }
    };

       // Escuta mudanças no storage (funciona entre abas)
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

export default useCookie;

// Hook adicional para múltiplos cookies com tipos
export type CookieRecord = Record<string, any>;

export const useCookies = <T extends CookieRecord>(
  keys: (keyof T)[],
  initialValues: Partial<T> = {},
  options: CookieOptions = {}
): [T, (key: keyof T, value: T[keyof T]) => void, (key: keyof T) => void] => {
  const [cookies, setCookies] = useState<T>(() => {
    const initialCookies = {} as T;
    keys.forEach(key => {
      try {
        const item = getCookie(key as string);
        if (item === null) {
          initialCookies[key] = (initialValues[key] || null) as T[keyof T];
        } else {
          try {
            initialCookies[key] = JSON.parse(item) as T[keyof T];
          } catch {
            initialCookies[key] = item as T[keyof T];
          }
        }
      } catch (error) {
        console.error(`Erro ao ler cookie ${String(key)}:`, error);
        initialCookies[key] = (initialValues[key] || null) as T[keyof T];
      }
    });
    return initialCookies;
  });

  const updateCookie = useCallback((key: keyof T, value: T[keyof T]) => {
    setCookies(prev => ({ ...prev, [key]: value }));
    
    if (value === null || value === undefined) {
      removeCookie(key as string, options);
    } else {
      const serializedValue = typeof value === 'string' 
        ? value 
        : JSON.stringify(value);
      setCookie(key as string, serializedValue, options);
    }
  }, [options]);

  const removeCookieByKey = useCallback((key: keyof T) => {
    setCookies(prev => ({ 
      ...prev, 
      [key]: (initialValues[key] || null) as T[keyof T] 
    }));
    removeCookie(key as string, options);
  }, [initialValues, options]);

  return [cookies, updateCookie, removeCookieByKey];
};