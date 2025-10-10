import React from 'react';
import Modal from '../atoms/Modal';
import Button from '../atoms/Button';
import './OrderConfirmation.css';

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(value);

const formatPickupDate = (value) => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat('es-CL', { dateStyle: 'long' }).format(date);
};

const OrderConfirmation = ({ isOpen, onClose, order }) => {
  if (!order) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pedido confirmado" size="lg">
      <div className="order-confirmation">
        <p className="order-confirmation__lead">
          ¡Gracias por confiar en Mil Sabores! Hemos recibido tu solicitud y te enviaremos un correo con los siguientes
          pasos.
        </p>
        <div className="order-confirmation__summary">
          <div>
            <span>Número de pedido</span>
            <strong>{order.code}</strong>
          </div>
          <div>
            <span>Total pagado</span>
            <strong>{formatCurrency(order.total)}</strong>
          </div>
          <div>
            <span>Fecha</span>
            <strong>{order.createdAt}</strong>
          </div>
        </div>

        <section className="order-confirmation__section" aria-label="Productos solicitados">
          <h3>Resumen de productos</h3>
          <ul>
            {order.items.map((item) => (
              <li key={item.codigo}>
                <span>
                  {item.nombre} <small>x{item.cantidad}</small>
                </span>
                <strong>{formatCurrency(item.cantidad * item.precio)}</strong>
              </li>
            ))}
          </ul>
        </section>

        {order.discounts ? (
          <section className="order-confirmation__section" aria-label="Descuentos aplicados">
            <h3>Descuentos aplicados</h3>
            <ul>
              <li>
                <span>Subtotal</span>
                <strong>{formatCurrency(order.subtotal ?? order.total)}</strong>
              </li>
              {order.discounts.couponDiscount > 0 ? (
                <li>
                  <span>Cupón {order.discounts.couponCode || 'especial'}</span>
                  <strong>- {formatCurrency(order.discounts.couponDiscount)}</strong>
                </li>
              ) : null}
              {order.discounts.seniorDiscount > 0 ? (
                <li>
                  <span>Descuento adulto mayor</span>
                  <strong>- {formatCurrency(order.discounts.seniorDiscount)}</strong>
                </li>
              ) : null}
              {order.discounts.totalSavings > 0 ? (
                <li>
                  <span>Ahorro total</span>
                  <strong>- {formatCurrency(order.discounts.totalSavings)}</strong>
                </li>
              ) : null}
              <li>
                <span>Total final</span>
                <strong>{formatCurrency(order.total)}</strong>
              </li>
            </ul>
          </section>
        ) : null}

        <section className="order-confirmation__section" aria-label="Detalles de entrega">
          <h3>Entrega y contacto</h3>
          <ul>
            <li>
              <span>Método de entrega</span>
              <strong>
                {order.deliveryOption === 'delivery' ? 'Envío a domicilio' : 'Retiro en tienda'}
              </strong>
            </li>
            <li>
              <span>{order.deliveryOption === 'delivery' ? 'Dirección' : 'Sucursal'}</span>
              <strong>
                {order.deliveryOption === 'delivery'
                  ? order.address || 'Por coordinar'
                  : order.branchLabel || 'Por coordinar'}
              </strong>
            </li>
            {order.deliveryOption === 'pickup' ? (
              <>
                <li>
                  <span>Fecha estimada</span>
                  <strong>{formatPickupDate(order.pickupDate) || 'Por coordinar'}</strong>
                </li>
                <li>
                  <span>Rango horario</span>
                  <strong>{order.pickupTimeSlotLabel || 'Por coordinar'}</strong>
                </li>
              </>
            ) : null}
            <li>
              <span>Medio de pago</span>
              <strong>{order.paymentMethodLabel || 'Por definir'}</strong>
            </li>
            <li>
              <span>Contacto</span>
              <strong>{order.contactName}</strong>
              <small>{order.contactEmail} · {order.contactPhone}</small>
            </li>
          </ul>
        </section>

        {order.notes ? (
          <section className="order-confirmation__section" aria-label="Notas adicionales">
            <h3>Notas</h3>
            <p>{order.notes}</p>
          </section>
        ) : null}

        <Button variant="primary" onClick={onClose}>
          Cerrar y seguir navegando
        </Button>
      </div>
    </Modal>
  );
};

export default OrderConfirmation;
