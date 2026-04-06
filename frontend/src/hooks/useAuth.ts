import { useState, useCallback } from 'react';
import { User } from '@tesla/shared';
import { ViewMode } from '../types/app.types';
import { ERROR_TIMEOUT_MS, MESSAGE_TIMEOUT_MS } from '../constants/app.constants';
import { API_BASE_URL } from '../config/api.config';

/**
 * Manages the full authentication lifecycle for the application.
 *
 * Handles:
 * - Session hydration from `localStorage` on mount
 * - Login success (stores token, sets user, navigates to dashboard)
 * - Account creation success (shows confirmation, navigates to login)
 * - Error display with auto-clear timeout
 * - Logout (clears token and user state)
 *
 * @param t - The i18n translation function from `useLanguage()`.
 * @returns Auth state and handler functions consumed by `App.tsx`.
 *
 * @example
 * ```tsx
 * const { view, currentUser, isCheckingSession, ... } = useAuth(t);
 * ```
 */
export const useAuth = (t: (key: string) => string) => {
  const [view, setView] = useState<ViewMode>('LOGIN');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  /**
   * Checks localStorage for an existing JWT and rehydrates the user session.
   * Called once on mount. If the token is invalid or expired, it's removed.
   */
  const hydrateSession = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsCheckingSession(false);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.user) {
        setCurrentUser(data.user);
        setView('DASHBOARD');
      } else {
        localStorage.removeItem('token');
      }
    } catch (_err) {
      localStorage.removeItem('token');
    }
    setIsCheckingSession(false);
  }, []);

  /**
   * Handles a successful login.
   *
   * @param user  - The authenticated user object from the API.
   * @param token - Optional JWT to persist in localStorage.
   */
  const handleLoginSuccess = useCallback((user: User, token?: string) => {
    if (token) localStorage.setItem('token', token);
    setCurrentUser(user);
    setView('DASHBOARD');
  }, []);

  /**
   * Handles a successful account creation.
   * Shows a confirmation message and switches to the login view.
   *
   * @param _token - Unused; included for callback signature compatibility.
   */
  const handleCreateSuccess = useCallback((_token?: string) => {
    setMessage(t('msg.created'));
    setView('LOGIN');
  }, [t]);

  /**
   * Displays an error message that auto-clears after `ERROR_TIMEOUT_MS`.
   *
   * @param msg - The error message string to display.
   */
  const handleError = useCallback((msg: string) => {
    setError(msg);
    setTimeout(() => setError(''), ERROR_TIMEOUT_MS);
  }, []);

  /** Clears both the success message and error message. */
  const clearMessages = useCallback(() => {
    setMessage('');
    setError('');
  }, []);

  /**
   * Logs the user out by clearing the JWT, resetting state, and
   * navigating back to the login view.
   */
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setView('LOGIN');
    setCurrentUser(null);
    clearMessages();
  }, [clearMessages]);

  /**
   * Handles a successful user profile update.
   * Updates the current user and shows a temporary success message.
   *
   * @param user - The updated user object from the API.
   */
  const handleUpdateSuccess = useCallback((user: User) => {
    setCurrentUser(user);
    setMessage(t('msg.updated'));
    setTimeout(() => setMessage(''), MESSAGE_TIMEOUT_MS);
  }, [t]);

  return {
    view,
    setView,
    currentUser,
    message,
    error,
    isCheckingSession,
    handleLoginSuccess,
    handleCreateSuccess,
    handleError,
    handleLogout,
    handleUpdateSuccess,
    clearMessages,
    hydrateSession,
  };
};
