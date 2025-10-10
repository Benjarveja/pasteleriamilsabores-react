import React, { useCallback, useMemo, useState } from 'react';
import PageHeader from '../organisms/PageHeader';
import CheckoutSummary from '../organisms/CheckoutSummary';
import CheckoutForm from '../organisms/CheckoutForm';
import SectionTitle from '../atoms/SectionTitle';
import OrderConfirmation from '../organisms/OrderConfirmation';
import AuthDialog from '../organisms/AuthDialog';
import { useCart } from '../../context/CartContext';
import { paymentMethods, pickupBranches, pickupTimeSlots } from '../../data/checkout';
import { computeDiscounts, isValidCouponCode, normalizeCouponCode } from '../../utils/discounts';
import './PagoPage.css';

const safetyTips = [
  'Todos los pagos se procesan en ambientes cifrados y verificados por Transbank.',
  'Revisamos los pedidos personalizados manualmente para asegurar que los detalles estén correctos.',
  'Puedes modificar tu pedido hasta 24 horas antes de la fecha de entrega coordinada.',
];

const timelineItems = [
  {
    id: 'recepcion',
    title: '1. Recepción del pedido',
    description:
      'Validamos disponibilidad, revisamos cantidades y confirmamos sabores o decoraciones especiales.',
  },
  {
    id: 'coordinacion',
    title: '2. Coordinación de entrega',
    description:
      'Coordinamos el horario ideal y confirmamos dirección o sucursal, además de los datos de contacto.',
  },
  {
    id: 'produccion',
    title: '3. Producción y despacho',
    description:
      'Nuestro equipo prepara tu pedido el mismo día de la entrega para mantener frescura y calidad.',
  },
];

const DEFAULT_COUPON_MESSAGE = 'Ingresa tu código de descuento si tienes uno.';
const APPLY_PROMPT_MESSAGE = 'Presiona “Aplicar cupón” para validar tu código.';
const EXISTING_COUPON_WARNING = 'Ya tienes un cupón aplicado. Quita el actual para probar otro código.';
const COUPON_ALREADY_APPLIED_MESSAGE = 'Este cupón ya está aplicado.';
const EMPTY_COUPON_ERROR = 'Ingresa un código antes de aplicarlo.';
const INVALID_COUPON_ERROR = 'Cupón no reconocido. Revísalo e inténtalo nuevamente.';

