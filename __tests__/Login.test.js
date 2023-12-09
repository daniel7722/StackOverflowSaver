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

    test('toggleForms changes isLoginFormVisible state', () => {
        // Arrange
        render(<Login />);

        // Act
        const toggleButton = screen.getByText('Create an account');
        fireEvent.click(toggleButton);

        // Assert
        const loginForm = screen.getByTestId('login-form');
        const signupForm = screen.getByTestId('signup-form');

        expect(loginForm).toHaveClass('form--hidden');
        expect(signupForm).not.toHaveClass('form--hidden');
    });
});
