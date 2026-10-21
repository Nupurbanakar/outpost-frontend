# Manual Testing Guide - Outpost Frontend

## 🚨 Prerequisites Issue Detected

**Current Node version:** v14.21.3  
**Required Node version:** v18 or higher

### Fix: Upgrade Node.js

**Option 1: Using nvm (Recommended)**
```bash
# Install nvm if you don't have it
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node 18
nvm install 18

# Use Node 18
nvm use 18

# Verify
node --version  # Should show v18.x.x
```

**Option 2: Direct Download**
- Download Node.js 18 LTS from: https://nodejs.org/
- Install and restart terminal

---

## 🚀 Starting the Application

### 1. Start Backend (Already Running ✅)
Backend is running on port 8080

### 2. Start Frontend
```bash
cd /Users/nupurbanakar/Desktop/outpost-frontend

# Install dependencies (if needed)
npm install

# Start dev server
npm run dev
```

**Expected output:**
```
  VITE v4.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Access the app:** http://localhost:5173

---

## 🧪 Testing Flows

### Flow 1: Signup & Onboarding (3 min)

1. **Navigate to Signup**
   - Go to: http://localhost:5173/signup
   - Or click "Sign Up" from homepage

2. **Create Account**
   - Email: `test@example.com`
   - Password: `password123`
   - Click "Create Account"
   - ✅ Should show success message

3. **Email Verification**
   - In demo: Email would be sent
   - For testing: Manually verify or use pre-verified account

4. **Complete Onboarding**
   - Step 1: Enter name and startup name
   - Step 2: Select city (e.g., Hyderabad)
   - Step 3: Select stage (e.g., Seed)
   - Step 4: Select sector (e.g., FinTech)
   - Click "Complete Profile"
   - ✅ Should redirect to `/discover`

---

### Flow 2: Discover & Browse Grants (2 min)

1. **View Discover Page**
   - URL: http://localhost:5173/discover
   - ✅ See spotlight section
   - ✅ See curated opportunities
   - ✅ See featured mentors

2. **Navigate to Grants**
   - Click "View All Grants"
   - URL: http://localhost:5173/grants
   - ✅ See list of grants

3. **Filter Grants**
   - Select stage filter
   - Select sector filter
   - Enter minimum amount
   - ✅ Results update

4. **Toggle AI Recommendations**
   - Turn on "AI Recommendations" toggle
   - ✅ See AI reason badges
   - ✅ Grants reordered by AI score

5. **View Grant Detail**
   - Click on a grant card
   - URL: http://localhost:5173/grants/:id
   - ✅ See full grant details
   - ✅ See "Apply Now" button

---

### Flow 3: Browse Mentors & Book (2 min)

1. **Navigate to Mentors**
   - URL: http://localhost:5173/mentors
   - ✅ See mentor cards

2. **Filter by Expertise**
   - Select expertise (e.g., "Fundraising")
   - ✅ Results filtered

3. **Toggle AI Recommendations**
   - Turn on AI toggle
   - ✅ See AI match reasons

4. **View Mentor Profile**
   - Click on a mentor card
   - URL: http://localhost:5173/mentors/:id
   - ✅ See bio, expertise, social links

5. **Book Session**
   - Click "Book a Session"
   - ✅ Cal.com booking modal opens

---

### Flow 4: Global Search (1 min)

1. **Open Search Modal**
   - Press `⌘K` (Mac) or `Ctrl+K` (Windows/Linux)
   - ✅ Search modal appears

2. **Search for Content**
   - Type: "funding"
   - ✅ See results from grants, challenges, mentors

3. **Keyboard Navigation**
   - Press `↓` to move down results
   - Press `↑` to move up results
   - Press `Enter` to open selected result
   - Press `Esc` to close modal

4. **Click to Navigate**
   - Click any result
   - ✅ Navigate to detail page

---

### Flow 5: Profile Management (2 min)

1. **View Profile**
   - URL: http://localhost:5173/profile
   - ✅ See profile information

2. **Edit Profile**
   - Click "Edit Profile" button
   - ✅ Fields become editable

3. **Update Information**
   - Edit first name, last name
   - Update bio (textarea)
   - Add LinkedIn URL
   - Add Twitter URL
   - Click "Save Changes"
   - ✅ Success message appears

4. **Upload Pitch Deck**
   - Find "Pitch Deck" section
   - Drag & drop PDF or click to upload
   - ✅ Upload progress shown
   - ✅ File name displayed after upload

---

### Flow 6: Bookmarks (1 min)

1. **Bookmark an Item**
   - Go to grants or challenges listing
   - Click bookmark icon on a card
   - ✅ Icon fills/changes state

2. **View Saved Items**
   - Click "Saved" in navigation
   - URL: http://localhost:5173/saved
   - ✅ See bookmarked items

3. **Remove Bookmark**
   - Click bookmark icon again
   - ✅ Item removed from saved list

4. **Test Persistence**
   - Bookmark an item
   - Navigate away
   - Return to saved items
   - ✅ Bookmark still there

---

### Flow 7: Mobile View (2 min)

1. **Open DevTools**
   - Press `F12` or `Cmd+Option+I`
   - Click device toolbar icon (or `Cmd+Shift+M`)

2. **Select Mobile Device**
   - Choose "iPhone 12" or similar
   - Viewport: 390x844

3. **Test Mobile Navigation**
   - ✅ Bottom navigation bar visible
   - ✅ Tap navigation items
   - ✅ No horizontal scroll

4. **Test Touch Interactions**
   - ✅ Buttons are large enough (44x44px)
   - ✅ Cards are tappable
   - ✅ Forms are usable

5. **Test Search on Mobile**
   - Press `Cmd+K`
   - ✅ Full-width search modal
   - ✅ Easy to type and select

---

### Flow 8: Error States (1 min)

1. **Test 404 Page**
   - Navigate to: http://localhost:5173/invalid-route
   - ✅ See custom 404 page
   - ✅ "Back to Home" link works

2. **Test Invalid ID**
   - Navigate to: http://localhost:5173/grants/99999
   - ✅ Shows error or 404

3. **Test Empty States**
   - Filter grants with impossible criteria
   - ✅ See "No results found" message

---

## 🎯 Key Features to Verify

### Core Features
- [ ] Authentication (signup, login, logout)
- [ ] Onboarding (4-step form)
- [ ] Discover page (spotlight, curated content)
- [ ] Grants listing & filtering
- [ ] Mentors listing & filtering
- [ ] AI recommendations toggle
- [ ] Global search (⌘K)
- [ ] Profile editing
- [ ] Bookmarks/Saved items
- [ ] Mobile navigation

### Polish Features
- [ ] Loading states on all pages
- [ ] Error pages (404)
- [ ] Empty states
- [ ] Form validation
- [ ] Success/error toasts
- [ ] Responsive design
- [ ] Keyboard navigation

### Integration Points
- [ ] API calls to backend (http://localhost:8080)
- [ ] Cal.com booking widget
- [ ] File upload (pitch deck)

---

## 🐛 Known Issues to Note

1. **Admin pages are stubs** - Not fully implemented
2. **Benefits/Talent Pool** - V2 features, may show empty
3. **Search API** - Requires backend implementation
4. **Email verification** - Requires email service setup

---

## 📊 Performance Checks

### Lighthouse Audit
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run audit
4. **Expected scores:**
   - Performance: > 90
   - Accessibility: > 90
   - Best Practices: > 90
   - SEO: > 90

### Network Tab
1. Open Network tab in DevTools
2. Navigate through app
3. Check:
   - ✅ API calls are cached (React Query)
   - ✅ No failed requests
   - ✅ Fast response times

---

## 🎨 UI/UX Checks

### Visual Consistency
- [ ] Consistent spacing and padding
- [ ] Consistent button styles
- [ ] Consistent typography
- [ ] Proper color contrast
- [ ] Icons align with text

### Interactions
- [ ] Hover states on buttons/links
- [ ] Focus states visible
- [ ] Loading spinners appear
- [ ] Smooth transitions
- [ ] No layout shift

### Responsiveness
- [ ] Works at 320px width (small mobile)
- [ ] Works at 768px width (tablet)
- [ ] Works at 1024px width (laptop)
- [ ] Works at 1440px+ (desktop)

---

## 🔄 Quick Test Script (5 minutes)

**Fast comprehensive test:**

1. **Signup** → Enter credentials → Success ✅
2. **Onboarding** → Complete 4 steps → Redirect ✅
3. **Discover** → See content → Navigate ✅
4. **Grants** → Filter → AI toggle → Detail ✅
5. **Mentors** → View profile → Booking button ✅
6. **Search** → `⌘K` → Type → Navigate ✅
7. **Profile** → Edit → Save → Success ✅
8. **Bookmark** → Add → View saved → Remove ✅
9. **Mobile** → Resize → Bottom nav → Tap ✅
10. **404** → Invalid URL → Custom page ✅

---

## 📝 Feedback Template

**What to note during testing:**

```markdown
## Testing Session - [Date]

