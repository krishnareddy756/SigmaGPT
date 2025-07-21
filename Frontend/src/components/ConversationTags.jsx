import { useState } from 'react';
import { useTag } from '../contexts/TagContext';
import TagManager from './TagManager';
import './ConversationTags.css';

const ConversationTags = ({ conversationId, compact = false }) => {
  const { getConversationTags } = useTag();
  const [showTagManager, setShowTagManager] = useState(false);
  
  const { tags, category } = getConversationTags(conversationId);

  const handleTagClick = (e) => {
    e.stopPropagation();
    setShowTagManager(true);
  };

  return (
    <>
      <div className={`conversation-tags ${compact ? 'compact' : ''}`}>
        {category && (
          <span 
            className="category-indicator"
            style={{ backgroundColor: category.color }}
            title={category.name}
          >
            {category.icon}
          </span>
        )}
        
        {tags.slice(0, compact ? 2 : 3).map(tag => (
          <span
            key={tag.id}
            className="tag-indicator"
            style={{ backgroundColor: tag.color }}
            title={tag.name}
          >
            {compact ? '' : tag.name}
          </span>
        ))}
        
        {tags.length > (compact ? 2 : 3) && (
          <span className="more-tags" title={`+${tags.length - (compact ? 2 : 3)} more tags`}>
            +{tags.length - (compact ? 2 : 3)}
          </span>
        )}
        
        <button
          className="manage-tags-button"
          onClick={handleTagClick}
          title="Manage tags"
        >
          🏷️
        </button>
      </div>

      <TagManager
        isOpen={showTagManager}
        onClose={() => setShowTagManager(false)}
        conversationId={conversationId}
      />
    </>
  );
};

export default ConversationTags;