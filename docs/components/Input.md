# Input Component

Shared text/number input component with consistent structural styling.

## Design Philosophy

**What Input controls:**
- Spacing (mt-2, px-3, py-2)
- Border (border-slate-800, rounded-md)
- Width (w-full)

**What callers control:**
- Background color (via className)
- Font size (inherits from parent)
- Additional styling (focus states, validation states)

## Usage Examples

### LeadCaptureForm pattern (slate-900 background)
```tsx
<Input
  {...register('fullName', { required: true })}
  placeholder="Alex Morgan"
  className="bg-slate-900"
  aria-label="Full name"
/>
```

### QuoteCalculator pattern (slate-950 background)
```tsx
<Input
  {...register('projectBudget')}
  type="number"
  placeholder="10000"
  className="bg-slate-950"
/>
```

## Migration Guide

Before:
```tsx
<input
  className="mt-2 w-full rounded-md border border-slate-800 px-3 py-2 bg-slate-900"
  {...register('email')}
/>
```

After:
```tsx
<Input
  className="bg-slate-900"
  {...register('email')}
/>
```

## Out of Scope (For Now)
- `<select>` elements (create Select component separately)
- `<input type="checkbox">` (create Checkbox component separately)
- `<textarea>` elements (create TextArea component separately)

## Future Enhancements
- Variant prop for background colors (after design system audit)
- Size prop for typography (if design requires smaller form text explicitly)
- Error state styling (if validation patterns converge)
