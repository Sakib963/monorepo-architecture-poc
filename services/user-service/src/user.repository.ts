import { v4 as uuidv4 } from 'uuid';
import type { User, CreateUserDto, UpdateUserDto } from '@poc/types';
import { UserRole, UserStatus } from '@poc/types';

// ── In-memory store (no database needed for this POC) ─────────────────────────
const users: Map<string, User> = new Map();

// Seed data so the showcase has something to display immediately
const seed: Omit<User, 'id' | 'createdAt' | 'updatedAt'>[] = [
  { email: 'alice@example.com', firstName: 'Alice', lastName: 'Chen',    role: UserRole.ADMIN,    status: UserStatus.ACTIVE },
  { email: 'bob@example.com',   firstName: 'Bob',   lastName: 'Martin',  role: UserRole.MANAGER,  status: UserStatus.ACTIVE },
  { email: 'carol@example.com', firstName: 'Carol', lastName: 'Nguyen',  role: UserRole.CUSTOMER, status: UserStatus.ACTIVE },
  { email: 'dave@example.com',  firstName: 'Dave',  lastName: 'Okafor',  role: UserRole.CUSTOMER, status: UserStatus.SUSPENDED },
];

seed.forEach(u => {
  const id = uuidv4();
  const now = new Date().toISOString();
  users.set(id, { ...u, id, createdAt: now, updatedAt: now });
});

// ── Repository functions ──────────────────────────────────────────────────────

export const UserRepository = {
  findAll(): User[] {
    return Array.from(users.values());
  },

  findById(id: string): User | undefined {
    return users.get(id);
  },

  findByEmail(email: string): User | undefined {
    return Array.from(users.values()).find(u => u.email === email);
  },

  create(dto: CreateUserDto): User {
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
    users.set(id, user);
    return user;
  },

  update(id: string, dto: UpdateUserDto): User | undefined {
    const existing = users.get(id);
    if (!existing) return undefined;

    const updated: User = {
      ...existing,
      ...(dto.firstName !== undefined && { firstName: dto.firstName }),
      ...(dto.lastName  !== undefined && { lastName:  dto.lastName  }),
      ...(dto.role      !== undefined && { role:      dto.role      }),
      ...(dto.status    !== undefined && { status:    dto.status    }),
      updatedAt: new Date().toISOString(),
    };
    users.set(id, updated);
    return updated;
  },

  delete(id: string): boolean {
    return users.delete(id);
  },
};
