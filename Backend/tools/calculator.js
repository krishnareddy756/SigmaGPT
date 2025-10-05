// tools/calculator.js
import { evaluate } from 'mathjs';
import { Tool } from '@langchain/core/tools';
import { z } from 'zod';

export class CalculatorTool extends Tool {
  name = "calculator";
  description = "Useful for mathematical calculations. Input should be a mathematical expression.";
  
  schema = z.object({
    input: z.string().describe("A mathematical expression to evaluate")
  });

  async _call(input) {
    try {
      // Extract the actual expression from the input
      const expression = typeof input === 'string' ? input : (input.input || input.expression || String(input));
      
      if (!expression || expression.trim().length === 0) {
        return "Please provide a mathematical expression to calculate.";
      }

      console.log(`🧮 Calculator evaluating: "${expression}"`);
      const result = evaluate(expression.trim());
      return `${expression} = ${result}`;
    } catch (error) {
      console.error('Calculator error:', error);
      return `Error calculating ${input}: ${error.message}`;
    }
  }
}

export const calculatorTool = new CalculatorTool();