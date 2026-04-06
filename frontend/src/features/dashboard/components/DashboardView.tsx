import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { DashboardViewProps } from '../../../types/dashboard.types';
import { SitePlanner } from '../../site-planner/components/SitePlanner';
import styles from '../styles/Dashboard.module.css';

/**
 * Main dashboard view that wraps the `SitePlanner` component.
 *
 * Acts as a thin container applying layout styling and aria semantics.
 *
 * @param props.currentUser - The authenticated user, passed through to `SitePlanner`.
 * @returns The site planner wrapped in a semantic `<main>` element.
 */
export const DashboardView = ({ currentUser }: DashboardViewProps) => {
  return (
    <main className={styles.dashboardContainer} aria-label="Energy Site Planner Workspace">
      <SitePlanner currentUser={currentUser} />
    </main>
  );
};
