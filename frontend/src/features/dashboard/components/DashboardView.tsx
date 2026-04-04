import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { DashboardViewProps } from '../../../types/dashboard.types';
import styles from '../styles/Dashboard.module.css';

export const DashboardView = ({ currentUser }: DashboardViewProps) => {
  const { t } = useLanguage();

  return (
    <div className={styles.workspacePlaceholder}>
      <h2>
        <span className={styles.highlight}>{t('dashboard.welcome')}</span> {currentUser.name}!
      </h2>
      <p>{t('dashboard.subtitle')}</p>
    </div>
  );
};
