# 🤖 SigmaGPT - Complete Project Analysis

## Executive Summary

**SigmaGPT** is a sophisticated, full-stack AI-powered chatbot application combining a modern React frontend with a Node.js/LangChain backend. It enables intelligent conversations with advanced tool integration, file processing, and persistent conversation management.

---

## 📊 Project Architecture

### High-Level Overview
```
┌──────────────────────────────────────────────────────────────┐
│                    SigmaGPT Full Stack                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐            ┌──────────────────┐       │
│  │  React Frontend  │            │  Node.js Backend │       │
│  │  (Vite + React19)│◄──────────►│  (Express + LLM) │       │
│  └──────────────────┘  REST API  └──────────────────┘       │
│         Port 5173                      Port 8080            │
│                                                              │
│  ┌──────────────────────────────────────────────────┐       │
│  │            External Services                     │       │
│  ├──────────────────────────────────────────────────┤       │
│  │ • OpenAI gpt-4o-mini • SerpAPI • MongoDB Atlas   │       │
│  │ • Together AI (DeepSeek-V3) • FAISS Vec • Render │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎯 Core Features

### 1. **AI Conversation Engine**
- **LLM Integration**: OpenAI `gpt-4o-mini` model via LangChain (cost-efficient alternative to GPT-4)
- **Alternative LLM**: DeepSeek-V3 via Together AI API (for flexible provider options)
- **Framework**: LangChain with agent-based architecture and tool calling
- **Tool Calling**: Agents can invoke specialized tools (calculator, web search) during conversations
- **Context Management**: Maintains chat history with last 10 messages for context

### 2. **Integrated Tools**
- **Calculator Tool** - Mathematical operations using MathJS
  - Handles complex mathematical expressions
  - Error handling for invalid expressions
  
- **Search Tool** - Web search via SerpAPI
  - Real-time information retrieval
  - Returns top 3 results with title, snippet, and link
  - Requires SERPAPI_API_KEY
  
- **Final Answer Tool** - Structured response delivery
  - Formats agent responses for presentation
  - Ensures consistent output format

### 3. **File Upload & RAG (Retrieval-Augmented Generation)**
- **Supported Formats**: PDF, DOCX
- **Max File Size**: 25MB per file
- **Processing Pipeline**:
  - PDF parsing with pdf-parse
  - DOCX parsing with mammoth
  - File stored in-memory with threadId reference
  - Content included in agent prompts for contextual responses

### 4. **Conversation Management**
- **Thread-Based Architecture**: Each conversation is a thread with unique ID
- **Persistent Storage**: MongoDB Atlas for permanent storage
- **Message History**: User and assistant messages with timestamps
- **Search Capability**: Find conversations by title

### 5. **Voice Input**
- **Speech Recognition**: Web Speech API integration
- **Continuous Listening**: Captures multiple speech segments
- **Error Handling**: User-friendly error messages
- **Browser Support**: Chrome, Firefox, Edge, Safari

### 6. **UI/UX Features**
- **Theme Support**: Dark and light modes with detailed color palettes
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Settings Panel**: Customize theme, typography, layout, behavior
- **Keyboard Shortcuts**: Custom keyboard context for quick actions
- **Tag System**: Categorize and manage conversations

---

## 🏗️ Technical Stack

### Frontend (React + Vite)
```json
{
  "Framework": "React 19",
  "Build Tool": "Vite 6.0.5",
  "State Management": "React Context API",
  "Markdown Rendering": "react-markdown with syntax highlighting",
  "Icons": "react-icons",
  "Loading States": "react-spinners",
  "Utilities": "UUID, localStorage API",
  "CSS": "CSS3 with custom properties (design tokens)"
}
```

**Key Libraries**:
- `react-markdown@10.1.0` - Render AI responses with formatting
- `rehype-highlight@7.0.1` - Code syntax highlighting
- `react-spinners@0.17.0` - Loading indicators
- `uuid@11.1.0` - Thread ID generation

### Backend (Node.js + Express)
```json
{
  "Runtime": "Node.js 20.18.0",
  "Framework": "Express 5.1.0",
  "AI Framework": "LangChain 0.3.34",
  "LLM Provider": "@langchain/openai 0.3.17",
  "Database": "MongoDB 6.10.0 + Mongoose 8.8.4",
  "Vector Store": "FAISS (free local alternative to Pinecone)",
  "File Processing": "Multer, pdf-parse, mammoth",
  "Web Search": "SerpAPI",
  "Math": "MathJS 14.8.0"
}
```

**Key Libraries**:
- `@langchain/community@0.3.57` - Extended LangChain tools
- `@langchain/core@0.3.77` - Core agent and tool definitions
- `express@5.1.0` - HTTP server framework
- `mongoose@8.8.4` - MongoDB object modeling
- `cors@2.8.5` - Cross-origin request handling

---

## 📁 Project Structure

### Frontend Structure
```
Frontend/
├── src/
│   ├── App.jsx                          # Main app component with context setup
│   ├── ChatWindow.jsx                   # Chat interface & message handling
│   ├── Chat.jsx                         # Message display with streaming
│   ├── Sidebar.jsx                      # Thread management & search
│   ├── MyContext.jsx                    # Global context definition
│   │
│   ├── components/
│   │   ├── FileUpload.jsx              # File drag-drop upload UI
│   │   ├── VoiceInput.jsx              # Voice input button & controls
│   │   ├── Navbar.jsx                  # Top navigation bar
│   │   ├── SettingsButton.jsx          # Settings toggle
│   │   ├── SearchButton.jsx            # Global search
│   │   ├── SettingsPanel.jsx           # Settings UI
│   │   ├── ErrorBoundary.jsx           # Error handling wrapper
│   │   ├── Layout.jsx                  # Sidebar + MainContent layout
│   │   ├── ConversationTags.jsx        # Tag management
│   │   ├── TagManager.jsx              # Tag editor
│   │   └── StreamingMessage.jsx        # Animated message display
│   │
│   ├── contexts/
│   │   ├── ThemeContext.jsx            # Theme provider with dark/light modes
│   │   ├── SettingsContext.jsx         # Settings state management
│   │   ├── KeyboardContext.jsx         # Keyboard shortcut handling
│   │   └── TagContext.jsx              # Tag state management
│   │
│   ├── hooks/
│   │   └── useSettings.js              # Custom settings hook
│   │
│   ├── styles/
│   │   ├── FileUpload.css
│   │   ├── VoiceInput.css
│   │   ├── globals.css
│   │   └── responsive.css              # Mobile & tablet breakpoints
│   │
│   ├── utils/
│   │   ├── storage.js                  # LocalStorage utilities
│   │   ├── streamingChat.js            # Streaming response handling
│   │   └── theme.js                    # Theme utilities
│   │
│   ├── config/
│   │   └── api.js                      # API endpoint configuration
│   │
│   └── __tests__/
│       └── theme.test.js               # Theme testing
│
└── package.json
```

### Backend Structure
```
Backend/
├── server.js                            # Express server & DB connection
├── package.json
│
├── agents/
│   └── sigmaAgent.js                    # LangChain agent initialization
│       └── Uses: Calculator, Search, FinalAnswer tools
│
├── models/
│   └── Thread.js                        # MongoDB Thread schema
│       └── Messages with timestamps
│
├── routes/
│   ├── chat.js                          # POST /chat - Main chat endpoint
│   │                                    # GET /thread - Fetch all threads
│   │                                    # DELETE /thread/:id - Delete
│   │
│   └── fileUpload.js                    # POST /upload - File upload
│                                        # GET /file/:id - File info
│                                        # GET /file/:id/content - Full content
│
├── tools/
│   ├── calculator.js                    # MathJS-based calculations
│   ├── serpapi.js                       # Web search tool
│   └── finalAnswer.js                   # Response formatting tool
│
└── utils/
    ├── fileParser.js                    # PDF & DOCX parsing
    ├── pinecone.js                      # FAISS vector store management
    └── together.js                      # (Placeholder for Together AI)
