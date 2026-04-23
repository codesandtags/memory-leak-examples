import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

const GlobalVariable: React.FC = () => {
  const [dataSize, setDataSize] = useState(0);
  // FIXED: Using local state instead of the window object
  const [localArray, setLocalArray] = useState<any[]>([]);

  const leakData = () => {
    // Push a large chunk of data into local state
    const largeChunk = new Array(1000000).fill('Some heavy string data to not leak memory');
    
    setLocalArray((prev) => {
      const newArray = [...prev, largeChunk];
      setDataSize(newArray.length);
      console.log(`Local Array contains \${newArray.length} chunks.`);
      return newArray;
    });
  };

  const clearData = () => {
    setLocalArray([]);
    setDataSize(0);
    console.log('Local data cleared.');
  };

  return (
    <div className="leak-page">
      <div className="demo-area glass-panel">
        <h2 style={{ position: 'absolute', top: '2rem', left: '2rem' }}>Interactive Demo</h2>
        
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <ShieldAlert size={48} className="text-gradient" style={{ margin: '0 auto 1rem auto' }} />
          <h3>Global Chunks: {dataSize}</h3>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={leakData}>
              Attach Data to Window
            </button>
            <button className="btn btn-danger" onClick={clearData}>
              Clear Window Data
            </button>
          </div>
        </div>
      </div>

      <div className="info-sidebar">
        <div className="info-card glass-panel">
          <h3><AlertTriangle size={20} color="var(--warning)" /> Root Cause</h3>
          <p>
            Variables attached directly to the `window` or `global` object are never garbage collected as long as the page remains open. 
          </p>
          <br/>
          <p>
            If a component fetches large amounts of data and accidentally assigns it to a global variable (e.g., forgetting `let`/`const`, or explicitly using `window.data = ...`), that memory is permanently locked, causing the app to slowly crash over time.
          </p>
        </div>

        <div className="info-card glass-panel">
          <span className="todo-badge">@TODO: How to fix</span>
          <p>Keep state localized to the component using `useState` or `useReducer`, or use proper state management tools (Zustand, Redux). Avoid attaching anything to the `window`.</p>
          <div className="code-block">
{`// BAD: Global leak
window.userData = await fetchUsers();

// GOOD: Local state
const [users, setUsers] = useState([]);
useEffect(() => {
  fetchUsers().then(setUsers);
}, []);`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalVariable;
