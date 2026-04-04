import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import styles from './MainLayout.module.css';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useLanguage();
  return (
    <div className={styles.appContainer}>
      <div className={styles.glassCard}>
        <div className={styles.headerFlex}>
          <h1 className={styles.title}>{t('app.title')}</h1>
        </div>
        {children}
      </div>
    </div>
  );
};
