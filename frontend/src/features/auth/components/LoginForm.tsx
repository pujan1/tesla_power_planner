import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useMutation } from '../../../hooks/useApi';
import { API_ENDPOINTS } from '../../../config/api.config';
import { LoginFormProps } from '../../../types/auth.types';
import styles from '../styles/Auth.module.css';

export const LoginForm = ({ onLoginSuccess, onSwitchToCreate, onError }: LoginFormProps) => {
  const { t, setLanguage } = useLanguage();
  const { setTheme } = useTheme();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const { mutate: loginUser, loading } = useMutation(API_ENDPOINTS.auth.login, 'POST');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginUser({ username, password });
      
      if (data.user.language) setLanguage(data.user.language);
      if (data.user.theme) setTheme(data.user.theme);
      
      onLoginSuccess(data.user, data.token);
    } catch (err: any) {
      onError(err.message);
    }
  };

  return (
    <div className={styles.authFormContainer}>
      <form className={styles.form} onSubmit={handleLogin} data-testid="login-form">
        <h2>{t('login.welcome')}</h2>
        <Input
          type="text"
          placeholder={t('login.username')}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          data-testid="login-username"
        />
        <Input
          type="password"
          placeholder={t('login.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          data-testid="login-password"
        />
        <div className={styles.buttonGroup}>
          <Button 
            type="submit" 
            variant="primary"
            disabled={loading}
            data-testid="login-submit"
          >
            {t('login.btn')}
          </Button>

          <Button 
            type="button" 
            variant="secondary"
            onClick={onSwitchToCreate}
            data-testid="switch-to-signup"
          >
            {t('login.createAccount')}
          </Button>
        </div>
      </form>
    </div>
  );
};


