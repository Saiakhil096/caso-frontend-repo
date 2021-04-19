import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, within, wait } from '@testing-library/react';
import Cookies from 'js-cookie';
import Dashboard from './Dashboard';
import userEvent from '@testing-library/user-event';

describe('dashboard test', () => {
  beforeEach(() => {
    Cookies.set('jwt', 'fake-jwt-cookie');
    Cookies.set('user', 'fake-user-cookie');
    Cookies.set('username', 'fake-username');
    Cookies.set('role', 'Client');
  });

  test('Client Dashboard only shown when authenticated as Client user', async () => {
    const handleShowMessage = jest.fn();

    render(
      <MemoryRouter>
        <Dashboard onMessage={handleShowMessage} />
      </MemoryRouter>
    );

    // card 0: questionnaire, card 1: maturity model, card 2: design thinking
    const maturityModelTile = screen.getByTestId('card-1');
    expect(maturityModelTile).toBeInTheDocument();

    const maturitymodelbutton = within(maturityModelTile).getByRole('button');
    userEvent.click(maturitymodelbutton);

    //const stepperText = await wait(() => expect(screen.getByText('Perceptions')).toBeInTheDocument());
  });
});
