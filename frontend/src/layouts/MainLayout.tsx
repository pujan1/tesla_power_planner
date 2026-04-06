import React from 'react';
import { TeslaHeader } from '../components/layout/TeslaHeader';
import styles from './MainLayout.module.css';

/**
 * Layout wrapper for unauthenticated pages (login, signup).
 *
 * Renders the global Tesla header above the main content area.
 *
 * @param props.children - Page content rendered below the header.
 * @returns A layout container with header and main content.
 */
export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.appContainer}>
      <TeslaHeader />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};
