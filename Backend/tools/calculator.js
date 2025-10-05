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
      const expression = typeof input === 'object' ? input.input || input : input;
      const result = evaluate(expression);
      return String(`${expression} = ${result}`);
    } catch (error) {
      return String(`Error calculating ${input}: ${error.message}`);
    }
  }
}

export const calculatorTool = new CalculatorTool();