import React from 'react';
import { ToastProps } from '../../types/ui.types';
import styles from './Toast.module.css';

export const Toast = ({ message, type = 'success' }: ToastProps) => {
  if (!message) return null;
  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      {message}
    </div>
  );
};
