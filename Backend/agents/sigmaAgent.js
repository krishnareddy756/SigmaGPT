// agents/sigmaAgent.js
import Groq from 'groq-sdk';
import { searchSimilarDocuments } from '../utils/pinecone.js';

// Clean and validate API key
const cleanApiKey = (apiKey) => {
  if (!apiKey) return null;
  const cleaned = apiKey.trim().replace(/[\r\n\t]/g, '');
  return cleaned.length > 0 ? cleaned : null;
};

const apiKey = cleanApiKey(process.env.GROQ_API_KEY);

if (!apiKey || apiKey.length < 20) {
  console.error('❌ Groq API key is missing or invalid');
  console.error('API key length:', apiKey ? apiKey.length : 0);
  console.error('Make sure GROQ_API_KEY is set in your .env file');
  throw new Error('Groq API key is required');
}

console.log('✅ Groq API key validated, length:', apiKey.length);

const groq = new Groq({ apiKey });
const modelName = process.env.GROQ_CHAT_MODEL || 'mixtral-8x7b-32768';

export const processWithAgent = async (input, chatHistory = [], streamCallback = null, fileContext = '') => {
  try {
    // Get relevant context from vector store
    const relevantDocs = await searchSimilarDocuments(input, 2);
    const vectorContext = relevantDocs.map(doc => doc.pageContent).join('\n\n');

   // Combine contexts
    const context = fileContext ? `${vectorContext}\n${fileContext}` : vectorContext;

    // Format messages for Groq
    const messages = [];
    
    if (context) {
      messages.push({
        role: 'system',
        content: `You are SigmaGPT, an intelligent assistant helping users with various tasks.
        
Context from documents:
${context}

Be helpful, accurate, and concise in your responses.`
      });
    } else {
      messages.push({
        role: 'system',
        content: `You are SigmaGPT, an intelligent assistant helping users with various tasks. Be helpful, accurate, and concise in your responses.`
      });
    }

    // Add chat history
    chatHistory.forEach(msg => {
      messages.push({
        role: msg.role || 'user',
        content: typeof msg.content === 'object' ? JSON.stringify(msg.content) : String(msg.content || '')
      });
    });

    // Add current input
    messages.push({
      role: 'user',
      content: String(input || '')
    });

    console.log('Agent input prepared:', {
      inputType: typeof input,
      contextType: typeof context,
      historyType: typeof chatHistory,
      hasFileContext: !!fileContext
    });

    console.log('🔍 Calling Groq API with model:', modelName);
    
    const response = await groq.chat.completions.create({
      model: modelName,
      messages: messages,
      temperature: 0.3,
      max_tokens: 1024,
      stream: false
    });

    const finalAnswer = response.choices[0]?.message?.content || 'No response generated';
    
    console.log('✅ Response generated successfully');
    
    if (streamCallback) {
      streamCallback({
        type: 'complete',
        content: finalAnswer
      });
    }

    return {
      answer: finalAnswer,
      toolCalls: [],
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

export { groq };