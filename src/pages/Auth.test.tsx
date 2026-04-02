import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Auth from './Auth';
import {
  createMockAuthError,
  createMockSession,
  mockSuccessfulSignIn,
  mockSuccessfulSignUp
} from '../../tests/mocks/supabase';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', async () => {
  const actual = await vi.importActual<typeof import('../../tests/mocks/supabase')>('../../tests/mocks/supabase');
  return {
    supabase: actual.createMockSupabaseClient(),
  };
});

// Mock useNavigate
const { mockNavigate } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Auth Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  const renderAuth = () => {
    return render(
      <MemoryRouter>
        <Auth />
      </MemoryRouter>
    );
  };

  describe('Rendering', () => {
    it('renders sign in form by default', () => {
      renderAuth();
      expect(screen.getByText(/sign in to your workspace/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
      expect(screen.queryByLabelText(/full name/i)).not.toBeInTheDocument();
    });

    it('switches to sign up form when tab is clicked', async () => {
      const user = userEvent.setup();
      renderAuth();

      const signUpTab = screen.getByRole('tab', { name: 'Sign Up' });
      await user.click(signUpTab);

      expect(screen.getByText(/create an account/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('shows error for invalid email format', async () => {
      const user = userEvent.setup();
      renderAuth();

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: 'Sign In' });

      await user.type(emailInput, 'not-an-email');
      await user.click(submitButton);

      // Wait for possible async validation
      // If validation fails, we expect error message.
      // If validation passes (wrongly), we expect mocked sign in to be called.
      // But we assert it is NOT called.

      expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
      expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
    });

    it('shows error for short password', async () => {
      const user = userEvent.setup();
      renderAuth();

      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: 'Sign In' });

      await user.type(passwordInput, '123');
      await user.click(submitButton);

      expect(await screen.findByText(/password must be at least 6 characters/i)).toBeInTheDocument();
      expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
    });

    it('validates required fields', async () => {
      const user = userEvent.setup();
      renderAuth();

      const submitButton = screen.getByRole('button', { name: 'Sign In' });
      await user.click(submitButton);

      expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
    });

    it('validates sign up fields', async () => {
      const user = userEvent.setup();
      renderAuth();
      await user.click(screen.getByRole('tab', { name: 'Sign Up' }));

      const submitButton = screen.getByRole('button', { name: 'Create Account' });
      await user.click(submitButton);

      expect(await screen.findByText(/name must be at least 2 characters/i)).toBeInTheDocument();
      expect(supabase.auth.signUp).not.toHaveBeenCalled();
    });
  });

  describe('Sign In Flow', () => {
    it('calls signInWithPassword with correct credentials', async () => {
      const user = userEvent.setup();
      renderAuth();

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('redirects after successful sign in', async () => {
      const user = userEvent.setup();
      renderAuth();

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/app', { replace: true });
      });
    });

    it('shows error message on sign in failure', async () => {
      const user = userEvent.setup();
      (supabase.auth.signInWithPassword as Mock).mockResolvedValueOnce({
        data: { user: null, session: null },
        error: createMockAuthError('Invalid login credentials'),
      });

      renderAuth();

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(await screen.findByText(/invalid login credentials/i)).toBeInTheDocument();
    });
  });

  describe('Sign Up Flow', () => {
    it('calls signUp with correct data', async () => {
      const user = userEvent.setup();
      renderAuth();
      await user.click(screen.getByRole('tab', { name: 'Sign Up' }));

      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'new@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
        options: {
          data: { full_name: 'John Doe' },
          emailRedirectTo: expect.stringContaining('/auth/callback'),
        },
      });
    });

    it('shows success message after sign up', async () => {
      const user = userEvent.setup();
      renderAuth();
      await user.click(screen.getByRole('tab', { name: 'Sign Up' }));

      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'new@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(await screen.findByText(/account created/i)).toBeInTheDocument();
    });

    it('shows error message on sign up failure', async () => {
      const user = userEvent.setup();
      (supabase.auth.signUp as Mock).mockResolvedValueOnce({
        data: { user: null, session: null },
        error: createMockAuthError('User already registered'),
      });

      renderAuth();
      await user.click(screen.getByRole('tab', { name: 'Sign Up' }));

      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'existing@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(await screen.findByText(/user already registered/i)).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('shows loading state during sign in', async () => {
      const user = userEvent.setup();
      (supabase.auth.signInWithPassword as Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockSuccessfulSignIn()), 100))
      );

      renderAuth();

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /signing in/i })).not.toBeInTheDocument();
      });
    });

    it('shows loading state during sign up', async () => {
      const user = userEvent.setup();
      (supabase.auth.signUp as Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockSuccessfulSignUp()), 100))
      );

      renderAuth();
      await user.click(screen.getByRole('tab', { name: 'Sign Up' }));

      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'new@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(screen.getByRole('button', { name: /creating account/i })).toBeDisabled();
    });
  });

  describe('Session Handling', () => {
    it('redirects if session already exists', async () => {
      (supabase.auth.getSession as Mock).mockResolvedValueOnce({
        data: { session: createMockSession() },
        error: null,
      });

      renderAuth();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/app', { replace: true });
      });
    });

    it('does not redirect if no session exists', async () => {
      (supabase.auth.getSession as Mock).mockResolvedValueOnce({
        data: { session: null },
        error: null,
      });

      renderAuth();

      await new Promise(resolve => setTimeout(resolve, 100));
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Security & Error Handling', () => {
    it('logs security event on auth failure', async () => {
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      (supabase.auth.signInWithPassword as Mock).mockRejectedValueOnce(new Error('Network error'));

      renderAuth();

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });

      expect(consoleSpy).toHaveBeenCalledWith('auth_failed', expect.objectContaining({ email: 'test@example.com' }));

      consoleSpy.mockRestore();
    });

    it('handles rate limit error from Supabase', async () => {
      const user = userEvent.setup();
      (supabase.auth.signInWithPassword as Mock).mockResolvedValueOnce({
        data: { user: null, session: null },
        error: createMockAuthError('Too many requests', 429),
      });

      renderAuth();

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(await screen.findByText(/too many requests/i)).toBeInTheDocument();
    });
  });
});
