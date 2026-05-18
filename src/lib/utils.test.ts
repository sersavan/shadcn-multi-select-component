import { cn } from './utils';

describe('cn function', () => {
  it('should merge class names correctly', () => {
    const result = cn('bg-red-500', 'text-white');
    expect(result).toBe('bg-red-500 text-white');
  });

  it('should handle conditional class names', () => {
    const result = cn('bg-red-500', false && 'text-white', true && 'font-bold');
    expect(result).toBe('bg-red-500 font-bold');
  });

  it('should merge conflicting tailwind classes', () => {
    // tailwind-merge should prioritize the last conflicting class
    const result = cn('bg-red-500', 'bg-blue-500');
    expect(result).toBe('bg-blue-500');
  });

  it('should handle object syntax', () => {
    const result = cn({ 'bg-red-500': true, 'text-white': false, 'font-bold': true });
    expect(result).toBe('bg-red-500 font-bold');
  });

  it('should handle array syntax', () => {
    const result = cn(['bg-red-500', 'text-white']);
    expect(result).toBe('bg-red-500 text-white');
  });

  it('should handle mixed syntax', () => {
    const result = cn(
      'bg-red-500',
      { 'text-white': true, 'font-bold': false },
      ['p-4', 'm-2'],
      false && 'hidden'
    );
    expect(result).toBe('bg-red-500 text-white p-4 m-2');
  });

  it('should return empty string when no inputs provided', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle null and undefined values', () => {
    const result = cn('bg-red-500', null, undefined, 'text-white');
    expect(result).toBe('bg-red-500 text-white');
  });
});