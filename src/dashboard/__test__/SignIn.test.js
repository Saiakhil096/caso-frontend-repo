import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, wait } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignIn from '../SignIn';

describe('signing in', () => {
  test('sign in with incorrect details', async () => {
    jest.spyOn(window, 'fetch').mockImplementationOnce(() => {
      return Promise.resolve({
        ok: false,
        status: 400
      });
    });

    const handleShowMessage = jest.fn();

    render(
      <MemoryRouter>
        <SignIn onMessage={handleShowMessage} />
      </MemoryRouter>
    );

    userEvent.type(screen.getByLabelText(/username/i), 'wrong-username');
    userEvent.type(screen.getByLabelText(/password/i), 'password');

    userEvent.click(screen.getByText('Sign In'));

    await wait(() => expect(handleShowMessage).toHaveBeenCalledWith('Incorrect username or password', 'error'));
  });

  test('sign in with correct details', async () => {
    const fakeResponse = {
      jwt: 'fake jwt',
      user: {
        id: 1
      }
    };

    jest.spyOn(window, 'fetch').mockImplementationOnce(() => {
      return Promise.resolve({
        json: () => Promise.resolve(fakeResponse),
        ok: true
      });
    });

    const handleShowMessage = jest.fn();

    render(
      <MemoryRouter>
        <SignIn onMessage={handleShowMessage} />
      </MemoryRouter>
    );

    userEvent.type(screen.getByLabelText(/username/i), 'username');
    userEvent.type(screen.getByLabelText(/password/i), 'password');

    userEvent.click(screen.getByText('Sign In'));

    await wait(() => expect(handleShowMessage).toHaveBeenCalledWith('You have been logged in', 'success'));
  });

  test('Navigate to Forgotten Password', async () => {
    const handleShowMessage = jest.fn();
    render(
      <MemoryRouter>
        <SignIn onMessage={handleShowMessage} />
      </MemoryRouter>
    );
    userEvent.click(screen.getByText('Forgot password?'));
    const passwordResetHeading = await screen.findByText('Reset your password');
    expect(passwordResetHeading).toBeInTheDocument();
  });
});
