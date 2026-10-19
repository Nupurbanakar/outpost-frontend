import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn utility', () => {
  it('should merge class names', () => {
    const result = cn('text-red-500', 'bg-blue-500');
    expect(result).toBe('text-red-500 bg-blue-500');
  });

  it('should handle conditional classes', () => {
    const result = cn('text-red-500', false && 'hidden', 'bg-blue-500');
    expect(result).toBe('text-red-500 bg-blue-500');
  });

  it('should deduplicate Tailwind classes', () => {
    // tailwind-merge should keep the last conflicting class
    const result = cn('text-red-500', 'text-blue-500');
    expect(result).toBe('text-blue-500');
  });

  it('should handle arrays of classes', () => {
    const result = cn(['text-red-500', 'bg-blue-500'], 'p-4');
    expect(result).toBe('text-red-500 bg-blue-500 p-4');
  });

  it('should handle objects with boolean values', () => {
    const result = cn({
      'text-red-500': true,
      'bg-blue-500': false,
      'p-4': true,
    });
    expect(result).toBe('text-red-500 p-4');
  });

  it('should handle undefined and null values', () => {
    const result = cn('text-red-500', undefined, null, 'bg-blue-500');
    expect(result).toBe('text-red-500 bg-blue-500');
  });

  it('should handle complex Tailwind conflicts', () => {
    // Should keep the last conflicting utility
    const result = cn('px-4 py-2', 'p-6');
    expect(result).toBe('p-6');
  });

  it('should handle empty input', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle responsive classes', () => {
    const result = cn('text-sm md:text-base lg:text-lg');
    expect(result).toBe('text-sm md:text-base lg:text-lg');
  });

  it('should handle hover and state variants', () => {
    const result = cn('bg-blue-500 hover:bg-blue-600 focus:ring-2');
    expect(result).toBe('bg-blue-500 hover:bg-blue-600 focus:ring-2');
  });

  it('should merge conflicting responsive classes correctly', () => {
    const result = cn('text-sm md:text-base', 'text-lg');
    // The last base class should win, but responsive modifiers are preserved
    expect(result).toBe('md:text-base text-lg');
  });
});
