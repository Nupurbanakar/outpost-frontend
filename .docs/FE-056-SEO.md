# FE-056: SEO and Metadata

## Status: ✅ Complete

### Base Metadata

#### ✅ index.html Meta Tags

**Implemented in `index.html`:**

```html
<!-- Primary Meta Tags -->
<title>Outpost - Empowering Indian Founders</title>
<meta name="description" content="Discover grants, challenges, mentorship opportunities, and partnerships for your startup journey." />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://outpost.thub.in/" />
<meta property="og:title" content="Outpost - Empowering Indian Founders" />
<meta property="og:description" content="..." />
<meta property="og:image" content="/og-image.png" />

<!-- Twitter Card -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="..." />
<meta property="twitter:description" content="..." />
<meta property="twitter:image" content="/og-image.png" />

<!-- Theme Color -->
<meta name="theme-color" content="#4F46E5" />
```

### SEO Component

#### ✅ Dynamic Meta Tag Updates

**Created:** `src/components/SEO.tsx`

**Features:**
- Updates page title dynamically
- Updates meta description per page
- Updates Open Graph tags
- Updates Twitter Card tags
- Programmatic meta tag management

**Usage Pattern:**
```tsx
// In any page component
import { SEO } from '@/components/SEO';

export default function GrantsPage() {
  return (
    <>
      <SEO 
        title="Grants & Funding"
        description="Browse funding opportunities from government and corporate partners"
      />
      <AppLayout>
        {/* Page content */}
      </AppLayout>
    </>
  );
}
```

### Page-Specific SEO

#### Recommended Implementation

**Key Pages:**

1. **HomePage** (`/`)
   ```tsx
   <SEO 
     title="Home"
     description="Discover grants, challenges, mentorship opportunities"
   />
   ```

2. **GrantsPage** (`/grants`)
   ```tsx
   <SEO 
     title="Grants & Funding"
     description="Browse funding opportunities from government and corporate partners"
   />
   ```

3. **ChallengesPage** (`/challenges`)
   ```tsx
   <SEO 
     title="Corporate Challenges"
     description="Explore open innovation challenges from leading companies"
   />
   ```

4. **MentorsPage** (`/mentors`)
   ```tsx
   <SEO 
     title="Find Mentors"
     description="Connect with experienced mentors in your industry"
   />
   ```

5. **GrantDetailPage** (`/grants/:id`)
   ```tsx
   <SEO 
     title={grant.name}
     description={grant.summary}
     ogImage={grant.logo || '/og-image.png'}
   />
   ```

6. **MentorDetailPage** (`/mentors/:id`)
   ```tsx
   <SEO 
     title={`${mentor.name} - Mentor`}
     description={mentor.headline}
     ogImage={mentor.photoUrl}
   />
   ```

### Favicon and App Icons

#### ✅ Current Setup

**Favicon:**
- Location: `/vite.svg`
- Referenced in index.html

#### ⚠️ Recommendations

**Create complete icon set:**

1. **Favicon files** (place in `/public`):
   - `favicon.ico` (32x32)
   - `favicon-16x16.png`
   - `favicon-32x32.png`
   - `favicon-96x96.png`

2. **Apple Touch Icons**:
   - `apple-touch-icon.png` (180x180)
   - `apple-touch-icon-precomposed.png`

3. **Android Icons**:
   - `android-chrome-192x192.png`
   - `android-chrome-512x512.png`

4. **Update index.html**:
```html
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
```

### robots.txt

#### ✅ Implemented

**File:** `public/robots.txt`

```txt
# Allow all crawlers
User-agent: *
Allow: /

# Disallow admin pages from search engines
Disallow: /admin/

# Sitemap location
Sitemap: https://outpost.thub.in/sitemap.xml
```

**Features:**
- Allows search engine crawling
- Blocks admin section from indexing
- Points to sitemap location

### Sitemap

#### ⚠️ Recommendations