```

---

## 🔄 Key Data Flows

### 1. Chat Message Flow
```
User Input
    ↓
Frontend: ChatWindow.jsx (getReply)
    ↓
POST /api/chat { threadId, message }
    ↓
Backend: chat.js
    ├─→ Load/Create Thread in MongoDB
    ├─→ Add user message to thread
    ├─→ Retrieve last 10 messages (context)
    ├─→ Get file context if available
    ↓
sigmaAgent.js (processWithAgent)
    ├─→ Initialize LangChain agent
    ├─→ Format prompt with context
    ├─→ Execute agent with message
    ├─→ Agent may call tools:
    │   ├─ Calculator Tool
    │   ├─ Search Tool
    │   └─ Final Answer Tool
    ↓
Return agentResponse.answer
    ↓
Add assistant message to Thread
    ↓
Save Thread to MongoDB
    ↓
Send response to Frontend
    ↓
Frontend: Display response with streaming animation
```

### 2. File Upload Flow
```
User Selects File
    ↓
Frontend: FileUpload.jsx
    ├─→ Validate: type (PDF/DOCX), size (≤25MB)
    ↓
POST /api/upload { file, threadId }
    ↓
Backend: fileUpload.js
    ├─→ Validate file again
    ├─→ Parse file:
    │   ├─ PDF: pdf-parse
    │   └─ DOCX: mammoth
    ├─→ Store in fileStore Map (threadId → fileData)
    ├─→ Create preview (first 500 chars)
    ↓
