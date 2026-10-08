import { API_BASE_URL } from "./constants"

export interface ApiRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
}

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  status: number
  ok: boolean
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const { params, headers, ...rest } = options

  let url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`

  if (params) {
    const searchParams = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        searchParams.append(key, String(value))
      }
    }
    const queryString = searchParams.toString()
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString
    }
  }

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      ...rest,
    })

    const status = response.status

    if (!response.ok) {
      let errorMessage = `HTTP Error ${status}`
      try {
        const errorBody = await response.json()
        errorMessage = errorBody.message || errorBody.error || errorMessage
      } catch {
        const text = await response.text()
        if (text) errorMessage = text
      }
      return {
        data: null,
        error: errorMessage,
        status,
        ok: false,
      }
    }

    const data: T = await response.json()
    return {
      data,
      error: null,
      status,
      ok: true,
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan jaringan"
    return {
      data: null,
      error: message,
      status: 0,
      ok: false,
    }
  }
}
