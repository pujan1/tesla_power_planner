import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useMutation } from '../../../hooks/useApi';
import { API_ENDPOINTS } from '../../../config/api.config';
import { CreateAccountFormProps } from '../../../types/auth.types';
import styles from '../styles/Auth.module.css';

export const CreateAccountForm = ({ onCreateSuccess, onSwitchToLogin, onError }: CreateAccountFormProps) => {
  const { t } = useLanguage();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const { mutate: createUser, loading } = useMutation(API_ENDPOINTS.users.create, 'POST');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await createUser({ username, password, name });
      onCreateSuccess(data.token);
    } catch (err: any) {
      onError(err.message);
    }
  };

  return (
    <div className={styles.authFormContainer}>
      <form className={styles.form} onSubmit={handleCreate} data-testid="signup-form">
        <h2>{t('create.title')}</h2>
        <Input
          type="text"
          placeholder={t('create.fullName')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          data-testid="signup-fullname"
        />
        <Input
          type="text"
          placeholder={t('login.username')}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          data-testid="signup-username"
        />
        <Input
          type="password"
          placeholder={t('login.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          data-testid="signup-password"
        />
        <div className={styles.buttonGroup}>
          <Button 
            type="submit" 
            variant="primary"
            disabled={loading}
            data-testid="signup-submit"
          >
            {t('create.btn')}
          </Button>

          <Button 
            type="button" 
            variant="secondary"
            onClick={onSwitchToLogin}
            data-testid="switch-to-login"
          >
            {t('create.loginText')}
          </Button>
        </div>
      </form>
    </div>
  );
};


