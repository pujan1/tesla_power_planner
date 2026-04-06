import { useEffect, useCallback, useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useSitePlanner } from '../hooks/useSitePlanner';
import { SiteCanvas } from './SiteCanvas';
import { SiteCanvas3D } from './SiteCanvas3D';
import { SalesModal } from './SalesModal';
import { useMutation, useQuery } from '../../../hooks/useApi';
import { API_ENDPOINTS } from '../../../config/api.config';
import { User, DeviceType, SiteLayout } from '@tesla/shared';
import { DEVICE_PROPERTIES } from '../constants/device.constants';
import { DeviceCounts } from '../types/site-planner.types';
import { useSitePlannerContext } from '../context/SitePlannerContext';
import styles from '../styles/SitePlanner.module.css';

export const SitePlanner = ({ currentUser }: { currentUser: User }) => {
  const { t } = useLanguage();
  const { is3D } = useSitePlannerContext();
  const { counts, updateCount, devices, stats } = useSitePlanner();

  const [showSalesModal, setShowSalesModal] = useState(false);
  const [lastSafeCounts, setLastSafeCounts] = useState<DeviceCounts | null>(null);

  const { mutate: saveSite, loading: saving } = useMutation(API_ENDPOINTS.auth.me.replace('/auth/me', '/auth/sites'), 'POST');
  const { fetchResource: getSites } = useQuery<{ sites: SiteLayout[] }>(API_ENDPOINTS.auth.me.replace('/auth/me', '/auth/sites'));

  const handleUpdateCount = (type: keyof DeviceCounts, count: number) => {
    // Calculate hypothetical total with the new count
    const otherUnits = (Object.entries(counts) as [keyof DeviceCounts, number][])
      .filter(([t]) => t !== type)
      .reduce((acc, [_, c]) => acc + c, 0);
    
    const newBatteryTotal = otherUnits + count;
    const newTransformerTotal = Math.ceil(newBatteryTotal / 2);
    const totalUnits = newBatteryTotal + newTransformerTotal;

    if (totalUnits > 50) {
      setLastSafeCounts({ ...counts });
      setShowSalesModal(true);
      return;
    }

    updateCount(type, count);
  };

  const handleSalesClose = () => {
    if (lastSafeCounts) {
      // Revert to last safe counts
      (Object.entries(lastSafeCounts) as [keyof DeviceCounts, number][]).forEach(([type, count]) => {
        updateCount(type, count);
      });
    }
    setShowSalesModal(false);
  };

  const handleSalesSubmit = (data: { email: string; phone: string }) => {
    console.log('Sales lead captured:', data);
    handleSalesClose(); // Revert anyway as per user's request for graceful edge case handling
    alert(t('sales.thankYou') || 'A Tesla Energy representative will contact you shortly.');
  };

  const handleSave = async () => {
    try {
      const siteData: SiteLayout = {
        id: 'main-layout', // For now, we support one main layout
        name: 'My Energy Site',
        devices,
        updatedAt: new Date().toISOString(),
      };
      await saveSite(siteData);
      alert('Site layout saved successfully!');
    } catch (err: any) {
      alert(`Failed to save: ${err.message}`);
    }
  };

  const loadLatestSite = useCallback(async () => {
    try {
      const result = await getSites();
      if (result && result.sites && result.sites.length > 0) {
        const latest = result.sites[0];
        // Restore counts from the loaded layout
        const newCounts: DeviceCounts = {
          [DeviceType.MEGAPACK_XL]: latest.devices.filter((d: any) => d.type === DeviceType.MEGAPACK_XL).length,
          [DeviceType.MEGAPACK_2]: latest.devices.filter((d: any) => d.type === DeviceType.MEGAPACK_2).length,
          [DeviceType.MEGAPACK]: latest.devices.filter((d: any) => d.type === DeviceType.MEGAPACK).length,
          [DeviceType.POWERPACK]: latest.devices.filter((d: any) => d.type === DeviceType.POWERPACK).length,
        };
        (Object.entries(newCounts) as [keyof DeviceCounts, number][]).forEach(([type, count]) => {
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
                  <span className={styles.price}>${DEVICE_PROPERTIES[type as DeviceType].cost.toLocaleString()}</span>
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
