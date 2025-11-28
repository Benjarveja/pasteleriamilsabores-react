import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '../../../src/components/organisms/ContactForm.jsx';

describe('ContactForm component', () => {
  afterEach(() => {
    cleanup();
  });

  it('valida campos obligatorios y muestra mensajes de error', async () => {
    const user = userEvent.setup();

    render(<ContactForm />);

    const submitButton = screen.getByRole('button', { name: /enviar mensaje/i });
    await user.click(submitButton);

    expect(screen.getByText('Ingresa tu nombre completo.')).toBeTruthy();
    expect(screen.getByText('Utiliza un correo con formato nombre@dominio.cl.')).toBeTruthy();
    expect(screen.getByText('El mensaje debe tener al menos 20 caracteres.')).toBeTruthy();

    const nameInput = screen.getByLabelText('Nombre');
    const emailInput = screen.getByLabelText('Correo electrónico');
    const messageInput = screen.getByLabelText('Mensaje');

    await user.type(nameInput, 'Benjamin Castillo');
    await user.type(emailInput, 'benjamin@mail.cl');
    await user.type(messageInput, 'Mensaje con suficiente detalle para validar.');

    await user.click(submitButton);

    expect(screen.queryByText('Ingresa tu nombre completo.')).toBeNull();
    expect(screen.queryByText('Utiliza un correo con formato nombre@dominio.cl.')).toBeNull();
    expect(screen.queryByText('El mensaje debe tener al menos 20 caracteres.')).toBeNull();
    expect(screen.getByText('¡Gracias! Te contactaremos muy pronto.')).toBeTruthy();
  });
});
