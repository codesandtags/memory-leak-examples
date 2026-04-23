import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle } from 'lucide-react';

const IntervalComponent: React.FC<{ onUnmount: () => void }> = ({ onUnmount }) => {
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    console.log('Interval Component Mounted. Starting Interval...');
    // FIXED: Store the interval ID and clear it on unmount
    const intervalId = setInterval(() => {
      setTicks((t) => {
        const newTick = t + 1;
        console.log(`Interval tick: ${newTick}`);
        return newTick;
      });
    }, 1000);

    return () => {
      console.log('Interval Component Unmounted.');
      onUnmount();
      // Fixed memory leak
      clearInterval(intervalId);
    };
  }, [onUnmount]);

  return (
    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', width: '100%', maxWidth: '300px' }}>
      <Activity size={48} className="text-gradient" style={{ margin: '0 auto 1rem auto' }} />
      <h3>Running Interval</h3>
      <div style={{ fontSize: '3rem', fontWeight: 'bold', margin: '1rem 0' }}>{ticks}</div>
      <p style={{ color: 'var(--text-secondary)' }}>Check your console!</p>
    </div>
  );
};

const UnclearedInterval: React.FC = () => {
  const [showComponent, setShowComponent] = useState(false);
  const [unmountCount, setUnmountCount] = useState(0);

  return (
    <div className="leak-page">
      <div className="demo-area glass-panel">
        <h2 style={{ position: 'absolute', top: '2rem', left: '2rem' }}>Interactive Demo</h2>
        
        {showComponent ? (
          <IntervalComponent onUnmount={() => setUnmountCount(prev => prev + 1)} />
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p style={{ marginBottom: '1rem' }}>Component is unmounted.</p>
            {unmountCount > 0 && <p style={{ color: 'var(--danger)' }}>Open dev tools console. The interval from the unmounted component is still running!</p>}
          </div>
        )}

        <div style={{ position: 'absolute', bottom: '2rem', display: 'flex', gap: '1rem' }}>
          <button 
            className={`btn ${showComponent ? 'btn-danger' : 'btn-primary'}`}
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
            When `setInterval` is called inside a `useEffect`, it registers a callback with the browser's timer API. If you unmount the component without calling `clearInterval`, the interval continues to run forever in the background.
          </p>
          <br/>
          <p>
            Because the interval callback references state update functions (`setTicks`), the entire component's closure is kept alive in memory, preventing garbage collection.
          </p>
        </div>

        <div className="info-card glass-panel">
          <span className="todo-badge">@TODO: How to fix</span>
          <p>Store the interval ID and return a cleanup function from the `useEffect` hook to clear it.</p>
          <div className="code-block">
{`useEffect(() => {
  const intervalId = setInterval(() => {
    // ...
  }, 1000);

  // Return cleanup function
  return () => {
    clearInterval(intervalId);
  };
}, []);`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnclearedInterval;