Return file metadata & preview
    ↓
Frontend: Display upload confirmation
    ↓
Future: Auto-include in chat context via fileContext
```

### 3. Thread Management Flow
```
Load Threads
    ↓
GET /api/thread
    ↓
Backend: Find all threads in MongoDB
    ↓
Return thread list with titles, dates
    ↓
Frontend: Display in Sidebar with:
    - Search functionality
    - Date grouping
    - Delete capability
    ↓
Select Thread
    ↓
GET /api/thread/:threadId
    ↓
Load message history
    ↓
Display in Chat
```

---

## 🔌 API Endpoints

### Chat Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/chat` | Send message & get AI response |
| GET | `/api/thread` | Get all conversation threads |
| GET | `/api/thread/:threadId` | Get messages in a thread |
| DELETE | `/api/thread/:threadId` | Delete a thread |

### File Upload Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/upload` | Upload PDF/DOCX file |
| GET | `/api/file/:threadId` | Get file metadata |
| GET | `/api/file/:threadId/content` | Get full file content |

### Request/Response Examples

**POST /api/chat**
```json
Request:
{
  "threadId": "uuid-string",
  "message": "What is 2+2?"
}

Response:
{
  "reply": "2+2=4",
  "success": true
}
```

**POST /api/upload**
```json
Request:
Form Data:
- file: <PDF/DOCX file>
- threadId: "uuid-string"

Response:
{
  "success": true,
  "file": {
    "fileName": "document.pdf",
    "fileType": "pdf",
    "textLength": 5000,
    "preview": "Document content preview..."
  }
}
```

---

## 🛠️ Core Components Deep Dive

### Frontend: Chat Processing (ChatWindow.jsx)
```javascript
Key Features:
- getReply(): Sends message to backend
- Loading state management with ScaleLoader
- Error handling with user-friendly messages
- Auto-populates thread if doesn't exist
- Integrates file upload when available
```

### Frontend: Thread Management (Sidebar.jsx)
```javascript
Key Features:
- getAllThreads(): Fetch from backend
- changeThread(): Switch between conversations
- deleteThread(): Remove conversation
- formatDate(): Relative date display (Today, Yesterday, etc.)
- searchQuery: Real-time thread search
```

### Frontend: Voice Input (VoiceInput.jsx)
```javascript
Key Features:
- Uses native Web Speech API
- Continuous listening mode
- Real-time transcription display
- Error handling for unsupported browsers
- Accesses microphone with browser permissions
```

### Frontend: File Upload (FileUpload.jsx)
```javascript
Key Features:
- Drag-and-drop support
- File validation (type, size)
- In-memory upload with multer
- Upload progress feedback
- Preview of first 500 characters
```

