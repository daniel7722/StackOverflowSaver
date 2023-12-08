// Test API connection - use static data
import { handleSubmit } from "../app/questions/page";

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ items: [{ title: "Test Question" }] }),
  }),
);

describe("handleSubmit fetch function", () => {
  it("fetches question title from Stack Overflow API", async () => {
    // Mock the response from the Stack Overflow API
    jest.spyOn(global, "fetch");

    // Call the fetchQuestionTitleFromAPI function
    const title = await handleSubmit();

    // Assertion: Ensure fetch was called with the correct URL
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/questions/123"),
    );

    // Assertion: Ensure the title is returned correctly
    expect(title).toBe("Test Question");

    // Reset the mock to avoid side effects on other tests
    global.fetch.mockClear();
  });
});

// Test question returns question text

// Test answer returns answer and answer ID based on question

// Test answer rank selection works with API call
