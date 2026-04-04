import React from 'react';
import { ButtonProps } from '../../types/ui.types';
import styles from './Button.module.css';

export const Button = ({ variant = 'primary', className = '', children, ...props }: ButtonProps) => {
  return (
    <button className={`${styles.btn} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
