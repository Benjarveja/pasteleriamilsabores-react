import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AccordionItem from '../../../src/components/molecules/AccordionItem.jsx';

describe('AccordionItem component', () => {
  afterEach(() => {
    cleanup();
  });

  const baseProps = {
    id: 'faq-1',
    title: 'How does it work?',
    children: <p>Opening the accordion reveals this answer.</p>,
  };

  it('refleja el estado abierto/cerrado en atributos ARIA y estilos', () => {
    const onToggle = jasmine.createSpy('onToggle');
    const { rerender } = render(<AccordionItem {...baseProps} isOpen={false} onToggle={onToggle} />);

  const trigger = screen.getByRole('button', { name: /how does it work/i });
  const region = screen.getByRole('region', { hidden: true });

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(region.getAttribute('aria-hidden')).toBe('true');
    expect(region.style.height).toBe('0px');

  rerender(<AccordionItem {...baseProps} isOpen onToggle={onToggle} />);

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  expect(region.getAttribute('aria-hidden')).toBe('false');
  expect(region.style.height === '0px').toBeFalse();
  });

  it('dispara onToggle cuando se hace clic en el encabezado', async () => {
    const onToggle = jasmine.createSpy('onToggle');
    const user = userEvent.setup();

    render(<AccordionItem {...baseProps} isOpen={false} onToggle={onToggle} />);

  const trigger = screen.getByRole('button', { name: /how does it work/i });
    await user.click(trigger);

    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
