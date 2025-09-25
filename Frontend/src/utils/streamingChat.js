// utils/streamingChat.js

export class StreamingChatClient {
  constructor(baseUrl = 'http://localhost:8080/api') {
    this.baseUrl = baseUrl;
  }

  async sendMessage(threadId, message, onStream, onComplete, onError) {
    try {
      const response = await fetch(`${this.baseUrl}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ threadId, message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              onComplete(fullResponse);
              return;
            }

            try {
              const parsed = JSON.parse(data);
              
              switch (parsed.type) {
                case 'tool_start':
                  onStream({
                    type: 'tool_start',
                    tool: parsed.tool,
                    input: parsed.input
                  });
                  break;
                  
                case 'tool_end':
                  onStream({
                    type: 'tool_end',
                    output: parsed.output
                  });
                  break;
                  
                case 'token':
                  fullResponse += parsed.content;
                  onStream({
                    type: 'token',
                    content: parsed.content,
                    fullResponse
                  });
                  break;
                  
                case 'final':
                  onStream({
                    type: 'final',
                    answer: parsed.answer,
                    toolCalls: parsed.toolCalls,
                    context: parsed.context
                  });
                  break;
                  
                case 'error':
                  onError(new Error(parsed.message));
                  return;
              }
            } catch (parseError) {
              console.warn('Failed to parse streaming data:', data);
            }
          }
        }
      }
    } catch (error) {
      onError(error);
    }
  }

  // Fallback to non-streaming chat
  async sendMessageNonStreaming(threadId, message) {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ threadId, message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Non-streaming chat error:', error);
      throw error;
    }
  }
}

export default StreamingChatClient;