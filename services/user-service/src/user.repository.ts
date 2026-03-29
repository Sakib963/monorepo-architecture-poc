import { v4 as uuidv4 } from 'uuid';
import type { User, CreateUserDto, UpdateUserDto } from '@poc/types';
import { UserRole, UserStatus } from '@poc/types';
import fs from 'fs';
import path from 'path';

const STORAGE_PATH = path.resolve(__dirname, './data/users.json');

const fallbackSeed: User[] = [
  {
    id: 'a0d88eb8-83a4-45fa-a9cd-7ee95f47d181',
    email: 'sakib.ahmed@example.com',
    firstName: 'Sakib',
    lastName: 'Ahmed',
    role: UserRole.CUSTOMER,
    status: UserStatus.ACTIVE,
    createdAt: '2026-03-20T09:00:00.000Z',
    updatedAt: '2026-03-20T09:00:00.000Z',
  },
  {
    id: 'b9327d98-72c2-4f70-9c7a-15521fda69e8',
    email: 'nabila.rahman@example.com',
    firstName: 'Nabila',
    lastName: 'Rahman',
    role: UserRole.CUSTOMER,
    status: UserStatus.ACTIVE,
    createdAt: '2026-03-20T10:00:00.000Z',
    updatedAt: '2026-03-20T10:00:00.000Z',
  },
  {
    id: 'c8443f2b-c7e0-4d85-b88d-2a7d6b8f9fe1',
    email: 'alice.admin@example.com',
    firstName: 'Alice',
    lastName: 'Chen',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    createdAt: '2026-03-19T12:00:00.000Z',
    updatedAt: '2026-03-19T12:00:00.000Z',
  },
];

function ensureStorage(): void {
  if (!fs.existsSync(STORAGE_PATH)) {
    fs.mkdirSync(path.dirname(STORAGE_PATH), { recursive: true });
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(fallbackSeed, null, 2), 'utf8');
  }
}

function readUsers(): User[] {
  ensureStorage();
  const raw = fs.readFileSync(STORAGE_PATH, 'utf8');
  try {
    return JSON.parse(raw) as User[];
  } catch {
    return fallbackSeed;
  }
}

function writeUsers(users: User[]): void {
  ensureStorage();
  fs.writeFileSync(STORAGE_PATH, JSON.stringify(users, null, 2), 'utf8');
}

// ── Repository functions ──────────────────────────────────────────────────────

export const UserRepository = {
  findAll(): User[] {
    return readUsers();
  },

  findById(id: string): User | undefined {
    return readUsers().find((user) => user.id === id);
  },

  findByEmail(email: string): User | undefined {
    return readUsers().find((user) => user.email === email);
  },

  create(dto: CreateUserDto): User {
    const users = readUsers();
    const id = uuidv4();
    const now = new Date().toISOString();
    const user: User = {
      id,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role ?? UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
      createdAt: now,
      updatedAt: now,
    };
    users.push(user);
    writeUsers(users);
    return user;
  },

  update(id: string, dto: UpdateUserDto): User | undefined {
    const users = readUsers();
    const index = users.findIndex((user) => user.id === id);
    const existing = index >= 0 ? users[index] : undefined;
    if (!existing) return undefined;

    const updated: User = {
      ...existing,
      ...(dto.firstName !== undefined && { firstName: dto.firstName }),
      ...(dto.lastName  !== undefined && { lastName:  dto.lastName  }),
      ...(dto.role      !== undefined && { role:      dto.role      }),
      ...(dto.status    !== undefined && { status:    dto.status    }),
      updatedAt: new Date().toISOString(),
    };
    users[index] = updated;
    writeUsers(users);
    return updated;
  },

  delete(id: string): boolean {
    const users = readUsers();
    const next = users.filter((user) => user.id !== id);
    if (next.length === users.length) {
      return false;
    }
    writeUsers(next);
    return true;
  },
};
