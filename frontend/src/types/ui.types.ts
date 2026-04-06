import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'logout' | 'teslaPrimary' | 'teslaSecondary';
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Can extend with custom error styling boolean in the future
}

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning';

  duration?: number;
  onClose?: () => void;
}

