export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User {
  userId: string;
  username: string;
  role: Role;
  email?: string;
}
