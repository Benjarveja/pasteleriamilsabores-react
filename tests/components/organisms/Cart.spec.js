import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cart from '../../../src/components/organisms/Cart.jsx';

describe('Cart component', () => {
  let navigateSpy;

  beforeEach(() => {
    navigateSpy = jasmine.createSpy('navigate');
  });

  afterEach(() => {
    cleanup();
  });

  const createCartMock = (overrides = {}) => ({
    items: [],
    total: 0,
    totalItems: 0,
    isOpen: true,
    toggleCart: jasmine.createSpy('toggleCart'),
    closeCart: jasmine.createSpy('closeCart'),
    updateQuantity: jasmine.createSpy('updateQuantity'),
    removeItem: jasmine.createSpy('removeItem'),
    notification: null,
    dismissNotification: jasmine.createSpy('dismissNotification'),
    ...overrides,
  });

  it('muestra estado vacío y deshabilita la compra cuando no hay productos', () => {
  const cartMock = createCartMock();

  render(<Cart cartApi={cartMock} navigateFn={navigateSpy} />);

    expect(screen.getByLabelText('Abrir carrito')).toBeTruthy();
  expect(screen.getByText('Tu carrito está vacío.')).toBeTruthy();
  const checkoutButton = screen.getByRole('button', { name: 'Finalizar compra' });
  expect(checkoutButton.disabled).toBeTrue();
  const status = screen.getByRole('status', { hidden: true });
  expect(status.className).not.toContain('cart-notification--visible');
  });

  it('permite actualizar cantidades, remover productos y avanzar al pago', async () => {
    const user = userEvent.setup();
    const updateQuantity = jasmine.createSpy('updateQuantity');
    const removeItem = jasmine.createSpy('removeItem');
    const closeCart = jasmine.createSpy('closeCart');

    const cartMock = createCartMock({
      items: [
        {
          codigo: 'P-100',
          nombre: 'Tarta de berries',
          categoria: 'Tartas',
          precio: 15990,
          cantidad: 2,
          imagen: '/img/p-100.jpg',
        },
      ],
      total: 31980,
      totalItems: 2,
      updateQuantity,
      removeItem,
      closeCart,
      notification: 'Producto añadido al carrito!',
    });

  render(<Cart cartApi={cartMock} navigateFn={navigateSpy} />);

    expect(screen.getByText('Tarta de berries')).toBeTruthy();
    expect(screen.getByText('$15.990')).toBeTruthy();
    expect(screen.getByText('Mi Carrito')).toBeTruthy();
    expect(screen.getByText('2 productos')).toBeTruthy();
  expect(screen.getByText('Producto añadido al carrito!')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'Sumar Tarta de berries' }));
    expect(updateQuantity).toHaveBeenCalledWith('P-100', 1);

    await user.click(screen.getByRole('button', { name: 'Restar Tarta de berries' }));
    expect(updateQuantity).toHaveBeenCalledWith('P-100', -1);

    await user.click(screen.getByRole('button', { name: 'Eliminar Tarta de berries' }));
    expect(removeItem).toHaveBeenCalledWith('P-100');

    await user.click(screen.getByRole('button', { name: 'Finalizar compra' }));
    expect(closeCart).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith('/pago');
  });
});
