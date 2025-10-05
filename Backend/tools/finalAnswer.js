// tools/finalAnswer.js
import { Tool } from '@langchain/core/tools';
import { z } from 'zod';

export class FinalAnswerTool extends Tool {
  name = "final_answer";
  description = "Use this tool to provide the final answer to the user's question. Input should be the complete answer.";
  
  schema = z.object({
    input: z.string().describe("The complete final answer to provide to the user")
  });

  async _call(input) {
    const answer = typeof input === 'object' ? input.input || input : input;
    return String(answer);
  }
}

export const finalAnswerTool = new FinalAnswerTool();