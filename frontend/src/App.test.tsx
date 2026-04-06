import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

test('renders login welcome message', () => {
  render(
    <ThemeProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>
  );
  
  // App starts in LOGIN view by default
  const welcomeText = screen.getByText(/Welcome Back/i);
  expect(welcomeText).toBeInTheDocument();
});
