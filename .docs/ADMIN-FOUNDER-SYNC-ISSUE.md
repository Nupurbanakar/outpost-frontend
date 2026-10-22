# Admin-Founder Data Sync Issue

## Problem
When admin edits a grant (title, amount, summary), the changes:
- ✅ **Save successfully** (200 OK response)
- ✅ **Show in admin list** (after refresh)
- ❌ **Don't appear in founder view** (Discovery, Grants list, Grant details)

## Root Cause
The backend has **two separate API endpoints** that appear to serve different data:

### Admin API
- **Endpoint**: `/api/v1/admin/grants/{id}`
- **Method**: PUT (update)
- **Purpose**: Admin CRUD operations
- **Response format**: `{ name, published, expired, ... }`

### Founder API  
- **Endpoint**: `/api/v1/grants/{id}`
- **Method**: GET (read-only)
- **Purpose**: Founder discovery
- **Response format**: `{ title, status, ... }`

## Evidence
1. **Admin edit succeeds**:
   ```json
   PUT /api/v1/admin/grants/7b140936-aeaa-42e0-8398-96ea2f05c9bf
   Status: 200 OK
   Response: {
     "name": "STARTUP101",  // Updated successfully
     "updatedAt": "2026-10-22T08:02:20.249676Z"
   }
   ```

2. **Founder view shows old data**:
   ```
   GET /api/v1/grants/7b140936-aeaa-42e0-8398-96ea2f05c9bf
   Response: {
     "title": "Startup India Seed Fund"  // Still old title
   }
   ```

## Possible Backend Issues

### Option 1: Cache Not Invalidated
- Founder API caches grant data
- Admin updates don't invalidate the cache
- Cache TTL (time-to-live) hasn't expired yet

**Solution**: Invalidate founder API cache when admin makes changes

### Option 2: Separate Database Tables
- Admin API writes to `admin_grants` table
- Founder API reads from `founder_grants` table
- No sync mechanism between them

**Solution**: Use single source of truth, or add sync job

### Option 3: View/Materialized View
- Founder API reads from pre-computed view
- View hasn't refreshed after admin update

**Solution**: Refresh view after admin changes

## Backend Fix Needed

The backend should ensure that when admin updates a grant:

```java
@PutMapping("/admin/grants/{id}")
public GrantResponse updateGrant(@PathVariable String id, @RequestBody GrantRequest request) {
    // Update grant
    Grant grant = grantService.update(id, request);
    
    // IMPORTANT: Invalidate caches
    cacheManager.evict("grants", id);
    cacheManager.evict("grants-list");
    
    // Or: Trigger view refresh
    // grantViewService.refresh();
    
    return toResponse(grant);
}
```

## Frontend Status

✅ Frontend is working correctly:
- Admin edits send correct data to backend
- Frontend transforms response formats correctly
- Frontend refreshes lists after changes
- Frontend adds cache-busting where possible

❌ This is a **backend data consistency issue** that frontend cannot fix.

## Temporary Workarounds

### For Testing
1. **Hard refresh** browser (Ctrl+Shift+R)
2. **Clear browser cache**
3. **Wait** for cache TTL to expire (could be minutes/hours)

### For Users
Not ideal - users shouldn't need to wait or clear cache to see updates.

## Verification Steps

Backend team should verify:

1. **Check if caching is enabled**:
   ```bash
   # Look for @Cacheable annotations
   grep -r "@Cacheable" src/
   ```

2. **Check database queries**:
   ```sql
   -- Do both endpoints query same table?
   -- Check the actual SQL being executed
   ```

3. **Test the flow**:
   ```bash
   # Update via admin API
   curl -X PUT http://localhost:8080/api/v1/admin/grants/{id} \
     -H "Authorization: Bearer {token}" \
     -d '{"name": "UPDATED TITLE"}'
   
   # Immediately fetch via founder API
   curl http://localhost:8080/api/v1/grants/{id}
   
   # Should show "UPDATED TITLE" immediately
   ```

## Recommended Solution

**Option A**: Single source with cache invalidation
```java
@Service
public class GrantService {
    @CacheEvict(value = "grants", key = "#id")
    public Grant update(String id, GrantRequest request) {
        // Update logic
    }
    
    @Cacheable(value = "grants", key = "#id")
    public Grant findById(String id) {
        // Fetch logic
    }
}
```

**Option B**: Event-driven sync
```java
@Service
public class GrantService {
    @Autowired
    private ApplicationEventPublisher eventPublisher;
    
    public Grant update(String id, GrantRequest request) {
        Grant grant = // update logic
        eventPublisher.publishEvent(new GrantUpdatedEvent(grant));
        return grant;
    }
}

@EventListener
public void onGrantUpdated(GrantUpdatedEvent event) {
    // Invalidate caches, refresh views, etc.
}
```

## Impact

**High Priority**: This breaks the admin workflow
- Admins can't verify their changes
- Founders see stale data
- Content management is unreliable

This should be fixed before production deployment.
