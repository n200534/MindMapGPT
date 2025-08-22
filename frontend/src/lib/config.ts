// Frontend configuration
export const config = {
  // API Configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  
  // App Configuration
  appName: 'MindMapGPT',
  
  // Feature flags
  features: {
    enableDebug: process.env.NODE_ENV === 'development',
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => {
  return `${config.apiUrl}${endpoint}`;
};
