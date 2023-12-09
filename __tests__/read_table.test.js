/**
 * @jest-environment node
 */
import { POST } from '../app/api/read_table/route';
import * as dbOperations from '../lib/dbOperations';



async function readableStreamToString(readableStream) {
  const reader = readableStream.getReader();
  let result = '';
  let done = false;

  while (!done) {
    const { value, done: readDone } = await reader.read();
    if (readDone) {
      done = true;
    } else {
      result += new TextDecoder().decode(value);
    }
  }
  return result;
}
// Mocking NextResponse and the database connection
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((data) => data),
    error: jest.fn().mockImplementation((data) => data),
  },
}));


//Mock the dbOperations module
jest.mock('../lib/dbOperations.js', () => ({
  getUserData: jest.fn().mockResolvedValue([
    { q_id: 1, a_id: 1, question: 'Sample Question', answer: 'Sample Answer' }
  ]),
}));
describe('READ_TABLE API Tests', () => {
  it('should handle the READ_TABLE request successfully', async () => {
    // Mock the request object
    const mockReq = {
      json: jest.fn().mockResolvedValue({ username: 'testUser' }),
    };

    // Call the POST (READ_TABLE) function
    const res = await POST(mockReq);

    // Assert that getUserData was called correctly
    expect(dbOperations.getUserData).toHaveBeenCalledWith('testUser');

    
// Convert the readable stream to a string and then parse it as JSON
    const bodyString = await readableStreamToString(res.body);
    const body = JSON.parse(bodyString);

    // Check if the parsed body contains the expected data
    const expectedData = [
      { q_id: 1, a_id: 1, question: 'Sample Question', answer: 'Sample Answer' }
    ];
    expect(body.data).toEqual(expectedData);
  });
  // Additional tests for error handling, etc., can be added here
});
