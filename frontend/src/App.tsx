import React, { useState } from 'react';
import { User } from '@tesla/shared';
import { MainLayout } from './layouts/MainLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Toast } from './components/ui/Toast';
import { LoginForm } from './features/auth/components/LoginForm';
import { CreateAccountForm } from './features/auth/components/CreateAccountForm';
import { DashboardView } from './features/dashboard/components/DashboardView';
import { UserSettingsDropdown } from './features/dashboard/components/UserSettingsDropdown';
import { useLanguage } from './context/LanguageContext';

type ViewMode = 'LOGIN' | 'CREATE' | 'DASHBOARD';

function App() {
  const { t } = useLanguage();
  const [view, setView] = useState<ViewMode>('LOGIN');
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setView('DASHBOARD');
  };

  const handleCreateSuccess = () => {
    setMessage(t('msg.created'));
    setView('LOGIN');
  };

  const handleError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(''), 5000);
  };

  const clearMessages = () => {
    setMessage('');
    setError('');
  };

  // Authenticated State Router
  if (view === 'DASHBOARD' && currentUser) {
    return (
      <DashboardLayout
        navbarContent={
          <UserSettingsDropdown 
            currentUser={currentUser}
            onLogout={() => { setView('LOGIN'); setCurrentUser(null); clearMessages(); }}
            onUpdateSuccess={(user) => { setCurrentUser(user); setMessage(t('msg.updated')); setTimeout(() => setMessage(''), 3000); }}
            onError={handleError}
          />
        }
      >
        {message && <Toast message={message} type="success" />}
        {error && <Toast message={error} type="error" />}
        <DashboardView currentUser={currentUser} />
      </DashboardLayout>
    );
  }

  // Unauthenticated State Router
  return (
    <MainLayout>
      {message && <Toast message={message} type="success" />}
      {error && <Toast message={error} type="error" />}

      {view === 'LOGIN' && (
        <LoginForm 
          onLoginSuccess={handleLoginSuccess}
          onSwitchToCreate={() => { setView('CREATE'); clearMessages(); }}
          onError={handleError}
        />
      )}

      {view === 'CREATE' && (
        <CreateAccountForm 
          onCreateSuccess={handleCreateSuccess}
          onSwitchToLogin={() => { setView('LOGIN'); clearMessages(); }}
          onError={handleError}
        />
      )}
    </MainLayout>
  );
}

export default App;
