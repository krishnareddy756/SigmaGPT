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
   * Test 3: FAIL - Intentional Failure
   * This test is designed to fail to demonstrate failure in CI pipeline
   * In production, this would be fixed before deployment
   */
  test('should fail intentionally for demonstration', () => {
    const expectedValue = 10;
    const actualValue = 5 + 3; // This equals 8, not 10
    expect(actualValue).toBe(expectedValue); // This will fail
  });

});
