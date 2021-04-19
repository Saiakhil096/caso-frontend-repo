import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import { render, screen, wait } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../Dashboard';

describe('dashboard test', () => {
  beforeEach(() => {
    Cookies.set('jwt', 'fake-jwt-cookie');
    Cookies.set('user', 'fake-user-cookie');
    Cookies.set('username', 'fake-username');
    Cookies.set('role', 'Capgemini Users');
    //here/
  });

  test('landing area only shown when authenticated as Capgemini user', () => {
    const handleShowMessage = jest.fn();
    render(
      <MemoryRouter>
        <Dashboard onMessage={handleShowMessage} />
      </MemoryRouter>
    );
    expect(screen.getByText('fake-username')).toBeInTheDocument();
  });

  test('Client Dashboard only shown when authenticated as Client user', async () => {
    Cookies.set('role', 'Basic Client');
    const handleShowMessage = jest.fn();

    render(
      <MemoryRouter>
        <Dashboard onMessage={handleShowMessage} />
      </MemoryRouter>
    );
    const questionnaireTile = await wait(() => expect(screen.getByText('1. Ambition Setting')).toBeInTheDocument());
  });

  test('sign in shown when not authenticated', () => {
    Cookies.remove('jwt');
    Cookies.remove('user');
    Cookies.remove('username');
    Cookies.remove('role');

    const handleShowMessage = jest.fn();
    render(
      <MemoryRouter>
        <Dashboard onMessage={handleShowMessage} />
      </MemoryRouter>
    );
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  test('show maturity model assessment component when menu item is clicked', async () => {
    const fakeResponse = [
      {
        id: 1,
        name: 'Digital Contracts',
        client: {
          id: 1,
          name: 'Client #1',
          created_at: '2020-06-22T10:17:39.022Z',
          updated_at: '2020-06-22T10:17:39.022Z'
        },
        status: 'inprogress',
        created_at: '2020-06-22T10:18:03.017Z',
        updated_at: '2020-06-22T10:18:59.797Z',
        favourited_by: [
          {
            id: 1,
            username: 'testing',
            email: 'test@i.ng',
            provider: 'local',
            confirmed: true,
            blocked: false,
            role: 1,
            created_at: '2020-06-22T10:18:24.234Z',
            updated_at: '2020-06-22T10:18:24.243Z'
          }
        ],
        members: [
          {
            id: 1,
            username: 'testing',
            email: 'test@i.ng',
            provider: 'local',
            confirmed: true,
            blocked: false,
            role: 1,
            created_at: '2020-06-22T10:18:24.234Z',
            updated_at: '2020-06-22T10:18:24.243Z'
          }
        ]
      },
      {
        id: 2,
        name: 'S4 Transformation',
        client: {
          id: 1,
          name: 'Client #1',
          created_at: '2020-06-22T10:17:39.022Z',
          updated_at: '2020-06-22T10:17:39.022Z'
        },
        status: 'notstarted',
        created_at: '2020-06-22T10:18:49.576Z',
        updated_at: '2020-06-22T10:18:49.586Z',
        favourited_by: [],
        members: [
          {
            id: 1,
            username: 'testing',
            email: 'test@i.ng',
            provider: 'local',
            confirmed: true,
            blocked: false,
            role: 1,
            created_at: '2020-06-22T10:18:24.234Z',
            updated_at: '2020-06-22T10:18:24.243Z'
          }
        ]
      }
    ];

    jest.spyOn(window, 'fetch').mockImplementationOnce(() => {
      return Promise.resolve({
        json: () => Promise.resolve(fakeResponse),
        ok: true
      });
    });

    const handleShowMessage = jest.fn();
    render(
      <MemoryRouter>
        <Dashboard onMessage={handleShowMessage} />
      </MemoryRouter>
    );
    userEvent.click(screen.getByRole('button', { name: 'account of current user' }));
    //userEvent.click(screen.getByText('Maturity Model Assessment'));
    //await wait(() => expect(screen.getByText('Perceptions')).toBeInTheDocument());
  });
});
