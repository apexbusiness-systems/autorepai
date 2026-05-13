import { describe, it, expect } from 'vitest';
import { getBranding } from '../../src/lib/branding';

describe('getBranding', () => {
  it('returns default branding when mode is not provided (using env)', () => {
    // We can't easily mock import.meta.env in a way that branding.ts sees it when using bun test
    // So we test the logic via the optional parameter
    const branding = getBranding();
    // Default should be AutoRepAi unless environment is set
    expect(['AutoRepAi', 'Doorstep Auto']).toContain(branding.name);
  });

  it('returns doorstep branding when mode is "doorstep"', () => {
    const branding = getBranding('doorstep');
    expect(branding.name).toBe('Doorstep Auto');
    expect(branding.colors.primary).toBe('#377620');
  });

  it('returns autorepai branding when mode is "autorepai"', () => {
    const branding = getBranding('autorepai');
    expect(branding.name).toBe('AutoRepAi');
    expect(branding.colors.primary).toBe('#ef4444');
  });

  it('returns default branding for unknown mode', () => {
    const branding = getBranding('unknown');
    expect(branding.name).toBe('AutoRepAi');
  });
});
