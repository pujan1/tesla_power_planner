import React from 'react';
import { TeslaHeader } from '../components/layout/TeslaHeader';
import styles from './MainLayout.module.css';

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