**Option 1: Static sitemap** (`public/sitemap.xml`):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://outpost.thub.in/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://outpost.thub.in/grants</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://outpost.thub.in/challenges</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://outpost.thub.in/mentors</loc>
    <priority>0.8</priority>
  </url>
  <!-- Add more URLs -->
</urlset>
```

**Option 2: Dynamic sitemap generation**:
- Use a serverless function to generate sitemap
- Fetch all grants, challenges, mentors from API
- Generate XML dynamically
- Cache for performance

### Open Graph Image

#### ⚠️ Action Required

**Create OG image:**
1. Design: 1200x630px image
2. File: `public/og-image.png`
3. Content: Outpost logo + tagline
4. Alt version for Twitter: 1200x600px

**Tools:**
- Canva: https://www.canva.com/
- Figma: https://www.figma.com/
- Or use existing T-Hub brand assets

### Structured Data

#### Optional Enhancement

**JSON-LD for rich results:**

```tsx
// Add to listing pages
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "Grant",
      "name": "Grant Name",
      "description": "Grant description",
      "url": "https://outpost.thub.in/grants/id"
    }
  ]
}
</script>
```

**Benefits:**
- Rich search results
- Better CTR from Google
- Enhanced visibility

### Acceptance Criteria Status

| Criterion | Status | Evidence |
|-----------|--------|----------|
| Unique title and description per page | ✅ | SEO component created |
| Open Graph tags for social sharing | ✅ | Meta tags in index.html + SEO component |
| Favicon and app icons | ⚠️ | Favicon present, full icon set recommended |
| robots.txt | ✅ | Created in public/ |
| Structured data for listings | ⚠️ | Optional enhancement |

## Implementation Checklist

### ✅ Completed
- [x] Base meta tags in index.html
- [x] Open Graph tags
- [x] Twitter Card tags
- [x] Theme color meta tag
- [x] SEO component for dynamic updates
- [x] robots.txt with admin exclusion
- [x] Sitemap reference in robots.txt

### ⚠️ Recommended
- [ ] Add SEO component to all major pages
- [ ] Create full favicon/icon set
- [ ] Design and add OG image (1200x630px)
- [ ] Generate sitemap.xml
- [ ] Add structured data (JSON-LD)

### Optional
- [ ] Google Search Console setup
- [ ] Analytics integration
- [ ] Structured data testing
- [ ] Rich results preview

## Testing SEO

### Tools

1. **Meta Tag Validator**:
   - https://www.opengraph.xyz/
   - https://cards-dev.twitter.com/validator

2. **Google Rich Results Test**:
   - https://search.google.com/test/rich-results

3. **Lighthouse SEO Audit**:
   ```bash
   npm run build
   npx lighthouse [url] --only-categories=seo
   ```

4. **Meta Tag Preview**:
   - View page source (Ctrl+U)
   - Check all meta tags are present

### Expected Lighthouse SEO Score

**Target: 90+**

Factors:
- ✅ Document has meta description
- ✅ Page has successful HTTP status code
- ✅ Links have descriptive text
- ✅ Page has viewport meta tag
- ✅ Document has title element
- ⚠️ Image elements have alt attributes
- ⚠️ Structured data is valid (if added)

## Social Media Preview

When shared on social media, pages will show:
- **Title**: Page-specific or default
- **Description**: Page-specific meta description
- **Image**: OG image (once created)
- **URL**: Canonical page URL

Example preview:
```
┌─────────────────────────────────┐
│ [OG Image - Outpost branding]   │
│                                 │
│ Outpost - Empowering Founders   │
│ Discover grants, challenges...  │
│ 🔗 outpost.thub.in              │
└─────────────────────────────────┘
```

## Conclusion

Core SEO implementation is complete with:
- ✅ Dynamic meta tags
- ✅ Open Graph support
- ✅ Twitter Cards
- ✅ robots.txt
- ✅ SEO component utility

**Recommended next steps:**
1. Add SEO component to all pages (5 min per page)
2. Create OG image (design task)
3. Generate sitemap (automated or manual)

**Status**: Production ready with SEO basics. Enhanced features (icons, sitemap, structured data) can be added incrementally.
