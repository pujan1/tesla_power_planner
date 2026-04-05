import React, { useEffect, useCallback } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useSitePlanner, DEVICE_PROPERTIES, DeviceCounts } from '../hooks/useSitePlanner';
import { SiteCanvas } from './SiteCanvas';
import { useMutation, useQuery } from '../../../hooks/useApi';
import { API_ENDPOINTS } from '../../../config/api.config';
import { SiteDevice, DeviceType, SiteLayout } from '@tesla/shared';
import styles from '../styles/SitePlanner.module.css';

export const SitePlanner: React.FC = () => {
  const { counts, updateCount, devices, stats } = useSitePlanner();
  
  const { mutate: saveSite, loading: saving } = useMutation(API_ENDPOINTS.auth.me.replace('/auth/me', '/auth/sites'), 'POST');
  const { fetchResource: getSites } = useQuery<{ sites: SiteLayout[] }>(API_ENDPOINTS.auth.me.replace('/auth/me', '/auth/sites'));

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
        Object.entries(newCounts).forEach(([type, count]) => {
          updateCount(type as keyof DeviceCounts, count);
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
      <aside className={styles.sidebar}>
        <h3>
          Site Config
        </h3>
        
        <div className={styles.deviceControls}>
          {Object.keys(counts).map((type) => (
            <div key={type} className={styles.deviceItem}>
              <div className={styles.deviceHeader}>
                <label>{type}</label>
                <span className={styles.price}>${DEVICE_PROPERTIES[type as DeviceType].cost.toLocaleString()}</span>
              </div>
              <input 
                type="number" 
                min="0"
                value={counts[type as keyof DeviceCounts]}
                onChange={(e) => updateCount(type as keyof DeviceCounts, parseInt(e.target.value) || 0)}
              />
            </div>
          ))}
        </div>

        <div className={styles.statsSection}>
          <div className={styles.statCard}>
            <label>Total Cost</label>
            <span className={styles.value}>${stats.totalCost.toLocaleString()}</span>
          </div>
          <div className={styles.statCard}>
            <label>Total Energy</label>
            <span className={styles.value}>{stats.totalEnergy} MWh</span>
          </div>
          <div className={styles.statCard}>
            <label>Batteries</label>
            <span className={styles.value}>{stats.batteryCount}</span>
          </div>
          <div className={styles.statCard}>
            <label>Transformers</label>
            <span className={styles.value}>{stats.transformerCount}</span>
          </div>
          <div className={styles.statCard} style={{ gridColumn: 'span 2' }}>
            <label>Area (ft²)</label>
            <span className={styles.value}>
              {stats.dimensions.width}ft x {stats.dimensions.length}ft ({stats.totalArea.toLocaleString()} ft²)
            </span>
          </div>
        </div>

        <button 
          className={styles.saveBtn} 
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Layout'}
        </button>
      </aside>

      <SiteCanvas devices={devices} dimensions={stats.dimensions} />
    </div>
  );
};
