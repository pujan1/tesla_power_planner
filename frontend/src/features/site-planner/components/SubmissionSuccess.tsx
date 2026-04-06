import { useLanguage } from '../../../context/LanguageContext';
import { Button } from '../../../components/ui/Button';
import styles from '../styles/SubmissionSuccess.module.css';

interface SubmissionSuccessProps {
  /** Callback to return to the site planner and continue editing. */
  onBack: () => void;
}

/**
 * Premium splash screen for confirming successful site submission.
 *
 * Provides industrial-grade user feedback after a site layout is finalized,
 * along with a clear pathway back to the editing workspace.
 *
 * @param props.onBack - Closes the splash screen and resumes site planning.
 * @returns A glassmorphic success overlay with submission confirmation.
 */
export const SubmissionSuccess = ({ onBack }: SubmissionSuccessProps) => {
  const { t } = useLanguage();

  return (
    <div className={styles.splashOverlay} role="alert" aria-live="assertive">
      <div className={styles.splashContent}>
        <div className={styles.successIcon}>✓</div>
        
        <h1 className={styles.title}>
          {t('site.submitSuccess') || 'Success!'}
        </h1>
        
        <p className={styles.message}>
          {t('site.submitMessage') || 
          'Your layout is submitted. A team member will contact you for further details.'}
        </p>

        <div className={styles.actions}>
          <Button 
            variant="secondary" 
            onClick={onBack}
            className={styles.backBtn}
          >
            {t('site.goBackAndChange') || 'Go back and change layout'}
          </Button>
        </div>
      </div>
    </div>
  );
};
