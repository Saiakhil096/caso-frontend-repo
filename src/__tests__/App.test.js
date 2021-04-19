import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('basic smoke test', () => {
  test('renders without crashing  ', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
  });

  test('sign in page shown', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    const signInElement = screen.getAllByText(/Sign in/i);
    expect(signInElement).toHaveLength(2);
  });
});
