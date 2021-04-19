import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, wait, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cookies from 'js-cookie';
import AmbitionSetting from '../AmbitionSetting';

describe('AmbitionSetting tests', () => {
  beforeEach(() => {
    Cookies.set('jwt', 'fake-jwt-cookie');
    Cookies.set('user', 'fake-user-cookie');
    Cookies.set('username', 'fake-username');
    Cookies.set('project', 'fake-project');
  });

  afterEach(() => {
    Cookies.remove('jwt');
    Cookies.remove('user');
    Cookies.remove('username');
    Cookies.remove('project');
    jest.clearAllMocks();
  });

  test('When next button clicked with empty answer ', async () => {
    const handleShowMessage = jest.fn();
    const fakedata = [
      {
        id: 1,
        question_text: 'What is your role?'
      },
      {
        id: 2,
        question_text: 'How long have you been working with the company(years)?'
      }
    ];
    jest
      .spyOn(window, 'fetch')
      .mockImplementationOnce(() => {
        return Promise.resolve({
          json: () => Promise.resolve([]),
          ok: true
        });
      })
      .mockImplementationOnce(() => {
        return Promise.resolve({
          json: () => Promise.resolve(fakedata),
          ok: true
        });
      });
    render(
      <MemoryRouter>
        <AmbitionSetting onMessage={handleShowMessage} />
      </MemoryRouter>
    );
    await wait(() => expect(screen.getByText(/What is your role?/i)).toBeInTheDocument());
    await wait(() => userEvent.click(screen.getByTestId('next-btn')));
    expect(handleShowMessage).toHaveBeenCalledWith('Please fill the required field', 'error');
  });

  test('When all questions and answers render properly ', async () => {
    const handleShowMessage = jest.fn();
    const fakedata = [
      {
        id: 1,
        question_text: 'What is your role'
      },
      {
        id: 2,
        question_text: "How long have you been working with the company(years)'"
      }
    ];
    jest
      .spyOn(window, 'fetch')
      .mockImplementationOnce(() => {
        return Promise.resolve({
          json: () => Promise.resolve([]),
          ok: true
        });
      })
      .mockImplementationOnce(() => {
        return Promise.resolve({
          json: () => Promise.resolve(fakedata),
          ok: true
        });
      });
    render(
      <MemoryRouter>
        <AmbitionSetting onMessage={handleShowMessage} />
      </MemoryRouter>
    );

    await wait(() => expect(screen.getByText(/What is your role/i)).toBeInTheDocument());
    userEvent.type(screen.getByTestId('answer'), 'A4');
    await wait(() => userEvent.click(screen.getByTestId('next-btn')));

    await wait(() => expect(screen.getByText(/How long have you been working with the company/i)).toBeInTheDocument());
    userEvent.type(screen.getByTestId('answer'), 'A4');
    await wait(() => userEvent.click(screen.getByTestId('next-btn')));

    await wait(() => expect(screen.getByTestId('dialog-yes')).toBeInTheDocument());
  });

  test('Check the questions side panel is working', async () => {
    const handleShowMessage = jest.fn();
    const fakedata = [
      {
        id: 1,
        question_text: 'What is your role?'
      },
      {
        id: 2,
        question_text: 'How long have you been working with the company(years)?'
      }
    ];
    jest
      .spyOn(window, 'fetch')
      .mockImplementationOnce(() => {
        return Promise.resolve({
          json: () => Promise.resolve([]),
          ok: true
        });
      })
      .mockImplementationOnce(() => {
        return Promise.resolve({
          json: () => Promise.resolve(fakedata),
          ok: true
        });
      });
    render(
      <MemoryRouter>
        <AmbitionSetting onMessage={handleShowMessage} />
      </MemoryRouter>
    );
    await wait(() => fireEvent.click(screen.getByText('Question 2')));
    expect(screen.getByText('How long have you been working with the company(years)?')).toBeInTheDocument();
  });

  test('When all questions not answered', async () => {
    const handleShowMessage = jest.fn();
    const fakedata = [
      {
        id: 1,
        question_text: 'What is your role?'
      },
      {
        id: 2,
        question_text: 'How long have you been working with the company(years)?'
      }
    ];
    jest
      .spyOn(window, 'fetch')
      .mockImplementationOnce(() => {
        return Promise.resolve({
          json: () => Promise.resolve([]),
          ok: true
        });
      })
      .mockImplementationOnce(() => {
        return Promise.resolve({
          json: () => Promise.resolve(fakedata),
          ok: true
        });
      });
    render(
      <MemoryRouter>
        <AmbitionSetting onMessage={handleShowMessage} />
      </MemoryRouter>
    );
    await wait(() => fireEvent.click(screen.getByText('Question 2')));
    expect(screen.getByText('How long have you been working with the company(years)?')).toBeInTheDocument();

    userEvent.type(screen.getByTestId('answer'), 'A4');
    await wait(() => userEvent.click(screen.getByTestId('next-btn')));
    await wait(() => userEvent.click(screen.getByTestId('dialog-yes')));
    expect(handleShowMessage).toHaveBeenCalledWith('Please answer all the questions', 'error');
  });

  test('When all answers saved properly ', async () => {
    const handleShowMessage = jest.fn();
    const fakedata = [
      {
        id: 1,
        question_text: 'What is your role'
      },
      {
        id: 2,
        question_text: 'How long have you been working with the company(years)'
      }
    ];
    jest
      .spyOn(window, 'fetch')
      .mockImplementationOnce(() => {
        return Promise.resolve({
          json: () => Promise.resolve([]),
          ok: true
        });
      })
      .mockImplementationOnce(() => {
        return Promise.resolve({
          json: () => Promise.resolve(fakedata),
          ok: true
        });
      })
      .mockImplementationOnce(() => {
        return Promise.resolve({
          json: () => Promise.resolve(),
          ok: true
        });
      })
      .mockImplementationOnce(() => {
        return Promise.resolve({
          json: () => Promise.resolve(),
          ok: true
        });
      });
    render(
      <MemoryRouter>
        <AmbitionSetting onMessage={handleShowMessage} />
      </MemoryRouter>
    );

    await wait(() => expect(screen.getByText(/What is your role/i)).toBeInTheDocument());
    userEvent.type(screen.getByTestId('answer'), 'A4');
    await wait(() => userEvent.click(screen.getByTestId('next-btn')));

    await wait(() => expect(screen.getByText(/How long have you been working with the company/i)).toBeInTheDocument());
    userEvent.type(screen.getByTestId('answer'), 'A4');
    await wait(() => userEvent.click(screen.getByTestId('next-btn')));

    await wait(() => userEvent.click(screen.getByTestId('dialog-yes')));
    await wait(() => expect(handleShowMessage).toHaveBeenCalledWith('Successfully added your response', 'success'));
  });
});
