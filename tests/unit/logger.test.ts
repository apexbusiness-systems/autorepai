import { describe, expect, it, vi } from 'vitest';
import { logger } from '../../src/lib/logger';

describe('logger', () => {
  it('should call console.error when not in production', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    // Assuming we are in test environment which is not "production" for Vite by default
    logger.error('test message');
    expect(spy).toHaveBeenCalledWith('test message');
    spy.mockRestore();
  });

  it('should call console.warn when not in production', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    logger.warn('test warning');
    expect(spy).toHaveBeenCalledWith('test warning');
    spy.mockRestore();
  });
});
