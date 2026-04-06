import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import styles from './DashboardLayout.module.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
  navbarContent: React.ReactNode;
}

export const DashboardLayout = ({ children, navbarContent }: DashboardLayoutProps) => {
  const { t } = useLanguage();
  return (
    <div className={styles.dashboardLayout}>
      <nav className={styles.navbar}>
        <h1 className={styles.navbarBrand}>{t('app.title')}</h1>
        <div className={styles.navbarActions}>
          {navbarContent}
        </div>
      </nav>
      <main className={styles.dashboardContent}>
        {children}
      </main>
    </div>
  );
};
