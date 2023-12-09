import React from 'react';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../components/login/Login';

global.fetch = jest.fn();
global.console.error = jest.fn();
jest.mock('bcrypt');

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
        const toggleButton = screen.getByText("Don't have an account?");
        fireEvent.click(toggleButton);

        // Assert
        const loginForm = screen.getByTestId('login-form');
        const signupForm = screen.getByTestId('signup-form');

        expect(loginForm).toHaveClass('form--hidden');
        expect(signupForm).not.toHaveClass('form--hidden');
    });

    test('confirm password matches the password', () => {
        render(<Login/>);
        const signupPasswordInput = screen.getByTestId('signupPassword');
        const signupConfirmPasswordInput = screen.getByTestId('signupConfirmPassword');
        fireEvent.input(signupPasswordInput, { target: { value: 'abc' } });
        fireEvent.input(signupConfirmPasswordInput, { target: { value: 'abcd' } });
        fireEvent.submit(screen.getByTestId('signup-form'));
        const formMessage = screen.getByTestId('formMessage');
        expect(formMessage).toHaveClass('form__message--error');

    });
});
