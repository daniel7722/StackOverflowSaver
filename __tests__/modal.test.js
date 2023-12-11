// modal.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Modal from '../components/cards/modal';

// Mock the useSession hook
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

global.console.error = jest.fn();

describe('Modal component', () => {
  const mockClose = jest.fn(); // Mock function for the 'close' prop
  const mockData = {
    q_id: 'question_id',
    a_id: 'answer_id',
    question: 'Test question',
    answer: 'Test answer',
  };
    global.fetch = jest.fn(); // Mocking fetch globally


  test('renders without crashing', () => {
    render(<Modal data={mockData} close={mockClose} />);
  });

  test('calls handleDelete and logs deletion data on button click', () => {
    const mockData = { success: true };
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData),
    });


    const { getByTestId } = render(
      <Modal data={mockData} close={mockClose} />
    );

    // Simulate a click event on the delete button
    const deleteButton = getByTestId('delete-button');
    fireEvent.click(deleteButton);
    fireEvent.click(deleteButton);

    // Verify that handleDelete function is called
    expect(global.fetch).toHaveBeenCalledWith('/api/del_from_db', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q_id: mockData.q_id,
        a_id: mockData.a_id,
        user: 'testUser', // Ensure this matches your expected user data
      }),
    });
  });
});