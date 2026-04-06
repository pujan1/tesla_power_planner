import { InputProps } from '../../types/ui.types';
import styles from './Input.module.css';

export const Input = ({ className = '', ...props }: InputProps) => {
  return (
    <div className={styles.inputGroup}>
      <input className={className} {...props} />
    </div>
  );
};
