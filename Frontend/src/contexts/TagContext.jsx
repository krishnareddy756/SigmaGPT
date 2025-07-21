import { createContext, useContext, useState, useEffect } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage';

const defaultCategories = [
  { id: 'code-review', name: 'Code Review', icon: '👀', color: '#10b981', predefined: true },
  { id: 'debugging', name: 'Debugging', icon: '🐛', color: '#ef4444', predefined: true },
  { id: 'learning', name: 'Learning', icon: '📚', color: '#3b82f6', predefined: true },
  { id: 'planning', name: 'Planning', icon: '📋', color: '#8b5cf6', predefined: true },
  { id: 'brainstorming', name: 'Brainstorming', icon: '💡', color: '#f59e0b', predefined: true },
  { id: 'documentation', name: 'Documentation', icon: '📝', color: '#06b6d4', predefined: true }
];

const TagContext = createContext();

export const useTag = () => {
  const context = useContext(TagContext);
  if (!context) {
    throw new Error('useTag must be used within a TagProvider');
  }
  return context;
};

export const TagProvider = ({ children }) => {
  const [tags, setTags] = useState(() => {
    return getStorageItem('conversation-tags', []);
  });

  const [categories, setCategories] = useState(() => {
    const saved = getStorageItem('conversation-categories', []);
    // Merge with default categories, keeping user customizations
    const merged = [...defaultCategories];
    saved.forEach(savedCat => {
      const existingIndex = merged.findIndex(cat => cat.id === savedCat.id);
      if (existingIndex >= 0) {
        merged[existingIndex] = { ...merged[existingIndex], ...savedCat };
      } else {
        merged.push(savedCat);
      }
    });
    return merged;
  });

  const [conversationTags, setConversationTags] = useState(() => {
    return getStorageItem('conversation-tag-assignments', {});
  });

  // Save to localStorage when data changes
  useEffect(() => {
    setStorageItem('conversation-tags', tags);
  }, [tags]);

  useEffect(() => {
    setStorageItem('conversation-categories', categories);
  }, [categories]);

  useEffect(() => {
    setStorageItem('conversation-tag-assignments', conversationTags);
  }, [conversationTags]);

  // Tag management functions
  const createTag = (name, color = '#64748b') => {
    const newTag = {
      id: `tag-${Date.now()}`,
      name: name.trim(),
      color,
      createdAt: new Date().toISOString()
    };

    setTags(prev => [...prev, newTag]);
    return newTag;
  };

  const updateTag = (tagId, updates) => {
    setTags(prev => prev.map(tag => 
      tag.id === tagId ? { ...tag, ...updates } : tag
    ));
  };

  const deleteTag = (tagId) => {
    setTags(prev => prev.filter(tag => tag.id !== tagId));
    
    // Remove tag from all conversations
    setConversationTags(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(conversationId => {
        updated[conversationId] = {
          ...updated[conversationId],
          tags: updated[conversationId].tags?.filter(id => id !== tagId) || []
        };
      });
      return updated;
    });
  };

  // Category management functions
  const createCategory = (name, icon = '📁', color = '#64748b') => {
    const newCategory = {
      id: `category-${Date.now()}`,
      name: name.trim(),
      icon,
      color,
      predefined: false,
      createdAt: new Date().toISOString()
    };

    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = (categoryId, updates) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId ? { ...category, ...updates } : category
    ));
  };

  const deleteCategory = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category?.predefined) {
      console.warn('Cannot delete predefined category');
      return false;
    }

    setCategories(prev => prev.filter(category => category.id !== categoryId));
    
    // Remove category from all conversations
    setConversationTags(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(conversationId => {
        if (updated[conversationId].category === categoryId) {
          updated[conversationId] = {
            ...updated[conversationId],
            category: null
          };
        }
      });
      return updated;
    });

    return true;
  };

  // Conversation tagging functions
  const addTagToConversation = (conversationId, tagId) => {
    setConversationTags(prev => ({
      ...prev,
      [conversationId]: {
        ...prev[conversationId],
        tags: [...(prev[conversationId]?.tags || []), tagId].filter((id, index, arr) => arr.indexOf(id) === index)
      }
    }));
  };

  const removeTagFromConversation = (conversationId, tagId) => {
    setConversationTags(prev => ({
      ...prev,
      [conversationId]: {
        ...prev[conversationId],
        tags: (prev[conversationId]?.tags || []).filter(id => id !== tagId)
      }
    }));
  };

  const setCategoryForConversation = (conversationId, categoryId) => {
    setConversationTags(prev => ({
      ...prev,
      [conversationId]: {
        ...prev[conversationId],
        category: categoryId
      }
    }));
  };

  const getConversationTags = (conversationId) => {
    const assignment = conversationTags[conversationId];
    return {
      tags: (assignment?.tags || []).map(tagId => tags.find(tag => tag.id === tagId)).filter(Boolean),
      category: assignment?.category ? categories.find(cat => cat.id === assignment.category) : null
    };
  };

  const getTaggedConversations = (tagId) => {
    return Object.keys(conversationTags).filter(conversationId => 
      conversationTags[conversationId]?.tags?.includes(tagId)
    );
  };

  const getCategorizedConversations = (categoryId) => {
    return Object.keys(conversationTags).filter(conversationId => 
      conversationTags[conversationId]?.category === categoryId
    );
  };

  const searchByTags = (tagIds) => {
    return Object.keys(conversationTags).filter(conversationId => {
      const conversationTagIds = conversationTags[conversationId]?.tags || [];
      return tagIds.every(tagId => conversationTagIds.includes(tagId));
    });
  };

  const value = {
    tags,
    categories,
    conversationTags,
    createTag,
    updateTag,
    deleteTag,
    createCategory,
    updateCategory,
    deleteCategory,
    addTagToConversation,
    removeTagFromConversation,
    setCategoryForConversation,
    getConversationTags,
    getTaggedConversations,
    getCategorizedConversations,
    searchByTags
  };

  return (
    <TagContext.Provider value={value}>
      {children}
    </TagContext.Provider>
  );
};