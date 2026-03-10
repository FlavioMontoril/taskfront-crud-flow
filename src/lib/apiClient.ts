import { envConfig } from "../env-config";

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: Response,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestInterceptor = (
  config: RequestConfig,
) => RequestConfig | Promise<RequestConfig>;
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;
type ErrorInterceptor = (error: ApiError) => ApiError | Promise<ApiError>;

interface RequestConfig {
  endpoint: string;
  method: string;
  headers: Record<string, string>;
  body?: string | FormData;
  signal?: AbortSignal;
}

interface RequestOptions {
  requireAuth?: boolean;
  timeout?: number;
  params?: Record<string, string | number | boolean | undefined | null>;
  signal?: AbortSignal;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor(baseURL: string, options: { timeout?: number } = {}) {
    this.baseURL = baseURL;
    this.defaultTimeout = options.timeout ?? 30000;
  }

  // Interceptors
  onRequest(interceptor: RequestInterceptor): () => void {
    this.requestInterceptors.push(interceptor);
    return () => {
      const index = this.requestInterceptors.indexOf(interceptor);
      if (index > -1) this.requestInterceptors.splice(index, 1);
    };
  }

  onResponse(interceptor: ResponseInterceptor): () => void {
    this.responseInterceptors.push(interceptor);
    return () => {
      const index = this.responseInterceptors.indexOf(interceptor);
      if (index > -1) this.responseInterceptors.splice(index, 1);
    };
  }

  onError(interceptor: ErrorInterceptor): () => void {
    this.errorInterceptors.push(interceptor);
    return () => {
      const index = this.errorInterceptors.indexOf(interceptor);
      if (index > -1) this.errorInterceptors.splice(index, 1);
    };
  }

  private buildURL(
    endpoint: string,
    params?: RequestOptions["params"],
  ): string {
    const url = new URL(endpoint, this.baseURL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private getHeaders(includeAuth: boolean = true): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    if (includeAuth) {
      const token = getCookie("authToken");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    // Aplica interceptors de response
    let processedResponse = response;
    for (const interceptor of this.responseInterceptors) {
      processedResponse = await interceptor(processedResponse);
    }

    if (!processedResponse.ok) {
      let errorData: unknown;
      try {
        errorData = await processedResponse.json();
      } catch {
        // Response não é JSON
      }

      const error = new ApiError(
        `Request failed: ${processedResponse.status} ${processedResponse.statusText}`,
        processedResponse.status,
        processedResponse,
        errorData,
      );

      // Aplica interceptors de erro
      let processedError = error;
      for (const interceptor of this.errorInterceptors) {
        processedError = await interceptor(processedError);
      }

      throw processedError;
    }

    // 204 No Content
    if (processedResponse.status === 204) {
      return null as T;
    }

    // Verifica se tem body
    const contentLength = processedResponse.headers.get("content-length");
    const contentType = processedResponse.headers.get("content-type");

    if (contentLength === "0" || !contentType?.includes("application/json")) {
      return null as T;
    }

    try {
      return await processedResponse.json();
    } catch {
      throw new ApiError("Failed to parse response JSON");
    }
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    const {
      requireAuth = true,
      timeout = this.defaultTimeout,
      params,
      signal,
    } = options;

    // Cria AbortController para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Combina signals se necessário
    const combinedSignal = signal
      ? this.combineSignals(signal, controller.signal)
      : controller.signal;

    try {
      const url = this.buildURL(endpoint, params);

      const isFormData = data instanceof FormData;

      const headers = this.getHeaders(requireAuth);
      if (isFormData) {
        // Remove Content-Type para o browser setar automaticamente com boundary
        delete headers["Content-Type"];
      }

      let config: RequestConfig = {
        endpoint: url,
        method,
        headers,
        signal: combinedSignal,
      };

      if (data !== undefined) {
        config.body = isFormData ? data : JSON.stringify(data);
      }

      // Aplica interceptors de request
      for (const interceptor of this.requestInterceptors) {
        config = await interceptor(config);
      }

      const response = await fetch(config.endpoint, {
        method: config.method,
        headers: config.headers,
        body: config.body,
        signal: config.signal,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new ApiError("Request timeout", 408);
      }

      throw new ApiError(
        `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private combineSignals(...signals: AbortSignal[]): AbortSignal {
    const controller = new AbortController();

    for (const signal of signals) {
      if (signal.aborted) {
        controller.abort();
        break;
      }
      signal.addEventListener("abort", () => controller.abort(), {
        once: true,
      });
    }

    return controller.signal;
  }

  // Métodos públicos - API limpa
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("GET", endpoint, undefined, options);
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>("POST", endpoint, data, options);
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>("PUT", endpoint, data, options);
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>("PATCH", endpoint, data, options);
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("DELETE", endpoint, undefined, options);
  }
}

// Instância global
export const apiClient = new ApiClient(envConfig.baseURL, { timeout: 30000 });

// Exemplo de interceptor para logging
apiClient.onRequest((config) => {
  console.log(`[API] ${config.method} ${config.endpoint}`);
  return config;
});

// Exemplo de interceptor para refresh token
apiClient.onError(async (error) => {
  if (error.status === 401) {
    // Aqui você pode implementar refresh token
    console.log("[API] Unauthorized - redirect to login");
  }
  return error;
});