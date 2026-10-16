# Outpost API Reference

Base URL: `http://localhost:8080` (local) | `https://outpost-<name>.<platform>/` (production)

Swagger UI: `{baseUrl}/swagger-ui.html`
OpenAPI JSON: `{baseUrl}/v3/api-docs`

---

## Authentication

All `/api/v1/**` endpoints except public listings require a JWT Bearer token.

```
Authorization: Bearer <accessToken>
```

Tokens expire in 15 minutes. Use `/auth/refresh` to get a new pair.

---

## Public Endpoints (no auth required)

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/signup` | Register with email + password |
| POST | `/api/v1/auth/login` | Login → access + refresh tokens |
| POST | `/api/v1/auth/refresh` | Refresh token → new token pair |
| POST | `/api/v1/auth/verify` | Verify email with token |
| POST | `/api/v1/auth/resend-verification` | Resend verification email |
| POST | `/api/v1/auth/forgot-password` | Request password reset email |
| POST | `/api/v1/auth/reset-password` | Reset password with token |
| POST | `/api/v1/auth/oauth/google` | Login/signup with Google ID token |

### Lookups

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/lookups/stages` | List all startup stages |
| GET | `/api/v1/lookups/sectors` | List all sectors |

### Grants (public listing)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/grants` | List published grants |
| GET | `/api/v1/grants/{id}` | Get grant detail |

**Query params:** `issuingBodyType`, `type`, `stageId`, `sectorId`, `amountBand`, `deadline`, `q`, `includeExpired`, `ai` (requires auth)

### Challenges (public listing)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/challenges` | List published challenges |
| GET | `/api/v1/challenges/{id}` | Get challenge detail |
| GET | `/api/v1/challenges/{id}/apply` | Get apply URL |
| GET | `/api/v1/challenges/themes` | List distinct themes |

**Query params:** `sectorId`, `theme`, `corporate`, `status`, `q`, `sort`, `ai` (requires auth)

### Mentors (public listing)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/mentors` | List published approved mentors |
| GET | `/api/v1/mentors/{id}` | Get mentor detail |
| POST | `/api/v1/mentors/apply` | Submit mentor application |

**Query params:** `expertise[]`, `stageId`, `sectorId`, `q`, `ai` (requires auth)

---

## Authenticated Endpoints (founder token required)

### Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/me` | Get current founder profile |
| PATCH | `/api/v1/me` | Update profile fields |
| PUT | `/api/v1/me/password` | Change password |
| GET | `/api/v1/me/identities` | List linked OAuth providers |
| DELETE | `/api/v1/me/identities/{provider}` | Unlink OAuth provider |

### Onboarding

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/me/onboarding` | Complete onboarding (startup name, stage, sector) |

### AI Search (requires auth + onboarding complete)

Add `?ai=true` to any listing endpoint:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/mentors?ai=true` | AI-ranked mentors by founder profile |
| GET | `/api/v1/challenges?ai=true` | AI-ranked challenges |
| GET | `/api/v1/grants?ai=true` | AI-ranked grants |

Response includes `aiApplied: boolean` and per-item `aiReason: string`.

---

## Admin Endpoints (admin role required)

### Grants Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/grants` | List all grants (inc. draft/expired) |
| POST | `/api/v1/admin/grants` | Create grant |
| GET | `/api/v1/admin/grants/{id}` | Get grant |
| PUT | `/api/v1/admin/grants/{id}` | Update grant |
| DELETE | `/api/v1/admin/grants/{id}` | Soft delete grant |
| POST | `/api/v1/admin/grants/{id}/publish` | Publish grant |
| POST | `/api/v1/admin/grants/{id}/unpublish` | Unpublish grant |
| POST | `/api/v1/admin/grants/{id}/expire` | Mark grant as expired |

