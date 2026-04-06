import { useEffect, useCallback, useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useSitePlanner } from '../hooks/useSitePlanner';
import { SiteCanvas } from './SiteCanvas';
import { SiteCanvas3D } from './SiteCanvas3D';
import { SalesModal } from './SalesModal';
import { useMutation, useQuery } from '../../../hooks/useApi';
import { API_ENDPOINTS } from '../../../config/api.config';
import { User, SiteLayout } from '@tesla/shared';
import { DEVICE_PROPERTIES } from '../constants/device.constants';
import { DeviceCounts } from '../types/site-planner.types';
import { useSitePlannerContext } from '../context/SitePlannerContext';
import { canAddDevices, buildSitePayload, parseSiteLayoutToCounts } from '../helpers/site-planner.helpers';
import styles from '../styles/SitePlanner.module.css';

/**
 * Main site planner component. Provides:
 * - A sidebar with device count controls, statistics, and a save button.
 * - A 2D or 3D canvas rendering of the packed device layout.
 * - A sales modal that triggers when the unit limit is exceeded.
 *
 * @param props.currentUser - The authenticated user object.
 * @returns The full site planner UI (sidebar + canvas + optional modal).
 */
export const SitePlanner = ({ currentUser }: { currentUser: User }) => {
  const { t } = useLanguage();
  const { is3D } = useSitePlannerContext();
  const { counts, updateCount, devices, stats } = useSitePlanner();

  const [showSalesModal, setShowSalesModal] = useState(false);
  const [lastSafeCounts, setLastSafeCounts] = useState<DeviceCounts | null>(null);

  const { mutate: saveSite, loading: saving } = useMutation(API_ENDPOINTS.auth.me.replace('/auth/me', '/auth/sites'), 'POST');
  const { fetchResource: getSites } = useQuery<{ sites: SiteLayout[] }>(API_ENDPOINTS.auth.me.replace('/auth/me', '/auth/sites'));

  /**
   * Validates whether adding `count` units of `type` stays within the site
   * limit. If it exceeds the limit, opens the sales modal instead.
   *
   * @param type  - The device type being changed.
   * @param count - The proposed new count.
   */
  const handleUpdateCount = (type: keyof DeviceCounts, count: number) => {
    if (!canAddDevices(counts, type, count)) {
      setLastSafeCounts({ ...counts });
      setShowSalesModal(true);
      return;
    }
    updateCount(type, count);
  };

  /**
   * Closes the sales modal and reverts counts to the last safe values.
   */
  const handleSalesClose = () => {
    if (lastSafeCounts) {
      (Object.entries(lastSafeCounts) as [keyof DeviceCounts, number][]).forEach(([type, count]) => {
        updateCount(type, count);
      });
    }
    setShowSalesModal(false);
  };

  /**
   * Handles the sales lead form submission.
   *
   * @param data       - The captured lead data.
   * @param data.email - Contact email address.
   * @param data.phone - Contact phone number.
   */
  const handleSalesSubmit = (data: { email: string; phone: string }) => {
    console.log('Sales lead captured:', data);
    handleSalesClose();
    alert(t('sales.thankYou') || 'A Tesla Energy representative will contact you shortly.');
  };

  /**
   * Persists the current device layout to the backend.
   */
  const handleSave = async () => {
    try {
      await saveSite(buildSitePayload(devices));
      alert('Site layout saved successfully!');
    } catch (err: any) {
      alert(`Failed to save: ${err.message}`);
    }
  };

  /**
   * Loads the most recent site layout from the backend and
   * restores device counts from it.
   */
  const loadLatestSite = useCallback(async () => {
    try {
      const result = await getSites();
      if (result?.sites?.length) {
        const restoredCounts = parseSiteLayoutToCounts(result.sites[0]);
        (Object.entries(restoredCounts) as [keyof DeviceCounts, number][]).forEach(([type, count]) => {
          updateCount(type, count);
        });
      }
    } catch (err) {
      console.error('Failed to load sites', err);
    }
  }, [getSites, updateCount]);

  useEffect(() => {
    loadLatestSite();
  }, [loadLatestSite]);

  return (
    <div className={styles.plannerContainer}>
      <aside className={styles.sidebar} aria-label="Site Configuration Sidebar">
        <div className={styles.welcomeSection}>
          <h2 id="welcome-heading">
            <span className={styles.highlight}>{t('dashboard.welcome')}</span> {currentUser.name}!
          </h2>
          <div className={styles.separator} />
        </div>

        <h3>
          {t('site.config')}
        </h3>

        <div className={styles.deviceControls}>
          {(Object.keys(counts) as (keyof DeviceCounts)[]).map((type) => {
            const inputId = `input-${type.toLowerCase()}`;
            return (
              <div key={type} className={styles.deviceItem}>
                <div className={styles.deviceHeader}>
                  <label htmlFor={inputId}>{t(`device.${type.toLowerCase()}`)}</label>
                  <span className={styles.price}>${DEVICE_PROPERTIES[type as keyof typeof DEVICE_PROPERTIES].cost.toLocaleString()}</span>
                </div>
                <input
                  id={inputId}
                  type="number"
                  min="0"
                  value={counts[type]}
                  onChange={(e) => handleUpdateCount(type, parseInt(e.target.value) || 0)}
                  data-testid={`device-input-${type.toLowerCase()}`}
                  aria-label={`${t(`device.${type.toLowerCase()}`)} count`}
                />
              </div>
            );
          })}
        </div>

        <div className={styles.statsSection} aria-live="polite" aria-label="Site Statistics">
          <div className={styles.statCard}>
            <label>{t('site.totalCost')}</label>
            <span className={styles.value}>${stats.totalCost.toLocaleString()}</span>
          </div>
          <div className={styles.statCard}>
            <label>{t('site.totalEnergy')}</label>
            <span className={styles.value}>{stats.totalEnergy} MWh</span>
          </div>
          <div className={styles.statCard}>
            <label>{t('site.batteries')}</label>
            <span className={styles.value}>{stats.batteryCount}</span>
          </div>
          <div className={styles.statCard}>
            <label>{t('site.transformers')}</label>
            <span className={styles.value}>{stats.transformerCount}</span>
          </div>
          <div className={styles.statCard} style={{ gridColumn: 'span 2' }}>
            <label>{t('site.area')}</label>
            <span className={styles.value}>
              {stats.dimensions.width}ft x {stats.dimensions.length}ft ({stats.totalArea.toLocaleString()} ft²)
            </span>
          </div>
        </div>

        <button
          className={styles.saveBtn}
          onClick={handleSave}
          disabled={saving}
          data-testid="save-layout-btn"
        >
          {saving ? t('site.saving') : t('site.save')}
        </button>
      </aside>

      {is3D ? (
        <SiteCanvas3D devices={devices} dimensions={stats.dimensions} />
      ) : (
        <SiteCanvas devices={devices} dimensions={stats.dimensions} is3D={is3D} />
      )}

      {showSalesModal && (
        <SalesModal 
          onClose={handleSalesClose} 
          onSubmit={handleSalesSubmit} 
        />
      )}
    </div>
  );
};
