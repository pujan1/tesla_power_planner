import { InputProps } from '../../types/ui.types';
import styles from './Input.module.css';

/**
 * Reusable text input component with consistent styling.
 *
 * Wraps a native `<input>` in a styled container div.
 *
 * @param props.className - Additional CSS class names for the input.
 * @param props           - All remaining native `<input>` attributes are spread.
 * @returns A styled input group.
 */
export const Input = ({ className = '', ...props }: InputProps) => {
  return (
    <div className={styles.inputGroup}>
      <input className={className} {...props} />
    </div>
  );
};
