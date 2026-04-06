import { useLanguage } from '../../../context/LanguageContext';
import { useSitePlannerContext } from '../context/SitePlannerContext';
import styles from '../styles/ViewToggle.module.css';

/**
 * Toggle button group for switching between 2D and 3D site views.
 *
 * Reads and writes the `is3D` state from `SitePlannerContext`.
 *
 * @returns A pair of styled toggle buttons.
 */
export const ViewToggle = () => {
  const { t } = useLanguage();
  const { is3D, setIs3D, isManualMode } = useSitePlannerContext();

  return (
    <div className={`${styles.headerToggle} ${isManualMode ? styles.disabled : ''}`}>
      <button 
        className={`${styles.toggleBtn} ${!is3D ? styles.active : ''}`}
        onClick={() => !isManualMode && setIs3D(false)}
        disabled={isManualMode}
      >
        {t('view.2d')}
      </button>
      <button 
        className={`${styles.toggleBtn} ${is3D ? styles.active : ''}`}
        onClick={() => !isManualMode && setIs3D(true)}
        disabled={isManualMode}
      >
        {t('view.3d')}
      </button>
    </div>
  );
};

