import { useLanguage } from '../../../context/LanguageContext';
import { useSitePlannerContext } from '../context/SitePlannerContext';
import styles from '../styles/ViewToggle.module.css';

export const ViewToggle = () => {
  const { t } = useLanguage();
  const { is3D, setIs3D } = useSitePlannerContext();

  return (
    <div className={styles.headerToggle}>
      <button 
        className={`${styles.toggleBtn} ${!is3D ? styles.active : ''}`}
        onClick={() => setIs3D(false)}
      >
        {t('view.2d')}
      </button>
      <button 
        className={`${styles.toggleBtn} ${is3D ? styles.active : ''}`}
        onClick={() => setIs3D(true)}
      >
        {t('view.3d')}
      </button>
    </div>
  );
};
