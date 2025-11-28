import React from 'react';
import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ImageSlider from '../../../src/components/organisms/ImageSlider.jsx';

describe('ImageSlider component', () => {
  afterEach(() => {
    cleanup();
  });

  it('permite navegar manualmente entre diapositivas', async () => {
    const user = userEvent.setup();
    const { container } = render(<ImageSlider />);

    const wrapper = container.querySelector('.slider-wrapper');
    expect(wrapper).toBeTruthy();
  expect(wrapper.style.transform).toBe('translateX(0%)');

    const nextButton = screen.getByRole('button', { name: '>' });
    await user.click(nextButton);
    expect(wrapper.style.transform).toBe('translateX(-100%)');

    const prevButton = screen.getByRole('button', { name: '<' });
    await user.click(prevButton);
  expect(wrapper.style.transform).toBe('translateX(0%)');
  });

  it('avanza automáticamente cada 5 segundos', () => {
    jasmine.clock().install();
    try {
      const { container } = render(<ImageSlider />);

      const wrapper = container.querySelector('.slider-wrapper');
  expect(wrapper.style.transform).toBe('translateX(0%)');

      act(() => {
        jasmine.clock().tick(5000);
      });

      expect(wrapper.style.transform).toBe('translateX(-100%)');
    } finally {
      jasmine.clock().uninstall();
    }
  });
});
