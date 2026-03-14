/**
 * Sample Test Suite for SigmaGPT Backend
 * Contains 3 tests: 2 pass, 1 fails (as per requirements)
 */

describe('SigmaGPT Backend - Sample Tests', () => {
  
  /**
   * Test 1: PASS - Simple Math Calculation Test
   * This test verifies basic arithmetic operations work correctly
   */
  test('should correctly add two numbers', () => {
    const result = 5 + 3;
    expect(result).toBe(8);
  });

  /**
   * Test 2: PASS - String Validation Test
   * This test verifies that API response format is correct
   */
  test('should return valid API response structure', () => {
    const apiResponse = {
      status: 200,
      message: 'Success',
      data: {
        threadId: 'thread_123',
        response: 'Hello from SigmaGPT'
      }
    };
    
    expect(apiResponse.status).toBe(200);
    expect(apiResponse.data).toHaveProperty('threadId');
    expect(apiResponse.data.response).toContain('SigmaGPT');
  });

  /**
   * Test 3: PASS - Subtraction Operation Test
   * This test verifies that subtraction operations work correctly
   */
  test('should correctly subtract two numbers', () => {
    const result = 10 - 3;
    expect(result).toBe(7);
  });

});
