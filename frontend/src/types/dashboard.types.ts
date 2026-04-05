import { User } from '@tesla/shared';

export interface UserSettingsDropdownProps {
  currentUser: User;
  onLogout: () => void;
  onUpdateSuccess: (user: User) => void;
  onError: (msg: string) => void;
}

export interface DashboardViewProps {
  currentUser: User;
}
