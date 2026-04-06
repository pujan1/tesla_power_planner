import React, { useEffect } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Toast } from './components/ui/Toast';
import { LoginForm } from './features/auth/components/LoginForm';
import { CreateAccountForm } from './features/auth/components/CreateAccountForm';
import { DashboardView } from './features/dashboard/components/DashboardView';
import { UserSettingsDropdown } from './features/dashboard/components/UserSettingsDropdown';
import { SitePlannerProvider } from './features/site-planner/context/SitePlannerContext';
import { HeroVideo } from './features/landing/components/HeroVideo';
import { ViewToggle } from './features/site-planner/components/ViewToggle';
import { useLanguage } from './context/LanguageContext';
import { useAuth } from './hooks/useAuth';

/**
 * Root application component. Acts as a top-level router that switches
 * between unauthenticated views (Login, Create Account) and the
 * authenticated Dashboard view.
 *
 * @returns The full application UI tree.
 */
function App() {
  const { t } = useLanguage();
  const {
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
  } = useAuth(t);

  /** Hydrate session from localStorage on mount. */
  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  // Loading state while checking for an existing session
  if (isCheckingSession) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', color: '#fff' }}>
        Loading Session...
      </div>
    );
  }

  // ── Authenticated View ──
  if (view === 'DASHBOARD' && currentUser) {
    return (
      <SitePlannerProvider>
        <DashboardLayout
          navbarContent={
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <ViewToggle />
              <UserSettingsDropdown 
                currentUser={currentUser}
                onLogout={handleLogout}
                onUpdateSuccess={handleUpdateSuccess}
                onError={handleError}
              />
            </div>
          }
        >
          {message && <Toast message={message} type="success" />}
          {error && <Toast message={error} type="error" />}
          <DashboardView currentUser={currentUser} />
        </DashboardLayout>
      </SitePlannerProvider>
    );
  }

  // ── Unauthenticated View ──
  return (
    <MainLayout>
      {message && <Toast message={message} type="success" />}
      {error && <Toast message={error} type="error" />}

      <HeroVideo>
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
      </HeroVideo>
    </MainLayout>
  );
}


export default App;
