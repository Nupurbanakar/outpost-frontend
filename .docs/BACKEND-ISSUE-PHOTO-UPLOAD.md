# Backend Issue: Photo Upload Endpoint Errors

## Problem

Photo upload endpoint exists at `POST /api/v1/upload/photo` but returns errors:

1. **401 Unauthorized** (first attempt)
2. **500 Internal Server Error** (after retry)

## Error Details

```
POST http://localhost:8080/api/v1/upload/photo
Status: 401 (Unauthorized)

Then retry:
Status: 500 (Internal Server Error)
Response: {
  "status": 500,
  "message": "An unexpected error occurred",
  "code": "INTERNAL_ERROR"
}
```

## Expected Behavior

### Request
```
POST /api/v1/upload/photo
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body:
  file: <image file>
```

### Response (Success)
```json
HTTP 200 OK
{
  "url": "https://your-storage.com/photos/uuid.jpg"
}
```

### Response (Error)
```json
HTTP 4xx/5xx
{
  "message": "Specific error message",
  "detail": "More details about the error"
}
```

## Issues to Fix

### 1. Authentication (401 Error)
**Problem:** Endpoint returns 401 even with valid JWT token.

**Possible causes:**
- Endpoint requires different authentication
- Token not being read from Authorization header
- Missing `@PreAuthorize` or security config

**Fix:** Ensure endpoint accepts standard Bearer token authentication like other endpoints.

### 2. Server Error (500 Error)
**Problem:** After initial 401, subsequent attempts fail with 500 error.

**Possible causes:**
- Exception in file upload handling code
- Missing storage configuration (S3 credentials, etc.)
- File storage directory not writable
- Missing dependencies for file handling

**Fix needed:** Check server logs for stack trace and fix the underlying exception.

## Implementation Checklist

### Backend Requirements

- [ ] **Accept multipart file upload**
  ```java
  @PostMapping("/upload/photo")
  public ResponseEntity<PhotoUploadResponse> uploadPhoto(
      @RequestParam("file") MultipartFile file,
      Authentication auth
  ) {
      // Implementation
  }
  ```

- [ ] **Validate file**
  - Check file is not empty
  - Validate file type (image/jpeg, image/png, image/gif)
  - Validate file size (< 5MB)
  - Return 400 with clear error message if validation fails

- [ ] **Store file securely**
  - Generate unique filename (UUID + original extension)
  - Store in S3/cloud storage or secure server directory
  - Set proper permissions (public read for profile photos)

- [ ] **Return public URL**
  ```json
  {
    "url": "https://storage.example.com/photos/abc-123-def.jpg"
  }
  ```

- [ ] **Handle errors gracefully**
  - 400 for validation errors
  - 413 for file too large
  - 415 for unsupported file type
  - 500 with specific error message for server errors

- [ ] **Security**
  - Require authentication (valid JWT token)
  - Validate content type (not just extension)
  - Sanitize filenames
  - Prevent path traversal attacks
  - Limit upload rate to prevent abuse

### Storage Configuration

**Option 1: AWS S3 (Recommended)**
```yaml
# application.yml
aws:
  s3:
    bucket: your-bucket-name
    region: ap-south-1
    access-key: ${AWS_ACCESS_KEY}
    secret-key: ${AWS_SECRET_KEY}
```

**Option 2: Local Storage (Development)**
```yaml
file:
  upload:
    directory: /var/uploads/photos
    max-size: 5MB
    allowed-types: image/jpeg,image/png,image/gif
```

### Example Implementation

```java
@RestController
@RequestMapping("/api/v1/upload")
public class UploadController {

    @Autowired
    private S3Service s3Service;

    @PostMapping("/photo")
    public ResponseEntity<?> uploadPhoto(
        @RequestParam("file") MultipartFile file,
        Authentication auth
    ) {
        try {
            // Validate
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "File is empty"));
            }

            String contentType = file.getContentType();
            if (!contentType.startsWith("image/")) {
                return ResponseEntity.status(415)
                    .body(Map.of("message", "Only image files are allowed"));
            }

            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.status(413)
                    .body(Map.of("message", "File size must be less than 5MB"));
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(
                originalFilename.lastIndexOf(".")
            );
            String filename = UUID.randomUUID() + extension;

            // Upload to S3
            String url = s3Service.uploadFile(
                file.getInputStream(),
                filename,
                contentType,
                "photos/"
            );

            return ResponseEntity.ok(Map.of("url", url));

        } catch (Exception e) {
            log.error("Photo upload failed", e);
            return ResponseEntity.status(500)
                .body(Map.of(
                    "message", "Upload failed: " + e.getMessage(),
                    "code", "UPLOAD_ERROR"
                ));
        }
    }
}
```

## Testing

### Manual Test with curl
```bash
# Get auth token first
TOKEN="your-jwt-token"

# Upload photo
curl -X POST http://localhost:8080/api/v1/upload/photo \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/photo.jpg"

# Expected response:
# {"url": "https://storage.example.com/photos/abc-123.jpg"}
```

### Test Cases
1. Valid image upload → Should return URL
2. Non-image file → Should return 415 error
3. File too large → Should return 413 error
4. Empty file → Should return 400 error
5. No authentication → Should return 401 error
6. Invalid token → Should return 401 error

## Priority

**HIGH** - Blocking mentor application feature. Mentors cannot upload photos.

## Notes

- Same endpoint pattern should be used for other uploads (e.g., company logos, challenge images)
- Consider rate limiting to prevent abuse
- Add monitoring for failed uploads
- Consider image optimization/resizing on upload to reduce storage costs
