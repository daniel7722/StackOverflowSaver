import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Overlay from '../components/cards/overlay';

describe('Overlay component', () => {
  test('renders children and calls close function on click', () => {
    const closeMock = jest.fn(); // Mock function for the 'close' prop
    const { getByTestId } = render(
      <Overlay close={closeMock}>
        <div data-testid="test-child">Test Child</div>
      </Overlay>
    );

    // Check if the child component is rendered
    const childElement = getByTestId('test-child');
    expect(childElement).toBeInTheDocument();

    // Simulate a click event on the overlay component
    const overlayComponent = getByTestId('overlay-component');
    fireEvent.click(overlayComponent);

    // Check if the 'close' function is called when the component is clicked
    expect(closeMock).toHaveBeenCalled();
  });
});