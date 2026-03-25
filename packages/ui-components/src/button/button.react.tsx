import { createElement } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends HTMLAttributes<HTMLElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  children?: ReactNode;
}

/**
 * React wrapper over the shared Web Component.
 *
 * This uses the same `poc-shared-button` element that Angular apps use,
 * so behavior and styling stay aligned across frameworks.
 * Ensure `registerSharedUiElements()` is called once at app startup.
 * 
 * Usage:
 *   import { Button } from '@poc/ui-components/react'
 *   <Button variant="primary">Click me</Button>
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  type,
  onClick,
  children,
  ...rest
}: ButtonProps) {
  return createElement(
    'poc-shared-button',
    {
      variant,
      size,
      ...(type ? { type } : {}),
      ...(disabled || loading ? { disabled: true } : {}),
      ...(loading ? { loading: true } : {}),
      ...(className ? { class: className } : {}),
      ...(onClick ? { onClick } : {}),
      ...rest,
    },
    children,
  );
}
