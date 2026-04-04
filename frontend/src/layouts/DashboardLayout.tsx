import React from 'react';
import styles from './DashboardLayout.module.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
  navbarContent: React.ReactNode;
}

export const DashboardLayout = ({ children, navbarContent }: DashboardLayoutProps) => {
  return (
    <div className={styles.dashboardLayout}>
      <nav className={styles.navbar}>
        <h1 className={styles.navbarBrand}>Tesla Portal</h1>
        <div className="navbar-actions">
          {navbarContent}
        </div>
      </nav>
      <main className={styles.dashboardContent}>
        {children}
      </main>
    </div>
  );
};
