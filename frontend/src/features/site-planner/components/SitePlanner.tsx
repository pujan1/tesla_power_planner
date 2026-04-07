import { useEffect, useCallback, useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useSitePlanner } from '../hooks/useSitePlanner';
import { SiteCanvas } from './SiteCanvas';
import { SiteCanvas3D } from './SiteCanvas3D';
import { SalesModal } from './SalesModal';
import { SubmissionSuccess } from './SubmissionSuccess';
import { Toast } from '../../../components/ui/Toast';
import { useMediaQuery } from '../../../hooks/useMediaQuery';

import { useMutation, useQuery } from '../../../hooks/useApi';
import { API_ENDPOINTS } from '../../../config/api.config';
import { User, SiteLayout } from '@tesla/shared';
import { DEVICE_PROPERTIES } from '../constants/device.constants';
import { DeviceCounts } from '../types/site-planner.types';
import { useSitePlannerContext } from '../context/SitePlannerContext';
import { canAddDevices, buildSitePayload, parseSiteLayoutToCounts, isLayoutManual } from '../helpers/site-planner.helpers';
import { checkIntersections } from '../helpers/validation.helpers';
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
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const { 
    counts, 
    updateCount, 
    devices, 
    stats, 
    isManualMode,
    toggleManualMode,
    updateDevicePosition,
    revertManualLayout,
    autoArrangeLayout,
    addManualDevice,
    removeManualDevice,
    hasCustomLayout
  } = useSitePlanner();




  const [showSalesModal, setShowSalesModal] = useState(false);
  const [lastSafeCounts, setLastSafeCounts] = useState<DeviceCounts | null>(null);
  const [showAutoSaveToast, setShowAutoSaveToast] = useState(false);
  const [showManualWarning, setShowManualWarning] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);





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
   * Automatically persists the current device layout to the backend with a debounce.
   */
  useEffect(() => {
    // Disable auto-save during manual editing to prevent inconsistencies
    if (devices.length === 0 || isManualMode) return;
    
    const timeoutId = setTimeout(async () => {
      try {
        setShowAutoSaveToast(true);
        await saveSite(buildSitePayload(devices));
      } catch (err) {
        console.error('Auto-save failed:', err);
        setShowAutoSaveToast(false);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [devices, saveSite, isManualMode]);




  /**
   * Loads the most recent site layout from the backend and
   * restores device counts from it.
   */
  const loadLatestSite = useCallback(async () => {
    try {
      const result = await getSites();
      if (result?.sites?.length) {
        const layout = result.sites[0];
        const restoredCounts = parseSiteLayoutToCounts(layout);

        // Update counts first
        (Object.entries(restoredCounts) as [keyof DeviceCounts, number][]).forEach(([type, count]) => {
          updateCount(type, count);
        });

        // If the layout is manual, restore its devices and flag it as custom
        if (isLayoutManual(layout.devices, restoredCounts)) {
          toggleManualMode(false, layout.devices);
        }
      }
    } catch (err) {
      console.error('Failed to load sites', err);
    }
  }, [getSites, updateCount, toggleManualMode]);

  useEffect(() => {
    if (isManualMode) {
      setShowManualWarning(true);
      const timer = setTimeout(() => setShowManualWarning(false), 7000);
      return () => clearTimeout(timer);
    }
  }, [isManualMode]);



  const handleEditToggle = () => {
    if (!isManualMode) {
      toggleManualMode(true, devices);
    }
  };

  const handleSaveManual = async () => {
    // Check if there are intersections before saving
    const invalidIds = checkIntersections(devices);
    if (invalidIds.size > 0) {
      setSaveError(t('site.invalidLayout') || 'The layout is invalid. Please ensure no devices overlap before saving.');
      return;
    }


    try {
      await saveSite(buildSitePayload(devices));
      toggleManualMode(false);
    } catch (err) {
      console.error('Failed to save manual layout:', err);
    }
  };

  const handleCancelManual = () => {
    toggleManualMode(false);
  };


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

        {!isManualMode && (
          <div className={styles.deviceControls}>
            {(Object.keys(counts) as (keyof DeviceCounts)[]).map((type) => (
              <DeviceInput
                key={type}
                type={type}
                count={counts[type]}
                onUpdate={handleUpdateCount}
                t={t}
                disabled={isManualMode}
              />
            ))}
          </div>
        )}


        <div className={styles.editActions}>
          {!isManualMode ? (
            <>
              <button 
                className={styles.editBtn} 
                onClick={handleEditToggle}
                disabled={is3D || isMobile}
              >
                {t('site.editLayout') || 'Edit Layout'}
              </button>
              <button 
                className={styles.submitConfigBtn} 
                onClick={() => setIsSubmitted(true)}
              >
                {t('site.submitConfig') || 'Submit Configuration'}
              </button>
            </>
          ) : (

            <div className={styles.manualActions}>
              <button className={styles.revertBtn} onClick={revertManualLayout}>
                {t('site.revertLayout') || 'Revert'}
              </button>
              <button className={styles.autoArrangeBtn} onClick={autoArrangeLayout}>
                {t('site.autoArrange') || 'Auto Arrange'}
              </button>
              <div className={styles.primaryActions}>
                <button className={styles.saveManualBtn} onClick={handleSaveManual}>
                  {t('site.saveLayout') || 'Save Layout'}
                </button>
                <button className={styles.cancelManualBtn} onClick={handleCancelManual}>
                  {t('common.cancel') || 'Cancel'}
                </button>
              </div>
            </div>
          )}

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



        {showAutoSaveToast && (
          <Toast 
            message={t('site.saving')} 
            type="success"
            onClose={() => setShowAutoSaveToast(false)}
          />
        )}

        {showManualWarning && (
          <Toast 
            message={t('site.manualWarning')} 
            type="warning"
            onClose={() => setShowManualWarning(false)}
            duration={7000}
          />
        )}

        {saveError && (
          <Toast 
            message={saveError} 
            type="error"
            onClose={() => setSaveError(null)}
          />
        )}


      </aside>

      {is3D ? (
        <SiteCanvas3D devices={devices} dimensions={stats.dimensions} />
      ) : (
        <SiteCanvas 
          devices={devices} 
          dimensions={stats.dimensions} 
          is3D={is3D} 
          isManualMode={isManualMode}
          onUpdatePosition={updateDevicePosition}
          onRevert={revertManualLayout}
          onAutoArrange={autoArrangeLayout}
          onAddDevice={addManualDevice}
          onRemoveDevice={removeManualDevice}
        />


      )}


      {showSalesModal && (
        <SalesModal 
          onClose={handleSalesClose} 
          onSubmit={handleSalesSubmit} 
        />
      )}

      {isSubmitted && (
        <SubmissionSuccess onBack={() => setIsSubmitted(false)} />
      )}
    </div>
  );
};


/**
 * Custom number input with +/- steppers and local string state management.
 * Fixes the "sticky zero" bug and provides a premium Tesla-like feel.
 */
const DeviceInput = ({ type, count, onUpdate, t, disabled }: { 
  type: keyof DeviceCounts, 
  count: number, 
  onUpdate: (type: keyof DeviceCounts, val: number) => void,
  t: (key: string) => string,
  disabled?: boolean
}) => {

  const [localVal, setLocalVal] = useState(count.toString());

  // Sync local value if count is updated externally (e.g. session load)
  useEffect(() => {
    setLocalVal(count.toString());
  }, [count]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    // Allow empty string while typing
    if (val === '') {
      setLocalVal('');
      return;
    }

    const num = parseInt(val);
    if (!isNaN(num) && num >= 0) {
      setLocalVal(num.toString());
      onUpdate(type, num);
    }
  };

  const handleStep = (delta: number) => {
    const next = Math.max(0, count + delta);
    setLocalVal(next.toString());
    onUpdate(type, next);
  };

  const inputId = `input-${type.toLowerCase()}`;

  return (
    <div className={styles.deviceItem}>
      <div className={styles.deviceHeader}>
        <label htmlFor={inputId}>{t(`device.${type.toLowerCase()}`)}</label>
        <span className={styles.price}>
          ${DEVICE_PROPERTIES[type as keyof typeof DEVICE_PROPERTIES].cost.toLocaleString()}
        </span>
      </div>
      <div className={styles.stepperWrapper}>
        <button 
          className={styles.stepBtn} 
          onClick={() => handleStep(-1)}
          aria-label={`Decrease ${t(`device.${type.toLowerCase()}`)}`}
          disabled={disabled}
        >
          -
        </button>
        <input
          id={inputId}
          type="number"
          className={styles.stepperInput}
          value={localVal}
          onChange={handleChange}
          data-testid={`device-input-${type.toLowerCase()}`}
          aria-label={`${t(`device.${type.toLowerCase()}`)} count`}
          placeholder="0"
          disabled={disabled}
        />
        <button 
          className={styles.stepBtn} 
          onClick={() => handleStep(1)}
          aria-label={`Increase ${t(`device.${type.toLowerCase()}`)}`}
          disabled={disabled}
        >
          +
        </button>
      </div>

    </div>
  );
};

