export interface User {
  name: string;
  username: string;
  password?: string;
  language?: string;
  theme?: string;
}

export interface AuthResponse {
  message?: string;
  user: User;
  token: string;
}

export interface UsersResponse {
  count: number;
  users: User[];
}
