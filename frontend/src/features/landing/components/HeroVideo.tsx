import { useLanguage } from '../../../context/LanguageContext';
import styles from './HeroVideo.module.css';

interface HeroVideoProps {
  children?: React.ReactNode;
}

export const HeroVideo = ({ children }: HeroVideoProps) => {
  const { t } = useLanguage();
  
  return (
    <div className={styles.heroContainer}>
      <video 
        autoPlay 
        muted 
        loop 
        playsInline 
        className={styles.videoBackground}
        poster="https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto:best/Megapack-Hero-Desktop.jpg"
      >
        <source 
          src="https://digitalassets.tesla.com/tesla-contents/video/upload/f_auto,q_auto:best/v1759521034/Megapack_Hero_Desktop_V6.mp4" 
          type="video/mp4" 
        />
      </video>

      <div className={styles.overlayContent}>
        <div className={styles.heroText}>
          <h1 className={styles.title}>{t('landing.megapack') || 'Megapack'}</h1>
          <p className={styles.subtitle}>
            {t('landing.description') || 'Large-Scale Energy Storage'}
          </p>
          <div className={styles.configDetail}>
             {t('landing.configDetail') || 'Megapack Config - Your one page to configure solutions for all your battery needs'}
          </div>
        </div>

        <div className={styles.authWrapper}>
          {children}
        </div>

        <div className={styles.footerInfo}>
          <p>{t('landing.footer') || 'Experience the future of energy storage.'}</p>
        </div>
      </div>
    </div>
  );
};