### Frontend: Theme System (ThemeContext.jsx)
```javascript
Theme Structure:
{
  mode: 'dark' | 'light',
  colors: { primary, secondary, background, surface, ... },
  typography: { fontFamily, fontSize, monoFont... },
  spacing: { xs, sm, md, lg, xl },
  borderRadius: { sm, md, lg }
}

Pre-defined Themes:
- Dark Mode: Slate-based dark palette (primary: #0ea5e9)
- Light Mode: Clean light palette
```

### Backend: LangChain Agent (sigmaAgent.js)
```javascript
Configuration:
- Model: GPT-4o-mini (default, configurable)
- Temperature: 0.0 (deterministic responses)
- Tools: Calculator, Search, FinalAnswer
- Max Iterations: 5
- Streaming: Enabled

Prompt Structure:
- System: Agent identity & tool descriptions
- Context: Previous conversation history
- Input: Current user message
- Scratchpad: Agent's thinking/tool calls
```

### Backend: MongoDB Schema (Thread.js)
```javascript
ThreadSchema:
{
  threadId: String (unique),
  title: String,
  messages: [
    {
      role: 'user' | 'assistant',
      content: String,
      timestamp: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Deployment Configuration

### Frontend (Vercel)
- **Build Command**: `vite build`
- **Output Directory**: `dist/`
- **Environment**: VITE_API_URL
- **Deployment**: Automatic from main branch

### Backend (Render)
- **Runtime**: Node.js
- **Build Command**: `npm install --legacy-peer-deps && npm prune --production`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `OPENAI_API_KEY`
  - `MONGODB_URI`
  - `SERPAPI_API_KEY`
  - `NODE_ENV`
  - `PORT` (default 8080)

### CORS Configuration
```javascript
Allowed Origins:
- localhost (dev)
- *.vercel.app (Vercel deployments)
- Specific Render backend URLs
- Custom domains

Methods: GET, POST, DELETE, PUT, PATCH
Credentials: Enabled
```

---

## 🔐 Security Features

1. **CORS Protection**: Whitelisted origins with fallback patterns
2. **API Key Validation**: OpenAI key validation at startup
3. **File Validation**: Type and size checking
4. **Input Sanitization**: Message content validation
5. **Error Handling**: Sensitive info hidden in production
6. **Environment Variables**: All secrets in .env (not committed)

---

## 📊 Vector Store (FAISS)

### Current Implementation
- **Type**: FAISS (Free local vector database)
- **Embeddings**: Xenova/all-MiniLM-L6-v2 (local, no API key)
- **Storage**: Local `vector_store` directory
- **Purpose**: RAG capability (Retrieval-Augmented Generation)
- **Init Process**:
  1. Check if existing store exists
  2. Load if available, else create new
  3. Initialize with welcome document
  4. Persist to disk

### Note on Pinecone Migration
- Original implementation used Pinecone (paid service)
- Now uses FAISS for cost-free operation
- Drop-in replacement with same interface
- Can switch back if needed (see `searchSimilarDocuments()`)

---

## 🐛 Error Handling Strategy

### Frontend
- Try-catch blocks in API calls
- User-friendly error messages
- Loading states to prevent duplicate submissions
- Console logging for debugging

### Backend
- Global error handler middleware
- Graceful degradation (continues without vector store if init fails)
- Detailed logging in development, sanitized in production
- HTTP status codes for different error types

---

## 🔄 State Management

### Frontend Context Hierarchy
```
App
├── ThemeProvider
├── SettingsProvider
├── KeyboardProvider
├── TagProvider
└── MyContext
    ├── prompt, setPrompt
    ├── reply, setReply
    ├── currThreadId, setCurrThreadId
    ├── prevChats, setPrevChats
    ├── newChat, setNewChat
    └── allThreads, setAllThreads
