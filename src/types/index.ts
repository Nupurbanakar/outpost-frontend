// Common API response types
export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

// Auth types
export interface User {
  id: string;
  email: string;
  founderName: string;
  startupName: string;
  city: string;
  stage?: Stage;
  sector?: Sector;
}

export interface Stage {
  id: string;
  name: string;
  order: number;
}

export interface Sector {
  id: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  founderName: string;
  startupName: string;
  city: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
