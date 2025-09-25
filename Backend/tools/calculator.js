// tools/calculator.js
import { evaluate } from 'mathjs';
import { Tool } from '@langchain/core/tools';

export class CalculatorTool extends Tool {
  name = "calculator";
  description = "Useful for mathematical calculations. Input should be a mathematical expression.";

  async _call(input) {
    try {
      const result = evaluate(input);
      return `${input} = ${result}`;
    } catch (error) {
      return `Error calculating ${input}: ${error.message}`;
    }
  }
}

export const calculatorTool = new CalculatorTool();