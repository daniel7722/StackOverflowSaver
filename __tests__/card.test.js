// card.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Card from '../components/cards/card'; // Replace with the correct path to your Card component

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
  global.fetch = jest.fn(); // Mocking fetch globally

describe('Card component', () => {
  test('renders Question component and opens Modal when clicked', () => {
    const mockData = {
      // Mock data object
      q_id: 'testqID', 
      a_id: 'testaID', 
      question: 'testQuestion', 
      answer: 'testAnswer'
    };

    const { getByTestId, queryByTestId } = render(<Card data={mockData} />);

    // Check if Listing component is rendered
    const questionComponent = getByTestId('question-component');
    expect(questionComponent).toBeInTheDocument();

    // Ensure Modal is not initially rendered
    const modalComponent = queryByTestId('modal-component');
    expect(modalComponent).toBeNull();

    // Simulate a click event on the Listing component
    fireEvent.click(questionComponent);

    // Check if Modal and Overlay components are rendered after clicking
    const overlayComponent = getByTestId('overlay-component');
    expect(overlayComponent).toBeInTheDocument();

    const modalAfterClick = getByTestId('modal-component2');
    expect(modalAfterClick).toBeInTheDocument();

    // Simulate a click event on the Overlay component
    fireEvent.click(overlayComponent);

    // Check if Modal and Overlay components are not rendered after closing
    const modalAfterClose = queryByTestId('modal-component');
    expect(modalAfterClose).toBeNull();

    const overlayAfterClose = queryByTestId('overlay-component2');
    expect(overlayAfterClose).toBeNull();
  });
});
