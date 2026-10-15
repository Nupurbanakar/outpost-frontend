# Outpost Frontend Developer Guide

## Quick Start

### Prerequisites
- Node.js 20+ (use nvm: `nvm use 20`)
- npm 10+

### Setup
```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start dev server
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

## Project Structure

```
src/
├── api/              # API client and endpoint functions
│   ├── client.ts     # Axios instance with interceptors
│   └── auth.ts       # Auth API functions
├── components/       # Reusable React components
│   └── ui/           # UI components (buttons, inputs, etc.)
├── pages/            # Page components (one per route)
│   └── HomePage.tsx
├── hooks/            # Custom React hooks
├── contexts/         # React context providers (auth, theme, etc.)
├── types/            # TypeScript type definitions
│   └── index.ts
├── utils/            # Utility functions
├── styles/           # Global styles
│   └── globals.css   # Tailwind + custom styles
├── App.tsx           # Root component with routing
└── main.tsx          # Entry point
```

## Tech Stack

- **React 18**: UI library
- **TypeScript 5**: Type safety
- **Vite 5**: Build tool and dev server
- **Tailwind CSS 3**: Utility-first styling
- **React Router v6**: Client-side routing
- **React Query v5**: Server state management
- **Axios**: HTTP client with interceptors
- **React Hook Form + Zod**: Form validation

## Development

### Available Scripts

```bash
npm run dev      # Start dev server (port 5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Style

- **ESLint**: Enforces code quality rules
- **Prettier**: Auto-formats code
- Run `npm run lint` before committing

### Path Aliases

Use `@/` to import from `src/`:

```typescript
import apiClient from '@/api/client';
import { User } from '@/types';
```

### Environment Variables

All env vars must be prefixed with `VITE_`:

```bash
VITE_API_URL=http://localhost:8080/api/v1
VITE_ENV=development
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## API Integration

### Making API Calls

Use the API client in `src/api/client.ts`:

```typescript
import apiClient from '@/api/client';

// GET request
const response = await apiClient.get('/grants');

// POST request
const response = await apiClient.post('/auth/login', {
  email: 'founder@example.com',
  password: 'password123'
});
```

### Auth Token Handling

Token is automatically added to requests via interceptor:

```typescript
// Request interceptor adds: Authorization: Bearer <token>
// Response interceptor handles 401 (logout) and 429 (rate limit)
```

### Using React Query

```typescript
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/client';

function GrantsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['grants'],
    queryFn: () => apiClient.get('/grants').then(res => res.data),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading grants</div>;

  return <div>{/* Render grants */}</div>;
}
```

## Styling with Tailwind

### Utility Classes

```tsx
<button className="btn-primary px-4 py-2 rounded-md">
  Click me
</button>
```

### Custom Components (in globals.css)

Pre-defined classes:
- `.btn`, `.btn-primary`, `.btn-secondary` - Buttons
- `.input` - Form inputs
- `.label` - Form labels
- `.card` - Card container

```tsx
<div className="card">
  <h2>Card Title</h2>
  <p>Card content</p>
</div>
```

## SOLID Principles in Action

### Single Responsibility
- Each component has one clear purpose
- API functions separated from UI logic
- Types defined in dedicated files

### Open/Closed
- Components accept props for customization
- Use composition over modification

### Dependency Inversion
- Components depend on abstractions (hooks, contexts)
- API client injected via modules, not hardcoded

### Example: Clean Component

```typescript
// ❌ Bad: Multiple responsibilities
function GrantCard({ grantId }: { grantId: string }) {
  const [grant, setGrant] = useState(null);
  
  useEffect(() => {
    fetch(`/api/grants/${grantId}`)
      .then(res => res.json())
      .then(setGrant);
  }, [grantId]);
  
  return <div>{grant?.name}</div>;
}

// ✅ Good: Separation of concerns
// 1. Custom hook for data fetching
function useGrant(grantId: string) {
  return useQuery({
    queryKey: ['grants', grantId],
    queryFn: () => apiClient.get(`/grants/${grantId}`).then(res => res.data),
  });
}

// 2. Presentational component
function GrantCard({ grantId }: { grantId: string }) {
  const { data: grant, isLoading } = useGrant(grantId);
  
  if (isLoading) return <Skeleton />;
  
  return (
    <div className="card">
      <h3>{grant.name}</h3>
      <p>{grant.description}</p>
    </div>
  );
}
```

## Best Practices

### Component Structure

```typescript
// 1. Imports (grouped: external, internal, types, styles)
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/client';
import type { Grant } from '@/types';

// 2. Types (component props)
interface GrantListProps {
  sectorId?: string;
  onGrantClick: (grant: Grant) => void;
}

// 3. Component
export function GrantList({ sectorId, onGrantClick }: GrantListProps) {
  // Hooks at top
  const { data, isLoading } = useQuery(/* ... */);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Event handlers
  const handleClick = (grant: Grant) => {
    setSelectedId(grant.id);
    onGrantClick(grant);
  };
  
  // Early returns
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No grants found</div>;
  
  // Render
  return (
    <div className="space-y-4">
      {data.map(grant => (
        <GrantCard
          key={grant.id}
          grant={grant}
          isSelected={grant.id === selectedId}
          onClick={() => handleClick(grant)}
        />
      ))}
    </div>
  );
}
```

### Error Handling

```typescript
import { AxiosError } from 'axios';
import type { ApiError } from '@/types';

function MyComponent() {
  const { data, error } = useQuery({
    queryKey: ['grants'],
    queryFn: fetchGrants,
  });
  
  if (error) {
    const apiError = (error as AxiosError<ApiError>).response?.data;
    return (
      <div className="text-red-600">
        {apiError?.detail || 'Something went wrong'}
      </div>
    );
  }
  
  // ...
}
```

### TypeScript Tips

```typescript
// Use interfaces for objects
interface Grant {
  id: string;
  name: string;
}

// Use types for unions/primitives
type Status = 'active' | 'inactive' | 'pending';

// Use enums sparingly (prefer string unions)
type GrantStatus = 'OPEN' | 'CLOSED' | 'DRAFT';

// Generic types for reusability
interface ApiResponse<T> {
  data: T;
  message: string;
}
```

## Testing (Future)

Once testing is set up:

```bash
npm run test        # Run tests
npm run test:watch  # Watch mode
npm run test:coverage  # Coverage report
```

## Deployment

```bash
# Build for production
npm run build

# Output in dist/ folder
# Deploy dist/ to your hosting service (Vercel, Netlify, etc.)
```

## Troubleshooting

### Port 5173 already in use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Module not found errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
```bash
# Check for type errors
npx tsc --noEmit
```

## Next Steps

See `.docs/FRONTEND-STORIES.md` for upcoming features:
- FE-002: Layout Shell & Navigation
- FE-003: API Client with Auth
- FE-004: Auth Flow (Login/Signup)

---

Built with ❤️ for Indian Founders
