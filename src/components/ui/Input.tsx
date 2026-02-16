import { forwardRef, type InputHTMLAttributes } from 'react';
import clsx from 'clsx';

/**
 * Shared Input component for text/number inputs.
 *
 * DESIGN DECISIONS (intentionally NOT enforced):
 * - Font size: Inherits browser default (~16px) for accessibility
 * - Background color: Controlled by caller via className prop
 *
 * @example
 * // LeadCaptureForm usage (slate-900 background)
 * <Input {...register('name')} className="bg-slate-900" />
 *
 * @example
 * // QuoteCalculator usage (slate-950 background)
 * <Input {...register('amount')} className="bg-slate-950" />
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  // No additional props beyond native input attributes
  // Background and font sizing controlled via className
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    // Shared structural classes only (spacing, border, radius, width)
    const baseClasses = 'mt-2 w-full rounded-md border border-slate-800 px-3 py-2';

    return (
      <input
        ref={ref}
        type={type}
        className={clsx(baseClasses, className)}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