### Challenges Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/challenges` | List all challenges |
| POST | `/api/v1/admin/challenges` | Create challenge |
| GET | `/api/v1/admin/challenges/{id}` | Get challenge |
| PUT | `/api/v1/admin/challenges/{id}` | Update challenge |
| DELETE | `/api/v1/admin/challenges/{id}` | Delete challenge |
| POST | `/api/v1/admin/challenges/{id}/publish` | Publish |
| POST | `/api/v1/admin/challenges/{id}/unpublish` | Unpublish |
| POST | `/api/v1/admin/challenges/{id}/close` | Close challenge |

### Mentors Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/mentors` | List all mentors (inc. pending) |
| GET | `/api/v1/admin/mentors/{id}` | Get mentor |
| PUT | `/api/v1/admin/mentors/{id}` | Update mentor |
| DELETE | `/api/v1/admin/mentors/{id}` | Delete mentor |
| POST | `/api/v1/admin/mentors/{id}/approve` | Approve mentor application |
| POST | `/api/v1/admin/mentors/{id}/reject` | Reject mentor application |
| POST | `/api/v1/admin/mentors/import` | Bulk import mentors from CSV |

### Partners Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/partners` | List all partners |
| POST | `/api/v1/admin/partners` | Create partner |
| GET | `/api/v1/admin/partners/{id}` | Get partner |
| PUT | `/api/v1/admin/partners/{id}` | Update partner |
| DELETE | `/api/v1/admin/partners/{id}` | Delete partner |
| POST | `/api/v1/admin/partners/{id}/feature` | Feature partner |
| POST | `/api/v1/admin/partners/{id}/unfeature` | Unfeature partner |

### Offers Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/offers` | List all offers |
| POST | `/api/v1/admin/offers` | Create offer |
| GET | `/api/v1/admin/offers/{id}` | Get offer |
| PUT | `/api/v1/admin/offers/{id}` | Update offer |
| DELETE | `/api/v1/admin/offers/{id}` | Delete offer |
| POST | `/api/v1/admin/offers/{id}/publish` | Publish offer |
| POST | `/api/v1/admin/offers/{id}/unpublish` | Unpublish offer |

### Lookups Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/admin/lookups/stages` | Create stage |
| PUT | `/api/v1/admin/lookups/stages/{id}` | Update stage |
| DELETE | `/api/v1/admin/lookups/stages/{id}` | Delete stage |
| POST | `/api/v1/admin/lookups/sectors` | Create sector |
| PUT | `/api/v1/admin/lookups/sectors/{id}` | Update sector |
| DELETE | `/api/v1/admin/lookups/sectors/{id}` | Delete sector |

---

## Common Response Shapes

### Paginated List

```json
{
  "content": [...],
  "page": {
    "number": 0,
    "size": 20,
    "totalElements": 42,
    "totalPages": 3
  }
}
```

### Error Response

```json
{
  "status": 400,
  "error": "Bad Request",
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "errors": ["email: must be a valid email"]
}
```

### Token Response (login/signup/refresh)

```json
{
  "accessToken": "eyJ...",
  "refreshToken": "550e8400-e29b...",
  "expiresIn": 900
}
```

---

## AI Search Response Shape

When `?ai=true`:

```json
{
  "content": [
    {
      "id": "...",
      "name": "Alice Smith",
      "headline": "Product Lead",
      "aiReason": "Fintech product experience matches your payments focus",
      "aiApplied": true
    }
  ],
  "page": {...}
}
```

When AI fails or `?ai=false`: `aiReason: null`, `aiApplied: false`.

---

## Notes for Frontend

1. **CORS**: configured for `http://localhost:3000` in dev
2. **Tokens**: store in `localStorage` or secure cookie, attach to every request
3. **Refresh flow**: if 401, call `/auth/refresh` with refresh token, retry original request
4. **AI search**: requires auth + completed onboarding; falls back gracefully
5. **Pagination**: default 20 items, max 50, use `?page=0&size=10`
6. **Sorting**: `?sort=createdAt,desc` or `?sort=name,asc`
