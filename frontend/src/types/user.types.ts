import { Language } from '../i18n/locales';
import { Theme } from '../context/ThemeContext';

export interface User {
  username: string;
  name: string;
  language?: Language;
  theme?: Theme;
}