### Environment
- Node version: [version]
- Browser: [Chrome/Firefox/Safari]
- Screen size: [resolution]

### Flows Tested
- [ ] Flow 1: Signup & Onboarding
- [ ] Flow 2: Discover & Grants
- [ ] Flow 3: Mentors & Booking
- [ ] Flow 4: Global Search
- [ ] Flow 5: Profile Management
- [ ] Flow 6: Bookmarks
- [ ] Flow 7: Mobile View
- [ ] Flow 8: Error States

### Issues Found
1. [Description] - [Severity: Critical/High/Medium/Low]
2. ...

### Suggestions
1. [Improvement idea]
2. ...

### Overall Impression
[Your thoughts]
```

---

## 🆘 Troubleshooting

### Frontend won't start
```bash
# Check Node version
node --version  # Must be 18+

# Clear cache
rm -rf node_modules package-lock.json
npm install

# Try again
npm run dev
```

### Backend not responding
```bash
# Check if backend is running
lsof -ti:8080

# If not, start backend
cd ../outpost-nupur
./mvnw spring-boot:run
```

### CORS errors in console
- Ensure backend allows http://localhost:5173
- Check backend CORS configuration

### API 404 errors
- Ensure backend is running
- Check API_URL in .env: `VITE_API_URL=http://localhost:8080/api/v1`

---

## ✅ Ready to Test!

Once you upgrade Node.js to v18+, run:

```bash
npm run dev
```

Then visit **http://localhost:5173** and follow the flows above! 🚀
