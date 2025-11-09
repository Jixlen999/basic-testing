import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    const result = simpleCalculator({ a: 1, b: 2, action: Action.Add });
    expect(result).toEqual(3);
  });

  test('should subtract two numbers', () => {
    const result = simpleCalculator({ a: 2, b: 1, action: Action.Subtract });
    expect(result).toEqual(1);
  });

  test('should multiply two numbers', () => {
    const result = simpleCalculator({ a: 2, b: 3, action: Action.Multiply });
    expect(result).toEqual(6);
  });

  test('should divide two numbers', () => {
    const result = simpleCalculator({ a: 6, b: 2, action: Action.Divide });
    expect(result).toEqual(3);
  });

  test('should exponentiate two numbers', () => {
    const result = simpleCalculator({
      a: 2,
      b: 3,
      action: Action.Exponentiate,
    });
    expect(result).toEqual(8);
  });

  test('should return null for invalid action', () => {
    const result = simpleCalculator({ a: 2, b: 1, action: '=' });
    expect(result).toEqual(null);
  });

  test('should return null for invalid arguments', () => {
    const result = simpleCalculator({ a: 'a', b: 1, action: Action.Subtract });
    expect(result).toEqual(null);
  });
});
