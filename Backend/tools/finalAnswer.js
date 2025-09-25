// tools/finalAnswer.js
import { Tool } from '@langchain/core/tools';

export class FinalAnswerTool extends Tool {
  name = "final_answer";
  description = "Use this tool to provide the final answer to the user's question. Input should be the complete answer.";

  async _call(input) {
    return input;
  }
}

export const finalAnswerTool = new FinalAnswerTool();