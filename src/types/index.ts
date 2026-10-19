/**
 * Central types export
 * Re-exports all types from organized structure
 */

// Export enums
export * from './enums';

// Export entities
export * from './entities';

// Export API types
export * from './api';

// Legacy exports for backward compatibility (deprecated)
// TODO: Remove these once all imports are updated
export type { Grant, Challenge, Mentor, Stage, Sector, User } from './entities';
export type { ApiError, FieldError, PaginatedResponse, LoginRequest, SignupRequest } from './api';
