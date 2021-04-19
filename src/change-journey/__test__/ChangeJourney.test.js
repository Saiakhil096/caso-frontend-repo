import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, wait } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cookies from 'js-cookie';
import ChangeJourney from '../ChangeJourney';

describe('Change Journey', () => {
  beforeEach(() => {
    Cookies.set('jwt', 'fake-jwt-cookie');
    Cookies.set('user', 'fake-user-cookie');
    Cookies.set('username', 'fake-username');
  });

  test('Employee Category not Selected ', async () => {
    const handleShowMessage = jest.fn();
    render(
      <MemoryRouter>
        <ChangeJourney onMessage={handleShowMessage} />
      </MemoryRouter>
    );
    const btn = screen.getByTestId('download');
    userEvent.click(btn);
    await wait(() => expect(handleShowMessage).toHaveBeenCalledWith('You must select a Persona Job Role', 'error'));
  });
});
