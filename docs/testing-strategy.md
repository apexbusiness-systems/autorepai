# Testing Strategy

## When to Use Unit Tests (Vitest + RTL)

✅ Component rendering logic
✅ Form validation
✅ Event handlers and state management
✅ Error handling and edge cases
✅ Loading states and async operations
✅ Mocked API interactions

**Coverage target: 80%+ for business logic**

## When to Use E2E Tests (Playwright)

✅ Critical user journeys:
  - Complete sign-up → email verification → onboarding
  - Payment flow → confirmation → receipt
  - Multi-step forms with navigation

✅ Cross-browser compatibility:
  - Safari-specific issues
  - Firefox rendering differences

✅ Integration smoke tests:
  - Does auth work end-to-end in staging?
  - Can users complete core workflows?

**Run frequency: On PR merge, not every commit**
**Coverage target: Happy paths + critical failures only**

## Current Test Coverage

- ✓ Tax calculator logic (unit tests)
- ✓ Auth component (unit tests with mocked Supabase)
- ⏳ Integration tests (future: component interaction testing)
- ⏳ E2E tests (future: critical path validation)

## Adding New Tests

1. Start with unit tests for new components
2. Add integration tests if components interact heavily
3. Add E2E tests only for critical business flows
4. Maintain test pyramid ratio: 70% unit, 20% integration, 10% E2E
