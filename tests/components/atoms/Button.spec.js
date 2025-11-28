import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../../../src/components/atoms/Button.jsx';

describe('Button component', () => {
  afterEach(() => {
    cleanup();
  });

  it('aplica variantes, tamaños y ancho completo en la clase', () => {
    render(
      <Button variant="secondary" size="lg" fullWidth>
        Comprar
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Comprar' });
    expect(button.className).toContain('ms-button');
    expect(button.className).toContain('ms-button--secondary');
    expect(button.className).toContain('ms-button--lg');
    expect(button.className).toContain('ms-button--full');
  });

  it('admite renderizar otro elemento con la prop "as" preservando props adicionales', () => {
    render(
      <Button as="a" href="#contacto" className="extra-clase">
        Escríbenos
      </Button>,
    );

    const link = screen.getByRole('link', { name: 'Escríbenos' });
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('#contacto');
    expect(link.className).toContain('extra-clase');
  });

  it('propaga eventos al componente renderizado', async () => {
    const onClick = jasmine.createSpy('onClick');
    const user = userEvent.setup();

    render(<Button onClick={onClick}>Añadir</Button>);

    await user.click(screen.getByRole('button', { name: 'Añadir' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
