# Contman - Feature Access Management

A React application demonstrating user feature access management across multiple companies.

## Features

- **User Management**: Browse users and view their details
- **Company Membership**: Users can belong to multiple companies
- **Feature-Based Access**: Companies grant access to specific features
- **Dynamic Components**: Feature components render based on user access

### Available Features
- **Kittens**: Displays random kitten images
- **Random Number**: Generates new random numbers every 10 seconds
- **Company**: Shows company memberships and available features

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **Zustand** for state management
- **Tailwind CSS** for styling
- **React Router v6** for navigation
- **Jest + Testing Library** for testing

## Getting Started

### Prerequisites
- Node.js 18+

### Installation
```bash
npm install
npm run dev
```

Open http://localhost:5173

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm test         # Run tests
npm run lint     # Run ESLint
```

## Project Structure
```
src/
├── api/           # API layer with mock data
├── components/    # React components
├── store/         # Zustand state management
├── types/         # TypeScript definitions
├── utils/         # Utility functions
└── tests/         # Test files
```

## Data Model

```typescript
interface User {
  id: string;
  name: string;
  avatar: string;
  createdAt: string;
}

interface Company {
  id: string;
  name: string;
  features: string[];  // Available features
  users: string[];     // User IDs
}
```

A user's accessible features are the union of all features from companies they belong to.
