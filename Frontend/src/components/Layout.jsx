import { useState, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import './Layout.css';

const Layout = ({ sidebar, mainContent }) => {
  const { settings } = useSettings();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarCollapsed(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div 
      className={`layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''} ${isMobile ? 'mobile' : ''}`}
      style={{
        '--sidebar-width': `${settings.layout.sidebarWidth}px`,
        '--sidebar-collapsed-width': '60px'
      }}
    >
      <div className="layout-sidebar">
        <button 
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className={`toggle-icon ${isSidebarCollapsed ? 'collapsed' : ''}`}>
            ◀
          </span>
        </button>
        <div className="sidebar-content">
          {sidebar}
        </div>
      </div>

      <div className="layout-main">
        {isMobile && !isSidebarCollapsed && (
          <div 
            className="mobile-overlay" 
            onClick={() => setIsSidebarCollapsed(true)}
          />
        )}
        <div className="main-content">
          {mainContent}
        </div>
      </div>
    </div>
  );
};

export default Layout;