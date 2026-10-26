# Backend Issue: Pitch Deck Not Viewable/Downloadable

**Date:** October 26, 2026  
**Status:** 🔴 Blocked - Backend Issue  
**Impact:** Founders cannot view or download uploaded pitch decks

## Problem

After uploading a pitch deck PDF, founders cannot:
- ✗ View the pitch deck in browser
- ✗ Download the pitch deck file
- ✗ Verify the upload was successful

## Root Cause

The backend endpoint `GET /api/v1/me/pitch-deck` has implementation issues:

### Issue 1: 302 Redirect Handling
```
GET /api/v1/me/pitch-deck
→ Returns 302 redirect to S3 URL
→ Browser cannot follow redirect with Authorization header
→ Results in CORS error or 403 Forbidden from S3
```

**Why This Fails:**
- XHR/Fetch requests cannot follow 302 redirects that change domains (security)
- Authorization header is needed for backend endpoint but not forwarded to S3
- S3 bucket returns 403 if accessed without proper credentials

### Issue 2: Missing Info Endpoint
```
GET /api/v1/me/pitch-deck/info
→ Should return: { fileName: string, sizeBytes: number }
→ Current status: May not be implemented
→ Used to check if pitch deck exists without downloading
```

## Current Frontend Workaround

**File:** `src/components/profile/PitchDeckUpload.tsx`

### View Option (Opens in New Tab)
```typescript
const handleView = () => {
  window.open(currentDeckUrl, '_blank');
};
```
- ✓ Browser can follow 302 redirect naturally
- ✗ May fail if backend doesn't accept cookies/session
- ✗ User sees error page instead of PDF if auth fails

### Download Option (Fetch with Auth)
```typescript
const handleDownload = async () => {
  const response = await apiClient.get(currentDeckUrl, {
    responseType: 'blob',
  });
  const blob = new Blob([response.data], { type: 'application/pdf' });
  const blobUrl = window.URL.createObjectURL(blob);
  // Trigger download...
};
```
- ✓ Sends Authorization header correctly
- ✗ Fails if backend returns 302 redirect (CORS error)
- ✗ Cannot follow cross-origin redirects

## Backend Requirements

### Solution 1: Return Pre-Signed S3 URLs (Recommended ✅)

Instead of returning 302 redirects, return the S3 URL directly:

```json
// POST /api/v1/me/pitch-deck (upload)
{
  "url": "https://s3.amazonaws.com/bucket/founder-123/pitch-deck.pdf?signature=..."
}

// GET /api/v1/me/pitch-deck (download)
// Redirect 302 to pre-signed URL with expiry (e.g., 1 hour)
// OR return JSON: { "url": "https://...", "expiresAt": "..." }
```

**Benefits:**
- ✅ No CORS issues (browser accesses S3 directly)
- ✅ Works with both View and Download
- ✅ No authentication needed on S3 (URL has temporary signature)
- ✅ Can set expiry for security

**Implementation:**
```java
// Generate pre-signed URL with expiry
String presignedUrl = s3Client.generatePresignedUrl(
    bucketName,
    objectKey,
    Date.from(Instant.now().plus(1, ChronoUnit.HOURS)),
    HttpMethod.GET
);
return presignedUrl;
```

### Solution 2: Stream File Directly

Return the file content directly (no redirect):

```java
@GetMapping("/me/pitch-deck")
public ResponseEntity<Resource> downloadPitchDeck() {
    S3Object s3Object = s3Client.getObject(bucketName, key);
    
    return ResponseEntity.ok()
        .contentType(MediaType.APPLICATION_PDF)
        .header(HttpHeaders.CONTENT_DISPOSITION, 
                "attachment; filename=\"pitch-deck.pdf\"")
        .body(new InputStreamResource(s3Object.getObjectContent()));
}
```

**Benefits:**
- ✅ Works with Authorization header
- ✅ Frontend can use standard fetch with blob response
- ✅ More secure (backend controls access)

**Drawbacks:**
- ⚠️ Higher backend bandwidth usage (files proxy through backend)
- ⚠️ Slower for large files

### Solution 3: Cookie-Based Auth

Use cookies instead of Authorization header for this endpoint:

**Drawbacks:**
- ⚠️ Requires dual auth system (token + cookie)
- ⚠️ More complex implementation
- ⚠️ Not recommended for API-first architecture

## Info Endpoint Implementation

Add metadata endpoint to check if pitch deck exists:

```java
@GetMapping("/me/pitch-deck/info")
public PitchDeckInfo getPitchDeckInfo() {
    // Check if file exists in S3
    if (!s3Client.doesObjectExist(bucketName, key)) {
        throw new NotFoundException("No pitch deck found");
    }
    
    ObjectMetadata metadata = s3Client.getObjectMetadata(bucketName, key);
    
    return new PitchDeckInfo(
        "pitch-deck.pdf",
        metadata.getContentLength()
    );
}
```

**Benefits:**
- ✅ Fast check without downloading file
- ✅ Can show file size to user
- ✅ Better UX (show "Uploaded ✓" immediately)

## Testing Steps

Once backend is fixed:

1. **Upload Test:**
   ```bash
   # Upload a test PDF
   curl -X PUT http://localhost:8080/api/v1/me/pitch-deck \
     -H "Authorization: Bearer $TOKEN" \
     -F "file=@test.pdf"
   ```

2. **Info Check:**
   ```bash
   # Check if file exists
   curl http://localhost:8080/api/v1/me/pitch-deck/info \
     -H "Authorization: Bearer $TOKEN"
   # Expected: { "fileName": "pitch-deck.pdf", "sizeBytes": 12345 }
   ```

3. **Download Test:**
   ```bash
   # Try to download
   curl http://localhost:8080/api/v1/me/pitch-deck \
     -H "Authorization: Bearer $TOKEN" \
     -o downloaded.pdf
   # Expected: 200 OK with PDF content OR 302 to pre-signed URL
   ```

4. **Browser Test:**
   - Upload pitch deck in UI
   - Click "View" - should open PDF in new tab
   - Click "Download" - should download file
   - Refresh page - should still show "Current Pitch Deck"

## Recommendation

**Use Solution 1 (Pre-Signed URLs)** for best user experience:

1. Modify upload endpoint to return pre-signed URL in response
2. Store the S3 key (not URL) in database
3. Generate fresh pre-signed URL on GET requests (with 1-hour expiry)
4. Frontend can use URL directly for view/download

This is the industry-standard approach used by major platforms.

## Related Files

- `src/components/profile/PitchDeckUpload.tsx` - Upload component with View/Download
- `src/api/endpoints/founders.ts` - API client (uploadPitchDeck, hasPitchDeck, deletePitchDeck)
- `src/pages/ProfilePage.tsx` - Profile page that shows pitch deck section

## Similar Issues

- `.docs/BACKEND-ISSUE-PHOTO-UPLOAD.md` - Similar S3 upload issue with photos
- Pattern: File uploads need pre-signed URLs or direct streaming
