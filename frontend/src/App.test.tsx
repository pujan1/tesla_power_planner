/**
 * @module App.test
 * Smoke test for the root App component.
 * Verifies the login form renders in the default LOGIN view.
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

/** Verifies that the App renders the login form after session check completes. */
test('renders login form on initial load', async () => {
  render(
    <ThemeProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>
  );
  
  // Wait for the async session hydration to complete
  await waitFor(() => {
    const loginText = screen.getByText(/Please login to configure/i);
    expect(loginText).toBeInTheDocument();
  });
});
