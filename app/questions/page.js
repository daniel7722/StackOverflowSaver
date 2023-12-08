// "use client";

export const handleSubmit = async () => {
  const questionId = "123"; // Test Question ID

  if (!questionId) {
    // Check existence of question ID
    console.error("Invalid Stack Overflow URL");
    return;
  }

  try {
    const apiUrl = `https://api.stackexchange.com/2.3/questions/${questionId}?order=desc&sort=activity&site=stackoverflow`;
    const apiResponse = await fetch(apiUrl);
    const apiData = await apiResponse.json();
    const title = apiData.items[0]?.title; // Return question title

    return title;
  } catch (error) {
    console.error("Error fetching data from Stack Overflow API", error);
    return null;
  }
};
