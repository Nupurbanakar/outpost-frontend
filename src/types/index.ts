// Common API response types
export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  code?: string;
  message?: string;
  errors?: FieldError[];
}

export interface FieldError {
  field: string;
  message: string;
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
}

// Grant types
export interface Grant {
  id: string;
  title: string;
  summary: string;
  issuingBody: string;
  issuingBodyType: 'CENTRAL' | 'STATE' | 'OTHER';
  type: 'GRANT' | 'SUBSIDY' | 'SCHEME' | 'INCENTIVE';
  amount?: number;
  amountBand?: 'UNDER_10L' | '10L_50L' | '50L_1CR' | 'OVER_1CR';
  deadline?: string; // ISO date string, null for rolling
  sourceUrl: string;
  eligibleStages?: Stage[];
  eligibleSectors?: Sector[];
  status: 'DRAFT' | 'PUBLISHED' | 'EXPIRED';
  aiReason?: string;
  createdAt: string;
  updatedAt: string;
}

// Challenge types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  organizer: string;
  prize?: string;
  deadline?: string; // ISO date string
  sourceUrl: string;
  eligibleStages?: Stage[];
  eligibleSectors?: Sector[];
  status: 'DRAFT' | 'PUBLISHED' | 'EXPIRED';
  aiReason?: string;
  createdAt: string;
  updatedAt: string;
}

// Mentor types
export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  photo?: string;
  bio: string;
  expertise: string[];
  linkedinUrl?: string;
  calendlyUrl?: string;
  status: 'DRAFT' | 'PUBLISHED';
  createdAt: string;
  updatedAt: string;
}

// Unified opportunity type for mixed grant/challenge displays
export type Opportunity = (Grant | Challenge) & {
  opportunityType: 'GRANT' | 'CHALLENGE';
}
