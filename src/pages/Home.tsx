import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Globe, GitBranch, ShieldAlert, Scissors, Layers, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const examples = [
    {
      id: 'uncleared-interval',
      title: 'Uncleared Interval',
      description: 'See how forgetting to clear an interval on unmount causes background execution leaks.',
      icon: <Activity size={32} className="text-gradient" />,
      path: '/uncleared-interval',
      color: 'rgba(99, 102, 241, 0.2)'
    },
    {
      id: 'unremoved-listener',
      title: 'Unremoved Listener',
      description: 'Discover how global event listeners trap component instances in memory.',
      icon: <Globe size={32} className="text-gradient" />,
      path: '/unremoved-listener',
      color: 'rgba(236, 72, 153, 0.2)'
    },
    {
      id: 'stale-closure',
      title: 'Stale Closure',
      description: 'Understand how closures can accidentally retain references to heavy objects.',
      icon: <GitBranch size={32} className="text-gradient" />,
      path: '/stale-closure',
      color: 'rgba(16, 185, 129, 0.2)'
    },
    {
      id: 'global-variable',
      title: 'Global Variable',
      description: 'A classic mistake: attaching huge data sets directly to the window object.',
      icon: <ShieldAlert size={32} className="text-gradient" />,
      path: '/global-variable',
      color: 'rgba(245, 158, 11, 0.2)'
    },
    {
      id: 'detached-dom',
      title: 'Detached DOM Elements',
      description: 'Removing DOM nodes without removing JS references leads to memory accumulation.',
      icon: <Scissors size={32} className="text-gradient" />,
      path: '/detached-dom',
      color: 'rgba(239, 68, 68, 0.2)'
    },
    {
      id: 'modal-leak',
      title: 'Modal Portal Leak',
      description: 'Using React Portals but failing to remove the host container leads to massive orphaned DOM trees.',
      icon: <Layers size={32} className="text-gradient" />,
      path: '/modal-leak',
      color: 'rgba(139, 92, 246, 0.2)'
    }
  ];

  return (
    <div style={{ padding: '2rem 0' }}>
      <section style={{ textAlign: 'center', marginBottom: '4rem', padding: '4rem 0' }} className="glass-panel">
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
          Master <span className="text-gradient">Memory Leaks</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto', marginBottom: '2rem' }}>
          Interactive examples of the 5 most common frontend memory leaks. Learn the root causes, visualize the impact, and discover how to fix them.
        </p>
        <a href="#examples" className="btn btn-primary" style={{ display: 'inline-flex', gap: '0.5rem' }}>
          Explore Examples <ArrowRight size={20} />
        </a>
      </section>

      <section id="examples" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {examples.map((ex) => (
          <Link key={ex.id} to={ex.path} className="glass-panel" style={{ display: 'block', padding: '2rem', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer', textDecoration: 'none' }} 
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
          >
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: ex.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              {ex.icon}
            </div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{ex.title}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{ex.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
};

export default Home;
