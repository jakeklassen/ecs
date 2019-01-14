import 'jest';
import { demo } from './demo';

describe('demo', () => {
  test('can calculate compound interest', () => {
    expect(demo.compoundInterest(3, 0.05).toFixed(3)).toBe('1.158');
  });
});
