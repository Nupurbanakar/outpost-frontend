/**
 * Enums for the application
 */

export enum GrantIssuingBodyType {
  CENTRAL = 'CENTRAL',
  STATE = 'STATE',
  OTHER = 'OTHER',
}

export enum GrantType {
  GRANT = 'GRANT',
  SUBSIDY = 'SUBSIDY',
  SCHEME = 'SCHEME',
  INCENTIVE = 'INCENTIVE',
}

export enum AmountBand {
  UNDER_10L = 'UNDER_10L',
  TEN_L_TO_50L = '10L_50L',
  FIFTY_L_TO_1CR = '50L_1CR',
  OVER_1CR = 'OVER_1CR',
}

export enum DeadlineFilter {
  OPEN_NOW = 'OPEN_NOW',
  CLOSING_THIS_MONTH = 'CLOSING_THIS_MONTH',
  ROLLING = 'ROLLING',
}

export enum ContentStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  EXPIRED = 'EXPIRED',
}

export enum ChallengeStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export enum MentorStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum OpportunityType {
  GRANT = 'GRANT',
  CHALLENGE = 'CHALLENGE',
}
