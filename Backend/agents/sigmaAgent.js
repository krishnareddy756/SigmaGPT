// agents/sigmaAgent.js
import { ChatOpenAI } from '@langchain/openai';
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { calculatorTool } from '../tools/calculator.js';
import { serpAPITool } from '../tools/serpapi.js';
import { finalAnswerTool } from '../tools/finalAnswer.js';
import { searchSimilarDocuments } from '../utils/pinecone.js';

// Initialize the LLM
const llm = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
  temperature: 0.0,
  streaming: true,
});

// Define available tools
const tools = [calculatorTool, serpAPITool, finalAnswerTool];

// Create the agent prompt template
const prompt = ChatPromptTemplate.fromMessages([
  ["system", `You are SigmaGPT, an intelligent assistant that helps users with various tasks.

You have access to the following tools:
- calculator: For mathematical calculations
- search: For searching the web for current information
- final_answer: To provide the final answer to the user

IMPORTANT RULES:
1. You MUST use tools to help answer questions when appropriate
2. For math problems, use the calculator tool
3. For current events or information you might not know, use the search tool
4. Always use the final_answer tool to provide your complete response
5. Be helpful, accurate, and concise

Context from previous conversations:
{context}

Current conversation:
{chat_history}`],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

// Create the agent
const agent = await createToolCallingAgent({
  llm,
  tools,
  prompt,
});

// Create the agent executor
const agentExecutor = new AgentExecutor({
  agent,
  tools,
  maxIterations: 3,
  verbose: false,
});

export const processWithAgent = async (input, chatHistory = [], streamCallback = null) => {
  try {
    // Get relevant context from vector store
    const relevantDocs = await searchSimilarDocuments(input, 2);
    const context = relevantDocs.map(doc => doc.pageContent).join('\n\n');

    // Format chat history
    const formattedHistory = chatHistory.map(msg => 
      `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`
    ).join('\n');

    // Prepare the input
    const agentInput = {
      input,
      context,
      chat_history: formattedHistory,
    };

    let finalAnswer = '';
    let toolCalls = [];

    if (streamCallback) {
      // Streaming execution
      const stream = await agentExecutor.streamEvents(agentInput, {
        version: "v1",
      });

      for await (const event of stream) {
        if (event.event === "on_tool_start") {
          const toolName = event.name;
          const toolInput = event.data?.input;
          toolCalls.push({ name: toolName, input: toolInput });
          
          streamCallback({
            type: 'tool_start',
            tool: toolName,
            input: toolInput
          });
        }
        
        if (event.event === "on_tool_end") {
          const toolOutput = event.data?.output;
          streamCallback({
            type: 'tool_end',
            output: toolOutput
          });
        }

        if (event.event === "on_chat_model_stream") {
          const chunk = event.data?.chunk?.content;
          if (chunk) {
            streamCallback({
              type: 'token',
              content: chunk
            });
          }
        }
      }

      // Get the final result
      const result = await agentExecutor.invoke(agentInput);
      finalAnswer = result.output || 'No answer generated';
    } else {
      // Non-streaming execution
      const result = await agentExecutor.invoke(agentInput);
      finalAnswer = result.output || 'No answer generated';
    }

    return {
      answer: finalAnswer,
      toolCalls,
      context: relevantDocs.length > 0 ? 'Retrieved relevant context' : 'No relevant context found'
    };

  } catch (error) {
    console.error('Agent execution error:', error);
    return {
      answer: 'I apologize, but I encountered an error while processing your request. Please try again.',
      toolCalls: [],
      context: 'Error occurred'
    };
  }
};

export { agentExecutor };