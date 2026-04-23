import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShieldAlert, Activity, GitBranch, Globe, Scissors, Menu, X } from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { path: '/uncleared-interval', label: 'Uncleared Interval', icon: <Activity size={20} /> },
    { path: '/unremoved-listener', label: 'Unremoved Listener', icon: <Globe size={20} /> },
    { path: '/stale-closure', label: 'Stale Closure', icon: <GitBranch size={20} /> },
    { path: '/global-variable', label: 'Global Variable', icon: <ShieldAlert size={20} /> },
    { path: '/detached-dom', label: 'Detached DOM', icon: <Scissors size={20} /> },
  ];

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="app-container">
      {/* Mobile Header */}
      <header className="mobile-header">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)' }} onClick={closeMenu}>
          <div style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', padding: '0.5rem', borderRadius: '8px' }}>
            <Activity color="white" size={20} />
          </div>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>MemoryLeak<span className="text-gradient">Labs</span></h2>
        </Link>
        <button className="btn" onClick={toggleMenu} style={{ padding: '0.5rem', color: 'var(--text-primary)' }}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div style={{ padding: '1rem 0 2rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)' }} onClick={closeMenu}>
            <div style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', padding: '0.5rem', borderRadius: '8px' }}>
              <Activity color="white" size={24} />
            </div>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>MemoryLeak<span className="text-gradient">Labs</span></h2>
          </Link>
          <button className="btn mobile-close-btn" onClick={closeMenu} style={{ padding: '0.5rem', color: 'var(--text-primary)' }}>
            <X size={24} />
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em', marginBottom: '1rem', paddingLeft: '1rem' }}>
            Examples
          </div>
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={closeMenu}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '2rem', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
          Educational Project
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={closeMenu}
        />
      )}

      {/* Main Content */}
      <main className="main-content">
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
