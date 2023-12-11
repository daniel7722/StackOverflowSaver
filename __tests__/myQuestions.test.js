import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import QuestionList from '../app/my-questions/page';


global.fetch = jest.fn(); // Mocking fetch globally
global.console.error = jest.fn();

jest.mock("next-auth/react", () => {
    const originalModule = jest.requireActual('next-auth/react');
    const mockSession = {
      expires: new Date(Date.now() + 2 * 86400).toISOString(),
      user: 'testUser'
    };
    return {
      __esModule: true,
      ...originalModule,
      useSession: jest.fn(() => {
        return {data: mockSession, status: 'authenticated'}  // return type is [] in v3 but changed to {} in v4
      }),
    };
  });

describe('QuestionList component', () => {
  test('renders without crashing', () => {
    render(<QuestionList />);
  });

  test('fetches data and renders questions', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({
        data: [
          { q_id: '1', question: 'Test Question 1', answer: 'Test Answer 1' },
          { q_id: '2', question: 'Test Question 2', answer: 'Test Answer 2' },
        ],
      }),
    });

    const { findByText } = render(<QuestionList />);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('/api/read_table', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'testUser' }),
    });

    await waitFor(async () => {
        const question1 = await findByText('Test Question 1');
        const question2 = await findByText('Test Question 2');
  
        expect(question1).toBeInTheDocument();
        expect(question2).toBeInTheDocument();
      });
  });
  test('Clicking "Sign Out" button should call signOut function', async () => {

    const { getByText, getByTestId } = render(<QuestionList />);

    const settingsIcon = getByTestId('settings-icon');
    fireEvent.click(settingsIcon);

    fireEvent.click(getByText('Sign Out'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(5);
    });
  });

  test('Clicking "Delete Account" button should call handleDeleteAccount function', async () => {

    const { getByText, getByTestId } = render(<QuestionList />);

    const settingsIcon = getByTestId('settings-icon');
    fireEvent.click(settingsIcon);

    fireEvent.click(getByText('Delete Account'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(7);
    });

});

});