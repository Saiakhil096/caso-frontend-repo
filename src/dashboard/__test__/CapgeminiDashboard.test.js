import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, within, wait } from '@testing-library/react';
import Cookies from 'js-cookie';
import CapgeminiDashboard from '../CapgeminiDashboard';
import userEvent from '@testing-library/user-event';

describe('Capgemini dashboard test', () => {
  beforeEach(() => {
    Cookies.set('jwt', 'fake-jwt-cookie');
    Cookies.set('user', 'fake-user-cookie');
    Cookies.set('username', 'fake-username');
    Cookies.set('role', 'Capgemini Users');
    //here/
  });

  test('Capgemini Dashboard only shown when authenticated as Capgemini user', async () => {
    const handleShowMessage = jest.fn();

    render(
      <MemoryRouter>
        <CapgeminiDashboard onMessage={handleShowMessage} />
      </MemoryRouter>
    );

    // card 0: Manage Activites, card 1: Manage users, card 2: Exportdata
    const manageusersTile = screen.getByTestId('card-1');
    expect(manageusersTile).toBeInTheDocument();

    const manageusersbutton = within(manageusersTile).getByRole('button');
    userEvent.click(manageusersbutton);

    const stepperText = screen.findByText('User Id');
    wait(() => expect(stepperText).toBeInTheDocument());
  });
});
