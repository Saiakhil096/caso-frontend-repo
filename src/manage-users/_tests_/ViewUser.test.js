import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, wait } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cookies from 'js-cookie';
import ViewUser from '../ViewUser';

describe('view user tests', () => {
  beforeEach(() => {
    Cookies.set('jwt', 'fake-jwt-cookie');
    Cookies.set('id', 'fake-user-cookie');
    Cookies.set('username', 'fake-username');
    Cookies.set('email', 'fake-email');
    Cookies.set('client', 'fake-client');

    const fakedata = [
      {
        id: 3,
        username: 'saigangi',
        email: 'saiakhilgangishetty21@gamil.com',
        provider: 'local',
        confirmed: true,
        blocked: false,
        role: {
          id: 4,
          name: 'Client ',
          description: 'A bug standard client user',
          type: 'client'
        },
        created_at: '2020-07-03T15:08:11.348Z',
        updated_at: '2020-07-27T17:56:26.182Z',
        favourite_projects: [],
        favourite_clients: [],
        favourite_user_profiles: [],
        projects: [
          {
            id: 1,
            name: 'Campari',
            status: 'inprogress',
            client: 4
          },
          {
            id: 2,
            name: 'Burberry',
            status: 'completed',
            client: 1
          }
        ]
      }
    ];

    jest.spyOn(window, 'fetch').mockImplementationOnce(() => {
      console.log('fetch called ');
      return Promise.resolve({
        json: () => Promise.resolve(fakedata),
        ok: true
      });
    });
  });

  afterAll(() => {
    Cookies.remove('jwt', 'fake-jwt-cookie');
    Cookies.remove('id', 'fake-user-cookie');
    Cookies.remove('username', 'fake-username');
    Cookies.remove('email', 'fake-email');
    Cookies.remove('client', 'fake-client');
  });

  test('view user correctly renders', async () => {
    const handleShowMessage = jest.fn();
    render(
      <MemoryRouter>
        <ViewUser onMessage={handleShowMessage} />
      </MemoryRouter>
    );
    await wait(() => expect(screen.getByText('saigangi')).toBeInTheDocument());
  });

  test('Search for a user that exists', async () => {
    const handleShowMessage = jest.fn();
    render(
      <MemoryRouter>
        <ViewUser onMessage={handleShowMessage} />
      </MemoryRouter>
    );
    userEvent.type(screen.getByPlaceholderText(/Search/i), 'saigangi');
    await wait(() => expect(screen.getByText('saigangi')).toBeInTheDocument());
  });

  test("Search for a user that doesn't exist", async () => {
    const handleShowMessage = jest.fn();
    render(
      <MemoryRouter>
        <ViewUser onMessage={handleShowMessage} />
      </MemoryRouter>
    );
    userEvent.type(screen.getByPlaceholderText(/Search/i), 'qqq');
    await wait(() => expect(screen.getByText('No result found')).toBeInTheDocument());
  });

  // test('when add new user button click', async () => {
  //   const handleShowMessage = jest.fn();
  //   render(
  //     <MemoryRouter>
  //       <ViewUser onMessage={handleShowMessage} />
  //     </MemoryRouter>
  //   );
  //   const add = screen.getByText(/Add New User/);
  //   userEvent.click(add);
  //   await expect(screen.getByText(/Create New Users/)).toBeInTheDocument();
  //await wait(() => expect(screen.getByText('fake-client').toBeInTheDocument()));
  // });
});
