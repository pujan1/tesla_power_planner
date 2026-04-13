import { render, screen, fireEvent } from '@testing-library/react';
import { SiteCanvas } from '../SiteCanvas';
import { SiteDevice, DeviceType } from '@tesla/shared';
import { ThemeProvider } from '../../../../context/ThemeContext';
import { LanguageProvider } from '../../../../context/LanguageContext';

// Mock WebGL / React Three Fiber since Jest does not support WebGL contexts
jest.mock('@react-three/fiber', () => {
  return {
    Canvas: ({ children }: any) => <div data-testid="mock-r3f-canvas">{children}</div>,
    useThree: () => ({ camera: {}, scene: {}, gl: {} }),
  };
});

jest.mock('@react-three/drei', () => ({
  OrthographicCamera: () => <div data-testid="mock-ortho-camera" />,
  MapControls: () => <div />,
  Grid: () => <div />,
  Text: () => <div />,
  Line: () => <div />
}));

jest.mock('../BatteryMesh', () => ({
  BatteryMesh: () => <div data-testid="mock-battery-mesh" />
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <LanguageProvider>
        {ui}
      </LanguageProvider>
    </ThemeProvider>
  );
};

describe('SiteCanvas (WebGL 2D)', () => {
  const mockDimensions = { width: 100, length: 100 };
  const mockDevices: SiteDevice[] = [
    { id: '1', type: DeviceType.MEGAPACK_XL, x: 0, y: 0 },
    { id: '2', type: DeviceType.TRANSFORMER, x: 20, y: 20 }
  ];

  it('renders WebGL canvas mock successfully', () => {
    renderWithProviders(
      <SiteCanvas
        devices={[]}
        dimensions={mockDimensions}
        is3D={false}
      />
    );
    expect(screen.getByTestId('mock-r3f-canvas')).toBeInTheDocument();
  });

  it('renders correct number of BatteryMesh placeholders', () => {
    renderWithProviders(
      <SiteCanvas
        devices={mockDevices}
        dimensions={mockDimensions}
        is3D={false}
      />
    );
    const meshes = screen.getAllByTestId('mock-battery-mesh');
    expect(meshes.length).toBe(2);
  });

  it('does not show mobile palette when isManualMode is false', () => {
    renderWithProviders(
      <SiteCanvas
        devices={[]}
        dimensions={mockDimensions}
        is3D={false}
        isManualMode={false}
      />
    );
    const paletteItems = screen.queryByText(/Megapack/i);
    expect(paletteItems).not.toBeInTheDocument();
  });

  it('shows mobile palette and trash zone when isManualMode is true', () => {
    renderWithProviders(
      <SiteCanvas
        devices={[]}
        dimensions={mockDimensions}
        is3D={false}
        isManualMode={true}
      />
    );
    expect(screen.getByText('device.megapack_xl')).toBeInTheDocument();
    
    // Trash zone should be present (though perhaps not visible until dragging)
    expect(screen.getByLabelText('Trash Bin - Drop here to remove device')).toBeInTheDocument();
  });

});
