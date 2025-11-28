import { apiClient } from './apiClient';

const CART_VALIDATE_PATH = '/cart/validate';
const CHECKOUT_PATH = '/checkout';
const COUPON_VALIDATE_PATH = '/coupons/validate';

const mapCartItems = (items = []) =>
  items
    .filter((item) => item && item.codigo && item.cantidad > 0)
    .map(({ codigo, cantidad }) => ({ codigo, cantidad }));

export const checkoutService = {
  validateCart: async ({ items = [], token } = {}) => {
    const payload = { items: mapCartItems(items) };
    return apiClient.post(CART_VALIDATE_PATH, { token, data: payload });
  },
  validateCoupon: async (couponCode) =>
    apiClient.post(COUPON_VALIDATE_PATH, {
      data: { couponCode: couponCode?.trim() || '' },
    }),
  submitOrder: async ({ checkout = {}, items = [], token } = {}) => {
    if (!token) {
      throw new Error('No hay sesión activa. Inicia sesión para continuar.');
    }
    const payload = {
      ...checkout,
      items: mapCartItems(items),
    };
    return apiClient.post(CHECKOUT_PATH, { token, data: payload });
  },
};

