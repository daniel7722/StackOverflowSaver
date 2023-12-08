import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Question from "../components/cards/question";

describe("Question component", () => {
  const mockData = {
    question: "What is your favorite color?",
  };

  test("renders question content correctly", () => {
    const openMock = jest.fn(); // Mock function for the 'open' prop
    const { getByText, getByTestId } = render(
      <Question data={mockData} open={openMock} />,
    );

    // Check if the question content is rendered
    const questionElement = getByText(mockData.question);
    expect(questionElement).toBeInTheDocument();

    // Simulate a click event on the question component
    const questionComponent = getByTestId("question-component");
    fireEvent.click(questionComponent);

    // Check if the 'open' function is called when the component is clicked
    expect(openMock).toHaveBeenCalled();
  });
});
