import { useState, useEffect, useRef } from 'react';
import { useContext } from 'react';
import { MyContext } from '../MyContext';
import { useKeyboard } from '../contexts/KeyboardContext';
import './SearchModal.css';

const SearchModal = ({ isOpen, onClose }) => {
  const { allThreads, setCurrThreadId, setPrevChats, setNewChat, setReply } = useContext(MyContext);
  const { registerHandler, unregisterHandler } = useKeyboard();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    sortBy: 'relevance'
  });
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef(null);

  // Register keyboard shortcuts
  useEffect(() => {
    if (isOpen) {
      registerHandler('search', () => {
        // Focus search input
        searchInputRef.current?.focus();
      });

      registerHandler('closeModal', onClose);

      return () => {
        unregisterHandler('search');
        unregisterHandler('closeModal');
      };
    }
  }, [isOpen, registerHandler, unregisterHandler, onClose]);

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Perform search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate search delay
    const searchTimeout = setTimeout(() => {
      performSearch();
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery, filters, allThreads]);

  const performSearch = async () => {
    try {
      let results = [];
      
      // Search through conversations
      for (const thread of allThreads || []) {
        if (thread.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          // Get conversation messages for context
          try {
            const response = await fetch(`http://localhost:8080/api/thread/${thread.id}`);
            const messages = await response.json();
            
            // Find matching messages
            const matchingMessages = messages.filter(msg => 
              msg.content.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (matchingMessages.length > 0 || thread.title.toLowerCase().includes(searchQuery.toLowerCase())) {
              results.push({
                thread,
                matchingMessages: matchingMessages.slice(0, 3), // Limit to 3 matches per conversation
                titleMatch: thread.title.toLowerCase().includes(searchQuery.toLowerCase())
              });
            }
          } catch (error) {
            console.error('Error fetching thread messages:', error);
            // Still include thread if title matches
            if (thread.title.toLowerCase().includes(searchQuery.toLowerCase())) {
              results.push({
                thread,
                matchingMessages: [],
                titleMatch: true
              });
            }
          }
        }
      }

      // Apply filters
      results = applyFilters(results);
      
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  const applyFilters = (results) => {
    let filtered = [...results];

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(result => 
        new Date(result.thread.createdAt) >= cutoffDate
      );
    }

    // Sort results
    switch (filters.sortBy) {
      case 'date':
        filtered.sort((a, b) => new Date(b.thread.updatedAt || b.thread.createdAt) - new Date(a.thread.updatedAt || a.thread.createdAt));
        break;
      case 'relevance':
      default:
        // Sort by title match first, then by number of matching messages
        filtered.sort((a, b) => {
          if (a.titleMatch && !b.titleMatch) return -1;
          if (!a.titleMatch && b.titleMatch) return 1;
          return b.matchingMessages.length - a.matchingMessages.length;
        });
        break;
    }

    return filtered;
  };

  const highlightText = (text, query) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="search-highlight">{part}</mark>
      ) : part
    );
  };

  const openConversation = async (threadId) => {
    setCurrThreadId(threadId);
    try {
      const response = await fetch(`http://localhost:8080/api/thread/${threadId}`);
      const res = await response.json();
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
      onClose();
    } catch (error) {
      console.error("Error opening conversation:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <div className="search-modal-header">
          <div className="search-input-container">
            <span className="search-icon">🔍</span>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search conversations and messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-modal-input"
            />
            {searchQuery && (
              <button 
                className="clear-search-button"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>
          
          <button className="close-modal-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="search-filters">
          <div className="filter-group">
            <label>Date Range:</label>
            <select 
              value={filters.dateRange} 
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Sort By:</label>
            <select 
              value={filters.sortBy} 
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            >
              <option value="relevance">Relevance</option>
              <option value="date">Date</option>
            </select>
          </div>
        </div>

        <div className="search-results">
          {isLoading ? (
            <div className="search-loading">
              <div className="loading-spinner"></div>
              <p>Searching...</p>
            </div>
          ) : searchQuery.trim() === '' ? (
            <div className="search-empty">
              <span className="empty-icon">🔍</span>
              <p>Start typing to search conversations</p>
              <small>Search through conversation titles and message content</small>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="search-empty">
              <span className="empty-icon">😔</span>
              <p>No results found</p>
              <small>Try different keywords or adjust your filters</small>
            </div>
          ) : (
            <div className="results-list">
              <div className="results-header">
                <span>{searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found</span>
              </div>
              
              {searchResults.map((result, index) => (
                <div 
                  key={result.thread.id} 
                  className="search-result-item"
                  onClick={() => openConversation(result.thread.id)}
                >
                  <div className="result-header">
                    <h4 className="result-title">
                      {highlightText(result.thread.title, searchQuery)}
                    </h4>
                    <span className="result-date">
                      {formatDate(result.thread.createdAt)}
                    </span>
                  </div>
                  
                  {result.matchingMessages.length > 0 && (
                    <div className="result-messages">
                      {result.matchingMessages.map((message, msgIndex) => (
                        <div key={msgIndex} className="result-message">
                          <span className="message-role">
                            {message.role === 'user' ? '👤' : '🤖'}
                          </span>
                          <p className="message-content">
                            {highlightText(
                              message.content.length > 150 
                                ? message.content.substring(0, 150) + '...' 
                                : message.content,
                              searchQuery
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;