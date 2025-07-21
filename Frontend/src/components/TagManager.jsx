import { useState } from 'react';
import { useTag } from '../contexts/TagContext';
import './TagManager.css';

const TagManager = ({ isOpen, onClose, conversationId = null }) => {
  const {
    tags,
    categories,
    createTag,
    updateTag,
    deleteTag,
    createCategory,
    updateCategory,
    deleteCategory,
    addTagToConversation,
    removeTagFromConversation,
    setCategoryForConversation,
    getConversationTags
  } = useTag();

  const [activeTab, setActiveTab] = useState('tags');
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#64748b');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('📁');
  const [newCategoryColor, setNewCategoryColor] = useState('#64748b');
  const [editingTag, setEditingTag] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  const conversationTagData = conversationId ? getConversationTags(conversationId) : null;

  if (!isOpen) return null;

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      createTag(newTagName, newTagColor);
      setNewTagName('');
      setNewTagColor('#64748b');
    }
  };

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      createCategory(newCategoryName, newCategoryIcon, newCategoryColor);
      setNewCategoryName('');
      setNewCategoryIcon('📁');
      setNewCategoryColor('#64748b');
    }
  };

  const handleUpdateTag = (tagId, updates) => {
    updateTag(tagId, updates);
    setEditingTag(null);
  };

  const handleUpdateCategory = (categoryId, updates) => {
    updateCategory(categoryId, updates);
    setEditingCategory(null);
  };

  const handleToggleTagForConversation = (tagId) => {
    if (!conversationId) return;
    
    const isTagged = conversationTagData.tags.some(tag => tag.id === tagId);
    if (isTagged) {
      removeTagFromConversation(conversationId, tagId);
    } else {
      addTagToConversation(conversationId, tagId);
    }
  };

  const handleSetCategoryForConversation = (categoryId) => {
    if (!conversationId) return;
    
    const currentCategory = conversationTagData.category?.id;
    setCategoryForConversation(conversationId, currentCategory === categoryId ? null : categoryId);
  };

  const colorOptions = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e', '#64748b', '#6b7280', '#374151'
  ];

  const iconOptions = [
    '📁', '📋', '💡', '🐛', '👀', '📚', '📝', '🔧', '⚡', '🎯',
    '🚀', '💻', '🎨', '📊', '🔍', '⭐', '🏷️', '📌', '🔥', '💎'
  ];

  return (
    <div className="tag-manager-overlay" onClick={onClose}>
      <div className="tag-manager-modal" onClick={e => e.stopPropagation()}>
        <div className="tag-manager-header">
          <h2>{conversationId ? 'Manage Conversation Tags' : 'Manage Tags & Categories'}</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="tag-manager-tabs">
          <button
            className={`tab-button ${activeTab === 'tags' ? 'active' : ''}`}
            onClick={() => setActiveTab('tags')}
          >
            🏷️ Tags
          </button>
          <button
            className={`tab-button ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            📁 Categories
          </button>
        </div>

        <div className="tag-manager-content">
          {activeTab === 'tags' && (
            <div className="tags-section">
              <div className="create-section">
                <h3>Create New Tag</h3>
                <div className="create-form">
                  <input
                    type="text"
                    placeholder="Tag name..."
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
                  />
                  <div className="color-picker">
                    {colorOptions.map(color => (
                      <button
                        key={color}
                        className={`color-option ${newTagColor === color ? 'selected' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewTagColor(color)}
                      />
                    ))}
                  </div>
                  <button className="create-button" onClick={handleCreateTag}>
                    Create Tag
                  </button>
                </div>
              </div>

              <div className="items-section">
                <h3>Existing Tags ({tags.length})</h3>
                <div className="items-list">
                  {tags.map(tag => (
                    <div key={tag.id} className="tag-item">
                      {editingTag === tag.id ? (
                        <div className="edit-form">
                          <input
                            type="text"
                            defaultValue={tag.name}
                            onBlur={(e) => handleUpdateTag(tag.id, { name: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleUpdateTag(tag.id, { name: e.target.value });
                              }
                            }}
                            autoFocus
                          />
                        </div>
                      ) : (
                        <>
                          <div className="tag-info">
                            <span 
                              className="tag-badge" 
                              style={{ backgroundColor: tag.color }}
                            >
                              {tag.name}
                            </span>
                            {conversationId && (
                              <button
                                className={`toggle-button ${
                                  conversationTagData.tags.some(t => t.id === tag.id) ? 'active' : ''
                                }`}
                                onClick={() => handleToggleTagForConversation(tag.id)}
                              >
                                {conversationTagData.tags.some(t => t.id === tag.id) ? '✓' : '+'}
                              </button>
                            )}
                          </div>
                          <div className="tag-actions">
                            <button
                              className="edit-button"
                              onClick={() => setEditingTag(tag.id)}
                            >
                              ✏️
                            </button>
                            <button
                              className="delete-button"
                              onClick={() => deleteTag(tag.id)}
                            >
                              🗑️
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="categories-section">
              <div className="create-section">
                <h3>Create New Category</h3>
                <div className="create-form">
                  <input
                    type="text"
                    placeholder="Category name..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
                  />
                  <div className="icon-picker">
                    {iconOptions.map(icon => (
                      <button
                        key={icon}
                        className={`icon-option ${newCategoryIcon === icon ? 'selected' : ''}`}
                        onClick={() => setNewCategoryIcon(icon)}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                  <div className="color-picker">
                    {colorOptions.map(color => (
                      <button
                        key={color}
                        className={`color-option ${newCategoryColor === color ? 'selected' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewCategoryColor(color)}
                      />
                    ))}
                  </div>
                  <button className="create-button" onClick={handleCreateCategory}>
                    Create Category
                  </button>
                </div>
              </div>

              <div className="items-section">
                <h3>Existing Categories ({categories.length})</h3>
                <div className="items-list">
                  {categories.map(category => (
                    <div key={category.id} className="category-item">
                      <div className="category-info">
                        <span 
                          className="category-badge"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.icon} {category.name}
                        </span>
                        {category.predefined && (
                          <span className="predefined-badge">Built-in</span>
                        )}
                        {conversationId && (
                          <button
                            className={`toggle-button ${
                              conversationTagData.category?.id === category.id ? 'active' : ''
                            }`}
                            onClick={() => handleSetCategoryForConversation(category.id)}
                          >
                            {conversationTagData.category?.id === category.id ? '✓' : '+'}
                          </button>
                        )}
                      </div>
                      <div className="category-actions">
                        <button
                          className="edit-button"
                          onClick={() => setEditingCategory(category.id)}
                        >
                          ✏️
                        </button>
                        {!category.predefined && (
                          <button
                            className="delete-button"
                            onClick={() => deleteCategory(category.id)}
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagManager;