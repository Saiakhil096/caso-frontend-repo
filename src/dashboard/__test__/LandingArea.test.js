import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, wait, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cookies from 'js-cookie';
import LandingArea from '../LandingArea';

describe('Landing Area tests', () => {
  beforeEach(() => {
    Cookies.set('jwt', 'fake-jwt-cookie');
    Cookies.set('user', 'fake-user-cookie');
    Cookies.set('username', 'fake-username');

    const fakedata = [
      {
        id: 1,
        name: 'Burberry',
        status: 'notstarted',
        client: {
          id: 1,
          name: 'king'
        },
        members: [
          {
            id: 2,
            username: 'fake-username',
            email: 'xyz@gmail.com',
            provider: 'local'
          }
        ],
        favourited_by: []
      }
    ];
    jest.spyOn(window, 'fetch').mockImplementationOnce(() => {
      return Promise.resolve({
        json: () => Promise.resolve(fakedata),
        ok: true
      });
    });
  });

  afterAll(() => {
    Cookies.remove('jwt', 'fake-jwt-cookie');
    Cookies.remove('user', 'fake-user-cookie');
    Cookies.remove('username', 'fake-username');
  });

  test('LandingArea correctly renders', async () => {
    const handleShowMessage = jest.fn();
    render(
      <MemoryRouter>
        <LandingArea onMessage={handleShowMessage} />
      </MemoryRouter>
    );
    await wait(() => expect(screen.getByText('king')).toBeInTheDocument());
  });

  test('Search for a project that exists', async () => {
    const handleShowMessage = jest.fn();
    render(
      <MemoryRouter>
        <LandingArea onMessage={handleShowMessage} />
      </MemoryRouter>
    );
    userEvent.type(screen.getByPlaceholderText(/Search/i), 'king');
    await wait(() => expect(screen.getByText('king')).toBeInTheDocument());
  });

  test("Search for a project that doesn't exist", async () => {
    const handleShowMessage = jest.fn();
    render(
      <MemoryRouter>
        <LandingArea onMessage={handleShowMessage} />
      </MemoryRouter>
    );
    userEvent.type(screen.getByPlaceholderText(/Search/i), 'qqq');
    await wait(() => expect(screen.getByText('No result found')).toBeInTheDocument());
  });

  test('project link renders a capgemini dashboard', async () => {
    const handleShowMessage = jest.fn();
    render(
      <MemoryRouter>
        <LandingArea onMessage={handleShowMessage} />
      </MemoryRouter>
    );

    await wait(() => userEvent.click(screen.getByText('king')));
    expect(screen.getByText('1. Manage Activities')).toBeInTheDocument();
  });

  test('No projects for your user', async () => {
    const fakedata = [];
    jest.spyOn(window, 'fetch').mockImplementationOnce(() => {
      return Promise.resolve({
        json: () => Promise.resolve(fakedata),
        ok: true
      });
    });

    const handleShowMessage = jest.fn();
    render(
      <MemoryRouter>
        <LandingArea onMessage={handleShowMessage} />
      </MemoryRouter>
    );
    const tbody = screen.getByTestId('tbody-element');
    expect(tbody.childElementCount).toBe(1);
    expect(screen.getByText('No result found')).toBeInTheDocument();
  });
});
