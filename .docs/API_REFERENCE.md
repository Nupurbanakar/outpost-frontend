# Outpost API Reference

**Version**: 1.0  
**Base URL**: `https://api.outpost.thub.in/api/v1` (Production) | `http://localhost:8080/api/v1` (Local)  
**Auth Type**: JWT Bearer Token  
**API Format**: REST (JSON)  

---

## 📋 Table of Contents

- [Authentication](#authentication)
- [Founder Profile](#founder-profile)
- [Grants](#grants)
- [Challenges](#challenges)
- [Mentors](#mentors)
- [Lookups](#lookups)
- [Admin Endpoints](#admin-endpoints)
- [Error Handling](#error-handling)
- [Rate Limits](#rate-limits)

---

## 🔐 Authentication

All authenticated endpoints require a JWT token in the `Authorization` header:

```http
Authorization: Bearer <access_token>
```

### Token Lifecycle
- **Access Token**: 15 minutes TTL
- **Refresh Token**: 30 days TTL
- **Refresh on expiry**: Use `/auth/refresh` to get new tokens

---

### POST `/auth/signup`

Create a new founder account.

**Public endpoint** - No authentication required

**Request Body**:
```json
{
  "email": "founder@startup.com",
  "password": "securepassword123"
}
```

**Validation**:
- `email`: Valid email format, will be stored in lowercase
- `password`: Minimum 10 characters

**Response** `201 Created`:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "d4f6e8c2-4b1a-4c3e-9f2d-a1b2c3d4e5f6",
  "expiresIn": 900
}
```

**Error Responses**:
- `400 Bad Request`: Validation error
  ```json
  {
    "status": 400,
    "title": "Bad Request",
    "code": "VALIDATION_ERROR",
    "errors": [
      {
        "field": "password",
        "message": "must be at least 10 characters"
      }
    ]
  }
  ```
- `409 Conflict`: Email already registered
  ```json
  {
    "status": 409,
    "title": "Conflict",
    "code": "EMAIL_TAKEN",
    "detail": "Email address already registered"
  }
  ```

---

### POST `/auth/login`

Authenticate with email and password.

**Public endpoint** - No authentication required

**Request Body**:
```json
{
  "email": "founder@startup.com",
  "password": "securepassword123"
}
```

**Response** `200 OK`:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "d4f6e8c2-4b1a-4c3e-9f2d-a1b2c3d4e5f6",
  "expiresIn": 900
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid credentials
  ```json
  {
    "status": 401,
    "title": "Unauthorized",
    "code": "INVALID_CREDENTIALS",
    "detail": "Invalid email or password"
  }
  ```
- `403 Forbidden`: Email not verified
  ```json
  {
    "status": 403,
    "title": "Forbidden",
    "code": "EMAIL_NOT_VERIFIED",
    "detail": "Email verification required"
  }
  ```

---

### POST `/auth/refresh`

Exchange refresh token for new access token.

**Public endpoint** - No authentication required

**Request Body**:
```json
{
  "refreshToken": "d4f6e8c2-4b1a-4c3e-9f2d-a1b2c3d4e5f6"
}
```

**Response** `200 OK`:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "f8a1c3e5-2d4b-4e6f-8a9c-b3d4e5f6a7b8",
  "expiresIn": 900
}
```

**Notes**:
- Old refresh token is invalidated (rotation for security)
- Store the new refresh token securely

**Error Responses**:
- `401 Unauthorized`: Invalid or expired refresh token

---

### POST `/auth/verify`

Verify email address with token from verification email.

**Public endpoint** - No authentication required

**Request Body**:
```json
{
  "token": "a1b2c3d4-e5f6-4a7b-8c9d-e1f2a3b4c5d6"
}
```

**Response** `200 OK`: Empty body

**Error Responses**:
- `400 Bad Request`: Invalid, expired, or already used token
  ```json
  {
    "status": 400,
    "title": "Bad Request",
    "code": "TOKEN_INVALID",
    "detail": "Verification token is invalid or expired"
  }
  ```

---

### POST `/auth/resend-verification`

Request a new verification email.

**Public endpoint** - No authentication required

**Request Body**:
```json
{
  "email": "founder@startup.com"
}
```

**Response** `200 OK`: Always returns success (doesn't leak email existence)

**Notes**:
- Rate limited: 1 request per minute per email
- No-op if email already verified or doesn't exist

---

### POST `/auth/forgot-password`

Request password reset email.

**Public endpoint** - No authentication required

**Request Body**:
```json
{
  "email": "founder@startup.com"
}
```

**Response** `200 OK`: Always returns success (doesn't leak email existence)

**Notes**:
- Rate limited: 1 request per minute per email
- Reset link expires in 1 hour

---

### POST `/auth/reset-password`

Reset password using token from reset email.

**Public endpoint** - No authentication required

**Request Body**:
```json
{
  "token": "a1b2c3d4-e5f6-4a7b-8c9d-e1f2a3b4c5d6",
  "newPassword": "newsecurepassword456"
}
```

**Response** `200 OK`: Empty body

**Notes**:
- Token is single-use, expires in 1 hour
- Invalidates all refresh tokens (forces re-login on all devices)
- Works for OAuth-only users (allows setting email password)

**Error Responses**:
- `400 Bad Request`: Invalid, expired, or already used token

---

## 👤 Founder Profile

All endpoints require authentication.

### GET `/me`

Get current founder's profile.

**Headers**:
```http
Authorization: Bearer <access_token>
```

**Response** `200 OK`:
```json
{
  "id": "a1b2c3d4-e5f6-4a7b-8c9d-e1f2a3b4c5d6",
  "email": "founder@startup.com",
  "emailVerified": true,
  "founderName": "Jane Doe",
  "startupName": "TechCorp",
  "stage": {
    "id": "stage-uuid",
    "name": "Seed"
  },
  "sector": {
    "id": "sector-uuid",
    "name": "FinTech"
  },
  "city": "Bangalore",
  "website": "https://techcorp.com",
  "onboarded": true,
  "role": "FOUNDER",
  "identities": [
    {
      "provider": "EMAIL",
      "linkedAt": "2024-01-15T10:30:00Z"
    },
    {
      "provider": "GOOGLE",
      "linkedAt": "2024-01-20T14:45:00Z"
    }
  ]
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or expired token
- `403 Forbidden`: Onboarding required

---

### POST `/me/onboarding`

Complete onboarding (first-time profile setup).

**Headers**:
```http
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "founderName": "Jane Doe",
  "startupName": "TechCorp",
  "stageId": "stage-uuid",
  "sectorId": "sector-uuid",
  "city": "Bangalore",
  "website": "https://techcorp.com"
}
```

**Validation**:
- All fields required except `website` (optional)
- `stageId` and `sectorId` must exist
- `website` must be valid URL if provided

**Response** `200 OK`:
```json
{
  "id": "founder-uuid",
  "founderName": "Jane Doe",
  "startupName": "TechCorp",
  "onboarded": true
}
```

**Error Responses**:
- `400 Bad Request`: Validation error or missing required fields
- `409 Conflict`: Already onboarded (use `/me` PATCH instead)

---

### PATCH `/me`

Update profile fields.

**Headers**:
```http
Authorization: Bearer <access_token>
```

**Request Body** (all fields optional):
```json
{
  "founderName": "Jane Smith",
  "startupName": "TechCorp Inc",
  "stageId": "new-stage-uuid",
  "sectorId": "new-sector-uuid",
  "city": "Mumbai",
  "website": "https://techcorpinc.com"
}
```

**Notes**:
- Only provided fields are updated
- Email is NOT editable via PATCH (security)
- Null values are ignored (doesn't clear fields)

**Response** `200 OK`: Updated profile (same as GET `/me`)

---

### GET `/me/identities`

List linked sign-in methods.

**Headers**:
```http
Authorization: Bearer <access_token>
```

**Response** `200 OK`:
```json
[
  {
    "provider": "EMAIL",
    "linkedAt": "2024-01-15T10:30:00Z"
  },
  {
    "provider": "GOOGLE",
    "linkedAt": "2024-01-20T14:45:00Z"
  }
]
```

---

### PUT `/me/password`

Change password (requires current password).

**Headers**:
```http
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Response** `200 OK`: Empty body

**Notes**:
- Invalidates all refresh tokens (forces re-login on all devices)
- New password must meet same requirements (≥10 chars)

**Error Responses**:
- `400 Bad Request`: Wrong current password or validation error

---

### DELETE `/me/identities/{provider}`

Unlink a sign-in method (EMAIL, GOOGLE, LINKEDIN).

**Headers**:
```http
Authorization: Bearer <access_token>
```

**Path Parameters**:
- `provider`: One of `EMAIL`, `GOOGLE`, `LINKEDIN`

**Response** `204 No Content`: Empty body

**Error Responses**:
- `409 Conflict`: Cannot unlink last sign-in method
  ```json
  {
    "status": 409,
    "title": "Conflict",
    "code": "LAST_IDENTITY",
    "detail": "Cannot remove the last sign-in method"
  }
  ```

---

## 💰 Grants

### GET `/grants`

List published grants with filters and pagination.

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `issuingBodyType` | string | No | Filter by: `CENTRAL`, `STATE`, `OTHER` |
| `type` | string | No | Filter by: `GRANT`, `SUBSIDY`, `SCHEME`, `INCENTIVE` |
| `stageId` | UUID | No | Filter by startup stage |
| `sectorId` | UUID | No | Filter by sector |
| `amountBand` | string | No | `UNDER_10L`, `10L_50L`, `50L_1CR`, `OVER_1CR` |
| `deadline` | string | No | `OPEN_NOW`, `CLOSING_THIS_MONTH`, `ROLLING` |
| `q` | string | No | Search in name, issuing body, summary |
| `includeExpired` | boolean | No | Include expired grants (default: false) |
| `ai` | boolean | No | Use AI ranking (default: false) |
| `page` | integer | No | Page number (0-indexed, default: 0) |
| `size` | integer | No | Page size (max: 50, default: 20) |
| `sort` | string | No | `deadline,asc`, `name,asc`, `createdAt,desc` |

**Example Request**:
```http
GET /grants?sectorId=fintech-uuid&amountBand=10L_50L&deadline=OPEN_NOW&page=0&size=20
Authorization: Bearer <access_token>
```

**Response** `200 OK`:
```json
{
  "content": [
    {
      "id": "grant-uuid",
      "name": "Startup India Seed Fund",
      "issuingBody": "Department for Promotion of Industry and Internal Trade",
      "issuingBodyType": "CENTRAL",
      "type": "GRANT",
      "amountDisplay": "Up to ₹50 Lakhs",
      "deadline": "2024-12-31",
      "summary": "Financial assistance to startups for proof of concept...",
      "stages": ["Ideation", "Seed"],
      "sectors": ["Technology", "FinTech"],
      "expired": false,
      "sourceUrl": "https://www.startupindia.gov.in/content/sih/en/seedfund.html"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 45,
  "totalPages": 3
}
```

**Notes**:
- Only returns `published=true AND expired=false` by default
- Rolling grants (null deadline) sort last
- Multiple filters are combined with AND logic

---

### GET `/grants/{id}`

Get detailed grant information.

**Path Parameters**:
- `id`: Grant UUID

**Response** `200 OK`:
```json
{
  "id": "grant-uuid",
  "name": "Startup India Seed Fund",
  "issuingBody": "DPIIT",
  "issuingBodyType": "CENTRAL",
  "type": "GRANT",
  "amountDisplay": "Up to ₹50 Lakhs",
  "amountMin": null,
  "amountMax": 5000000,
  "deadline": "2024-12-31",
  "summary": "Financial assistance to startups...",
  "eligibility": "- Incorporated as a private limited company\n- Less than 2 years old...",
  "whatIsFunded": "Proof of concept, prototype development, product trials...",
  "howToApply": "1. Register on Startup India portal\n2. Submit application...",
  "sourceUrl": "https://www.startupindia.gov.in/...",
  "stages": ["Ideation", "Seed"],
  "sectors": ["Technology", "FinTech"],
  "expired": false
}
```

**Error Responses**:
- `404 Not Found`: Grant not found or unpublished

---

## 🏆 Challenges

### GET `/challenges`

List published corporate challenges.

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sectorId` | UUID | No | Filter by sector |
| `theme` | string | No | Filter by exact theme |
| `corporate` | string | No | Filter by exact corporate name |
| `status` | string | No | `OPEN`, `CLOSED` |
| `q` | string | No | Search in title, problem statement |
| `ai` | boolean | No | Use AI ranking (default: false) |
| `sort` | string | No | `newest` (default) or `deadline` |
| `page` | integer | No | Page number (0-indexed, default: 0) |
| `size` | integer | No | Page size (max: 50, default: 20) |

**Example Request**:
```http
GET /challenges?sectorId=fintech-uuid&status=OPEN&sort=deadline
Authorization: Bearer <access_token>
```

**Response** `200 OK`:
```json
{
  "content": [
    {
      "id": "challenge-uuid",
      "corporateName": "HDFC Bank",
      "corporateLogoUrl": "https://cdn.example.com/hdfc-logo.png",
      "title": "Digital Banking Innovation Challenge",
      "sector": "FinTech",
      "theme": "Digital Payments",
      "deadline": "2024-11-30",
      "status": "OPEN",
      "hasDetail": true,
      "applyUrl": "https://hdfc.challenge.com/apply"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 12,
  "totalPages": 1
}
```

**Notes**:
- Both `OPEN` and `CLOSED` challenges are visible (marked with status)
- Challenges auto-close when deadline passes
- `sort=newest`: Created date descending (default)
- `sort=deadline`: Deadline ascending

---

### GET `/challenges/{id}`

Get detailed challenge information.

**Path Parameters**:
- `id`: Challenge UUID

**Response** `200 OK` (with detail):
```json
{
  "id": "challenge-uuid",
  "corporateName": "HDFC Bank",
  "corporateLogoUrl": "https://cdn.example.com/hdfc-logo.png",
  "title": "Digital Banking Innovation Challenge",
  "sector": "FinTech",
  "theme": "Digital Payments",
  "deadline": "2024-11-30",
  "status": "OPEN",
  "hasDetail": true,
  "problemStatement": "HDFC Bank seeks innovative solutions to enhance...",
  "lookingFor": "- UPI payment innovations\n- Fraud detection AI...",
  "eligibility": "- Registered startup\n- Financial domain experience...",
  "timeline": "- Application deadline: Nov 30\n- Shortlisting: Dec 15...",
  "offerType": "PILOT",
  "applyUrl": "https://hdfc.challenge.com/apply"
}
```

**Response** `200 OK` (without detail):
```json
{
  "id": "challenge-uuid",
  "corporateName": "Tech Corp",
  "corporateLogoUrl": "https://cdn.example.com/logo.png",
  "title": "Innovation Challenge",
  "sector": "Technology",
  "theme": "AI/ML",
  "deadline": "2024-12-31",
  "status": "OPEN",
  "hasDetail": false,
  "applyUrl": "https://techcorp.com/challenge"
}
```

**Notes**:
- If `hasDetail=false`, only card fields + apply URL are returned
- Closed challenges still viewable (status shows `CLOSED`)

---

### GET `/challenges/themes`

Get list of available themes for filtering.

**Response** `200 OK`:
```json
[
  "Digital Payments",
  "AI/ML",
  "Blockchain",
  "Sustainability",
  "Healthcare Tech"
]
```

---

## 🎓 Mentors

### GET `/mentors`

List published and approved mentors.

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `expertise` | string[] | No | Filter by expertise tags (OR logic) |
| `stageId` | UUID | No | Filter by startup stage |
| `sectorId` | UUID | No | Filter by sector |
| `q` | string | No | Search in name, headline, expertise tags |
| `ai` | boolean | No | Use AI ranking (default: false) |
| `page` | integer | No | Page number (0-indexed, default: 0) |
| `size` | integer | No | Page size (max: 50, default: 20) |

**Example Request**:
```http
GET /mentors?expertise=Fundraising&expertise=Pricing&stageId=seed-uuid&ai=true
Authorization: Bearer <access_token>
```

**Response** `200 OK`:
```json
{
  "content": [
    {
      "id": "mentor-uuid",
      "name": "John Smith",
      "photoUrl": "https://cdn.example.com/photos/john.jpg",
      "headline": "VP Product at TechCorp",
      "expertise": ["Fundraising", "Product Strategy", "Go-to-Market"],
      "bookingUrl": "https://cal.com/johnsmith"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 45,
  "totalPages": 3
}
```

**Notes**:
- Only returns `published=true AND status=APPROVED`
- Multiple `expertise` params use OR logic (matches ANY tag)
- Stage/sector filters only match mentors with those fields set

---

### GET `/mentors/{id}`

Get detailed mentor profile.

**Path Parameters**:
- `id`: Mentor UUID

**Response** `200 OK`:
```json
{
  "id": "mentor-uuid",
  "name": "John Smith",
  "photoUrl": "https://cdn.example.com/photos/john.jpg",
  "headline": "VP Product at TechCorp",
  "bio": "15 years of experience in product management...",
  "expertise": ["Fundraising", "Product Strategy", "Go-to-Market"],
  "experience": "Led product teams at Google, Microsoft, and Amazon...",
  "links": [
    {
      "type": "LINKEDIN",
      "url": "https://linkedin.com/in/johnsmith"
    },
    {
      "type": "X",
      "url": "https://x.com/johnsmith"
    }
  ],
  "bookingUrl": "https://cal.com/johnsmith"
}
```

**Notes**:
- Booking happens on cal.com (not tracked by Outpost)
- Unpublished or pending mentors return `404`

**Error Responses**:
- `404 Not Found`: Mentor not found, unpublished, or pending approval

---

### POST `/mentors/apply`

Apply to become a mentor (V2 feature).

**Public endpoint** - No authentication required

**Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "headline": "CTO at StartupCo",
  "bio": "10 years of technical leadership...",
  "expertise": ["Technical Architecture", "Team Building", "Fundraising"],
  "calcomUrl": "https://cal.com/janedoe",
  "photoUrl": "https://example.com/photo.jpg",
  "linkedinUrl": "https://linkedin.com/in/janedoe"
}
```

**Validation**:
- `calcomUrl` must be a cal.com URL
- `expertise`: 1-5 tags required
- `photoUrl` and `linkedinUrl` optional

**Response** `202 Accepted`: Empty body

**Notes**:
- Application goes to admin approval queue
- Duplicate applications for same email return `409 Conflict`
- Rate limited: 5 applications per hour per IP

**Error Responses**:
- `400 Bad Request`: Validation error (invalid cal.com URL, etc.)
- `409 Conflict`: Duplicate pending application for this email

---

## 📚 Lookups

### GET `/lookups/stages`

Get list of startup stages for dropdowns.

**Response** `200 OK`:
```json
[
  {
    "id": "stage-uuid-1",
    "name": "Ideation",
    "sortOrder": 1
  },
  {
    "id": "stage-uuid-2",
    "name": "Seed",
    "sortOrder": 2
  },
  {
    "id": "stage-uuid-3",
    "name": "Series A",
    "sortOrder": 3
  }
]
```

**Notes**:
- Only returns active stages
- Ordered by `sortOrder`

---

### GET `/lookups/sectors`

Get list of sectors for dropdowns.

**Response** `200 OK`:
```json
[
  {
    "id": "sector-uuid-1",
    "name": "FinTech",
    "sortOrder": 1
  },
  {
    "id": "sector-uuid-2",
    "name": "HealthTech",
    "sortOrder": 2
  },
  {
    "id": "sector-uuid-3",
    "name": "EdTech",
    "sortOrder": 3
  }
]
```

**Notes**:
- Only returns active sectors
- Ordered by `sortOrder`

---

## 🔧 Admin Endpoints

All admin endpoints require `ADMIN` role. Include admin JWT token in `Authorization` header.

### Admin Settings

#### GET `/admin/settings/ai`

Get current AI feature flags.

**Response** `200 OK`:
```json
{
  "mentors": true,
  "challenges": true,
  "grants": false
}
```

---

#### PUT `/admin/settings/ai`

Update AI feature flags.

**Request Body**:
```json
{
  "mentors": true,
  "challenges": false,
  "grants": true
}
```

**Response** `200 OK`: Updated settings (same format)

**Notes**:
- All fields required (`@NotNull`)
- Changes take effect immediately (cache evicted)
- Audit trail: `updated_by` tracks admin username

---

### Admin Grants

Base path: `/admin/grants`

- `POST /admin/grants` - Create grant
- `GET /admin/grants` - List all (including unpublished)
- `GET /admin/grants/{id}` - Get grant details
- `PUT /admin/grants/{id}` - Update grant
- `DELETE /admin/grants/{id}` - Delete grant
- `POST /admin/grants/{id}/publish` - Publish grant
- `POST /admin/grants/{id}/unpublish` - Unpublish grant
- `POST /admin/grants/{id}/expire` - Mark as expired

---

### Admin Challenges

Base path: `/admin/challenges`

- `POST /admin/challenges` - Create challenge
- `GET /admin/challenges` - List all (including unpublished)
- `GET /admin/challenges/{id}` - Get challenge details
- `PUT /admin/challenges/{id}` - Update challenge
- `DELETE /admin/challenges/{id}` - Delete challenge
- `POST /admin/challenges/{id}/publish` - Publish challenge
- `POST /admin/challenges/{id}/unpublish` - Unpublish challenge
- `POST /admin/challenges/{id}/close` - Close challenge manually

---

### Admin Mentors

Base path: `/admin/mentors`

- `GET /admin/mentors?status=PENDING` - Get approval queue
- `POST /admin/mentors/{id}/approve` - Approve mentor application
- `POST /admin/mentors/{id}/reject` - Reject with reason
  ```json
  {
    "reason": "Insufficient experience in listed expertise areas"
  }
  ```
- `PUT /admin/mentors/{id}` - Update mentor details
- `DELETE /admin/mentors/{id}` - Soft delete (unpublish)

---

### Admin Lookups

Base path: `/admin/lookups`

#### Stages
- `POST /admin/lookups/stages` - Create stage
- `PUT /admin/lookups/stages/{id}` - Update stage
- `DELETE /admin/lookups/stages/{id}` - Deactivate (409 if referenced)

#### Sectors
- `POST /admin/lookups/sectors` - Create sector
- `PUT /admin/lookups/sectors/{id}` - Update sector
- `DELETE /admin/lookups/sectors/{id}` - Deactivate (409 if referenced)

---

## ⚠️ Error Handling

All errors follow RFC 7807 Problem Details format.

### Standard Error Response

```json
{
  "type": "about:blank",
  "title": "Bad Request",
  "status": 400,
  "detail": "Validation failed for request",
  "instance": "/api/v1/grants",
  "code": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "stageId",
      "message": "Stage not found"
    }
  ]
}
```

### Error Codes

| HTTP Status | Code | Description |
|-------------|------|-------------|
| 400 | `VALIDATION_ERROR` | Request validation failed |
| 400 | `TOKEN_INVALID` | Verification/reset token invalid or expired |
| 401 | `INVALID_CREDENTIALS` | Wrong email or password |
| 401 | `UNAUTHORIZED` | Invalid or expired JWT token |
| 403 | `EMAIL_NOT_VERIFIED` | Email verification required |
| 403 | `ONBOARDING_REQUIRED` | Must complete onboarding first |
| 403 | `FORBIDDEN` | Insufficient permissions |
| 404 | `GRANT_NOT_FOUND` | Grant not found or unpublished |
| 404 | `CHALLENGE_NOT_FOUND` | Challenge not found or unpublished |
| 404 | `MENTOR_NOT_FOUND` | Mentor not found or not approved |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `EMAIL_TAKEN` | Email already registered |
| 409 | `CONFLICT` | Resource conflict (e.g., already onboarded) |
| 409 | `LAST_IDENTITY` | Cannot remove last sign-in method |
| 413 | `PAYLOAD_TOO_LARGE` | Request body too large |
| 429 | `TOO_MANY_REQUESTS` | Rate limit exceeded |
| 500 | `INTERNAL_SERVER_ERROR` | Server error (no details leaked) |

### Validation Error Example

```json
{
  "status": 400,
  "title": "Bad Request",
  "code": "VALIDATION_ERROR",
  "detail": "Validation failed for 2 fields",
  "errors": [
    {
      "field": "email",
      "message": "must be a valid email address"
    },
    {
      "field": "password",
      "message": "must be at least 10 characters"
    }
  ]
}
```

---

## 🚦 Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/auth/resend-verification` | 1 request | 1 minute per email |
| `/auth/forgot-password` | 1 request | 1 minute per email |
| `/mentors/apply` | 5 requests | 1 hour per IP |
| AI ranking (`?ai=true`) | 30 requests | 1 hour per founder |

**Rate Limit Response** `429 Too Many Requests`:
```json
{
  "status": 429,
  "title": "Too Many Requests",
  "code": "TOO_MANY_REQUESTS",
  "detail": "Rate limit exceeded",
  "retryAfter": 45
}
```

**Headers**:
```http
Retry-After: 45
```

---

## 🎯 AI Features

### AI Ranking

Add `ai=true` query parameter to use AI-powered ranking:

```http
GET /mentors?expertise=Fundraising&ai=true
GET /challenges?sectorId=fintech-uuid&ai=true
GET /grants?amountBand=10L_50L&ai=true
```

**How it works**:
1. Filters are applied first (standard database query)
2. Top 30 candidates sent to LLM with founder profile
3. LLM ranks based on relevance to founder's stage, sector, city
4. Ranked results returned with AI reasons

**AI Response Fields**:
```json
{
  "content": [
    {
      "id": "mentor-uuid",
      "name": "John Smith",
      "aiReason": "Expert in seed-stage fundraising for FinTech startups in Bangalore"
    }
  ]
}
```

**Notes**:
- Requires completed onboarding (stage, sector set)
- Falls back to standard ranking if LLM fails
- Cached for 1 hour per unique request
- Admin can disable per module via `/admin/settings/ai`

---

## 📝 Pagination

All list endpoints use cursor-based pagination.

**Standard Response**:
```json
{
  "content": [...],
  "page": 0,
  "size": 20,
  "totalElements": 145,
  "totalPages": 8
}
```

**Empty Results**:
```json
{
  "content": [],
  "page": 0,
  "size": 20,
  "totalElements": 0,
  "totalPages": 0
}
```

**Notes**:
- Empty results return `200 OK` with empty array (not `404`)
- `page` is 0-indexed
- Max `size` is 50 (returns `400` if exceeded)

---

## 🔒 Security Best Practices

### Token Storage
- **Access Token**: Store in memory (React state, not localStorage)
- **Refresh Token**: Store in httpOnly cookie or secure storage
- Never expose tokens in URLs or logs

### Token Refresh Flow
```typescript
// Check token expiry before each request
if (isTokenExpired(accessToken)) {
  const { accessToken, refreshToken } = await refreshTokens();
  // Store new tokens
  // Retry original request
}
```

### CORS
Allowed origins configured server-side. Contact admin to whitelist your domain.

---

## 📞 Support

- **API Issues**: [GitHub Issues](https://github.com/thub/outpost/issues)
- **Questions**: support@thub.in
- **Swagger UI**: `http://localhost:8080/swagger-ui.html` (local dev)
- **OpenAPI Spec**: `http://localhost:8080/v3/api-docs` (JSON)

---

## 📦 SDK / Client Libraries

Coming soon:
- TypeScript/JavaScript SDK
- React hooks library
- Python client

---

## 🔄 Changelog

### v1.0.0 (Current)
- Initial API release
- Authentication (email + OAuth)
- Grants, Challenges, Mentors
- AI-powered ranking
- Admin controls

---

**Last Updated**: October 2026  
**API Version**: 1.0  
**Maintained by**: T-Hub Engineering
