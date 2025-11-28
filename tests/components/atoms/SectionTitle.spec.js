import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';

import SectionTitle from '../../../src/components/atoms/SectionTitle.jsx';

describe('SectionTitle component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renderiza como h2 centrado por defecto', () => {
    render(<SectionTitle>Destacados</SectionTitle>);

    const heading = screen.getByRole('heading', { level: 2, name: 'Destacados' });
    expect(heading.className).toContain('section-title');
    expect(heading.className).toContain('section-title--center');
  });

  it('permite personalizar el elemento y la alineación', () => {
    render(
      <SectionTitle as="h3" align="left" data-testid="section">
        Novedades
      </SectionTitle>,
    );

    const heading = screen.getByTestId('section');
    expect(heading.tagName).toBe('H3');
    expect(heading.className).toContain('section-title--left');
  });
});
