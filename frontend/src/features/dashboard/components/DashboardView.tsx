import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { DashboardViewProps } from '../../../types/dashboard.types';
import { SitePlanner } from '../../site-planner/components/SitePlanner';
import styles from '../styles/Dashboard.module.css';

export const DashboardView = ({ currentUser }: DashboardViewProps) => {
  return (
    <div className={styles.dashboardContainer}>
      <SitePlanner currentUser={currentUser} />
    </div>
  );
};
