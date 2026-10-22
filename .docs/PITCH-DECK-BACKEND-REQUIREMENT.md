# Pitch Deck Download - Backend Requirement

## Issue
Frontend cannot download pitch deck files when backend returns `302 redirect` to S3.

**Error:** `ERR_UNSAFE_REDIRECT` - Browser blocks XHR requests from following redirects to external domains (S3) for security reasons.

## Current Backend Behavior
```
GET /api/v1/me/pitch-deck
→ 302 Found
→ Location: https://s3.amazonaws.com/bucket/file.pdf?signature=...
```

This works in browser address bar but fails in:
- `fetch()` with `redirect: 'manual'` (can't access Location header due to CORS)
- `axios` with `responseType: 'blob'` (ERR_UNSAFE_REDIRECT)
- Any XHR request (security restriction)

## Required Backend Fix

### Option 1: Return Pre-signed URL (Recommended)
**Endpoint:** `GET /api/v1/me/pitch-deck/url`

**Response:**
```json
{
  "url": "https://s3.amazonaws.com/bucket/file.pdf?signature=...",
  "expiresIn": 3600
}
```

Frontend can then use this URL directly:
```typescript
const { url } = await foundersApi.getPitchDeckUrl();
window.open(url, '_blank'); // Works!
```

### Option 2: Stream File Through Backend
Keep current endpoint but stream the file content instead of redirecting:

```java
@GetMapping("/me/pitch-deck")
public ResponseEntity<Resource> downloadPitchDeck() {
    // Download from S3
    S3Object s3Object = s3Client.getObject(bucket, key);
    
    // Stream to client
    return ResponseEntity.ok()
        .contentType(MediaType.APPLICATION_PDF)
        .header("Content-Disposition", "attachment; filename=\"pitch-deck.pdf\"")
        .body(new InputStreamResource(s3Object.getObjectContent()));
}
```

**Trade-off:** Uses backend bandwidth, but works with Authorization header.

## Current Workaround
Frontend opens download in new tab: `window.open(url, '_blank')`

**Limitation:** 
- Can't send Authorization header
- May fail with 401 if backend requires auth
- Not a programmatic download

## Recommendation
Implement **Option 1** - return pre-signed S3 URL. This is:
- Most efficient (direct S3 download)
- Secure (pre-signed URL expires)
- Simple to implement
- Standard practice for S3 file downloads
