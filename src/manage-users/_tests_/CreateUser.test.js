import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, wait, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cookies from 'js-cookie';
import ViewUser from '../ViewUser';
import CreateUser from '../CreateUser';

describe('view user tests', () => {
  beforeEach(() => {
    Cookies.set('jwt', 'fake-jwt-cookie');
    Cookies.set('id', 'fake-user-cookie');
    Cookies.set('username', 'fake-username');
    Cookies.set('email', 'fake-email');
    Cookies.set('client', 'fake-client');
  });

  afterAll(() => {
    Cookies.remove('jwt', 'fake-jwt-cookie');
    Cookies.remove('id', 'fake-user-cookie');
    Cookies.remove('username', 'fake-username');
    Cookies.remove('email', 'fake-email');
    Cookies.remove('client', 'fake-client');
  });

  test('cretae user correctly renders', async () => {
    const handleShowMessage = jest.fn();
    render(
      <MemoryRouter>
        <CreateUser onMessage={handleShowMessage} />
      </MemoryRouter>
    );
    await wait(() => expect(screen.getByText('fake-client')).toBeInTheDocument());
  });

  test('when create button clicked with empty field', async () => {
    const handleShowMessage = jest.fn();
    render(
      <MemoryRouter>
        <CreateUser onMessage={handleShowMessage} />
      </MemoryRouter>
    );
    userEvent.click(screen.getByText('Create'));
    await wait(() => expect(handleShowMessage).toHaveBeenCalledWith(`You should select user type to proceed `, 'warning'));
  });

  // test('when user is successfully created', async () => {
  //   const handleShowMessage = jest.fn();
  //   jest.spyOn(window, 'fetch').mockImplementationOnce(() => {
  //     console.log('first has been called');
  //     return Promise.resolve({
  //       json: () => Promise.resolve(),
  //       ok: true
  //     });
  //   });
  //   render(
  //     <MemoryRouter>
  //       <CreateUser onMessage={handleShowMessage} />
  //     </MemoryRouter>
  //   );
  //   const username = screen.getByTestId('username');
  //   userEvent.type(username, 'fake-user');

  //   const email = screen.getByTestId('email');
  //   userEvent.type(email, 'fake-email');

  //   const password = screen.getByTestId('password');
  //   userEvent.type(password, 'fake-password');

  //   userEvent.click(screen.getByText('Create'));
  //   await wait(() => expect(handleShowMessage).toHaveBeenCalledWith(`User \"fake-user\" has been created successfully`, 'success'));
  // });

  // test('when back button clicked', async () => {
  //   const handleShowMessage = jest.fn();
  //   render(
  //     <MemoryRouter>
  //       <CreateUser onMessage={handleShowMessage} />
  //     </MemoryRouter>
  //   );
  //   userEvent.click(screen.getByText('Back'));
  //   await wait(() => expect(screen.getByPlaceholderText(/Search/i)).toBeInTheDocument());
  // });
});
