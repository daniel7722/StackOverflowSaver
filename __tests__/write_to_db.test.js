/**
 * @jest-environment node
 */
import { POST } from '../app/api/write_to_db/route';
import * as dbOperations from '../lib/dbOperations';

// Mock the dbOperations module
jest.mock('../lib/dbOperations', () => ({
  insertQuestionAndAnswer: jest.fn().mockResolvedValue(null),
}));


describe('POST API Tests', () => {
  it('should handle the POST request successfully', async () => {
    // Create a mock request object
    const mockReq = {
      json: jest.fn().mockResolvedValue({
        question: { q_id: '1', question: 'What is your favorite color?' },
        answer: { a_id: '1', answer: 'Blue' },
        username: 'testUser',
      }),
    };

    // Call the POST function
    const response = await POST(mockReq);

    // Assert that insertQuestionAndAnswer was called correctly
    expect(dbOperations.insertQuestionAndAnswer).toHaveBeenCalledWith(
      { q_id: '1', question: 'What is your favorite color?' },
      { a_id: '1', answer: 'Blue' },
      'testUser'
    );

          
    // Check response == 200 
    expect(response.status).toBe(200);
  });

  // Additional tests for error handling, etc., can be added here
});