```

### Persistent Storage
- **localStorage**: Settings, theme preferences
- **MongoDB**: Thread messages and metadata
- **In-Memory Map**: Current session file uploads
- **FAISS Index**: Vector embeddings for similarity search

---

## 🎯 Technology Decisions & Trade-offs

| Aspect | Choice | Rationale |
|--------|--------|-----------|
| Frontend State | Context API | Simplicity, no extra deps |
| Build Tool | Vite | Fast dev server, modern bundling |
| CSS-in-JS | CSS Modules + CSS Vars | Performance, maintainability |
| Vector DB | FAISS (local) | Free, no API keys, persistent |
| LLM | OpenAI GPT | Reliable, extensive tools |
| Database | MongoDB | Flexible schema, Atlas free tier |
| File Upload | Multer (in-memory) | Simple, no disk I/O |
| Markdown Render | react-markdown | Lightweight, extensible |

---

## 📈 Performance Considerations

1. **Frontend**:
   - Streaming message display (40ms per word chunk)
   - React Context avoids prop drilling
   - CSS custom properties for efficient theme switching
   - Lazy loading of components

2. **Backend**:
   - Agent max iterations capped at 5
   - Chat history limited to last 10 messages
   - FAISS similarity search (k=3)
   - In-memory file storage (25MB max per file)

3. **Database**:
   - MongoDB indexes on threadId (unique)
   - Date-based queries for thread sorting
   - Lean queries where possible

---

## 🔧 Environment Variables Required

### Backend (.env)
```
# OpenAI Configuration
OPENAI_API_KEY=sk-...
OPENAI_CHAT_MODEL=gpt-4o-mini

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
MONGODB_URL=mongodb://localhost:27017/sigmagpt (local dev)

# Search API
SERPAPI_API_KEY=...

# Server
PORT=8080
NODE_ENV=development|production
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:8080/api (dev)
VITE_API_URL=https://backend-url/api (production)
```

---

## 🚀 Quick Start Flows

### Local Development
```bash
# Backend
cd Backend
npm install --legacy-peer-deps
export OPENAI_API_KEY=... MONGODB_URL=... SERPAPI_API_KEY=...
npm run dev

# Frontend (new terminal)
cd Frontend
npm install
npm run dev
```

### Production Deployment
1. Backend: Deploy to Render, set environment variables
2. Frontend: Connect GitHub repo to Vercel
3. Set VITE_API_URL to production backend
4. Auto-deploy on push to main

---

## 📝 Notable Features

✅ **Streaming Responses**: Word-by-word animation for AI responses  
✅ **Voice Input**: Browser-native speech recognition  
✅ **File Analysis**: PDF/DOCX parsing for RAG  
✅ **Theme Switching**: Comprehensive dark/light modes  
✅ **Conversation Search**: Find old chats by title  
✅ **Tool Calling**: Agent uses calculator, search, answer tools  
✅ **Conversation Tags**: Organize by category (feature-ready)  
✅ **Error Boundaries**: React error recovery  
✅ **Responsive Design**: Mobile-optimized UI  
✅ **CORS Handled**: Works across domains  

---

## 🎓 Learning Resources

**Key Concepts Used**:
- React Hooks & Context API
- LangChain Agent Architecture
- Express.js Middleware
- MongoDB Mongoose ODM
- Vector Similarity Search
- Web Speech API
- CORS & Authentication
- File Processing & Validation

**Potential Enhancements**:
1. User authentication & multi-user support
2. Rate limiting & usage quotas
3. Conversation sharing & public links
4. Real-time collaboration with WebSockets
5. Custom tool creation UI
6. Integration with more LLM providers
7. Advanced RAG with document chunking
8. Export conversations (PDF, JSON)

---

## Summary Stats

| Metric | Value |
|--------|-------|
| Frontend Components | 20+ |
| Backend Routes | 7 |
| Integrated Tools | 3 |
| Database Collections | 1 (Threads) |
| Supported File Types | 2 (PDF, DOCX) |
| Theme Variants | 2 (Dark, Light) |
| Context Providers | 5 |
| Max File Size | 25 MB |
| Chat History Context | 10 messages |
| Agent Max Iterations | 5 |

---

*Last Updated: January 2, 2026*  
*Analysis includes complete codebase review of all major files and components*
