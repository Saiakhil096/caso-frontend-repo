import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, wait } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ForgotPassword from '../ForgotPassword';

describe('Forgotten Password tests', () => {
  test('Initial Render', () => {
    const handleShowMessage = jest.fn();

    render(
      <MemoryRouter>
        <ForgotPassword onMessage={handleShowMessage} />
      </MemoryRouter>
    );

    expect(screen.getByText('Reset your password')).toBeInTheDocument();
  });

  test('Reset password without email', async () => {
    const handleShowMessage = jest.fn();

    render(
      <MemoryRouter>
        <ForgotPassword onMessage={handleShowMessage} />
      </MemoryRouter>
    );

    userEvent.click(screen.getByText('Reset Password'));
    await wait(() => expect(handleShowMessage).toHaveBeenCalledWith('You must enter an email', 'error'));
  });

  test('Reset password with wrong email', async () => {
    const EMAIL = 'testing@test';

    jest.spyOn(window, 'fetch').mockImplementationOnce(() => {
      return Promise.resolve({
        ok: false,
        status: 400,
        message: 'Bad Request'
      });
    });

    const handleShowMessage = jest.fn();

    render(
      <MemoryRouter>
        <ForgotPassword onMessage={handleShowMessage} />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    userEvent.type(emailInput, EMAIL);

    userEvent.click(screen.getByText('Reset Password'));

    await wait(() => expect(handleShowMessage).toHaveBeenCalledWith('Email not registered', 'error'));
  });

  test('Reset password', async () => {
    const EMAIL = 'test@test.test';

    jest.spyOn(window, 'fetch').mockImplementationOnce(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ok: true })
      });
    });

    const handleShowMessage = jest.fn();

    render(
      <MemoryRouter>
        <ForgotPassword onMessage={handleShowMessage} />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    userEvent.type(emailInput, EMAIL);

    userEvent.click(screen.getByText('Reset Password'));

    await wait(() => expect(handleShowMessage).toHaveBeenCalledWith(`Password reset for ${EMAIL}`, 'success'));
  });
});
