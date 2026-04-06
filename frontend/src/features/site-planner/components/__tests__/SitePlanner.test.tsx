import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { SitePlanner } from '../SitePlanner';
import { useSitePlanner } from '../../hooks/useSitePlanner';
import { useMutation, useQuery } from '../../../../hooks/useApi';
import { useLanguage } from '../../../../context/LanguageContext';
import { SitePlannerProvider } from '../../context/SitePlannerContext';
import { DeviceType } from '@tesla/shared';

// Mock dependencies
jest.mock('../../hooks/useSitePlanner');
jest.mock('../../../../hooks/useApi');
jest.mock('../../../../context/LanguageContext');

const mockUser = {
  name: 'Test User',
  username: 'testuser',
  theme: 'dark',
  language: 'en',
};

describe('SitePlanner Auto-Save', () => {
  const mockMutate = jest.fn();
  const mockUpdateCount = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    (useLanguage as jest.Mock).mockReturnValue({
      t: (key: string) => key,
    });

    (useMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      loading: false,
    });

    (useQuery as jest.Mock).mockReturnValue({
      fetchResource: jest.fn().mockResolvedValue({ sites: [] }),
    });

    (useSitePlanner as jest.Mock).mockReturnValue({
      counts: { 
        [DeviceType.MEGAPACK_XL]: 0, 
        [DeviceType.MEGAPACK_2]: 0, 
        [DeviceType.MEGAPACK]: 0, 
        [DeviceType.POWERPACK]: 0 
      },
      updateCount: mockUpdateCount,
      devices: [{ id: '1', type: DeviceType.MEGAPACK_XL, x: 0, y: 0 }],
      stats: {
        totalCost: 0,
        totalEnergy: 0,
        batteryCount: 0,
        transformerCount: 0,
        dimensions: { width: 100, length: 100 },
        totalArea: 10000,
      },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('triggers auto-save after 2 seconds of inactivity', async () => {
    render(
      <SitePlannerProvider>
        <SitePlanner currentUser={mockUser} />
      </SitePlannerProvider>
    );

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledTimes(1);
    });
  });

  it('debounces multiple changes', async () => {
    const { rerender } = render(
      <SitePlannerProvider>
        <SitePlanner currentUser={mockUser} />
      </SitePlannerProvider>
    );

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(mockMutate).toHaveBeenCalledTimes(1);

    // Update mock to simulate change
    (useSitePlanner as jest.Mock).mockReturnValue({
      counts: { 
        [DeviceType.MEGAPACK_XL]: 1, 
        [DeviceType.MEGAPACK_2]: 0, 
        [DeviceType.MEGAPACK]: 0, 
        [DeviceType.POWERPACK]: 0 
      },
      updateCount: mockUpdateCount,
      devices: [
        { id: '1', type: DeviceType.MEGAPACK_XL, x: 0, y: 0 },
        { id: '2', type: DeviceType.MEGAPACK_XL, x: 10, y: 0 }
      ],
      stats: { dimensions: { width: 100, length: 100 }, totalCost: 0, totalEnergy: 0, batteryCount: 0, transformerCount: 0, totalArea: 10000 },
    });

    rerender(
      <SitePlannerProvider>
        <SitePlanner currentUser={mockUser} />
      </SitePlannerProvider>
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(mockMutate).toHaveBeenCalledTimes(1);

    rerender(
      <SitePlannerProvider>
        <SitePlanner currentUser={mockUser} />
      </SitePlannerProvider>
    );

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledTimes(2);
    });
  });

  it('displays a saving toast during auto-save', async () => {
    render(
      <SitePlannerProvider>
        <SitePlanner currentUser={mockUser} />
      </SitePlannerProvider>
    );

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(screen.getByText('site.saving')).toBeInTheDocument();
    });

    // Fast forward to hide toast
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => {
      expect(screen.queryByText('site.saving')).not.toBeInTheDocument();
    });

  });

  it('does not display a save button', () => {
    render(
      <SitePlannerProvider>
        <SitePlanner currentUser={mockUser} />
      </SitePlannerProvider>
    );

    expect(screen.queryByTestId('save-layout-btn')).not.toBeInTheDocument();
  });
});

