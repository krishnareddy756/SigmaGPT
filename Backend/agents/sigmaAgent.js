// agents/sigmaAgent.js
import { ChatOpenAI } from '@langchain/openai';
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { calculatorTool } from '../tools/calculator.js';
import { serpAPITool } from '../tools/serpapi.js';
import { finalAnswerTool } from '../tools/finalAnswer.js';
import { searchSimilarDocuments } from '../utils/pinecone.js';

// Clean and validate API key
const cleanApiKey = (apiKey) => {
  if (!apiKey) return null;
  // Remove any whitespace, newlines, or other invalid characters
  return apiKey.trim().replace(/[\r\n\t]/g, '');
};

const apiKey = cleanApiKey(process.env.OPENAI_API_KEY);

if (!apiKey) {
  console.error('❌ OpenAI API key is missing or invalid');
  throw new Error('OpenAI API key is required');
}

console.log('✅ OpenAI API key validated');

// Initialize the LLM
const llm = new ChatOpenAI({
  apiKey: apiKey,
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
1. For questions requiring current/factual information (like population, news, etc.), use the search tool FIRST
2. For math problems, use the calculator tool
3. After getting information, use final_answer tool to provide a complete response
4. If you have enough information to answer directly, you can skip search and use final_answer
5. Be concise and helpful

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
  maxIterations: 10, // Increased from 3 to allow proper tool usage
  verbose: true, // Enable verbose for debugging
  returnIntermediateSteps: true, // Return intermediate steps for debugging
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
      // Non-streaming execution with timeout and fallback
      try {
        const result = await Promise.race([
          agentExecutor.invoke(agentInput),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Agent timeout')), 30000) // 30 second timeout
          )
        ]);
        finalAnswer = result.output || 'No answer generated';
      } catch (agentError) {
        console.error('Agent execution failed:', agentError);
        
        if (agentError.message === 'Agent timeout' || agentError.message.includes('max iterations')) {
          console.log('🔄 Agent timeout/max iterations, providing direct response...');
          
          try {
            const directResponse = await llm.invoke([
              { role: "system", content: "You are SigmaGPT, a helpful AI assistant. Answer the user's question directly and concisely." },
              { role: "user", content: input }
            ]);
            
            finalAnswer = directResponse.content || 'I apologize, but I cannot process your request at the moment.';
          } catch (fallbackError) {
            console.error('Fallback response error:', fallbackError);
            finalAnswer = 'I apologize, but I encountered an error while processing your request. Please try again.';
          }
        } else {
          throw agentError; // Re-throw if it's not a timeout/iteration issue
        }
      }
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