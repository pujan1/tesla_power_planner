import styles from './TeslaHeader.module.css';

/**
 * Global header component displaying the Tesla wordmark SVG logo.
 *
 * Used in the unauthenticated `MainLayout` across all landing pages.
 * grabbed this from tesla website
 *
 * @returns A `<header>` element with the Tesla logo.
 */
export const TeslaHeader = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Left: Tesla Logo */}
        <div className={styles.logo}>
          <svg viewBox="0 0 342 35" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M0 .1a9.7 9.7 0 0 0 7 7h11l.5.1v27.6h6.8V7.3L26 7h11a9.8 9.8 0 0 0 7-7H0zm238.6 0h-6.8v34.8H263a9.7 9.7 0 0 0 6-6.8h-30.3V0zm-52.3 6.8c3.6-1 6.6-3.8 7.4-6.9l-38.1.1v20.6h31.1v7.2h-24.4a13.6 13.6 0 0 0-8.7 7h39.9v-21h-31.2v-7zm116.2 28h6.7v-14h24.6v14h6.7v-21h-38zM85.3 7h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7m0 13.8h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7m0 14.1h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7M308.5 7h26a9.6 9.6 0 0 0 7-7h-40a9.6 9.6 0 0 0 7 7"></path>
          </svg>
        </div>
      </div>
    </header>
  );
};
