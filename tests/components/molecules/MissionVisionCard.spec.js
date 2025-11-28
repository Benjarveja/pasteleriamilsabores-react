import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';

import MissionVisionCard from '../../../src/components/molecules/MissionVisionCard.jsx';

describe('MissionVisionCard component', () => {
  afterEach(() => {
    cleanup();
  });

  it('muestra el título y la descripción proporcionados', () => {
    render(<MissionVisionCard title="Our mission" description="Make every moment sweeter" />);

    expect(screen.getByRole('heading', { level: 3, name: 'Our mission' })).toBeTruthy();
    expect(screen.getByText('Make every moment sweeter')).toBeTruthy();
  });
});
