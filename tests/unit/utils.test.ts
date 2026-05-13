import { describe, it, expect } from 'vitest';
import { cn } from '../../src/lib/utils';

describe('cn utility', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('foo', true && 'bar', false && 'baz')).toBe('foo bar');
    expect(cn('foo', undefined, null, false)).toBe('foo');
  });

  it('merges tailwind classes and resolves conflicts', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    expect(cn('bg-red-500', 'hover:bg-blue-500')).toBe('bg-red-500 hover:bg-blue-500');
    expect(cn('hover:text-red-500', 'hover:text-blue-500')).toBe('hover:text-blue-500');
  });

  it('handles arrays and objects', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar');
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
    expect(cn([{ foo: true }, { bar: false }])).toBe('foo');
    expect(cn({ 'p-4': true, 'p-2': true })).toBe('p-2');
  });

  it('handles mixed inputs', () => {
    expect(cn('foo', ['bar', { baz: true }], { qux: false })).toBe('foo bar baz');
  });

  it('handles empty inputs', () => {
    expect(cn()).toBe('');
  });

  it('handles numeric 0', () => {
    expect(cn('foo', 0)).toBe('foo');
  });

  it('handles empty strings', () => {
    expect(cn('foo', '')).toBe('foo');
  });

  it('handles deeply nested arrays', () => {
    expect(cn(['foo', ['bar', ['baz']]])).toBe('foo bar baz');
  });

  it('deduplicates classes', () => {
    expect(cn('foo', 'foo', 'bar')).toBe('foo bar');
  });

  it('handles complex tailwind conflicts', () => {
    expect(cn('px-2', 'p-4')).toBe('p-4');
    expect(cn('m-2', 'mt-4')).toBe('m-2 mt-4');
    expect(cn('mt-4', 'm-2')).toBe('m-2');
  });
});
