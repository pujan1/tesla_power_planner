import { ToastProps } from '../../types/ui.types';
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
export const Toast = ({ message, type = 'success' }: ToastProps) => {
  if (!message) return null;
  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      {message}
    </div>
  );
};
