import { useEffect } from 'react';
import { ToastProps } from '../../types/ui.types';
import { ERROR_TIMEOUT_MS, MESSAGE_TIMEOUT_MS } from '../../constants/app.constants';
import styles from './Toast.module.css';

/**
 * Notification toast component for success and error messages.
 *
 * Renders nothing if `message` is empty/falsy.
 *
 * @param props.message - The text to display in the toast.
 * @param props.type    - Visual style: `'success'` (default) or `'error'`.
 * @returns A styled toast div, or `null` if no message.
 */
export const Toast = ({ message, type = 'success', duration, onClose }: ToastProps) => {
  useEffect(() => {
    if (!message || !onClose) return;

    const timeout = duration || (type === 'error' ? ERROR_TIMEOUT_MS : MESSAGE_TIMEOUT_MS);
    const timerId = setTimeout(onClose, timeout);

    return () => clearTimeout(timerId);
  }, [message, type, duration, onClose]);

  if (!message) return null;
  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      {message}
    </div>
  );
};
