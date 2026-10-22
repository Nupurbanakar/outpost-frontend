# Admin Portal - Setup & Features

## Overview
The admin portal allows administrators to manage all content (grants, challenges, mentors) that appears on the founder-facing discovery pages.

## Access Requirements

### 1. Set User Role to ADMIN
```sql
-- Connect to your database and run:
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

### 2. Logout and Login Again
- The user object in localStorage needs to be refreshed
- Click profile → Logout
- Login again with your credentials

### 3. Access Admin Portal
Once logged in as ADMIN:
- **Dashboard:** http://localhost:3000/admin
- **Grants Management:** http://localhost:3000/admin/grants
- **Challenges Management:** http://localhost:3000/admin/challenges
- **Mentors Management:** http://localhost:3000/admin/mentors
- **Spotlight Management:** http://localhost:3000/admin/spotlight

## Features Implemented

### ✅ Admin Grants Management (`/admin/grants`)

**List View:**
- View all grants (DRAFT, PUBLISHED, EXPIRED)
- Filter by status (ALL/DRAFT/PUBLISHED/EXPIRED)
- Pagination (20 per page)
- Shows: Title, Type, Status, Amount, Deadline

**Actions:**
- **Publish** (DRAFT → PUBLISHED) - Makes grant visible to founders
- **Unpublish** (PUBLISHED → DRAFT) - Hides grant from founders
- **Expire** (PUBLISHED → EXPIRED) - Marks as expired
- **Delete** - Permanently remove grant (with confirmation)

**Backend API Integration:**
- `GET /api/v1/admin/grants` - List all grants
- `POST /api/v1/admin/grants/{id}/publish` - Publish grant
- `POST /api/v1/admin/grants/{id}/unpublish` - Unpublish grant
- `POST /api/v1/admin/grants/{id}/expire` - Expire grant
- `DELETE /api/v1/admin/grants/{id}` - Delete grant

**Data Flow:**
```
Admin creates grant (backend) → Status: DRAFT
Admin clicks "Publish" → Status: PUBLISHED
Founder visits /discover or /grants → Sees published grant! ✅
Admin clicks "Unpublish" → Status: DRAFT
Founder refreshes → Grant disappears from view
```

### 🚧 To Be Implemented

#### Grants - Create/Edit Forms
- Modal or page to create new grant
- Form fields: title, issuing body, type, amount, deadline, eligibility, etc.
- Edit existing grant details
- Multi-select for stages and sectors

#### Challenges Management (`/admin/challenges`)
- Same CRUD interface as grants
- Publish/unpublish/close actions
- Filter by status

#### Mentors Management (`/admin/mentors`)
- List mentors by status (PENDING/APPROVED/REJECTED)
- Approve/Reject pending mentor applications
- Edit mentor details
- CSV import functionality

#### Dashboard (`/admin`)
- Total grants by status (draft/published/expired)
- Total challenges by status
- Pending mentor approvals count
- Recent activity log

## Security

**AdminRoute Component:**
- Checks user authentication
- Verifies user role is ADMIN
- Redirects non-admin users to /discover
- Located: `src/components/AdminRoute.tsx`

**Protected Routes:**
All `/admin/*` routes use `<AdminRoute>` wrapper in `src/App.tsx`

## Troubleshooting

### "Failed to load grants"
**Cause:** Backend is not running or endpoint returned error
**Fix:** 
- Check backend is running on http://localhost:8080
- Check Swagger UI: http://localhost:8080/swagger-ui.html
- Verify admin grants endpoint exists

### Redirects to /discover when accessing /admin
**Cause:** User role is not ADMIN
**Fix:**
1. Check role: `JSON.parse(localStorage.getItem('user')).role`
2. If not ADMIN, update database
3. Logout and login again

### Admin page shows empty list
**Possible causes:**
1. No grants created yet (create via backend/Swagger)
2. Backend not seeded with data
3. API error (check browser console)

## Next Steps

1. **Create Grant Form** - Allow admin to create grants from UI
2. **Edit Grant Form** - Modal to edit existing grants
3. **Challenges CRUD** - Implement full challenges management
4. **Mentors Management** - Approve/reject mentors
5. **Dashboard Stats** - Real-time statistics and charts

## API Client

Admin API client: `src/api/endpoints/admin/grants.ts`

Example usage:
```typescript
import { adminGrantsApi } from '@/api/endpoints/admin/grants';

// List grants
const response = await adminGrantsApi.listGrants({
  status: 'PUBLISHED',
  page: 1,
  size: 20,
});

// Publish a grant
await adminGrantsApi.publishGrant(grantId);

// Delete a grant
await adminGrantsApi.deleteGrant(grantId);
```

## Testing the Flow

1. **Backend:** Create a grant via Swagger (status: DRAFT)
2. **Admin Portal:** Login as admin, go to /admin/grants
3. **Admin Action:** Click "Publish" on the grant
4. **Founder View:** Logout, login as founder, visit /discover
5. **Verify:** Published grant should appear! ✅

---

**Status:** Admin Grants Management is live and functional! 🎉
**Next Priority:** Build create/edit grant forms
