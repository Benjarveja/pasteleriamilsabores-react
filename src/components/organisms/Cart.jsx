import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../atoms/Button';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import './Cart.css';

const Cart = () => {
  const {
    items,
    total,
    totalItems,
    isOpen,
    toggleCart,
    closeCart,
    updateQuantity,
    removeItem,
    notification,
    dismissNotification,
  } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (items.length === 0) {
      return;
    }

    closeCart();
    navigate('/pago');
  };

  return (
    <>
      <button className="cart-fab" type="button" onClick={toggleCart} aria-label="Abrir carrito">
        <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.16 14.26 7.1 14l-.03-.12L5.29 6H3V4h3c.47 0 .87.32.97.76L7.1 6h12.4c.41 0 .77.26.92.64l2.28 6.04c.21.55-.19 1.14-.78 1.14H8.53l-.3 1.08c-.12.45-.52.74-.97.74H5v-2h1.4l.76-2.24Z" />
        </svg>
        {totalItems > 0 && <span className="cart-fab__badge">{totalItems}</span>}
      </button>

      <div className={`cart-drawer ${isOpen ? 'cart-drawer--open' : ''}`}>
        <header className="cart-drawer__header">
          <div>
            <h3>Mi Carrito</h3>
            <p>{totalItems === 1 ? '1 producto' : `${totalItems} productos`}</p>
          </div>
          <button type="button" className="cart-drawer__close" onClick={closeCart} aria-label="Cerrar carrito">
            &times;
          </button>
        </header>

        <div className="cart-drawer__content">
          {items.length === 0 ? (
            <p className="cart-drawer__empty">Tu carrito está vacío.</p>
          ) : (
            <ul className="cart-list">
              {items.map((item) => (
                <li key={item.codigo} className="cart-list__item">
                  <img src={item.imagen} alt={item.nombre} />
                  <div className="cart-list__details">
                    <h4>{item.nombre}</h4>
                    <span>{formatCurrency(item.precio)}</span>
                    <div className="cart-list__controls">
                      <button type="button" onClick={() => updateQuantity(item.codigo, -1)} aria-label={`Restar ${item.nombre}`}>
                        −
                      </button>
                      <span>{item.cantidad}</span>
                      <button type="button" onClick={() => updateQuantity(item.codigo, 1)} aria-label={`Sumar ${item.nombre}`}>
                        +
                      </button>
                    </div>
                  </div>
                  <button type="button" className="cart-list__remove" onClick={() => removeItem(item.codigo)} aria-label={`Eliminar ${item.nombre}`}>
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="cart-drawer__footer">
          <div className="cart-drawer__total">
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
          <Button onClick={handleCheckout} fullWidth disabled={items.length === 0}>
            Finalizar compra
          </Button>
        </footer>
      </div>

      {isOpen && <div className="cart-backdrop" onClick={closeCart} aria-hidden="true" />}

      <div
        className={`cart-notification ${notification ? 'cart-notification--visible' : ''}`}
        role="status"
        aria-live="polite"
        aria-hidden={notification ? 'false' : 'true'}
      >
        <span>{notification}</span>
        <button type="button" className="cart-notification__close" onClick={dismissNotification} aria-label="Cerrar aviso">
          ×
        </button>
      </div>
    </>
  );
};

export default Cart;
