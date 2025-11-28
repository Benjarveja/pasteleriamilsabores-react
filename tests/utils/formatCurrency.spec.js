import { formatCurrency } from '../../src/utils/formatCurrency.js';

describe('formatCurrency', () => {
  it('formatea valores numéricos como CLP sin decimales', () => {
    expect(formatCurrency(1500)).toBe('$1.500');
  });

  it('maneja valores grandes correctamente', () => {
    expect(formatCurrency(9876543)).toBe('$9.876.543');
  });

  it('incluye separadores de miles y símbolo de peso', () => {
    const formatted = formatCurrency(123456);
    expect(formatted.startsWith('$')).toBeTrue();
    expect(formatted.includes('.')).toBeTrue();
  });
});
