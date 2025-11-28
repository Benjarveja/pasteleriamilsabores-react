import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '../../../src/components/atoms/Modal.jsx';

describe('Modal component', () => {
  afterEach(() => {
    cleanup();
  });

  it('no renderiza nada cuando está cerrado', () => {
    const { container } = render(
      <Modal isOpen={false} title="Modal cerrado">
        Contenido
      </Modal>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('muestra contenido, título y dispara onClose con interacciones', async () => {
    const onClose = jasmine.createSpy('onClose');
    const user = userEvent.setup();

    render(
      <Modal isOpen title="Modal abierto" onClose={onClose}>
        <p>Contenido dinámico</p>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Modal abierto' });
    expect(dialog).toBeTruthy();
    expect(dialog.textContent).toContain('Contenido dinámico');

    await user.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(onClose).toHaveBeenCalledTimes(1);

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(2);

    const backdrop = dialog.querySelector('.ms-modal__backdrop');
    expect(backdrop).toBeTruthy();
    await user.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(3);
  });
});
