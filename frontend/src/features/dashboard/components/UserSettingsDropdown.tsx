import React, { useState, useRef, useCallback } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme, Theme } from '../../../context/ThemeContext';
import { Language } from '../../../i18n/locales';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useMutation } from '../../../hooks/useApi';
import { API_ENDPOINTS } from '../../../config/api.config';
import { UserSettingsDropdownProps } from '../../../types/dashboard.types';
import { useClickOutside } from '../../../hooks/useClickOutside';
import styles from '../styles/Dashboard.module.css';

/**
 * Dropdown menu for user settings, accessible from the dashboard navbar.
 *
 * Provides:
 * - Avatar button showing user initials
 * - Language and theme selectors (persisted to backend)
 * - Name and password update form
 * - Logout button
 *
 * Closes automatically when clicking outside the dropdown.
 *
 * @param props.currentUser    - The authenticated user object.
 * @param props.onLogout       - Callback invoked when the user logs out.
 * @param props.onUpdateSuccess - Callback invoked with the updated user after a settings save.
 * @param props.onError        - Callback invoked with an error message string.
 * @returns The avatar button and conditionally-rendered dropdown panel.
 */
export const UserSettingsDropdown = ({ currentUser, onLogout, onUpdateSuccess, onError }: UserSettingsDropdownProps) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const endpoint = API_ENDPOINTS.users.update(currentUser.username);
  const { mutate: updateUser, loading } = useMutation(endpoint, 'PUT');
  const { mutate: updateConfig } = useMutation(endpoint, 'PUT');

  /** Close the dropdown when clicking outside. */
  const closeDropdown = useCallback(() => setIsOpen(false), []);
  useClickOutside(wrapperRef as React.RefObject<HTMLElement>, closeDropdown, isOpen);

  /** User initials derived from the full name (max 2 characters). */
  const initials = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  /**
   * Submits name/password updates to the backend.
   *
   * @param e - The form submission event.
   */
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await updateUser({ password: password || undefined, name: name || undefined });
      onUpdateSuccess(data.user);
      setPassword('');
      setName('');
      setIsOpen(false);
    } catch (err: any) {
      onError(err.message);
    }
  };

  /**
   * Handles language preference changes and persists to backend.
   *
   * @param e - The select change event.
   */
  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as Language;
    setLanguage(newLang);
    try {
      await updateConfig({ language: newLang });
    } catch (err) {
      console.error('Failed to save language preference', err);
    }
  };

  /**
   * Handles theme preference changes and persists to backend.
   *
   * @param e - The select change event.
   */
  const handleThemeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value as Theme;
    setTheme(newTheme);
    try {
      await updateConfig({ theme: newTheme });
    } catch (err) {
      console.error('Failed to save theme preference', err);
    }
  };

  return (
    <>
      {/* Visual Blur Overlay for entire dashboard */}
      {isOpen && <div className={styles.pageOverlay} onClick={() => setIsOpen(false)} />}
      
      <div className={styles.settingsWrapper} ref={wrapperRef}>
        <div className={styles.avatarCircle} onClick={() => setIsOpen(!isOpen)} data-testid="settings-avatar">
          {initials}
        </div>

        {isOpen && (
          <div className={styles.dropdownMenu}>
            <div className={styles.dropdownHeader}>
              <h4>{currentUser.name}</h4>
              <p>@{currentUser.username}</p>
            </div>

            <div className={styles.controlsGrid}>
              <div className={styles.controlGroup}>
                <label htmlFor="lang-select">{t('nav.language')}</label>
                <select id="lang-select" className={styles.controlSelect} value={language} onChange={handleLanguageChange}>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              <div className={styles.controlGroup}>
                <label htmlFor="theme-select">Theme</label>
                <select id="theme-select" className={styles.controlSelect} value={theme} onChange={handleThemeChange}>
                  <option value="dark">Dark Mode</option>
                  <option value="light">Light Mode</option>
                </select>
              </div>
            </div>

            <form className={styles.dropdownForm} onSubmit={handleUpdate}>
              <h5>{t('dashboard.updateTitle')}</h5>
              <Input 
                type="text" 
                placeholder={t('dashboard.newName')} 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
              <Input 
                type="password" 
                placeholder={t('dashboard.newPassword')} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              <Button type="submit" variant="secondary" disabled={loading}>
                {loading ? '...' : t('dashboard.updateBtn')}
              </Button>
            </form>

            <Button variant="logout" onClick={onLogout}>
              {t('dashboard.logoutBtn')}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
