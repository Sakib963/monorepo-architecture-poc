import { User, Role } from '@monorepo/types';

interface UserWithPassword extends User {
  password: string;
}

// Mock user database for POC
const users: UserWithPassword[] = [
  {
    userId: '1',
    username: 'user@example.com',
    email: 'user@example.com',
    role: Role.USER,
    password: 'user123',
  },
  {
    userId: '2',
    username: 'admin@example.com',
    email: 'admin@example.com',
    role: Role.ADMIN,
    password: 'admin123',
  },
  {
    userId: '3',
    username: 'john@example.com',
    email: 'john@example.com',
    role: Role.USER,
    password: 'password',
  },
];

export const findUserByCredentials = (
  username: string,
  password: string
): User | null => {
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return null;
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const findUserById = (userId: string): User | null => {
  const user = users.find((u) => u.userId === userId);

  if (!user) {
    return null;
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
