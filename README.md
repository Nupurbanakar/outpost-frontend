# Outpost Frontend

React + TypeScript frontend for the Outpost platform - T-Hub's founder community portal.

## Tech Stack

- **React 18** with TypeScript
- **Vite** (build tool)
- **Tailwind CSS** (styling)
- **React Query** (server state management)
- **React Router v6** (routing)
- **React Hook Form + Zod** (forms & validation)
- **Axios** (HTTP client)

## Getting Started

### Prerequisites

- Node.js 18+ and npm (⚠️ **Required**: Node 14 is not supported)
- Backend API running at `http://localhost:8080`

### Installation

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

The app will be available at `http://localhost:5173`

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

## Project Structure

```
src/
├── api/           # API client and endpoint functions
├── components/    # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── contexts/      # React contexts
├── types/         # TypeScript types
├── utils/         # Utility functions
└── App.tsx        # Root component
```

## Features

### Founder Features
- Browse Grants, Challenges, and Mentors with AI-powered rankings
- Filter and search opportunities
- Apply for mentorship
- Complete onboarding and manage profile

### Admin Features
- Manage all content (CRUD for grants, challenges, mentors, partners, offers)
- Publish/unpublish/expire content
- Import mentors via CSV
- Manage lookup tables (stages, sectors, expertise)

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Lint
npm run lint
```

## Documentation

See `.docs/` directory for:
- Implementation plan
- Story details
- Component documentation
- API integration guide

## Backend Repository

[outpost-nupur](https://github.com/yourusername/outpost-nupur) - Spring Boot backend

---

**Status**: 🚧 In Development

**Version**: 0.1.0
