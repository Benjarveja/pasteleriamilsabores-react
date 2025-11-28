import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CheckoutForm from '../../../src/components/organisms/CheckoutForm.jsx';

describe('CheckoutForm component', () => {

  afterEach(() => {
    cleanup();
  });

  it('muestra invitación a iniciar sesión cuando no hay usuario', async () => {
    const user = userEvent.setup();
    const onRequestAuth = jasmine.createSpy('onRequestAuth');

  render(<CheckoutForm onRequestAuth={onRequestAuth} authContext={{ user: null }} />);

  expect(screen.getByText(/Tienes cuenta/)).toBeTruthy();

    const authButton = screen.getByRole('button', { name: 'Iniciar sesión o registrarme' });
    await user.click(authButton);

    expect(onRequestAuth).toHaveBeenCalled();
  });

  it('envía los datos de entrega válidos y notifica el cambio de precio', async () => {
    const user = userEvent.setup();
    const onSubmitSuccess = jasmine.createSpy('onSubmitSuccess');
    const onPricingChange = jasmine.createSpy('onPricingChange');

    render(
      <CheckoutForm
        onSubmitSuccess={onSubmitSuccess}
        onPricingChange={onPricingChange}
        couponCode="50MILSABORES"
        authContext={{ user: null }}
      />,
    );

    await waitFor(() => {
      expect(onPricingChange).toHaveBeenCalledWith({ birthDate: '' });
    });

    await user.type(screen.getByLabelText('RUN'), '12.345.678-5');
    await user.type(screen.getByLabelText('Nombre'), 'Fernanda');
    await user.type(screen.getByLabelText('Apellidos'), 'Donoso');
    await user.type(screen.getByLabelText('Email'), 'fernanda@mail.cl');
    await user.type(screen.getByLabelText('Celular'), '912345678');
  await user.type(screen.getByLabelText(/Fecha de nacimiento/), '1990-01-01');
    await user.type(screen.getByLabelText('Calle y número'), 'Calle Falsa 123');

    await user.selectOptions(screen.getByLabelText('Región'), 'Región de Arica y Parinacota');
    await user.selectOptions(screen.getByLabelText('Comuna'), 'Arica');

    await waitFor(() => {
      expect(onPricingChange).toHaveBeenCalledWith({ birthDate: '1990-01-01' });
    });

    await user.click(screen.getByRole('button', { name: 'Confirmar y avanzar al pago' }));

    await waitFor(() => {
      expect(onSubmitSuccess).toHaveBeenCalled();
    });

    const payload = onSubmitSuccess.calls.mostRecent().args[0];

    expect(payload).toEqual(
      jasmine.objectContaining({
        run: '12.345.678-5',
        phone: '912345678',
        deliveryOption: 'delivery',
        street: 'Calle Falsa 123',
        region: 'Región de Arica y Parinacota',
        comuna: 'Arica',
        address: 'Calle Falsa 123, Arica, Región de Arica y Parinacota',
        paymentMethod: 'card',
        couponCode: '50MILSABORES',
      }),
    );
    expect(payload.notes).toBe('');
    expect(payload.branch).toBe('');

    expect(await screen.findByText(/¡Gracias!/)).toBeTruthy();
  });
});
