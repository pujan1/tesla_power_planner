import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import styles from './DashboardLayout.module.css';

interface DashboardLayoutProps {
  /** Main page content rendered below the navbar. */
  children: React.ReactNode;
  /** Content rendered in the right side of the navbar (e.g., ViewToggle, avatar). */
  navbarContent: React.ReactNode;
}

/**
 * Layout wrapper for authenticated dashboard pages.
 *
 * Renders a top navbar with the Tesla logo and customizable right-side
 * content, plus a main content area below.
 *
 * @param props.children       - Dashboard page content.
 * @param props.navbarContent  - Elements rendered in the navbar action area.
 * @returns A dashboard layout with navbar and content.
 */
export const DashboardLayout = ({ children, navbarContent }: DashboardLayoutProps) => {
  const { t } = useLanguage();
  return (
    <div className={styles.dashboardLayout}>
      <nav className={styles.navbar}>
        <div className={styles.navbarBrand}>
          <svg viewBox="0 0 342 35" xmlns="http://www.w3.org/2000/svg" style={{ height: '14px', width: 'auto' }}>
            <path fill="currentColor" d="M0 .1a9.7 9.7 0 0 0 7 7h11l.5.1v27.6h6.8V7.3L26 7h11a9.8 9.8 0 0 0 7-7H0zm238.6 0h-6.8v34.8H263a9.7 9.7 0 0 0 6-6.8h-30.3V0zm-52.3 6.8c3.6-1 6.6-3.8 7.4-6.9l-38.1.1v20.6h31.1v7.2h-24.4a13.6 13.6 0 0 0-8.7 7h39.9v-21h-31.2v-7zm116.2 28h6.7v-14h24.6v14h6.7v-21h-38zM85.3 7h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7m0 13.8h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7m0 14.1h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7M308.5 7h26a9.6 9.6 0 0 0 7-7h-40a9.6 9.6 0 0 0 7 7"></path>
          </svg>
        </div>
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
