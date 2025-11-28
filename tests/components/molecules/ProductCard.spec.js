import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from '../../../src/components/molecules/ProductCard.jsx';

describe('ProductCard component', () => {
  afterEach(() => {
    cleanup();
  });

  const producto = {
    codigo: 'P-01',
    nombre: 'Cheesecake Frutos Rojos',
    categoria: 'Tortas',
    precio: 12990,
    imagen: '/fake-path.jpg',
  };

  it('muestra la información principal del producto', () => {
    render(<ProductCard producto={producto} />);

    expect(screen.getByRole('heading', { name: producto.nombre })).toBeTruthy();
    expect(screen.getByText('Tortas')).toBeTruthy();
    expect(screen.getByText('$12.990 CLP')).toBeTruthy();
  });

  it('propaga eventos de ver detalles y agregar al carrito', async () => {
    const onViewDetails = jasmine.createSpy('onViewDetails');
    const onAddToCart = jasmine.createSpy('onAddToCart');
    const user = userEvent.setup();

    const { container } = render(
      <ProductCard producto={producto} onViewDetails={onViewDetails} onAddToCart={onAddToCart} />,
    );

    const card = container.querySelector('article');
    expect(card).toBeTruthy();

    await user.click(card);
    expect(onViewDetails).toHaveBeenCalledTimes(1);
    expect(onViewDetails).toHaveBeenCalledWith(producto);

    await user.click(screen.getByRole('button', { name: /agregar al carrito/i }));
    expect(onAddToCart).toHaveBeenCalledTimes(1);
    expect(onAddToCart).toHaveBeenCalledWith(producto);
    expect(onViewDetails).toHaveBeenCalledTimes(1);
  });
});
