export const VALID_COUPON_CODE = '50MILSABORES';
export const COUPON_DISCOUNT_RATE = 0.25;
export const SENIOR_DISCOUNT_RATE = 0.5;
export const SENIOR_AGE_THRESHOLD = 50;

export const normalizeCouponCode = (value = '') => value.trim().toUpperCase();

export const isValidCouponCode = (value) => normalizeCouponCode(value) === VALID_COUPON_CODE;

export const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  const date = new Date(birthDate);
  if (Number.isNaN(date.getTime())) return null;

  const now = new Date();
  let age = now.getFullYear() - date.getFullYear();
  const monthDiff = now.getMonth() - date.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < date.getDate())) {
    age -= 1;
  }

  return age;
};

export const computeDiscounts = ({ subtotal = 0, couponCode = '', birthDate = '' } = {}) => {
  const normalizedCoupon = normalizeCouponCode(couponCode);
  const couponValid = normalizedCoupon === VALID_COUPON_CODE;
  const couponDiscount = couponValid ? Math.round(subtotal * COUPON_DISCOUNT_RATE) : 0;

  const age = calculateAge(birthDate);
  const seniorEligible = age !== null && age >= SENIOR_AGE_THRESHOLD;
  const baseForSenior = Math.max(subtotal - couponDiscount, 0);
  const seniorDiscount = seniorEligible ? Math.round(baseForSenior * SENIOR_DISCOUNT_RATE) : 0;

  const total = Math.max(subtotal - couponDiscount - seniorDiscount, 0);

  return {
    subtotal,
    couponCode,
    normalizedCoupon,
    couponValid,
    couponDiscount,
    age,
    seniorEligible,
    seniorDiscount,
    total,
  };
};
