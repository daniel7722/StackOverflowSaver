import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../components/login/Login';

describe('Login Component Tests', () => {

    test('handleInputBlur sets input error for signupUsername with invalid length', () => {
        // Arrange
        render(<Login />);
        const signupUsernameInput = screen.getByPlaceholderText('Username');

        // Act
        fireEvent.input(signupUsernameInput, { target: { value: 'abc' } });
        fireEvent.blur(signupUsernameInput);

        // Assert
        expect(signupUsernameInput).toHaveClass('form__input--error');
    });
});
