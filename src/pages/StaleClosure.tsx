import React, { useState, useEffect, useRef } from 'react';
import { GitBranch, AlertTriangle } from 'lucide-react';

const StaleClosure: React.FC = () => {
  const [count, setCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  
  // LEAK: The interval captures the initial state of 'count' (0).
  // Heavy data could also be captured in a closure unintentionally.
  const heavyObject = useRef(new Array(100000).fill('Heavy Data'));

  useEffect(() => {
    const logInterval = setInterval(() => {
      // The closure captures 'count' from the render when useEffect was called.
      // Since dependency array is empty [], it only captures count = 0.
      const msg = `Interval log: count is \${count}. Array size: \${heavyObject.current.length}`;
      setLogs((prev) => [...prev.slice(-4), msg]);
    }, 2000);

    return () => clearInterval(logInterval);
  }, []); // Empty dependency array causes the stale closure

  return (
    <div className="leak-page">
      <div className="demo-area glass-panel">
        <h2 style={{ position: 'absolute', top: '2rem', left: '2rem' }}>Interactive Demo</h2>
        
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <GitBranch size={48} className="text-gradient" style={{ margin: '0 auto 1rem auto' }} />
          <h3>Counter: {count}</h3>
          
          <button 
            className="btn btn-primary" 
            style={{ marginTop: '1rem', marginBottom: '2rem' }}
            onClick={() => setCount(c => c + 1)}
          >
            Increment Counter
          </button>

          <div style={{ background: '#000', padding: '1rem', borderRadius: '8px', textAlign: 'left', fontSize: '0.8rem', color: '#10B981', minWidth: '300px', height: '120px', overflowY: 'auto' }}>
            {logs.map((log, i) => <div key={i}>{log}</div>)}
            {logs.length === 0 && 'Waiting for logs...'}
          </div>
        </div>
      </div>

      <div className="info-sidebar">
        <div className="info-card glass-panel">
          <h3><AlertTriangle size={20} color="var(--warning)" /> Root Cause</h3>
          <p>
            In JavaScript, functions "close over" the variables in their surrounding scope. Because the `useEffect` has an empty dependency array, the `setInterval` closure captures the initial value of `count` (which is 0) and never updates it.
          </p>
          <br/>
          <p>
            If heavy objects (like large arrays or parsed data) are unintentionally referenced inside these stale closures, they cannot be garbage collected, leading to bloated memory usage that is disconnected from the current state.
          </p>
        </div>

        <div className="info-card glass-panel">
          <span className="todo-badge">@TODO: How to fix</span>
          <p>Always include state variables in the dependency array, or use a mutable `ref` to access the latest value without causing re-runs.</p>
          <div className="code-block">
{`// Option 1: Add to dependencies
useEffect(() => {
  const logInterval = setInterval(() => {
    console.log(count);
  }, 2000);
  return () => clearInterval(logInterval);
}, [count]); // Correct dependency

// Option 2: Use Refs
const countRef = useRef(count);
countRef.current = count;
// Use countRef.current inside interval`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaleClosure;
