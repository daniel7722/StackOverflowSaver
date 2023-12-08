'use client';
import React, { useState, useEffect } from 'react';
import { signIn } from "next-auth/react";


const Login = () => {
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(true);

  useEffect(() => {
    // Add event listeners when the component mounts
    const inputElements = document.querySelectorAll(".form__input");

    inputElements.forEach((inputElement) => {
      inputElement.addEventListener("blur", handleInputBlur);
      inputElement.addEventListener("input", handleInputChange);

      return () => {
        // Remove event listeners when the component unmounts
        inputElement.removeEventListener("blur", handleInputBlur);
        inputElement.removeEventListener("input", handleInputChange);
      };
    });
  }, []);

  const handleInputBlur = (e) => {
    const inputElement = e.target;

    if (inputElement.id === "signupUsername" && inputElement.value.length > 0 && inputElement.value.length <= 4) {
      setInputError(inputElement, "Username must be at least 4 characters in length");
    }
  };

  const handleInputChange = (e) => {
    const inputElement = e.target;
    clearInputError(e.target);
  };

  const setFormMessage = (formElement, type, message) => {
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add('form__message--${type}');
  };

  const setInputError = (inputElement, message) => {
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
  };

  const clearInputError = (inputElement) => {
    inputElement.classList.remove("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Call the appropriate submit handler based on the visible form
    if (isLoginFormVisible) {
      handleLoginSubmit(e);
    } else {
      handleSignupSubmit(e);
    }
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const formElement = e.target;
    const username = formElement.querySelector(".form__input[type='text']").value;
    const password = formElement.querySelector(".form__input[type='password']").value;
    try {
      const result = await signIn("sign-in", {
        username,
        password,
        callbackUrl: '/',
        redirect: false, // Prevent automatic redirect
      });
      const hello = JSON.stringify(result);
      // Check the result and handle accordingly
      if (hello.error) {
        setFormMessage(formElement, "error", "Invalid username/password combination");
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const formElement = e.target;
    const username = formElement.querySelector(".form__input[type='text']").value;
    const password = formElement.querySelector(".form__input[type='password']").value;
    try {
      // Use signIn to trigger credential authorization on the server side
      const result = await signIn("sign-up", {
        username,
        password,
        callbackUrl: "/",
        redirect: false, // Prevent automatic redirect
      });
      // Check the result and handle accordingly
      if (result.status === 401) {
        setFormMessage(e.target, "error", "You already have an account");
      } else if (result.status === 403) {
        window.location.href = "/";
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };
  const toggleForms = () => {
    console.log("Toggle Forms Called");
    setIsLoginFormVisible((prev) => !prev);
  };


  return (
    <>
      <div className="container">
        <form id='credentials' className={`form ${isLoginFormVisible ? "" : "form--hidden"}`} method='post' onSubmit={handleFormSubmit}>
          <h1 className="form__title">Log in</h1>
          <div className="form__message form__message--error"></div>
          <div className="for__input-group">
            <input type="text" className="form__input" id='username' autoFocus placeholder="Username or email" />
            <div className="form__input-error-message"></div>
          </div>
          <div className="for__input-group">
            <input type="password" className="form__input" id='password' autoFocus placeholder="Password" />
            <div className="form__input-error-message"></div>
          </div>
          <button className="form__button" type='submit'>Continue</button>
          <p className="form__text">Don't have an account? <a className="form__link" href="#" id="linkCreateAccount" onClick={toggleForms}>Create an account</a>
          </p>
        </form>
        <form className={`form ${isLoginFormVisible ? "form--hidden" : ""}`} id="credential2" onSubmit={handleFormSubmit}>
          <h1 className="form__title">Create Account</h1>
          <div className="form__message form__message--error"></div>
          <div className="for__input-group">
            <input type="text" className="form__input" id="signupUsername" autoFocus placeholder="Username" />
            <div className="form__input-error-message"></div>
          </div>
          <div className="for__input-group">
            <input type="password" className="form__input" autoFocus placeholder="Password" />
            <div className="form__input-error-message"></div>
          </div>
          <div className="for__input-group">
            <input type="password" className="form__input" autoFocus placeholder="Confirm Password" />
            <div className="form__input-error-message"></div>
          </div>
          <button className="form__button" type="submit">Continue</button>
          <p className="form__text"> Already have an account? <a className="form__link" href="#" id="linkLogin" onClick={toggleForms}>Sign in</a>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;