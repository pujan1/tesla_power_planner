import { ButtonProps } from '../../types/ui.types';
import styles from './Button.module.css';

/**
 * Reusable button component with variant-based styling.
 *
 * @param props.variant   - Visual variant: `'primary'`, `'secondary'`, `'logout'`, etc.
 * @param props.className - Additional CSS class names to append.
 * @param props.children  - Button label content.
 * @param props           - All remaining native `<button>` attributes are spread.
 * @returns A styled `<button>` element.
 */
export const Button = ({ variant = 'primary', className = '', children, ...props }: ButtonProps) => {
  return (
    <button className={`${styles.btn} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
