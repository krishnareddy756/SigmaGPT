// components/StreamingMessage.jsx
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import './StreamingMessage.css';

const StreamingMessage = ({ content, toolCalls = [], isStreaming = false }) => {
  const [displayContent, setDisplayContent] = useState('');
  const [currentToolCall, setCurrentToolCall] = useState(null);
  const [completedTools, setCompletedTools] = useState([]);

  useEffect(() => {
    if (isStreaming) {
      setDisplayContent(content);
    } else {
      // Type out the content when not actively streaming
      let index = 0;
      const timer = setInterval(() => {
        if (index < content.length) {
          setDisplayContent(content.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 20);

      return () => clearInterval(timer);
    }
  }, [content, isStreaming]);

  const renderToolCall = (tool, index) => {
    const isActive = currentToolCall?.name === tool.name;
    const isCompleted = completedTools.some(t => t.name === tool.name);

    return (
      <div key={index} className={`tool-call ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
        <div className="tool-header">
          <span className="tool-icon">
            {tool.name === 'calculator' ? '🧮' : 
             tool.name === 'search' ? '🔍' : 
             tool.name === 'final_answer' ? '✅' : '🔧'}
          </span>
          <span className="tool-name">
            {tool.name === 'calculator' ? 'Calculator' : 
             tool.name === 'search' ? 'Web Search' : 
             tool.name === 'final_answer' ? 'Final Answer' : tool.name}
          </span>
          <span className="tool-status">
            {isActive ? '⏳' : isCompleted ? '✓' : '⏸️'}
          </span>
        </div>
        
        {tool.input && (
          <div className="tool-input">
            <strong>Input:</strong> {tool.input}
          </div>
        )}
        
        {tool.output && (
          <div className="tool-output">
            <strong>Output:</strong> 
            <pre>{tool.output}</pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="streaming-message">
      {toolCalls.length > 0 && (
        <div className="tool-calls-section">
          <h4>🔧 Tools Used:</h4>
          {toolCalls.map((tool, index) => renderToolCall(tool, index))}
        </div>
      )}
      
      <div className="message-content">
        <ReactMarkdown 
          rehypePlugins={[rehypeHighlight]}
          components={{
            code({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <pre className={className} {...props}>
                  <code>{children}</code>
                </pre>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {displayContent}
        </ReactMarkdown>
        
        {isStreaming && (
          <span className="typing-indicator">▊</span>
        )}
      </div>
    </div>
  );
};

export default StreamingMessage;