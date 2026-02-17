AutoRepAi

Compliance-first dealership AI platform built on React + TypeScript + Supabase.

## Overview

AutoRepAi is an enterprise-grade, multi-tenant platform for dealership lead management, inventory intelligence, quoting, and compliance workflows. The frontend is powered by React 18 + Vite, with Supabase providing authentication, PostgreSQL storage, and realtime updates.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **UI**: Radix primitives + shadcn-style components
- **Routing**: React Router v6
- **State**: TanStack Query
- **Forms**: React Hook Form + Zod validation
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)

## Local Development

```bash
npm install
npm run dev
# open http://localhost:8080
```

### Environment Variables

Create a `.env` file with:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Scripts

```bash
npm run build
npm run lint
npm run typecheck
npm run test
```

## Testing

This project uses Vitest + React Testing Library for component testing.

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test -- --coverage

# Run specific test file
npm run test -- Auth.test.tsx
```

**Test Structure**
- Unit tests: `src/**/*.test.tsx` - Fast, isolated component tests
- Mocks: `tests/mocks/` - Reusable mock factories
- Setup: `tests/setup.ts` - Global test configuration

For more details, see [Testing Strategy](docs/testing-strategy.md).

## Project Structure

```
src/
├── components/
├── pages/
├── lib/
├── integrations/
└── types/
```

## Notes

- Edge functions live in Supabase and are invoked via `/functions/v1/*` endpoints.
- RLS is expected to be enabled on all tables in production.

## License

MIT
