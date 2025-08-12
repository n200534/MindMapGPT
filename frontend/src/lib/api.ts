const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface MindMapResponse {
  mindMap: {
    id: string;
    title: string;
    data: any;
    createdAt: string;
    updatedAt: string;
  };
}

interface ResourcesResponse {
  resources: Array<{
    type: string;
    title: string;
    description: string;
    url: string;
    platform: string;
  }>;
}

interface RoadmapResponse {
  roadmap: {
    title: string;
    phases: Array<{
      id: string;
      title: string;
      description: string;
      duration: string;
      tasks: Array<{
        id: string;
        title: string;
        description: string;
        status: string;
      }>;
    }>;
  };
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  private setUser(user: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  private clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // Handle 401 (unauthorized) - token might be expired
      if (response.status === 401) {
        this.clearAuth();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return { error: 'Session expired. Please login again.' };
      }

      if (!response.ok) {
        return { error: data.error || 'An error occurred' };
      }

      return { data };
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  }

  // Auth endpoints
  async register(userData: { name: string; email: string; password: string }) {
    const response = await this.request<AuthResponse>('/api/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.data && response.data.success && response.data.token) {
      this.setToken(response.data.token);
      this.setUser(response.data.user);
    }

    return response;
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request<AuthResponse>('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.data && response.data.success && response.data.token) {
      this.setToken(response.data.token);
      this.setUser(response.data.user);
    }

    return response;
  }

  async getCurrentUser() {
    return this.request('/api/me');
  }

  async logout() {
    const response = await this.request('/api/logout', {
      method: 'POST',
    });
    
    // Clear auth data regardless of response
    this.clearAuth();
    
    return response;
  }

  // MindMap endpoints
  async createMindMap(data: { title: string; prompt: string }) {
    return this.request<MindMapResponse>('/api/mindmap', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMindMaps() {
    return this.request<{ mindMaps: Array<{ id: string; title: string; createdAt: string; updatedAt: string }> }>('/api/mindmap');
  }

  async getMindMap(id: string) {
    return this.request<MindMapResponse>(`/api/mindmap/${id}`);
  }

  async updateMindMap(id: string, data: { title?: string; data?: any }) {
    return this.request<MindMapResponse>(`/api/mindmap/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMindMap(id: string) {
    return this.request(`/api/mindmap/${id}`, {
      method: 'DELETE',
    });
  }

  // AI-powered features
  async generateResources(mindMapId: string) {
    return this.request<ResourcesResponse>(`/api/mindmap/${mindMapId}/resources`);
  }

  async generateRoadmap(mindMapId: string) {
    return this.request<RoadmapResponse>(`/api/mindmap/${mindMapId}/roadmap`);
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getStoredUser(): any {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }
}

export const apiClient = new ApiClient(API_BASE_URL || "http://localhost:3001");