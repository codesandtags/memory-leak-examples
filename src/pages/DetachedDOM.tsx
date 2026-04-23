import React, { useState, useRef } from 'react';
import { Scissors, AlertTriangle } from 'lucide-react';

const DetachedDOM: React.FC = () => {
  const [elementsCount, setElementsCount] = useState(0);
  
  // LEAK: Keeping references to DOM nodes in a React Ref even after they are removed
  const detachedNodesRef = useRef<HTMLElement[]>([]);

  const generateNodes = () => {
    // Create 1000 detached div elements
    for (let i = 0; i < 1000; i++) {
      const div = document.createElement('div');
      div.innerText = 'Detached Node ' + i;
      // We append it to the ref array, but never to the document!
      detachedNodesRef.current.push(div);
    }
    setElementsCount(detachedNodesRef.current.length);
    console.log(`Holding \${detachedNodesRef.current.length} detached DOM nodes in memory.`);
  };

  const clearNodes = () => {
    detachedNodesRef.current = [];
    setElementsCount(0);
    console.log('Detached nodes cleared.');
  };

  return (
    <div className="leak-page">
      <div className="demo-area glass-panel">
        <h2 style={{ position: 'absolute', top: '2rem', left: '2rem' }}>Interactive Demo</h2>
        
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <Scissors size={48} className="text-gradient" style={{ margin: '0 auto 1rem auto' }} />
          <h3>Detached Nodes: {elementsCount}</h3>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={generateNodes}>
              Generate Detached Nodes
            </button>
            <button className="btn btn-danger" onClick={clearNodes}>
              Clear References
            </button>
          </div>
        </div>
      </div>

      <div className="info-sidebar">
        <div className="info-card glass-panel">
          <h3><AlertTriangle size={20} color="var(--warning)" /> Root Cause</h3>
          <p>
            A "detached DOM element" occurs when a node is removed from the DOM tree, but a JavaScript variable still holds a reference to it.
          </p>
          <br/>
          <p>
            Because JS still points to the node, the garbage collector cannot free its memory. This commonly happens when using third-party imperative libraries (like D3 or jQuery) inside React without proper cleanup.
          </p>
        </div>

        <div className="info-card glass-panel">
          <span className="todo-badge">@TODO: How to fix</span>
          <p>Let React handle DOM nodes. If you must use imperative libraries, ensure you nullify any JS references to DOM elements when the component unmounts.</p>
          <div className="code-block">
{`// Example of fixing a detached node leak
useEffect(() => {
  let chartNode = document.createElement('div');
  document.body.appendChild(chartNode);

  return () => {
    document.body.removeChild(chartNode);
    // Nullify the JS reference
    chartNode = null; 
  };
}, []);`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetachedDOM;
