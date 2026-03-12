// Re-export validation utilities from the shared package.
// Both this React app AND user-service use the same schemas.
export { validate, getFieldError, hasFieldError } from '@poc/validators';
export { createUserSchema, updateUserSchema, createOrderSchema } from '@poc/validators';
