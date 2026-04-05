import { User } from '@tesla/shared';

export interface LoginFormProps {
  onLoginSuccess: (user: User) => void;
  onSwitchToCreate: () => void;
  onError: (msg: string) => void;
}

export interface CreateAccountFormProps {
  onCreateSuccess: () => void;
  onSwitchToLogin: () => void;
  onError: (msg: string) => void;
}
