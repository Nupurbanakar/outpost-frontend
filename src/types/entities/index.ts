/**
 * Entity type definitions
 */

import { GrantIssuingBodyType, GrantType, ContentStatus, ChallengeStatus, MentorStatus } from '../enums';

export interface Stage {
  id: string;
  name: string;
  order: number;
}

export interface Sector {
  id: string;
  name: string;
}

export interface Grant {
  id: string;
  title: string;
  summary: string;
  issuingBody: string;
  issuingBodyType: GrantIssuingBodyType;
  type: GrantType;
  amount?: number;
  amountBand?: string;
  deadline?: string;
  sourceUrl: string;
  eligibleStages?: Stage[];
  eligibleSectors?: Sector[];
  status: ContentStatus;
  aiReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  organizer: string;
  prize?: string;
  deadline?: string;
  sourceUrl: string;
  eligibleStages?: Stage[];
  eligibleSectors?: Sector[];
  status: ChallengeStatus;
  aiReason?: string;
  createdAt: string;
  updatedAt: string;
}

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
  status: MentorStatus;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  founderName: string;
  startupName: string;
  city: string;
  stage?: Stage;
  sector?: Sector;
}
