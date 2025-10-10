import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../atoms/Button';
import SectionTitle from '../atoms/SectionTitle';
import { useCart } from '../../context/CartContext';
import { SENIOR_AGE_THRESHOLD } from '../../utils/discounts';
import './CheckoutSummary.css';

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(value);

const CheckoutSummary = ({
  pricing,
  couponInput = '',
  couponStatus,
  onCouponInputChange,
  onCouponApply,
  onCouponReset,
}) => {
  const { items, totalItems, total, toggleCart } = useCart();

  const hasItems = items.length > 0;

  const subtotal = pricing?.subtotal ?? total;
  const finalTotal = pricing?.total ?? subtotal;
  const normalizedCoupon = pricing?.normalizedCoupon?.trim() ?? '';
  const couponValid = pricing?.couponValid ?? false;
  const couponDiscount = pricing?.couponDiscount ?? 0;
  const seniorEligible = pricing?.seniorEligible ?? false;
  const seniorDiscount = pricing?.seniorDiscount ?? 0;
  const age = pricing?.age ?? null;
  const totalSavings = couponDiscount + seniorDiscount;
  const hasDiscounts = totalSavings > 0;
  const couponInputValue = couponInput ?? '';
  const normalizedCouponInput = couponInputValue.trim().toUpperCase();
  const couponApplied = couponValid && couponDiscount > 0;
  const hasSeniorDiscount = seniorDiscount > 0;
  const hasActiveDiscount = couponApplied || hasSeniorDiscount;
  const couponMessage = couponStatus?.message || 'Ingresa tu código de descuento si tienes uno.';
  const couponMessageVariant = couponStatus?.variant || 'hint';
  const applyDisabled = !normalizedCouponInput || couponApplied;
  const discountWarning = (() => {
    if (!hasActiveDiscount) return null;
    if (couponApplied && hasSeniorDiscount) {
      return 'Tienes un cupón y un beneficio adicional activos. Debes quitar el cupón actual antes de ingresar otro.';
    }
    if (couponApplied) {
      return 'Ya tienes un cupón aplicado. Quita el actual si deseas usar un código diferente.';
    }
    if (hasSeniorDiscount) {
      return 'Tienes un descuento adulto mayor activo. Aplicar un cupón puede ajustar ese beneficio.';
    }
    return null;
  })();

  const handleCouponInputChange = (event) => {
    const { value } = event.target;
    onCouponInputChange?.(value);
  };

  return (
    <aside className="checkout-summary" aria-label="Resumen de pedido">
      <SectionTitle as="h2" align="left">
        Resumen de tu pedido
      </SectionTitle>

      {!hasItems ? (
        <div className="checkout-summary__empty">
          <p>Tu carrito está vacío. Explora nuestros productos y vuelve para finalizar tu compra.</p>
          <Button as={Link} to="/productos" variant="primary">
            Ver catálogo
          </Button>
        </div>
      ) : (
        <>
          <ul className="checkout-summary__list">
            {items.map((item) => (
              <li key={item.codigo} className="checkout-summary__item">
                <div>
                  <p className="checkout-summary__item-name">{item.nombre}</p>
                  <span className="checkout-summary__item-meta">Cantidad: {item.cantidad}</span>
                </div>
                <span className="checkout-summary__item-price">
                  {formatCurrency(item.cantidad * item.precio)}
                </span>
              </li>
            ))}
          </ul>
          <div className="checkout-summary__breakdown">
            <div className="checkout-summary__row">
              <span>Subtotal</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            {normalizedCoupon ? (
              <div
                className={`checkout-summary__row checkout-summary__row--discount ${couponValid ? 'is-valid' : 'is-invalid'}`}
              >
                <span>
                  Cupón {couponValid ? `(${normalizedCoupon})` : 'no válido'}
                </span>
                <strong>{couponValid ? `- ${formatCurrency(couponDiscount)}` : '—'}</strong>
              </div>
            ) : null}
            {seniorEligible ? (
              <div className="checkout-summary__row checkout-summary__row--discount">
                <span>
                  Descuento 50% x 50 años
                  {age !== null ? ` (${age} ${age === 1 ? 'año' : 'años'})` : ''}
                </span>
                <strong>- {formatCurrency(seniorDiscount)}</strong>
              </div>
            ) : null}
            {!seniorEligible && age !== null && age < SENIOR_AGE_THRESHOLD ? (
              <p className="checkout-summary__note checkout-summary__note--muted">
                El beneficio adulto mayor se activa automáticamente desde los {SENIOR_AGE_THRESHOLD} años.
              </p>
            ) : null}
            <div className="checkout-summary__row checkout-summary__row--total">
              <span>Total estimado</span>
              <strong>{formatCurrency(finalTotal)}</strong>
            </div>
          </div>
          <div className="checkout-summary__footer">
            <div className="checkout-summary__totals">
              <span>
                {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
              </span>
              <strong>{formatCurrency(finalTotal)}</strong>
              {hasDiscounts ? (
                <small className="checkout-summary__savings">
                  Ahorro total: {formatCurrency(totalSavings)}
                </small>
              ) : null}
            </div>
            <Button type="button" variant="secondary" onClick={toggleCart}>
              Ajustar carrito
            </Button>
          </div>
          <div className="checkout-summary__coupon">
            <label>
              <span>Código de descuento</span>
              <input
                type="text"
                value={couponInputValue}
                onChange={handleCouponInputChange}
                placeholder="Ej: 50MILSABORES"
                autoComplete="off"
                spellCheck="false"
                inputMode="text"
                maxLength={32}
              />
            </label>
            <div className="checkout-summary__coupon-actions">
              <Button type="button" variant="primary" onClick={() => onCouponApply?.()} disabled={applyDisabled}>
                {couponApplied ? 'Cupón aplicado' : 'Aplicar cupón'}
              </Button>
              {couponApplied ? (
                <button type="button" onClick={onCouponReset} className="checkout-summary__coupon-reset">
                  Quitar cupón
                </button>
              ) : null}
            </div>
            <small
              className={`checkout-summary__coupon-feedback checkout-summary__coupon-feedback--${couponMessageVariant}`}
              aria-live="polite"
            >
              {couponMessage}
            </small>
            {discountWarning ? (
              <small className="checkout-summary__coupon-warning">{discountWarning}</small>
            ) : null}
          </div>
        </>
      )}
    </aside>
  );
};

export default CheckoutSummary;
