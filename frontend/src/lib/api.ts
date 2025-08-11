const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface ApiResponse<T> {
  data?: T;
  error?: string;
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

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

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
    return this.request('/api/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser() {
    return this.request('/api/me');
  }

  async logout() {
    return this.request('/api/logout', {
      method: 'POST',
    });
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
}

export const apiClient = new ApiClient(API_BASE_URL || "http://localhost:3001"); 