import { ZodSchema, ZodError } from 'zod';

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors: FieldError[];
}

export interface FieldError {
  field: string;
  message: string;
}

/**
 * Validate data against a Zod schema.
 * Returns structured errors that map directly to form fields.
 * Works identically in browser and Node.js.
 */
export function validate<T>(schema: ZodSchema<T>, data: unknown): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data, errors: [] };
  }

  const errors = flattenZodErrors(result.error);
  return { success: false, errors };
}

function flattenZodErrors(error: ZodError): FieldError[] {
  return error.errors.map(e => ({
    field: e.path.join('.') || 'root',
    message: e.message,
  }));
}

/**
 * Get errors for a specific field from a validation result.
 * Useful in template-driven forms: `getFieldError(result, 'email')`
 */
export function getFieldError(result: ValidationResult<unknown>, field: string): string | null {
  for (const err of result.errors) {
    if (err.field === field) return err.message;
  }
  return null;
}

/**
 * Check if a specific field has an error.
 */
export function hasFieldError(result: ValidationResult<unknown>, field: string): boolean {
  return result.errors.some(e => e.field === field);
}
