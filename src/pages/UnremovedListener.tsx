import React, { useState, useEffect } from 'react';
import { Globe, AlertTriangle } from 'lucide-react';

const ListenerComponent: React.FC<{ onUnmount: () => void }> = ({ onUnmount }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    console.log('Listener Component Mounted.');
    
    const handleMouseMove = (e: MouseEvent) => {
      console.log(`Mouse moved: \${e.clientX}, \${e.clientY}`);
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    // LEAK: Attaching event listener to window but not removing it
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      console.log('Listener Component Unmounted.');
      onUnmount();
      // @TODO: Fix memory leak here
      // window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [onUnmount]);

  return (
    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', width: '100%', maxWidth: '300px' }}>
      <Globe size={48} className="text-gradient" style={{ margin: '0 auto 1rem auto' }} />
      <h3>Tracking Mouse</h3>
      <div style={{ fontSize: '1.25rem', margin: '1rem 0' }}>
        X: {mousePos.x} <br /> Y: {mousePos.y}
      </div>
      <p style={{ color: 'var(--text-secondary)' }}>Move your mouse!</p>
    </div>
  );
};

const UnremovedListener: React.FC = () => {
  const [showComponent, setShowComponent] = useState(false);
  const [unmountCount, setUnmountCount] = useState(0);

  return (
    <div className="leak-page">
      <div className="demo-area glass-panel">
        <h2 style={{ position: 'absolute', top: '2rem', left: '2rem' }}>Interactive Demo</h2>
        
        {showComponent ? (
          <ListenerComponent onUnmount={() => setUnmountCount(prev => prev + 1)} />
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p style={{ marginBottom: '1rem' }}>Component is unmounted.</p>
            {unmountCount > 0 && <p style={{ color: 'var(--danger)' }}>Move your mouse and check the dev tools console. The event listener is still firing!</p>}
          </div>
        )}

        <div style={{ position: 'absolute', bottom: '2rem', display: 'flex', gap: '1rem' }}>
          <button 
            className={`btn \${showComponent ? 'btn-danger' : 'btn-primary'}`}
            onClick={() => setShowComponent(!showComponent)}
          >
            {showComponent ? 'Unmount Component' : 'Mount Component'}
          </button>
        </div>
      </div>

      <div className="info-sidebar">
        <div className="info-card glass-panel">
          <h3><AlertTriangle size={20} color="var(--warning)" /> Root Cause</h3>
          <p>
            Global objects like `window` or `document` exist for the entire lifetime of the application. If a component attaches an event listener to them and doesn't explicitly remove it when unmounting, the listener stays active forever.
          </p>
          <br/>
          <p>
            Because the listener function references variables inside the component, the entire component cannot be garbage collected, creating a memory leak. Multiple mounts and unmounts will compound the issue, attaching multiple orphaned listeners.
          </p>
        </div>

        <div className="info-card glass-panel">
          <span className="todo-badge">@TODO: How to fix</span>
          <p>Use the cleanup function of `useEffect` to remove the event listener using the exact same function reference.</p>
          <div className="code-block">
{`useEffect(() => {
  const handleMouseMove = (e) => { /*...*/ };
  window.addEventListener('mousemove', handleMouseMove);

  // Return cleanup function
  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
  };
}, []);`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnremovedListener;
