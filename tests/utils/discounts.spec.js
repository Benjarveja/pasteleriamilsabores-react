import {
  VALID_COUPON_CODE,
  COUPON_DISCOUNT_RATE,
  SENIOR_DISCOUNT_RATE,
  normalizeCouponCode,
  isValidCouponCode,
  calculateAge,
  computeDiscounts,
} from '../../src/utils/discounts.js';

describe('discounts utilities', () => {
  it('normaliza y valida códigos de cupón', () => {
    expect(normalizeCouponCode(' 50milsabores ')).toBe(VALID_COUPON_CODE);
    expect(isValidCouponCode('50milsabores')).toBeTrue();
    expect(isValidCouponCode('INVALIDO')).toBeFalse();
  });

  it('calcula la edad en años o retorna null para entradas inválidas', () => {
    expect(calculateAge('')).toBeNull();
    expect(calculateAge('fecha-no-valida')).toBeNull();

    const now = new Date();
    const birthDate = new Date(now.getFullYear() - 30, now.getMonth(), now.getDate());
    const formatted = birthDate.toISOString().split('T')[0];
    const age = calculateAge(formatted);
    expect(age === 30 || age === 29).toBeTrue();
  });

  it('calcula descuentos por cupón y senior correctamente', () => {
    const now = new Date();
    const seniorBirth = new Date(now.getFullYear() - 70, now.getMonth(), now.getDate());
    const seniorBirthIso = seniorBirth.toISOString().split('T')[0];

    const subtotal = 100000;

    const result = computeDiscounts({
      subtotal,
      couponCode: VALID_COUPON_CODE,
      birthDate: seniorBirthIso,
    });

    const expectedCoupon = Math.round(subtotal * COUPON_DISCOUNT_RATE);
    const seniorBase = Math.max(subtotal - expectedCoupon, 0);
    const expectedSenior = Math.round(seniorBase * SENIOR_DISCOUNT_RATE);

    expect(result.couponValid).toBeTrue();
    expect(result.couponDiscount).toBe(expectedCoupon);
    expect(result.seniorEligible).toBeTrue();
    expect(result.seniorDiscount).toBe(expectedSenior);
    expect(result.total).toBe(Math.max(subtotal - expectedCoupon - expectedSenior, 0));
  });

  it('omite descuentos cuando no aplica cupón ni senior', () => {
    const subtotal = 25000;
    const result = computeDiscounts({ subtotal, couponCode: 'otro', birthDate: '' });
    expect(result.couponValid).toBeFalse();
    expect(result.couponDiscount).toBe(0);
    expect(result.seniorEligible).toBeFalse();
    expect(result.seniorDiscount).toBe(0);
    expect(result.total).toBe(subtotal);
  });
});
