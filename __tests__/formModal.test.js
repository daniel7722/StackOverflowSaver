import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import FormModal from '../components/cards/formModal';

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

global.fetch = jest.fn();
global.console.error = jest.fn();

const mockStackOverflowQuestionResponse = {
    items: [
        { title: 'Test Question2'}
      ]
};

const mockStackOverflowAnswerResponse = {
    items: [
      { body: 'Test Answer', answer_id: '123' },
      { body: 'Second Answer', answer_id: '123' }
    ]
  };

describe('FormModal component', () => {
  test('submits form data', async () => {
    const mockClose = jest.fn();

    const { getByPlaceholderText, getByTestId } = render(
      <FormModal close={mockClose} />
    );

    global.fetch.mockResolvedValueOnce({json: () => Promise.resolve(mockStackOverflowQuestionResponse)});
    global.fetch.mockResolvedValueOnce({json: () => Promise.resolve(mockStackOverflowAnswerResponse)});

    // Fill in form inputs
    const urlInput = getByPlaceholderText('Enter Stack Overflow URL');
    const rankInput = getByPlaceholderText('Rank');

    fireEvent.change(urlInput, { target: { value: 'https://stackoverflow.com/questions/12345/example' } });
    fireEvent.change(rankInput, { target: { value: '2' } });

    // Click the submit button
    const submitButton = getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(3); // Check if the close function is called after submission
    });
  });
});