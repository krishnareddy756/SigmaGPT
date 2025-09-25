import './Sidebar.css';
import { useContext, useEffect, useState } from 'react';
import { MyContext } from './MyContext';
import { v1 as uuidv1 } from 'uuid';
import SettingsButton from './components/SettingsButton';
import SearchButton from './components/SearchButton';
import ConversationTags from './components/ConversationTags';
import { BASE_URL } from './config/api.js';

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats
  } = useContext(MyContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredThreads, setFilteredThreads] = useState([]);

  const getAllThreads = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/thread`);
      const res = await response.json();
      const filteredData = res.map(thread => ({
        id: thread.threadId,
        title: thread.title,
        createdAt: new Date(thread.createdAt).toLocaleDateString(),
        updatedAt: new Date(thread.updatedAt || thread.createdAt),
      }));

      console.log("Fetched Threads:", filteredData);
      setAllThreads(filteredData);
    } catch (error) {
      console.error("Error fetching threads:", error);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredThreads(allThreads || []);
    } else {
      const filtered = (allThreads || []).filter(thread =>
        thread.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredThreads(filtered);
    }
  }, [allThreads, searchQuery]);

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt('');
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    try {
      const response = await fetch(`${BASE_URL}/api/thread/${newThreadId}`);
      const res = await response.json();
      console.log("Changed Thread:", res);
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (error) {
      console.error("Error changing thread:", error);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/thread/${threadId}`, {
        method: 'DELETE'
      });
      console.log("Deleted Thread:", threadId);
      getAllThreads();
    } catch (error) {
      console.error("Error deleting thread:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <section className='sidebar'>
      <div className="sidebar-header">
        <div className="logo-section">
          <div className="app-logo">
            <span className="logo-icon">💬</span>
            <span className="app-name">SigmaGPT</span>
          </div>
        </div>
        
        <button className="new-chat-button" onClick={createNewChat}>
          <span className="button-icon">✏️</span>
          <span className="button-text">New Chat</span>
        </button>
      </div>

      <div className="search-section">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button 
              className="clear-search"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>
        <SearchButton />
      </div>

      <div className="conversations-section">
        <div className="section-header">
          <h3>Recent Conversations</h3>
          <span className="conversation-count">{filteredThreads.length}</span>
        </div>
        
        <ul className='conversation-list'>
          {filteredThreads.length > 0 ? (
            filteredThreads.map((thread) => (
              <li 
                key={thread.id} 
                className={`conversation-item ${currThreadId === thread.id ? 'active' : ''}`}
                onClick={() => changeThread(thread.id)}
              >
                <div className="conversation-content">
                  <div className="conversation-title">
                    {thread.title}
                  </div>
                  <div className="conversation-meta">
                    <span className="conversation-date">
                      {formatDate(thread.createdAt)}
                    </span>
                  </div>
                  <ConversationTags conversationId={thread.id} compact={true} />
                </div>
                <div className="conversation-actions">
                  <button
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteThread(thread.id);
                    }}
                    title="Delete conversation"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))
          ) : (
            <div className="empty-state">
              {searchQuery ? (
                <>
                  <span className="empty-icon">🔍</span>
                  <p>No conversations found</p>
                  <small>Try a different search term</small>
                </>
              ) : (
                <>
                  <span className="empty-icon">💭</span>
                  <p>No conversations yet</p>
                  <small>Start a new chat to begin</small>
                </>
              )}
            </div>
          )}
        </ul>
      </div>

      <SettingsButton />
    </section>
  );
}

export default Sidebar;
