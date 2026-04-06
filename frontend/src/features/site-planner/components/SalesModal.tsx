import { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import styles from '../styles/SalesModal.module.css';

interface SalesModalProps {
  onClose: () => void;
  onSubmit: (data: { email: string; phone: string }) => void;
}

export const SalesModal = ({ onClose, onSubmit }: SalesModalProps) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, phone });
  };

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="sales-modal-title">
      <div className={styles.modalContent}>
        <div className={styles.teslaLogo}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path fill="currentColor" d="M50 0c-4.4 0-16.7 1-16.7 1l-.5 2.1c0 0 11.2-1 17.2-1 6 0 17.2 1 17.2 1l-.5-2.1c0 0-12.3-1-16.7-1zm0 7.3c-14.7 0-33.3 3.6-33.3 3.6l-.6 2.5c0 0 20.3-3.1 33.9-3.1 13.6 0 33.9 3.1 33.9 3.1l-.6-2.5c0 0-18.6-3.6-33.3-3.6zm0 10.7C30.6 18 2 24.3 2 24.3l-.8 3.5s29.4-6.4 48.8-6.4c19.4 0 48.8 6.4 48.8 6.4l-.8-3.5s-28.6-6.3-48-6.3zm0 18.2C35 36.2 16.7 41 16.7 41L16 44.5s20-4 34-4c14 0 34 4 34 4l-.7-3.5s-18.3-4.8-33.3-4.8zM50 100V50c-15 0-30 4-30 4l-.7-3.5s15.7-4.1 30.7-4.1V0c20 0 33.3 1 33.3 1L84 4.5l-33.3-1v42.1c15 0 30.7 4.1 30.7 4.1L80.7 54s-15-4-30.7-4v46.5l3.5-.5V50c11.5 0 22 2.5 22 2.5l-.6-3s-10.5-2.5-22.1-2.5V5.5c7.7 0 15 0 15 0l-.3-2.5s-7.3 0-14.7 0" />
          </svg>
        </div>
        
        <h2 id="sales-modal-title">{t('sales.title')}</h2>
        <p>{t('sales.message')}</p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formField}>
            <label htmlFor="sales-email">{t('sales.email')}</label>
            <Input 
              id="sales-email"
              type="email" 
              placeholder={t('sales.email')} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              data-testid="sales-email"
            />
          </div>
          <div className={styles.formField}>
            <label htmlFor="sales-phone">{t('sales.phone')}</label>
            <Input 
              id="sales-phone"
              type="tel" 
              placeholder={t('sales.phone')} 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              data-testid="sales-phone"
            />
          </div>
          
          <div className={styles.actions}>
            <Button 
              type="submit" 
              variant="primary" 
              data-testid="sales-submit"
            >
              {t('sales.submit')}
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onClose}
              data-testid="sales-cancel"
            >
              {t('sales.cancel')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
