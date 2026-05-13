import { vi } from 'vitest';
import type { User, Session, AuthError } from '@supabase/supabase-js';

/**
 * Mock user factory for consistent test data
 */
export const createMockUser = (overrides?: Partial<User>): User => ({
  id: 'test-user-id',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  ...overrides,
});

/**
 * Mock session factory
 */
export const createMockSession = (overrides?: Partial<Session>): Session => ({
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  expires_at: Date.now() + 3600000,
  token_type: 'bearer',
  user: createMockUser(),
  ...overrides,
});

/**
 * Mock auth error factory
 * Returns an Error instance that also satisfies the Supabase AuthError interface
 */
export const createMockAuthError = (message: string, status = 400): AuthError => {
  const error = new Error(message);
  return Object.assign(error, {
    name: 'AuthError',
    status,
  }) as AuthError;
};

/**
 * Mock Supabase client with default successful responses
 */
export const createMockSupabaseClient = () => {
  const mockSignInWithPassword = vi.fn().mockResolvedValue({
    data: { user: createMockUser(), session: createMockSession() },
    error: null,
  });
  const mockSignUp = vi.fn().mockResolvedValue({
    data: { user: createMockUser(), session: createMockSession() },
    error: null,
  });
  const mockSignOut = vi.fn().mockResolvedValue({ error: null });
  const mockGetSession = vi.fn().mockResolvedValue({
    data: { session: createMockSession() },
    error: null,
  });
  const mockOnAuthStateChange = vi.fn((callback) => {
    // Immediately call callback with signed-in state
    callback('SIGNED_IN', createMockSession());
    return {
      data: {
        subscription: {
          unsubscribe: vi.fn(),
        },
      },
    };
  });
  const mockResetPasswordForEmail = vi.fn().mockResolvedValue({ error: null });
  const mockUpdateUser = vi.fn().mockResolvedValue({
    data: { user: createMockUser() },
    error: null,
  });

  return {
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signUp: mockSignUp,
      signOut: mockSignOut,
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
      resetPasswordForEmail: mockResetPasswordForEmail,
      updateUser: mockUpdateUser,
    },
    from: vi.fn(() => ({
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    })),
  };
};

export const mockSuccessfulSignIn = () => ({
  data: {
    user: createMockUser(),
    session: createMockSession(),
  },
  error: null,
});

export const mockFailedSignIn = (message = 'Invalid credentials') => ({
  data: { user: null, session: null },
  error: createMockAuthError(message),
});

export const mockSuccessfulSignUp = () => ({
  data: {
    user: createMockUser({ id: 'new-user-id', email: 'new@example.com' }),
    session: null, // No session until email confirmed
  },
  error: null,
});

export const mockExistingSession = () => ({
  data: {
    session: createMockSession(),
  },
  error: null,
});

export const mockNoSession = () => ({
  data: { session: null },
  error: null,
});

/**
 * Helper to mock Supabase module globally
 */
export const setupSupabaseMock = () => {
  const mockClient = createMockSupabaseClient();
  return mockClient;
};
