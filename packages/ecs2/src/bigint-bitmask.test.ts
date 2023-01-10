import { describe, expect, it } from 'vitest';

describe('BigInt Bitmask', () => {
  it('should work', () => {
    let start = 0n;

    const maskA = 1n << start++;
    const maskB = 1n << start++;

    expect(maskA).toBe(1n);
    expect(maskB).toBe(2n);
    expect(maskA | maskB).toBe(3n);
    expect(maskA & maskB).toBe(0n);
  });
});
