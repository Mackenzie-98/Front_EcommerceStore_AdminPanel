// Base API service with authentication and error handling
export interface ApiConfig {
  baseUrl: string
  timeout: number
  retries: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
  pagination?: {
    current_page: number
    total_pages: number
    total_items: number
    items_per_page: number
  }
}

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}

class ApiService {
  private config: ApiConfig
  private baseUrl: string

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = {
      baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
      timeout: 10000,
      retries: 3,
      ...config
    }
    this.baseUrl = this.config.baseUrl
  }

  private getAuthHeaders(): Record<string, string> {
    const token = this.getToken()
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token')
    }
    return null
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type')
    
    if (!response.ok) {
      let errorData: any = {}
      
      if (contentType && contentType.includes('application/json')) {
        try {
          errorData = await response.json()
        } catch (e) {
          errorData = { message: response.statusText }
        }
      }

      // Handle 401 Unauthorized
      if (response.status === 401) {
        this.handleAuthError()
      }

      throw {
        message: errorData.message || response.statusText,
        status: response.status,
        errors: errorData.errors
      } as ApiError
    }

    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    }

    return { success: true, data: null as T }
  }

  private handleAuthError() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      // Redirect to login or show auth modal
      window.location.href = '/login'
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.baseUrl)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getAuthHeaders(),
      signal: AbortSignal.timeout(this.config.timeout)
    })

    return this.handleResponse<T>(response)
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.baseUrl)

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(this.config.timeout)
    })

    return this.handleResponse<T>(response)
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.baseUrl)

    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(this.config.timeout)
    })

    return this.handleResponse<T>(response)
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.baseUrl)

    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      signal: AbortSignal.timeout(this.config.timeout)
    })

    return this.handleResponse<T>(response)
  }

  async upload<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.baseUrl)
    const formData = new FormData()
    
    formData.append('file', file)
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
    }

    const token = this.getToken()
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers,
      body: formData,
      signal: AbortSignal.timeout(this.config.timeout)
    })

    return this.handleResponse<T>(response)
  }

  // Authentication methods
  async login(credentials: { email: string; password: string }): Promise<ApiResponse<{ token: string; user: any }>> {
    const response = await this.post<{ token: string; user: any }>('/api/v1/auth/login', credentials)
    
    if (response.success && response.data.token) {
      localStorage.setItem('auth_token', response.data.token)
    }
    
    return response
  }

  async logout(): Promise<void> {
    try {
      await this.post('/api/v1/auth/logout')
    } catch (error) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('auth_token')
    }
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await this.post<{ token: string }>('/api/v1/auth/refresh')
    
    if (response.success && response.data.token) {
      localStorage.setItem('auth_token', response.data.token)
    }
    
    return response
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

// Export singleton instance
export const apiService = new ApiService()
export default apiService 