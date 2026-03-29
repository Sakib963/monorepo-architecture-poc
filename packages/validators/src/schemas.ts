import { z } from 'zod';

// ─── User schemas ─────────────────────────────────────────────────────────────

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Must be a valid email address')
  .max(254, 'Email must not exceed 254 characters');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must not exceed 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long').regex(/^[A-Za-z\s'-]+$/, 'First name contains invalid characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long').regex(/^[A-Za-z\s'-]+$/, 'Last name contains invalid characters'),
  role: z.enum(['ADMIN', 'MANAGER', 'CUSTOMER']).optional(),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'CUSTOMER']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

// ─── Product schemas ──────────────────────────────────────────────────────────

export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters').max(100, 'Product name too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description too long'),
  price: z.number().positive('Price must be positive').max(1_000_000, 'Price exceeds maximum'),
  category: z.enum(['ELECTRONICS', 'CLOTHING', 'BOOKS', 'FOOD', 'OTHER']),
  stock: z.number().int('Stock must be a whole number').min(0, 'Stock cannot be negative').max(100_000),
  imageUrl: z.string().url('Must be a valid URL').optional(),
});

// ─── Order schemas ────────────────────────────────────────────────────────────

export const addressSchema = z.object({
  street: z.string().min(3, 'Street address required').max(100),
  city: z.string().min(1, 'City required').max(50),
  state: z.string().min(1, 'State required').max(50),
  country: z.string().min(2, 'Country required').max(2, 'Use 2-letter country code (ISO 3166-1 alpha-2)'),
  postalCode: z.string().min(3, 'Postal code required').max(20).regex(/^[A-Za-z0-9\s-]+$/, 'Invalid postal code'),
});

export const orderItemSchema = z.object({
  productId: z.string().uuid('Product ID must be a valid UUID'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(100, 'Cannot order more than 100 of one item'),
});

export const createOrderSchema = z.object({
  userId: z.string().uuid('User ID must be a valid UUID'),
  items: z.array(orderItemSchema).min(1, 'Order must contain at least one item').max(50, 'Order cannot contain more than 50 different items'),
  shippingAddress: addressSchema,
});

// ─── Action schemas (User/Admin workflows) ─────────────────────────────────

export const createTransferActionSchema = z.object({
  fromAccountId: z.string().uuid('From account ID must be a valid UUID'),
  toAccountId: z.string().uuid('To account ID must be a valid UUID'),
  amount: z.number().positive('Amount must be positive').max(1_000_000, 'Amount exceeds maximum'),
  currency: z.enum(['BDT', 'USD']),
  note: z.string().max(200, 'Note too long').optional(),
});

export const approveTransferActionSchema = z.object({
  transferId: z.string().uuid('Transfer ID must be a valid UUID'),
  decision: z.enum(['APPROVE', 'REJECT']),
  reason: z.string().max(250, 'Reason too long').optional(),
});

export const updateProfileActionSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100, 'Full name too long'),
  phone: z.string().min(7, 'Phone number too short').max(20, 'Phone number too long'),
  addressLine: z.string().min(5, 'Address must be at least 5 characters').max(200, 'Address too long'),
});

export const changeUserStatusActionSchema = z.object({
  userId: z.string().uuid('User ID must be a valid UUID'),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'BLOCKED']),
  reason: z.string().min(3, 'Reason is required').max(250, 'Reason too long'),
});

export const toggleFeatureFlagActionSchema = z.object({
  flagKey: z.string().min(1, 'Flag key is required').max(100, 'Flag key too long'),
  enabled: z.boolean(),
  reason: z.string().min(3, 'Reason is required').max(250, 'Reason too long'),
});

export const requestStatementActionSchema = z.object({
  accountId: z.string().uuid('Account ID must be a valid UUID'),
  fromDate: z.string().datetime('fromDate must be an ISO datetime string'),
  toDate: z.string().datetime('toDate must be an ISO datetime string'),
  format: z.enum(['PDF', 'CSV']),
});

export const markNotificationReadActionSchema = z.object({
  notificationIds: z.array(z.string().uuid('Notification ID must be a valid UUID')).min(1, 'At least one notification ID is required'),
  read: z.literal(true),
});

export const resetUserCredentialActionSchema = z.object({
  userId: z.string().uuid('User ID must be a valid UUID'),
  channel: z.enum(['EMAIL', 'SMS']),
  reason: z.string().min(3, 'Reason is required').max(250, 'Reason too long'),
});

export const exportAuditLogActionSchema = z.object({
  fromDate: z.string().datetime('fromDate must be an ISO datetime string'),
  toDate: z.string().datetime('toDate must be an ISO datetime string'),
  format: z.enum(['CSV', 'PDF']),
  requestedBy: z.string().min(3, 'requestedBy is required').max(100, 'requestedBy too long'),
});

// ─── Types inferred from schemas (so fields stay in sync automatically) ────

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type CreateTransferActionInput = z.infer<typeof createTransferActionSchema>;
export type ApproveTransferActionInput = z.infer<typeof approveTransferActionSchema>;
export type UpdateProfileActionInput = z.infer<typeof updateProfileActionSchema>;
export type ChangeUserStatusActionInput = z.infer<typeof changeUserStatusActionSchema>;
export type ToggleFeatureFlagActionInput = z.infer<typeof toggleFeatureFlagActionSchema>;
export type RequestStatementActionInput = z.infer<typeof requestStatementActionSchema>;
export type MarkNotificationReadActionInput = z.infer<typeof markNotificationReadActionSchema>;
export type ResetUserCredentialActionInput = z.infer<typeof resetUserCredentialActionSchema>;
export type ExportAuditLogActionInput = z.infer<typeof exportAuditLogActionSchema>;
