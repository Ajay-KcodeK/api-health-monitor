// Matches your AuthResponse Java DTO
export interface AuthResponse {
  token: string;
  name: string;
  email: string;
}

// Matches your EndpointResponse Java DTO
export interface EndpointResponse {
  id: number;
  name: string;
  url: string;
  lastStatus: 'UP' | 'DOWN' | 'SLOW' | 'PENDING';  // union type — only these 4 values allowed
  lastResponseTime: number | null;
  createdAt: string;
}

// Matches your DashboardSummary Java DTO
export interface DashboardSummary {
  total: number;
  up: number;
  down: number;
  slow: number;
  pending: number;
  endpoints: EndpointResponse[];
}

// Matches your HealthCheckResponse Java DTO
export interface HealthCheckResponse {
  id: number;
  status: 'UP' | 'DOWN' | 'SLOW';
  responseTime: number;
  statusCode: number;
  checkedAt: string;
}

// Matches your HealthCheckUpdate WebSocket DTO
export interface HealthCheckUpdate {
  endpointId: number;
  endpointName: string;
  url: string;
  status: 'UP' | 'DOWN' | 'SLOW';
  responseTime: number;
  statusCode: number;
  checkedAt: string;
}

// Login form data
export interface LoginRequest {
  email: string;
  password: string;
}

// Register form data
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Add endpoint form data
export interface EndpointRequest {
  name: string;
  url: string;
}

export interface InsightResponse {
  endpointId: number;
  endpointName: string;
  url: string;
  insight: string;
  generatedAt: string;
}

export {};

