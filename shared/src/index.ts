export interface User {
  name: string;
  username: string;
  password?: string;
  language?: string;
  theme?: string;
}

export interface UserResponse {
  message?: string;
  user: User;
}

export interface UsersResponse {
  count: number;
  users: User[];
}
