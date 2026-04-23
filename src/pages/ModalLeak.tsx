import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Layers, AlertTriangle, X } from "lucide-react";

const HeavyModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [modalRoot] = useState(() => document.createElement("div"));

  useEffect(() => {
    // LEAK: Append the modal container to the body but NEVER remove it!
    modalRoot.className = "leaked-modal-container";
    document.body.appendChild(modalRoot);

    // @TODO: Fix memory leak here by returning a cleanup function:
    // return () => {
    //   if (document.body.contains(modalRoot)) {
    //     document.body.removeChild(modalRoot);
    //   }
    // };
  }, [modalRoot]);

  // Generate 1000 items for the heavy table
  const items = Array.from(
    { length: 1000 },
    (_, i) =>
      `Heavy Row Data #\${i + 1} - \${new Array(100).fill('data').join('')}`,
  );

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: "90%",
          maxWidth: "600px",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "1.5rem",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <h3 style={{ margin: 0 }}>Massive Data Table</h3>
          <button onClick={onClose} style={{ color: "var(--text-primary)" }}>
            <X size={24} />
          </button>
        </div>
        <div
          style={{
            padding: "1rem",
            overflowY: "auto",
            flex: 1,
            background: "#0B0E14",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              color: "var(--text-secondary)",
            }}
          >
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={index}
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                >
                  <td style={{ padding: "0.75rem", fontSize: "0.875rem" }}>
                    {item}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>,
    modalRoot,
  );
};

const ModalLeak: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openCount, setOpenCount] = useState(0);

  const toggleModal = () => {
    if (!isModalOpen) {
      setOpenCount((prev) => prev + 1);
    }
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="leak-page">
      <div className="demo-area glass-panel">
        <h2 style={{ position: "absolute", top: "2rem", left: "2rem" }}>
          Interactive Demo
        </h2>

        <div style={{ textAlign: "center", zIndex: 1 }}>
          <Layers
            size={48}
            className="text-gradient"
            style={{ margin: "0 auto 1rem auto" }}
          />
          <h3>Modal Opened: {openCount} times</h3>

          <button
            className="btn btn-primary"
            style={{ marginTop: "2rem" }}
            onClick={toggleModal}
          >
            Open Heavy Modal
          </button>

          <p
            style={{
              marginTop: "2rem",
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
            }}
          >
            Check the <strong>Elements</strong> tab in DevTools. Every time you
            open and close the modal, a new{" "}
            <code>&lt;div class="leaked-modal-container"&gt;</code> is left
            behind permanently at the end of the `&lt;body&gt;`!
          </p>
        </div>

        {isModalOpen && <HeavyModal onClose={() => setIsModalOpen(false)} />}
      </div>

      <div className="info-sidebar">
        <div className="info-card glass-panel">
          <h3>
            <AlertTriangle size={20} color="var(--warning)" /> Root Cause
          </h3>
          <p>
            When building modals with <strong>React Portals</strong>, a common
            practice is to dynamically create a `div` and append it to
            `document.body` to ensure the modal breaks out of complex CSS
            hierarchies (like `overflow: hidden` or `z-index` contexts).
          </p>
          <br />
          <p>
            However, if you forget to remove that `div` from the `document.body`
            when the component unmounts, the entire React tree inside the portal
            (including all its massive data and scrollable tables) is orphaned
            but strongly referenced by the DOM. Every time the modal opens, a
            new invisible DOM node is permanently created!
          </p>
        </div>

        <div className="info-card glass-panel">
          <span className="todo-badge">@TODO: How to fix</span>
          <p>
            Always use the `useEffect` cleanup function to `removeChild` the
            portal container when the modal unmounts.
          </p>
          <div className="code-block">
            {`useEffect(() => {
  const modalRoot = document.createElement('div');
  document.body.appendChild(modalRoot);

  // Cleanup the DOM node on unmount
  return () => {
    document.body.removeChild(modalRoot);
  };
}, []);`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalLeak;
