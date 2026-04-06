import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { DashboardViewProps } from '../../../types/dashboard.types';
import { SitePlanner } from '../../site-planner/components/SitePlanner';
import styles from '../styles/Dashboard.module.css';

export const DashboardView = ({ currentUser }: DashboardViewProps) => {
  return (
    <main className={styles.dashboardContainer} aria-label="Energy Site Planner Workspace">
      <SitePlanner currentUser={currentUser} />
    </main>
  );
};
