import { User } from '@tesla/shared';

export interface LoginFormProps {
  onLoginSuccess: (user: User, token?: string) => void;
  onSwitchToCreate: () => void;
  onError: (msg: string) => void;
}

export interface CreateAccountFormProps {
  onCreateSuccess: (token?: string) => void;
  onSwitchToLogin: () => void;
  onError: (msg: string) => void;
}
