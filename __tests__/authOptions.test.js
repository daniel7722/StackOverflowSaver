import { authOptions } from '../utils/authOptions';

describe("Authentication options", () => {
  test("JWT callback should modify token correctly", async () => {
    // Mock token and user objects
    const token = { accessToken: '' };
    const user = { name: 'testUser', token: 'userToken' };

    // Simulate the jwt callback function call
    const modifiedToken = await authOptions.callbacks.jwt({ token, user });

    // Assert that the token is modified correctly
    expect(modifiedToken.accessToken).toBe("userToken");
  });

  test("Session callback should modify session correctly", async () => {
    // Mock session and token objects
    const session = {};
    const token = { accessToken: "userToken", name: "testUser" };

    // Simulate the session callback function call
    const modifiedSession = await authOptions.callbacks.session({
      session,
      token,
    });

    // Assert that the session is modified correctly
    expect(modifiedSession.accessToken).toBe("userToken");
    expect(modifiedSession.user).toBe("testUser");
  });
});