const PagoPage = () => {
  const { items, total, clearCart } = useCart();
  const hasItems = items.length > 0;
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [order, setOrder] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponStatus, setCouponStatus] = useState({
    message: DEFAULT_COUPON_MESSAGE,
    variant: 'hint',
  });

  const branchLabels = useMemo(() => {
    const map = new Map();
    pickupBranches.forEach((branch) => {
      map.set(branch.id, `${branch.name}: ${branch.address}`);
    });
    return map;
  }, []);

  const pickupSlotLabels = useMemo(() => {
    const map = new Map();
    pickupTimeSlots.forEach((slot) => {
      map.set(slot.id, slot.label);
    });
    return map;
  }, []);

  const paymentLabels = useMemo(() => {
    const map = new Map();
    paymentMethods.forEach((method) => {
      map.set(method.id, method.label);
    });
    return map;
  }, []);

  const pricing = useMemo(
    () => computeDiscounts({ subtotal: total, couponCode: appliedCoupon, birthDate }),
    [total, appliedCoupon, birthDate],
  );

  const handlePricingChange = useCallback(({ birthDate: nextBirthDate } = {}) => {
    setBirthDate(nextBirthDate ?? '');
  }, []);

  const handleCouponInputChange = useCallback(
    (value = '') => {
      const upperValue = value.toUpperCase();
      setCouponInput(upperValue);

      if (!upperValue) {
        if (!appliedCoupon) {
          setCouponStatus({ message: DEFAULT_COUPON_MESSAGE, variant: 'hint' });
        }
        return;
      }

      if (appliedCoupon) {
        if (upperValue === appliedCoupon) {
          setCouponStatus({ message: COUPON_ALREADY_APPLIED_MESSAGE, variant: 'success' });
        } else {
          setCouponStatus({ message: EXISTING_COUPON_WARNING, variant: 'warning' });
        }
        return;
      }

      setCouponStatus({ message: APPLY_PROMPT_MESSAGE, variant: 'hint' });
    },
    [appliedCoupon],
  );

  const handleCouponApply = useCallback(() => {
    const normalized = normalizeCouponCode(couponInput);

    if (!normalized) {
      setCouponStatus({ message: EMPTY_COUPON_ERROR, variant: 'error' });
      return;
    }

    if (appliedCoupon && normalized !== appliedCoupon) {
      setCouponStatus({ message: EXISTING_COUPON_WARNING, variant: 'warning' });
      return;
    }

    if (appliedCoupon && normalized === appliedCoupon) {
      setCouponStatus({ message: COUPON_ALREADY_APPLIED_MESSAGE, variant: 'success' });
      return;
    }

    if (!isValidCouponCode(normalized)) {
      setCouponStatus({ message: INVALID_COUPON_ERROR, variant: 'error' });
      return;
    }

    const prospectivePricing = computeDiscounts({ subtotal: total, couponCode: normalized, birthDate });

    setAppliedCoupon(normalized);
    setCouponInput(normalized);
    setCouponStatus({
      message:
        prospectivePricing.seniorDiscount > 0
          ? 'Cupón aplicado. Considera que el descuento adulto mayor se ajustó al nuevo valor.'
          : 'Cupón aplicado correctamente.',
      variant: prospectivePricing.seniorDiscount > 0 ? 'warning' : 'success',
    });
  }, [appliedCoupon, birthDate, couponInput, total]);

  const handleCouponReset = useCallback(() => {
    setAppliedCoupon('');
    setCouponInput('');
    setCouponStatus({ message: DEFAULT_COUPON_MESSAGE, variant: 'hint' });
  }, []);

  const handleCheckoutSubmit = (payload) => {
    if (items.length === 0) {
      setOrder(null);
      return;
    }

    const code = `MS-${Date.now().toString().slice(-6)}`;
    const createdAt = new Intl.DateTimeFormat('es-CL', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date());

    const hasDiscountValue = pricing.couponDiscount > 0 || pricing.seniorDiscount > 0;
    const discounts = hasDiscountValue
      ? {
          couponCode: payload.couponCode,
          couponValid: pricing.couponValid,
          couponDiscount: pricing.couponDiscount,
          seniorEligible: pricing.seniorEligible,
          seniorDiscount: pricing.seniorDiscount,
          totalSavings: pricing.couponDiscount + pricing.seniorDiscount,
          age: pricing.age,
        }
      : null;

    const orderData = {
      code,
      createdAt,
      items,
      subtotal: pricing.subtotal,
      total: pricing.total,
      deliveryOption: payload.deliveryOption,
      address: payload.address,
      branch: payload.branch,
  pickupDate: payload.pickupDate,
  pickupTimeSlot: payload.pickupTimeSlot,
  pickupTimeSlotLabel: payload.pickupTimeSlot ? pickupSlotLabels.get(payload.pickupTimeSlot) : null,
      branchLabel: payload.branch ? branchLabels.get(payload.branch) : null,
      paymentMethod: payload.paymentMethod,
      paymentMethodLabel: paymentLabels.get(payload.paymentMethod),
      notes: payload.notes,
      contactName: `${payload.firstName} ${payload.lastName}`,
      contactEmail: payload.email,
      contactPhone: payload.phone,
      contactBirthDate: payload.birthDate,
      deliveryAddressParts: {
        street: payload.street,
        comuna: payload.comuna,
        region: payload.region,
      },
      discounts,
    };

    setOrder(orderData);
    setIsConfirmationOpen(true);
    clearCart();
    handleCouponReset();
    setBirthDate('');
  };

  return (
    <div className="pago-page">
      <PageHeader
        eyebrow="Paso final"
        title="Finaliza tu compra"
        description="Confirma tu pedido, elige cómo recibirlo y define el medio de pago que más te acomode. Estamos contigo en cada etapa para que tu celebración sea perfecta."
        backgroundVariant="pastel"
        align="left"
      />

      <div className="pago-page__layout">
        <CheckoutSummary
          pricing={pricing}
          couponInput={couponInput}
          couponStatus={couponStatus}
          onCouponInputChange={handleCouponInputChange}
          onCouponApply={handleCouponApply}
          onCouponReset={handleCouponReset}
        />
        <CheckoutForm
          onRequestAuth={() => setIsAuthOpen(true)}
          onSubmitSuccess={handleCheckoutSubmit}
          isSubmitDisabled={!hasItems}
          onPricingChange={handlePricingChange}
          couponCode={appliedCoupon}
        />
      </div>

      <section className="pago-page__info" aria-label="Información importante del proceso de compra">
        <div className="pago-page__column">
          <SectionTitle as="h2" align="left">
            Antes de pagar
          </SectionTitle>
          <ul className="pago-page__tips">
            {safetyTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
        <div className="pago-page__column">
          <SectionTitle as="h2" align="left">
            ¿Qué ocurre después?
          </SectionTitle>
          <ol className="pago-page__timeline">
            {timelineItems.map((item) => (
              <li key={item.id}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <AuthDialog isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <OrderConfirmation
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        order={order}
      />
    </div>
  );
};

export default PagoPage;
